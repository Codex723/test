import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingRequest {
  fullName: string;
  email: string;
  phone: string;
  roomType: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: number;
  specialRequests?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      throw new Error("Paystack secret key not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const bookingData: BookingRequest = await req.json();
    console.log("Received booking data:", JSON.stringify(bookingData));

    // Validate required fields
    if (!bookingData.email || !bookingData.fullName || !bookingData.totalAmount) {
      throw new Error("Missing required booking fields");
    }

    // Get all rooms of the requested type
    const { data: allRooms, error: roomsError } = await supabase
      .from("rooms")
      .select("id, room_number")
      .eq("room_type", bookingData.roomType)
      .eq("is_active", true);

    if (roomsError) {
      console.error("Error fetching rooms:", roomsError);
      throw new Error("Failed to fetch available rooms");
    }

    if (!allRooms || allRooms.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No rooms available for this room type.",
          unavailable: true,
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get all booked room IDs for the requested dates (only paid bookings)
    const { data: bookedRooms, error: bookedError } = await supabase
      .from("bookings")
      .select("room_id")
      .eq("payment_status", "paid")
      .not("room_id", "is", null)
      .or(`and(check_in.lt.${bookingData.checkOut},check_out.gt.${bookingData.checkIn})`);

    if (bookedError) {
      console.error("Error checking booked rooms:", bookedError);
      throw new Error("Failed to check room availability");
    }

    const bookedRoomIds = new Set(bookedRooms?.map(b => b.room_id) || []);
    
    // Find an available room
    const availableRoom = allRooms.find(room => !bookedRoomIds.has(room.id));

    if (!availableRoom) {
      console.log("No available rooms for dates:", bookingData.checkIn, "to", bookingData.checkOut);
      return new Response(
        JSON.stringify({
          success: false,
          error: "All rooms of this type are booked for the selected dates. Please choose different dates or room type.",
          unavailable: true,
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Assigned room:", availableRoom.room_number);

    // Generate unique reference
    const reference = `ZUMA-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create booking in database with pending status and assigned room
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        full_name: bookingData.fullName,
        email: bookingData.email,
        phone: bookingData.phone,
        room_type: bookingData.roomType,
        room_id: availableRoom.id,
        room_number: availableRoom.room_number,
        guests: bookingData.guests,
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        nights: bookingData.nights,
        total_amount: bookingData.totalAmount,
        special_requests: bookingData.specialRequests || null,
        payment_status: "pending",
        payment_reference: reference,
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Error creating booking:", bookingError);
      throw new Error("Failed to create booking");
    }

    console.log("Booking created:", booking.id, "Room:", availableRoom.room_number);

    // Initialize Paystack transaction
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: bookingData.email,
        amount: bookingData.totalAmount * 100, // Paystack expects amount in kobo
        reference: reference,
        callback_url: `${req.headers.get("origin")}/book?reference=${reference}`,
        metadata: {
          booking_id: booking.id,
          full_name: bookingData.fullName,
          room_type: bookingData.roomType,
          room_number: availableRoom.room_number,
          check_in: bookingData.checkIn,
          check_out: bookingData.checkOut,
        },
      }),
    });

    const paystackData = await paystackResponse.json();
    console.log("Paystack response:", JSON.stringify(paystackData));

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Failed to initialize payment");
    }

    return new Response(
      JSON.stringify({
        success: true,
        authorization_url: paystackData.data.authorization_url,
        reference: reference,
        booking_id: booking.id,
        room_number: availableRoom.room_number,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in initialize-payment:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
