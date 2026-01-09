import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Maximize, Wifi, Coffee, Tv, Bath } from "lucide-react";
import roomSingle from "@/assets/room-single.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomSuite from "@/assets/room-suite.jpg";

const rooms = [
  {
    id: "single",
    name: "Single Room",
    description: "Perfect for solo travelers seeking comfort and productivity. Our single rooms feature a comfortable queen bed, ergonomic workspace, and all essential amenities for a restful stay.",
    price: 45000,
    image: roomSingle,
    guests: 1,
    size: "25 sqm",
    features: ["Queen Bed", "Work Desk", "City View", "Room Service"],
  },
  {
    id: "double",
    name: "Double Room",
    description: "Ideal for couples or business travelers, our double rooms offer spacious accommodation with a king-size bed, premium furnishings, and stunning views of Abuja's skyline.",
    price: 75000,
    image: roomDeluxe,
    guests: 2,
    size: "35 sqm",
    features: ["King Bed", "Lounge Area", "Panoramic View", "Mini Bar"],
  },
  {
    id: "suite",
    name: "Executive Suite",
    description: "The epitome of luxury, our executive suites feature a separate living area, bedroom, and workspace. Perfect for extended stays or those seeking the finest accommodations.",
    price: 150000,
    image: roomSuite,
    guests: 4,
    size: "65 sqm",
    features: ["Two Bedrooms", "Living Room", "Kitchenette", "Butler Service"],
  },
];

const commonAmenities = [
  { icon: Wifi, label: "High-Speed WiFi" },
  { icon: Coffee, label: "Coffee Machine" },
  { icon: Tv, label: "Smart TV" },
  { icon: Bath, label: "Rain Shower" },
];

const RoomsPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4">
                Accommodations
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Our Rooms & Suites
              </h1>
              <p className="text-muted-foreground text-lg">
                Each room is thoughtfully designed to provide the perfect sanctuary 
                after a day of business or exploration in Abuja.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Rooms List */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="space-y-16 lg:space-y-24">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full aspect-[4/3] object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-gold px-4 py-2 rounded-full">
                        <span className="text-cream font-semibold">
                          ₦{room.price.toLocaleString()}/night
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                      {room.name}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-6">
                      {room.description}
                    </p>

                    <div className="flex items-center gap-6 mb-6 text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Up to {room.guests} guests
                      </span>
                      <span className="flex items-center gap-2">
                        <Maximize className="w-5 h-5" />
                        {room.size}
                      </span>
                    </div>

                    <div className="mb-8">
                      <h3 className="font-semibold text-foreground mb-3">Room Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {room.features.map((feature) => (
                          <span
                            key={feature}
                            className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="font-semibold text-foreground mb-3">Included Amenities</h3>
                      <div className="flex flex-wrap gap-4">
                        {commonAmenities.map((amenity) => (
                          <span
                            key={amenity.label}
                            className="flex items-center gap-2 text-muted-foreground text-sm"
                          >
                            <amenity.icon className="w-4 h-4 text-gold" />
                            {amenity.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button variant="gold" size="lg" asChild>
                      <Link to={`/book?room=${room.id}`}>Book This Room</Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RoomsPage;
