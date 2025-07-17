import React from "react";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-10  border-t border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Top Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
            {/* Brand & Social */}
            <div className="col-span-2 space-y-4">
              <h3 className="text-2xl font-bold text-primary">YourCompany</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Empowering your digital journey with modern tools and AI-driven insights.
              </p>
              <div className="flex gap-3 pt-2">
                <a href="#" className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "Integrations", "Enterprise", "Security"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Resources</h4>
              <ul className="space-y-2">
                {["Documentation", "API Reference", "Guides", "Updates", "Community"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Company</h4>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Press", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms", "Cookies", "GDPR", "License"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="max-w-sm">
                <h4 className="text-sm font-semibold mb-1">Stay up to date</h4>
                <p className="text-sm text-muted-foreground">
                  Get the latest updates and news from YourCompany.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 mt-4 md:mt-0">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full sm:w-64 px-3 py-2 text-sm rounded-md border border-border focus:border-primary focus:ring-primary outline-none"
                />
                <Button className="text-sm font-medium px-4 py-2 h-auto">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-border mt-8 pt-6 text-center">
            <p className="text-xs text-muted-foreground">© 2025 YourCompany. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
