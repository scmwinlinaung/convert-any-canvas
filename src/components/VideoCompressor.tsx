import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, X, FileVideo, Loader2, CheckCircle, Settings } from "lucide-react";
import { toast } from "sonner";

interface VideoFile {
  id: string;
  file: File;
  name: string;
  size: string;
  originalFormat: string;
  targetFormat: string;
  quality: number;
  status: 'pending' | 'compressing' | 'completed' | 'error';
  downloadUrl?: string;
  compressedBlob?: Blob;
  compressionRatio?: number;
}

const supportedFormats = [
  { value: 'mp4', label: 'MP4', category: 'web' },
  { value: 'webm', label: 'WEBM', category: 'web' },
  { value: 'mov', label: 'MOV', category: 'professional' },
  { value: 'avi', label: 'AVI', category: 'standard' },
  { value: 'mkv', label: 'MKV', category: 'high-quality' },
];

// Simple video compression using HTML5 Canvas and MediaRecorder
const compressVideo = async (
  file: File, 
  targetFormat: string, 
  quality: number,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    video.addEventListener('loadedmetadata', () => {
      // Set canvas dimensions based on quality setting
      const scale = quality / 100;
      canvas.width = Math.floor(video.videoWidth * scale);
      canvas.height = Math.floor(video.videoHeight * scale);
      
      // Configure MediaRecorder
      const stream = canvas.captureStream(30);
      const mimeType = `video/${targetFormat === 'mov' ? 'mp4' : targetFormat}`;
      
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        reject(new Error(`Format ${targetFormat} not supported`));
        return;
      }
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: Math.floor(1000000 * (quality / 100)) // Adjust bitrate based on quality
      });
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        resolve(blob);
      };
      
      mediaRecorder.onerror = (event) => {
        reject(new Error('MediaRecorder error'));
      };
      
      // Start recording
      mediaRecorder.start();
      
      video.addEventListener('timeupdate', () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Update progress
        if (onProgress && video.duration > 0) {
          const progress = (video.currentTime / video.duration) * 100;
          onProgress(progress);
        }
      });
      
      video.addEventListener('ended', () => {
        mediaRecorder.stop();
      });
      
      // Start video playback
      video.play();
    });
    
    video.addEventListener('error', () => {
      reject(new Error('Failed to load video'));
    });
    
    video.src = URL.createObjectURL(file);
  });
};

