import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, Zap, Shield } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Convert Any Image
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  In Seconds
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Transform images between all formats instantly. Support for Web, Photography, Design, Editing, and 3D formats. Fast, secure, and completely free.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm p-4 rounded-lg border hover:shadow-soft transition-smooth">
                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Lightning Fast</h3>
                  <p className="text-xs text-muted-foreground">Instant conversion</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm p-4 rounded-lg border hover:shadow-soft transition-smooth">
                <div className="w-10 h-10 bg-accent-light rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">100% Secure</h3>
                  <p className="text-xs text-muted-foreground">Files stay private</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm p-4 rounded-lg border hover:shadow-soft transition-smooth">
                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">No Limits</h3>
                  <p className="text-xs text-muted-foreground">Unlimited use</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="group"
                onClick={() => {
                  const element = document.querySelector('#converter');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Start Converting
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  const element = document.querySelector('#formats');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                View All Formats
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50M+</div>
                <div className="text-sm text-muted-foreground">Images Converted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">25+</div>
                <div className="text-sm text-muted-foreground">File Formats</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Free & Secure</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={heroImage} 
                alt="Image conversion process showing various file formats transforming"
                className="w-full h-auto"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-primary/10"></div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-primary rounded-full blur-xl opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-accent rounded-full blur-lg opacity-40 animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};