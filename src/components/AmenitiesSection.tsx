import { motion } from "framer-motion";
import { Wifi, Car, UtensilsCrossed, Dumbbell, Waves, Shield, Coffee, Sparkles } from "lucide-react";

const amenities = [
  {
    icon: Wifi,
    title: "High-Speed WiFi",
    description: "Complimentary fiber-optic internet throughout the hotel",
  },
  {
    icon: UtensilsCrossed,
    title: "Fine Dining",
    description: "Nigerian and international cuisine",
  },
  {
    icon: Car,
    title: "Free Parking",
    description: "Secure parking for all guests",
  },
  {
    icon: Waves,
    title: "Swimming Pool",
    description: "Heated outdoor pool with lounge area",
  },
  {
    icon: Dumbbell,
    title: "Fitness Center",
    description: "24/7 access to modern gym equipment",
  },
  {
    icon: Sparkles,
    title: "Spa & Wellness",
    description: "Traditional and contemporary treatments",
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description: "Round-the-clock security and concierge",
  },
  {
    icon: Coffee,
    title: "Business Center",
    description: "Conference rooms and meeting facilities",
  },
];

const AmenitiesSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4">
            Our Amenities
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            World-Class Facilities
          </h2>
          <p className="text-muted-foreground text-lg">
            Every detail designed for your comfort and convenience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => (
            <motion.div
              key={amenity.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold transition-colors duration-300">
                <amenity.icon className="w-7 h-7 text-gold group-hover:text-cream transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                {amenity.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {amenity.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;
