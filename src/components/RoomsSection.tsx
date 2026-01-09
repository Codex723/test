import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Maximize } from "lucide-react";
import roomSingle from "@/assets/room-single.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomSuite from "@/assets/room-suite.jpg";

export const rooms = [
  {
    id: "single",
    name: "Single Room",
    description: "Perfect for solo travelers, featuring modern amenities and a comfortable workspace.",
    price: 45000,
    image: roomSingle,
    guests: 1,
    size: "25 sqm",
  },
  {
    id: "double",
    name: "Double Room",
    description: "Spacious accommodation with king-size bed, city views, and premium furnishings.",
    price: 75000,
    image: roomDeluxe,
    guests: 2,
    size: "35 sqm",
  },
  {
    id: "suite",
    name: "Executive Suite",
    description: "Luxurious living with separate lounge, panoramic views, and exclusive amenities.",
    price: 150000,
    image: roomSuite,
    guests: 4,
    size: "65 sqm",
  },
];

const RoomsSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4">
            Accommodations
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Our Rooms & Suites
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose from our carefully designed rooms, each offering the perfect blend of 
            comfort and Nigerian elegance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-gold px-3 py-1 rounded-full">
                  <span className="text-cream text-sm font-semibold">
                    ₦{room.price.toLocaleString()}/night
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {room.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {room.description}
                </p>
                <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    Up to {room.guests} guests
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Maximize className="w-4 h-4" />
                    {room.size}
                  </span>
                </div>
                <Button variant="gold" className="w-full" asChild>
                  <Link to={`/book?room=${room.id}`}>Book Now</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/rooms">View All Rooms</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default RoomsSection;
