import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, X, FileImage, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ConversionFile {
  id: string;
  file: File;
  name: string;
  size: string;
  originalFormat: string;
  targetFormat: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
  downloadUrl?: string;
  convertedBlob?: Blob;
}

const supportedFormats = [
  { value: 'jpeg', label: 'JPEG', category: 'web' },
  { value: 'jpg', label: 'JPG', category: 'web' },
  { value: 'png', label: 'PNG', category: 'web' },
  { value: 'webp', label: 'WEBP', category: 'web' },
  { value: 'gif', label: 'GIF', category: 'web' },
  { value: 'bmp', label: 'BMP', category: 'photography' },
  { value: 'tiff', label: 'TIFF', category: 'photography' },
  { value: 'ico', label: 'ICO', category: 'web' },
];

// Image conversion function using HTML5 Canvas
const convertImage = async (file: File, targetFormat: string, quality: number = 0.9): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        // Handle transparency for formats that don't support it
        if (targetFormat === 'jpeg' || targetFormat === 'jpg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Conversion failed'));
          }
        }, `image/${targetFormat}`, quality);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const ImageConverter = () => {
  const [files, setFiles] = useState<ConversionFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [defaultTargetFormat, setDefaultTargetFormat] = useState('png');

  // Check for stored preferences on component mount
  useEffect(() => {
    const selectedFormat = localStorage.getItem('selectedFormat');
    if (selectedFormat) {
      setDefaultTargetFormat(selectedFormat);
      localStorage.removeItem('selectedFormat'); // Clear after use
    }
  }, []);

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
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== newFiles.length) {
      toast.error("Some files were skipped as they are not images");
    }

    const conversionFiles: ConversionFile[] = imageFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      originalFormat: getFileFormat(file.name),
      targetFormat: defaultTargetFormat,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...conversionFiles]);
    
    if (conversionFiles.length > 0) {
      toast.success(`Added ${conversionFiles.length} image${conversionFiles.length > 1 ? 's' : ''} for conversion`);
    }
  }, [defaultTargetFormat]);

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

  const convertFile = async (conversionFile: ConversionFile) => {
    setFiles(prev => prev.map(file => 
      file.id === conversionFile.id ? { ...file, status: 'converting' } : file
    ));

    try {
      console.log(`Converting ${conversionFile.name} to ${conversionFile.targetFormat}`);
      
      // Perform actual image conversion
      const convertedBlob = await convertImage(
        conversionFile.file, 
        conversionFile.targetFormat === 'jpg' ? 'jpeg' : conversionFile.targetFormat,
        0.9
      );
      
      const downloadUrl = URL.createObjectURL(convertedBlob);
      
      setFiles(prev => prev.map(file => 
        file.id === conversionFile.id 
          ? { ...file, status: 'completed', downloadUrl, convertedBlob } 
          : file
      ));
      
      toast.success(`${conversionFile.name} converted to ${conversionFile.targetFormat.toUpperCase()}`);
    } catch (error) {
      console.error('Conversion error:', error);
      setFiles(prev => prev.map(file => 
        file.id === conversionFile.id ? { ...file, status: 'error' } : file
      ));
      toast.error(`Failed to convert ${conversionFile.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const convertAllFiles = () => {
    const pendingFiles = files.filter(file => file.status === 'pending');
    pendingFiles.forEach(convertFile);
  };

  const downloadFile = (conversionFile: ConversionFile) => {
    if (conversionFile.downloadUrl && conversionFile.convertedBlob) {
      const link = document.createElement('a');
      link.href = conversionFile.downloadUrl;
      
      // Create proper filename with new extension
      const originalName = conversionFile.name.split('.').slice(0, -1).join('.');
      const newExtension = conversionFile.targetFormat === 'jpeg' ? 'jpg' : conversionFile.targetFormat;
      link.download = `${originalName}.${newExtension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloaded: ${link.download}`);
    }
  };

  return (
    <section id="converter" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Start Converting Your Images
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Drag and drop your images or click to browse. We'll convert them instantly to your preferred format.
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
              accept="image/*"
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
                  {isDragOver ? 'Drop your images here' : 'Upload your images'}
                </h3>
                <p className="text-muted-foreground">
                  Drag and drop images here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports: JPEG, PNG, WEBP, GIF, BMP, TIFF, ICO and more
                </p>
              </div>
              
              <Button variant="outline" className="mt-4">
                <FileImage className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </Card>

          {/* Default Target Format */}
          {files.length === 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Default Output Format</h3>
                  <p className="text-sm text-muted-foreground">Choose the format for converted images</p>
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
            </Card>
          )}

          {/* File List */}
          {files.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Files to Convert ({files.length})</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setFiles([])}
                    disabled={files.some(f => f.status === 'converting')}
                  >
                    Clear All
                  </Button>
                  <Button 
                    variant="hero"
                    onClick={convertAllFiles}
                    disabled={files.every(f => f.status !== 'pending')}
                  >
                    Convert All
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center gap-4 p-4 bg-background rounded-lg border">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <FileImage className="w-6 h-6 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{file.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {file.size} • {file.originalFormat.toUpperCase()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{file.originalFormat.toUpperCase()}</Badge>
                      <span className="text-muted-foreground">→</span>
                      <Select 
                        value={file.targetFormat} 
                        onValueChange={(value) => updateTargetFormat(file.id, value)}
                        disabled={file.status === 'converting'}
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
                    
                    <div className="flex items-center gap-2">
                      {file.status === 'pending' && (
                        <Button size="sm" onClick={() => convertFile(file)}>
                          Convert
                        </Button>
                      )}
                      
                      {file.status === 'converting' && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Converting...
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
                          <Button size="sm" onClick={() => convertFile(file)}>
                            Retry
                          </Button>
                        </div>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => removeFile(file.id)}
                        disabled={file.status === 'converting'}
                      >
                        <X className="w-4 h-4" />
                      </Button>
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