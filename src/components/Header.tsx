import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, FileImage, Zap, Shield, Globe } from "lucide-react";

const navigation = [
  { name: "Convert", href: "#converter" },
  { name: "Formats", href: "#formats" }, 
  { name: "Features", href: "#features" },
  { name: "Help", href: "#help" }
];

const scrollToSection = (href: string) => {
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <FileImage className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ImageConvert Pro
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-primary" />
                <span>Fast</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-accent" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-primary" />
                <span>Free</span>
              </div>
            </div>
            <Button variant="hero" size="sm" onClick={() => scrollToSection('#converter')}>
              Start Converting
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <FileImage className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    ImageConvert Pro
                  </span>
                </div>

                <nav className="flex flex-col gap-4 mb-8">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        scrollToSection(item.href);
                        setIsOpen(false);
                      }}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2 text-left"
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>

                <div className="mt-auto space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="flex flex-col items-center gap-1 p-3 bg-primary-light rounded-lg">
                      <Zap className="w-5 h-5 text-primary" />
                      <span className="text-xs font-medium">Fast</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-3 bg-accent-light rounded-lg">
                      <Shield className="w-5 h-5 text-accent" />
                      <span className="text-xs font-medium">Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-3 bg-primary-light rounded-lg">
                      <Globe className="w-5 h-5 text-primary" />
                      <span className="text-xs font-medium">Free</span>
                    </div>
                  </div>
                  <Button variant="hero" size="lg" className="w-full" onClick={() => {
                    scrollToSection('#converter');
                    setIsOpen(false);
                  }}>
                    Start Converting
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};