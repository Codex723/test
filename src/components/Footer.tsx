import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-forest text-cream">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-gold">
              Zuma Grand
            </h3>
            <p className="text-cream/80 text-sm leading-relaxed">
              Experience luxury and comfort in the heart of Abuja. Where Nigerian 
              hospitality meets world-class service.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-cream/80 hover:text-gold transition-colors text-sm">
                Home
              </Link>
              <Link to="/rooms" className="text-cream/80 hover:text-gold transition-colors text-sm">
                Our Rooms
              </Link>
              <Link to="/book" className="text-cream/80 hover:text-gold transition-colors text-sm">
                Book Now
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <a
                href="tel:+234 904 823 4626"
                className="flex items-start gap-3 text-cream/80 hover:text-gold transition-colors text-sm"
              >
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+234 904 823 4626</span>
              </a>
              <a
                href="mailto:reservations@zumagrand.com"
                className="flex items-start gap-3 text-cream/80 hover:text-gold transition-colors text-sm"
              >
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>reservations@zumagrand.com</span>
              </a>
              <div className="flex items-start gap-3 text-cream/80 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Plot 123, Maitama District<br />
                  Abuja, Nigeria
                </span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold">Opening Hours</h4>
            <div className="space-y-2 text-cream/80 text-sm">
              <p>Reception: 24/7</p>
              <p>Restaurant: 6:30 AM - 10:30 PM</p>
              <p>Spa & Wellness: 8:00 AM - 9:00 PM</p>
              <p>Pool: 6:00 AM - 10:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/60 text-sm">
            © {new Date().getFullYear()} Zuma Grand Hotel & Suites. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-cream/60 hover:text-gold transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-cream/60 hover:text-gold transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
