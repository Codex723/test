import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const { reference } = await req.json();
    console.log("Verifying payment for reference:", reference);

    if (!reference) {
      throw new Error("Missing payment reference");
    }

    // Verify with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    );

    const verifyData = await verifyResponse.json();
    console.log("Paystack verification response:", JSON.stringify(verifyData));

    if (!verifyData.status) {
      throw new Error(verifyData.message || "Payment verification failed");
    }

    const paymentStatus = verifyData.data.status === "success" ? "paid" : "failed";

    // Update booking status
    const { data: booking, error: updateError } = await supabase
      .from("bookings")
      .update({
        payment_status: paymentStatus,
        paystack_reference: verifyData.data.reference,
      })
      .eq("payment_reference", reference)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating booking:", updateError);
      throw new Error("Failed to update booking status");
    }

    console.log("Booking updated:", booking.id, "Status:", paymentStatus, "Room:", booking.room_number);

    // Send email notification if payment was successful
    if (paymentStatus === "paid") {
      try {
        const emailPayload = {
          bookingId: booking.id,
          fullName: booking.full_name,
          email: booking.email,
          phone: booking.phone,
          roomType: booking.room_type,
          roomNumber: booking.room_number,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          nights: booking.nights,
          guests: booking.guests,
          totalAmount: booking.total_amount,
        };

        const emailResponse = await fetch(
          `${supabaseUrl}/functions/v1/send-booking-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify(emailPayload),
          }
        );

        const emailResult = await emailResponse.json();
        console.log("Email notification result:", emailResult);
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Don't fail the whole request if email fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: paymentStatus,
        booking: {
          id: booking.id,
          fullName: booking.full_name,
          email: booking.email,
          roomType: booking.room_type,
          roomNumber: booking.room_number,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          nights: booking.nights,
          totalAmount: booking.total_amount,
          paymentStatus: booking.payment_status,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in verify-payment:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
