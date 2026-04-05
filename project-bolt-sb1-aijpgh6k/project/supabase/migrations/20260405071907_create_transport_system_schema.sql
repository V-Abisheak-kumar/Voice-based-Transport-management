-- Voice-based Transport Management System Database Schema
--
-- 1. New Tables
--    - user_profiles: Extended user information
--    - buses: Bus fleet information
--    - routes: Bus routes with stops
--    - bus_schedules: Schedule for each bus on routes
--    - rides: User ride bookings
--    - bus_locations: Real-time bus location tracking
--    - feedback: User feedback on completed rides
--
-- 2. Security
--    - Enable RLS on all tables
--    - Policies for authenticated users to manage their own data
--    - Public read access for bus/route information

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Buses Table
CREATE TABLE IF NOT EXISTS buses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_number text UNIQUE NOT NULL,
  capacity integer NOT NULL DEFAULT 40,
  bus_type text NOT NULL DEFAULT 'standard',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Routes Table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_name text NOT NULL,
  start_location text NOT NULL,
  end_location text NOT NULL,
  stops jsonb DEFAULT '[]'::jsonb,
  distance_km decimal(10,2),
  estimated_duration_minutes integer,
  created_at timestamptz DEFAULT now()
);

-- Bus Schedules Table
CREATE TABLE IF NOT EXISTS bus_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id uuid REFERENCES buses(id) ON DELETE CASCADE,
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  departure_time time NOT NULL,
  arrival_time time NOT NULL,
  days_of_week text[] DEFAULT ARRAY['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
  fare decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Rides Table
CREATE TABLE IF NOT EXISTS rides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  bus_id uuid REFERENCES buses(id),
  route_id uuid REFERENCES routes(id),
  schedule_id uuid REFERENCES bus_schedules(id),
  pickup_location text NOT NULL,
  dropoff_location text NOT NULL,
  booking_date timestamptz DEFAULT now(),
  ride_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  fare_paid decimal(10,2) NOT NULL,
  passengers integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bus Locations Table (for real-time tracking)
CREATE TABLE IF NOT EXISTS bus_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id uuid REFERENCES buses(id) ON DELETE CASCADE,
  latitude decimal(10,8) NOT NULL,
  longitude decimal(11,8) NOT NULL,
  speed decimal(5,2) DEFAULT 0,
  heading decimal(5,2) DEFAULT 0,
  timestamp timestamptz DEFAULT now()
);

-- Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES rides(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for buses (public read)
CREATE POLICY "Anyone can view buses"
  ON buses FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for routes (public read)
CREATE POLICY "Anyone can view routes"
  ON routes FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for bus_schedules (public read)
CREATE POLICY "Anyone can view schedules"
  ON bus_schedules FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for rides
CREATE POLICY "Users can view own rides"
  ON rides FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own rides"
  ON rides FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rides"
  ON rides FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for bus_locations (public read for tracking)
CREATE POLICY "Anyone can view bus locations"
  ON bus_locations FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for feedback
CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_ride_date ON rides(ride_date);
CREATE INDEX IF NOT EXISTS idx_bus_locations_bus_id ON bus_locations(bus_id);
CREATE INDEX IF NOT EXISTS idx_bus_locations_timestamp ON bus_locations(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_ride_id ON feedback(ride_id);