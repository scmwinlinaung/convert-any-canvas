import { Card } from "@/components/ui/card";
import { 
  Zap, 
  Shield, 
  Globe, 
  Smartphone, 
  Cloud, 
  Settings,
  Check,
  Star
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Conversion",
    description: "Convert images in seconds with our optimized processing engine. No waiting, no delays.",
    highlight: "Up to 10x faster"
  },
  {
    icon: Shield,
    title: "100% Secure & Private",
    description: "Your files are processed locally in your browser. We never store or access your images.",
    highlight: "Zero data collection"
  },
  {
    icon: Globe,
    title: "25+ Format Support",
    description: "Convert between all major image formats including RAW, PSD, SVG, and emerging formats.",
    highlight: "Most comprehensive"
  },
  {
    icon: Smartphone,
    title: "Works Everywhere",
    description: "Use on any device - desktop, tablet, or mobile. No downloads or installations required.",
    highlight: "Cross-platform"
  },
  {
    icon: Cloud,
    title: "Batch Processing",
    description: "Convert multiple images at once. Perfect for bulk operations and workflow automation.",
    highlight: "Unlimited files"
  },
  {
    icon: Settings,
    title: "Quality Control",
    description: "Adjust compression, resize images, and fine-tune output quality to meet your exact needs.",
    highlight: "Professional grade"
  }
];

const benefits = [
  "No file size limits",
  "Preserve image quality", 
  "Instant download",
  "No watermarks",
  "Free forever",
  "No registration required"
];

export const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-light text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Why Choose ImageConvert Pro
          </div>
          <h2 className="text-4xl font-bold mb-4">
            The Most Advanced
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Image Converter</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built with cutting-edge technology to deliver the fastest, most secure, and highest quality image conversions available online.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index}
                className="group p-6 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-primary bg-primary-light px-2 py-1 rounded-full">
                      {feature.highlight}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-secondary border-2">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Everything You Need, Nothing You Don't</h3>
              <p className="text-muted-foreground">Simple, powerful, and completely free image conversion</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-medium text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};