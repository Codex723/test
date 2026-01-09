-- Create rooms table with specific room numbers
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number TEXT NOT NULL UNIQUE,
  room_type TEXT NOT NULL CHECK (room_type IN ('single', 'double', 'suite')),
  floor INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Allow public read access to rooms
CREATE POLICY "Anyone can view rooms" 
ON public.rooms 
FOR SELECT 
USING (true);

-- Add room_id and room_number to bookings
ALTER TABLE public.bookings 
ADD COLUMN room_id UUID REFERENCES public.rooms(id),
ADD COLUMN room_number TEXT;

-- Insert sample rooms (3 of each type)
INSERT INTO public.rooms (room_number, room_type, floor) VALUES
-- Single rooms (1st floor)
('101', 'single', 1),
('102', 'single', 1),
('103', 'single', 1),
-- Double rooms (2nd floor)
('201', 'double', 2),
('202', 'double', 2),
('203', 'double', 2),
-- Suites (3rd floor)
('301', 'suite', 3),
('302', 'suite', 3),
('303', 'suite', 3);