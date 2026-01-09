-- First, update the rooms table room_number to integer
ALTER TABLE public.rooms 
ALTER COLUMN room_number TYPE integer USING room_number::integer;

-- Update the bookings table room_number to integer as well
ALTER TABLE public.bookings 
ALTER COLUMN room_number TYPE integer USING room_number::integer;