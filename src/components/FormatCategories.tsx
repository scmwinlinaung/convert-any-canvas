import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Camera, 
  Palette, 
  Edit3, 
  Box,
  ArrowRight,
  FileImage,
  Layers,
  Brush,
  PenTool,
  Gamepad2
} from "lucide-react";

const formatCategories = [
  {
    id: "web",
    title: "Web Formats",
    description: "Optimized for websites and online use",
    icon: Globe,
    color: "bg-blue-500",
    formats: ["JPEG", "PNG", "WEBP", "SVG", "GIF"],
    popular: true
  },
  {
    id: "photography",
    title: "Photography",
    description: "Professional camera and photo formats",
    icon: Camera,
    color: "bg-green-500",
    formats: ["RAW", "TIFF", "JPEG", "HEIC", "DNG"]
  },
  {
    id: "design",
    title: "Design Files",
    description: "Vector graphics and design formats",
    icon: Palette,
    color: "bg-purple-500",
    formats: ["SVG", "AI", "EPS", "PDF", "CDR"]
  },
  {
    id: "editing",
    title: "Image Editing",
    description: "Layered and editable image formats",
    icon: Edit3,
    color: "bg-orange-500",
    formats: ["PSD", "XCF", "GIMP", "PSB", "PDD"]
  },
  {
    id: "3d-games",
    title: "3D & Games",
    description: "3D models and game asset formats",
    icon: Box,
    color: "bg-red-500",
    formats: ["OBJ", "GLTF", "DDS", "TGA", "3DS"]
  }
];

export const FormatCategories = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Support for All
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Image Formats</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Convert between any image format with professional quality. From web optimization to professional photography.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {formatCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id}
                className="group relative p-6 hover:shadow-medium transition-smooth cursor-pointer border-2 hover:border-primary/20"
              >
                {category.popular && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center shadow-soft`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {category.formats.map((format) => (
                      <Badge 
                        key={format} 
                        variant="secondary" 
                        className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                      >
                        {format}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Convert {category.title}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick conversion suggestions */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-6">Popular Conversions</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "JPEG → PNG",
              "PNG → WEBP", 
              "RAW → JPEG",
              "PSD → PNG",
              "SVG → PNG",
              "HEIC → JPEG",
              "TIFF → JPEG",
              "PDF → PNG"
            ].map((conversion) => (
              <Badge 
                key={conversion}
                variant="outline"
                className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer px-4 py-2"
              >
                {conversion}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};