export const VideoCompressor = () => {
  const [files, setFiles] = useState<VideoFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [defaultTargetFormat, setDefaultTargetFormat] = useState('mp4');
  const [defaultQuality, setDefaultQuality] = useState(70);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileFormat = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return extension;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFiles = useCallback((newFiles: File[]) => {
    const videoFiles = newFiles.filter(file => file.type.startsWith('video/'));
    
    if (videoFiles.length !== newFiles.length) {
      toast.error("Some files were skipped as they are not videos");
    }

    const videoFileObjects: VideoFile[] = videoFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      originalFormat: getFileFormat(file.name),
      targetFormat: defaultTargetFormat,
      quality: defaultQuality,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...videoFileObjects]);
    
    if (videoFileObjects.length > 0) {
      toast.success(`Added ${videoFileObjects.length} video${videoFileObjects.length > 1 ? 's' : ''} for compression`);
    }
  }, [defaultTargetFormat, defaultQuality]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const updateTargetFormat = (id: string, format: string) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, targetFormat: format } : file
    ));
  };

  const updateQuality = (id: string, quality: number) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, quality } : file
    ));
  };

  const compressFile = async (videoFile: VideoFile) => {
    setFiles(prev => prev.map(file => 
      file.id === videoFile.id ? { ...file, status: 'compressing' } : file
    ));

    try {
      console.log(`Compressing ${videoFile.name} to ${videoFile.targetFormat} at ${videoFile.quality}% quality`);
      
      const compressedBlob = await compressVideo(
        videoFile.file, 
        videoFile.targetFormat,
        videoFile.quality,
        (progress) => {
          // Could add progress tracking here
          console.log(`Compression progress: ${progress}%`);
        }
      );
      
      const downloadUrl = URL.createObjectURL(compressedBlob);
      const compressionRatio = Math.round((1 - compressedBlob.size / videoFile.file.size) * 100);
      
      setFiles(prev => prev.map(file => 
        file.id === videoFile.id 
          ? { ...file, status: 'completed', downloadUrl, compressedBlob, compressionRatio } 
          : file
      ));
      
      toast.success(`${videoFile.name} compressed by ${compressionRatio}%`);
    } catch (error) {
      console.error('Compression error:', error);
      setFiles(prev => prev.map(file => 
        file.id === videoFile.id ? { ...file, status: 'error' } : file
      ));
      toast.error(`Failed to compress ${videoFile.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const compressAllFiles = () => {
    const pendingFiles = files.filter(file => file.status === 'pending');
    pendingFiles.forEach(compressFile);
  };

  const downloadFile = (videoFile: VideoFile) => {
    if (videoFile.downloadUrl && videoFile.compressedBlob) {
      const link = document.createElement('a');
      link.href = videoFile.downloadUrl;
      
      const originalName = videoFile.name.split('.').slice(0, -1).join('.');
      link.download = `${originalName}_compressed.${videoFile.targetFormat}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloaded: ${link.download}`);
    }
  };

  return (
    <section id="video-compressor" className="py-20 bg-gradient-tertiary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Compress Your Videos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Reduce video file sizes while maintaining quality. Perfect for web upload, sharing, and storage optimization.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Area */}
          <Card 
            className={`relative p-12 border-2 border-dashed transition-all duration-300 ${
              isDragOver 
                ? 'border-primary bg-primary-light/50 shadow-medium' 
                : 'border-border hover:border-primary/50 hover:bg-card-hover'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors ${
                isDragOver ? 'bg-primary text-primary-foreground' : 'bg-primary-light text-primary'
              }`}>
                <Upload className="w-8 h-8" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {isDragOver ? 'Drop your videos here' : 'Upload your videos'}
                </h3>
                <p className="text-muted-foreground">
                  Drag and drop videos here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports: MP4, WEBM, MOV, AVI, MKV and more
                </p>
              </div>
              
              <Button variant="outline" className="mt-4">
                <FileVideo className="w-4 h-4 mr-2" />
                Browse Videos
              </Button>
            </div>
          </Card>

          {/* Default Settings */}
          {files.length === 0 && (
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Default Output Format</h3>
                    <p className="text-sm text-muted-foreground">Choose the format for compressed videos</p>
                  </div>
                  <Select value={defaultTargetFormat} onValueChange={setDefaultTargetFormat}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Default Quality</h3>
                    <p className="text-sm text-muted-foreground">Higher quality = larger file size</p>
                  </div>
                  <div className="flex items-center gap-4 w-48">
                    <Slider
                      value={[defaultQuality]}
                      onValueChange={([value]) => setDefaultQuality(value)}
                      max={100}
                      min={10}
                      step={10}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">{defaultQuality}%</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* File List */}
          {files.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Videos to Compress ({files.length})</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setFiles([])}
                    disabled={files.some(f => f.status === 'compressing')}
                  >
                    Clear All
                  </Button>
                  <Button 
                    variant="hero"
                    onClick={compressAllFiles}
                    disabled={files.every(f => f.status !== 'pending')}
                  >
                    Compress All
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="p-4 bg-background rounded-lg border space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <FileVideo className="w-6 h-6 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{file.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {file.size} • {file.originalFormat.toUpperCase()}
                          {file.compressionRatio && (
                            <span className="text-success ml-2">
                              • Reduced by {file.compressionRatio}%
                            </span>
                          )}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {file.status === 'pending' && (
                          <Button size="sm" onClick={() => compressFile(file)}>
                            Compress
                          </Button>
                        )}
                        
                        {file.status === 'compressing' && (
                          <div className="flex items-center gap-2 text-sm text-primary">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Compressing...
                          </div>
                        )}
                        
                        {file.status === 'completed' && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-success" />
                            <Button size="sm" variant="success" onClick={() => downloadFile(file)}>
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        )}
                        
                        {file.status === 'error' && (
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">Error</Badge>
                            <Button size="sm" onClick={() => compressFile(file)}>
                              Retry
                            </Button>
                          </div>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeFile(file.id)}
                          disabled={file.status === 'compressing'}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Settings */}
                    <div className="flex items-center gap-6 pl-16">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{file.originalFormat.toUpperCase()}</Badge>
                        <span className="text-muted-foreground">→</span>
                        <Select 
                          value={file.targetFormat} 
                          onValueChange={(value) => updateTargetFormat(file.id, value)}
                          disabled={file.status === 'compressing'}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {supportedFormats.map((format) => (
                              <SelectItem key={format.value} value={format.value}>
                                {format.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Quality:</span>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[file.quality]}
                            onValueChange={([value]) => updateQuality(file.id, value)}
                            max={100}
                            min={10}
                            step={10}
                            className="w-24"
                            disabled={file.status === 'compressing'}
                          />
                          <span className="text-sm font-medium w-10">{file.quality}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};