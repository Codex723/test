import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  bookingId: string;
  fullName: string;
  email: string;
  phone: string;
  roomType: string;
  roomNumber: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalAmount: number;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Send booking email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: BookingEmailRequest = await req.json();
    console.log("Sending email for booking:", booking.bookingId);

    const hotelEmail = "bidikelvin282@gmail.com";

    // Format dates nicely
    const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; background: #f9f9f9; }
          .container { background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #b8860b; padding-bottom: 20px; margin-bottom: 25px; }
          .header h1 { color: #b8860b; margin: 0 0 8px 0; font-size: 28px; }
          .header p { margin: 4px 0; color: #666; font-size: 14px; }
          h2 { text-align: center; color: #333; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
          .row:last-child { border-bottom: none; }
          .label { color: #666; }
          .value { font-weight: 600; text-align: right; }
          .highlight { background: #fffbe6; margin: 0 -15px; padding: 12px 15px; border-radius: 4px; }
          .highlight .value { color: #b8860b; font-size: 18px; }
          .total { font-size: 18px; border-top: 2px solid #333; margin-top: 15px; padding-top: 15px; }
          .total .value { color: #b8860b; font-size: 22px; }
          .footer { text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 13px; }
          .badge { display: inline-block; background: #228B22; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Zuma Grand Hotel</h1>
            <p>Plot 123, Maitama District, Abuja, Nigeria</p>
            <p>Tel: +234 904 823 4626 | reservations@zumagrand.com</p>
          </div>
          
          <h2>🎉 New Booking Confirmed!</h2>
          
          <div class="row">
            <span class="label">Booking Reference</span>
            <span class="value">${booking.bookingId.slice(0, 8).toUpperCase()}</span>
          </div>
          <div class="row">
            <span class="label">Guest Name</span>
            <span class="value">${booking.fullName}</span>
          </div>
          <div class="row">
            <span class="label">Guest Email</span>
            <span class="value">${booking.email}</span>
          </div>
          <div class="row">
            <span class="label">Guest Phone</span>
            <span class="value">${booking.phone}</span>
          </div>
          <div class="row highlight">
            <span class="label"><strong>Room Number</strong></span>
            <span class="value">${booking.roomNumber}</span>
          </div>
          <div class="row">
            <span class="label">Room Type</span>
            <span class="value">${booking.roomType.charAt(0).toUpperCase() + booking.roomType.slice(1)} Room</span>
          </div>
          <div class="row">
            <span class="label">Number of Guests</span>
            <span class="value">${booking.guests} Guest${booking.guests > 1 ? 's' : ''}</span>
          </div>
          <div class="row">
            <span class="label">Check-in Date</span>
            <span class="value">${checkInDate}</span>
          </div>
          <div class="row">
            <span class="label">Check-out Date</span>
            <span class="value">${checkOutDate}</span>
          </div>
          <div class="row">
            <span class="label">Duration</span>
            <span class="value">${booking.nights} Night${booking.nights > 1 ? 's' : ''}</span>
          </div>
          <div class="row">
            <span class="label">Payment Status</span>
            <span class="value"><span class="badge">✓ PAID</span></span>
          </div>
          <div class="row total">
            <span class="label"><strong>Total Amount Paid</strong></span>
            <span class="value">₦${booking.totalAmount.toLocaleString()}</span>
          </div>
          
          <div class="footer">
            <p>This is an automated booking notification from Zuma Grand Hotel.</p>
            <p>Generated on ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Zuma Grand Hotel <onboarding@resend.dev>",
      to: [hotelEmail],
      subject: `New Booking: ${booking.fullName} - Room ${booking.roomNumber} (${booking.nights} nights)`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending booking email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
