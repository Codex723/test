import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, CheckCircle2, XCircle, Loader2, Download } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { rooms } from "@/components/RoomsSection";
import { supabase } from "@/integrations/supabase/client";

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedRoom = searchParams.get("room") || "";
  const paymentReference = searchParams.get("reference");
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    roomType: preselectedRoom,
    guests: "1",
    specialRequests: "",
  });
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "verifying" | "success" | "failed">("idle");
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  useEffect(() => {
    if (preselectedRoom) {
      setFormData(prev => ({ ...prev, roomType: preselectedRoom }));
    }
  }, [preselectedRoom]);

  // Verify payment if reference is present
  useEffect(() => {
    if (paymentReference) {
      verifyPayment(paymentReference);
    }
  }, [paymentReference]);

  const verifyPayment = async (reference: string) => {
    setPaymentStatus("verifying");
    try {
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: { reference },
      });

      if (error) throw error;

      if (data.success && data.status === "paid") {
        setPaymentStatus("success");
        setConfirmedBooking(data.booking);
        toast.success("Payment successful! Your booking is confirmed.");
      } else {
        setPaymentStatus("failed");
        toast.error("Payment verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      setPaymentStatus("failed");
      toast.error("Failed to verify payment. Please contact support.");
    }
  };

  const selectedRoom = rooms.find(r => r.id === formData.roomType);
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = selectedRoom && nights > 0 ? selectedRoom.price * nights : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || nights <= 0) {
      toast.error("Please select valid check-in and check-out dates");
      return;
    }
    if (!formData.roomType) {
      toast.error("Please select a room type");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("initialize-payment", {
        body: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          roomType: formData.roomType,
          guests: parseInt(formData.guests),
          checkIn: format(checkIn, "yyyy-MM-dd"),
          checkOut: format(checkOut, "yyyy-MM-dd"),
          nights: nights,
          totalAmount: totalPrice,
          specialRequests: formData.specialRequests || undefined,
        },
      });

      if (error) throw error;

      if (data.success && data.authorization_url) {
        // Redirect to Paystack checkout
        window.location.href = data.authorization_url;
      } else if (data.unavailable) {
        toast.error("Room not available for selected dates. Please choose different dates or room type.");
        setIsSubmitting(false);
      } else {
        throw new Error(data.error || "Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      toast.error(error.message || "Failed to process booking. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!confirmedBooking) return;
    
    const receiptContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Booking Receipt - ${confirmedBooking.id?.slice(0, 8).toUpperCase()}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 600px; margin: 40px auto; padding: 20px; color: #333; }
    .header { text-align: center; border-bottom: 2px solid #b8860b; padding-bottom: 20px; margin-bottom: 20px; }
    .header h1 { color: #b8860b; margin: 0 0 8px 0; font-size: 28px; }
    .header p { margin: 4px 0; color: #666; font-size: 14px; }
    h2 { text-align: center; margin: 20px 0; }
    .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
    .row.highlight { background: #fffbe6; margin: 0 -10px; padding: 12px 10px; border-radius: 4px; }
    .label { color: #666; }
    .value { font-weight: 600; }
    .value.gold { color: #b8860b; }
    .total { font-size: 20px; border-top: 2px solid #333; margin-top: 10px; padding-top: 15px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 13px; }
    .paid { color: #228B22; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Zuma Grand Hotel</h1>
    <p>Plot 123, Maitama District, Abuja, Nigeria</p>
    <p>Tel: +234 904 823 4626 | reservations@zumagrand.com</p>
  </div>
  <h2>Booking Receipt</h2>
  <div class="row"><span class="label">Booking Reference</span><span class="value">${confirmedBooking.id?.slice(0, 8).toUpperCase()}</span></div>
  <div class="row"><span class="label">Guest Name</span><span class="value">${confirmedBooking.fullName}</span></div>
  <div class="row"><span class="label">Email</span><span class="value">${confirmedBooking.email}</span></div>
  <div class="row highlight"><span class="label">Room Number</span><span class="value gold" style="font-size: 18px;">${confirmedBooking.roomNumber || 'TBA'}</span></div>
  <div class="row"><span class="label">Room Type</span><span class="value">${confirmedBooking.roomType.charAt(0).toUpperCase() + confirmedBooking.roomType.slice(1)} Room</span></div>
  <div class="row"><span class="label">Check-in</span><span class="value">${format(new Date(confirmedBooking.checkIn), "PPP")}</span></div>
  <div class="row"><span class="label">Check-out</span><span class="value">${format(new Date(confirmedBooking.checkOut), "PPP")}</span></div>
  <div class="row"><span class="label">Nights</span><span class="value">${confirmedBooking.nights}</span></div>
  <div class="row"><span class="label">Payment Status</span><span class="value paid">✓ Paid</span></div>
  <div class="row total"><span class="label">Total Paid</span><span class="value gold">₦${confirmedBooking.totalAmount.toLocaleString()}</span></div>
  <div class="footer">
    <p>Thank you for choosing Zuma Grand Hotel!</p>
    <p>This receipt was generated on ${format(new Date(), "PPP 'at' p")}</p>
  </div>
</body>
</html>`;

    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Zuma-Grand-Receipt-${confirmedBooking.id?.slice(0, 8).toUpperCase()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Show confirmation page if payment was successful
  if (paymentStatus === "success" && confirmedBooking) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <section className="py-16 lg:py-24 bg-secondary print:py-8 print:bg-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-2xl mx-auto"
              >
                <CheckCircle2 className="w-20 h-20 text-forest mx-auto mb-6 print:w-12 print:h-12" />
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 print:text-3xl">Booking Confirmed!</h1>
                <p className="text-muted-foreground text-lg mb-8 print:hidden">Thank you for your reservation. A confirmation email has been sent to {confirmedBooking.email}.</p>
              </motion.div>
            </div>
          </section>

          <section className="py-16 bg-background print:py-4">
            <div className="container mx-auto px-4 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-8 shadow-card print:shadow-none print:border print:border-border"
                id="booking-receipt"
              >
                {/* Print Header */}
                <div className="hidden print:block text-center mb-6 pb-4 border-b border-border">
                  <h2 className="font-serif text-2xl font-bold text-gold">Zuma Grand Hotel</h2>
                  <p className="text-sm text-muted-foreground">Plot 123, Maitama District, Abuja, Nigeria</p>
                  <p className="text-sm text-muted-foreground">Tel: +234 904 823 4626 | reservations@zumagrand.com</p>
                </div>

                <h3 className="font-serif text-2xl font-bold mb-6 text-center print:text-xl">Booking Receipt</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Booking Reference</span>
                    <span className="font-medium font-mono">{confirmedBooking.id?.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Guest Name</span>
                    <span className="font-medium">{confirmedBooking.fullName}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{confirmedBooking.email}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border bg-gold/10 px-3 -mx-3 rounded">
                    <span className="text-muted-foreground font-medium">Room Number</span>
                    <span className="font-bold text-gold text-lg">{confirmedBooking.roomNumber || 'TBA'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Room Type</span>
                    <span className="font-medium capitalize">{confirmedBooking.roomType} Room</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Check-in</span>
                    <span className="font-medium">{format(new Date(confirmedBooking.checkIn), "PPP")}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Check-out</span>
                    <span className="font-medium">{format(new Date(confirmedBooking.checkOut), "PPP")}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Nights</span>
                    <span className="font-medium">{confirmedBooking.nights}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Payment Status</span>
                    <span className="font-medium text-forest flex items-center gap-2">
                      <Check className="w-4 h-4" /> Paid
                    </span>
                  </div>
                  <div className="flex justify-between py-4">
                    <span className="font-semibold text-lg">Total Paid</span>
                    <span className="font-bold text-gold text-2xl print:text-xl">₦{confirmedBooking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Print Footer */}
                <div className="hidden print:block mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
                  <p>Thank you for choosing Zuma Grand Hotel!</p>
                  <p>This receipt was generated on {format(new Date(), "PPP 'at' p")}</p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" size="lg" onClick={handleDownloadReceipt} className="gap-2">
                    <Download className="w-5 h-5" />
                    Download Receipt
                  </Button>
                  <Button variant="gold" size="lg" onClick={() => window.location.href = "/"}>
                    Return to Homepage
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Show verifying state
  if (paymentStatus === "verifying") {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <section className="py-32 bg-secondary">
            <div className="container mx-auto px-4 text-center">
              <Loader2 className="w-16 h-16 text-gold animate-spin mx-auto mb-6" />
              <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Verifying Payment...</h1>
              <p className="text-muted-foreground">Please wait while we confirm your payment.</p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Show failed state
  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <section className="py-32 bg-secondary">
            <div className="container mx-auto px-4 text-center">
              <XCircle className="w-20 h-20 text-destructive mx-auto mb-6" />
              <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Payment Failed</h1>
              <p className="text-muted-foreground mb-8">We couldn't verify your payment. Please try again or contact support.</p>
              <Button variant="gold" size="lg" onClick={() => window.location.href = "/book"}>
                Try Again
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4">Reservations</p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">Book Your Stay</h1>
              <p className="text-muted-foreground text-lg">Complete the form below to reserve your room at Zuma Grand Hotel.</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit}
                className="lg:col-span-2 space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+234 904 823 4626" />
                  </div>
                  <div className="space-y-2">
                    <Label>Room Type *</Label>
                    <Select value={formData.roomType} onValueChange={(value) => setFormData({...formData, roomType: value})}>
                      <SelectTrigger><SelectValue placeholder="Select room type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Room - ₦45,000/night</SelectItem>
                        <SelectItem value="double">Double Room - ₦75,000/night</SelectItem>
                        <SelectItem value="suite">Executive Suite - ₦150,000/night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Check-in Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(date) => date < new Date()} /></PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Check-out Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? format(checkOut, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(date) => date <= (checkIn || new Date())} /></PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Guests *</Label>
                    <Select value={formData.guests} onValueChange={(value) => setFormData({...formData, guests: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4].map(n => <SelectItem key={n} value={String(n)}>{n} Guest{n > 1 ? 's' : ''}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Textarea id="specialRequests" value={formData.specialRequests} onChange={(e) => setFormData({...formData, specialRequests: e.target.value})} placeholder="Any special requirements..." rows={4} />
                </div>
                <Button type="submit" variant="gold" size="xl" className="w-full" disabled={isSubmitting || !totalPrice}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₦${totalPrice.toLocaleString()} with Paystack`
                  )}
                </Button>
              </motion.form>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-2xl p-6 shadow-card h-fit sticky top-24">
                <h3 className="font-serif text-xl font-bold mb-6">Booking Summary</h3>
                {selectedRoom && nights > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between"><span className="text-muted-foreground">Room</span><span className="font-medium">{selectedRoom.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Nights</span><span className="font-medium">{nights}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Rate</span><span className="font-medium">₦{selectedRoom.price.toLocaleString()}/night</span></div>
                    <div className="border-t pt-4 flex justify-between"><span className="font-semibold">Total</span><span className="font-bold text-gold text-xl">₦{totalPrice.toLocaleString()}</span></div>
                    <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-forest" />Free cancellation up to 24h</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-forest" />Secure payment via Paystack</div>
                      <div className="flex items-center gap-2"><Check className="w-4 h-4 text-forest" />Instant confirmation</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Select your room and dates to see pricing.</p>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;
