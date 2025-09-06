import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Github, 
  Twitter, 
  Mail, 
  Heart,
  FileImage,
  Globe,
  Shield,
  Zap
} from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Image Converter", href: "#converter" },
    { name: "Supported Formats", href: "#formats" },
    { name: "Batch Processing", href: "#batch" },
    { name: "API Access", href: "#api" }
  ],
  Support: [
    { name: "Help Center", href: "#help" },
    { name: "Contact Us", href: "#contact" },
    { name: "Feature Requests", href: "#features" },
    { name: "Bug Reports", href: "#bugs" }
  ],
  Company: [
    { name: "About Us", href: "#about" },
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" }
  ],
  Resources: [
    { name: "Blog", href: "#blog" },
    { name: "Tutorials", href: "#tutorials" },
    { name: "Image Optimization Guide", href: "#guide" },
    { name: "Format Comparison", href: "#comparison" }
  ]
};

const quickFeatures = [
  { icon: Globe, text: "Web Formats" },
  { icon: FileImage, text: "Photography" },
  { icon: Shield, text: "Secure Processing" },
  { icon: Zap, text: "Lightning Fast" }
];

export const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
                  ImageConvert Pro
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  The most advanced free online image converter. Convert between all formats with professional quality and complete privacy.
                </p>
              </div>
              
              {/* Quick Features */}
              <div className="grid grid-cols-2 gap-3">
                {quickFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <IconComponent className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Github className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground">
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h4 className="font-semibold text-foreground">{category}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© 2024 ImageConvert Pro. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for creators worldwide.</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>🌐 Available in 25+ languages</span>
              <span>⚡ 50M+ images converted</span>
              <span>🔒 100% secure & private</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};