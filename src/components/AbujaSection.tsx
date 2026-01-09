import { motion } from "framer-motion";
import { MapPin, Building2, Landmark, TreeDeciduous } from "lucide-react";

const attractions = [
  {
    icon: Landmark,
    name: "Aso Rock",
    distance: "10 min drive",
    description: "The iconic monolith and seat of the Nigerian presidency",
  },
  {
    icon: Building2,
    name: "Central Business District",
    distance: "5 min drive",
    description: "Nigeria's commercial hub with major corporate offices",
  },
  {
    icon: TreeDeciduous,
    name: "Millennium Park",
    distance: "8 min drive",
    description: "Abuja's largest park, perfect for relaxation and events",
  },
  {
    icon: MapPin,
    name: "National Mosque",
    distance: "12 min drive",
    description: "One of the largest mosques in Africa, architectural marvel",
  },
];

const AbujaSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-forest text-cream relative overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4">
              Discover Abuja
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Your Gateway to
              <span className="block text-gold">Nigeria's Capital</span>
            </h2>
            <p className="text-cream/80 text-lg mb-8 leading-relaxed">
              Strategically located in the prestigious Maitama District, Zuma Grand 
              Hotel offers easy access to Abuja's top attractions, business centers, 
              and cultural landmarks. Experience the vibrant energy of Nigeria's 
              modern capital.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {attractions.map((attraction, index) => (
                <motion.div
                  key={attraction.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <attraction.icon className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-cream">{attraction.name}</h3>
                    <p className="text-gold text-sm">{attraction.distance}</p>
                    <p className="text-cream/60 text-sm mt-1">{attraction.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gold/20 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-16 h-16 text-gold mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-bold mb-2">Prime Location</h3>
                <p className="text-cream/80">
                  Plot 123, Maitama District<br />
                  Abuja, FCT, Nigeria
                </p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-4 border-gold/30 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-terracotta/20 rounded-xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AbujaSection;
