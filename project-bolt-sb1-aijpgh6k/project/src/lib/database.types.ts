export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      buses: {
        Row: {
          id: string
          bus_number: string
          capacity: number
          bus_type: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          bus_number: string
          capacity?: number
          bus_type?: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          bus_number?: string
          capacity?: number
          bus_type?: string
          status?: string
          created_at?: string
        }
      }
      routes: {
        Row: {
          id: string
          route_name: string
          start_location: string
          end_location: string
          stops: Json
          distance_km: number | null
          estimated_duration_minutes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          route_name: string
          start_location: string
          end_location: string
          stops?: Json
          distance_km?: number | null
          estimated_duration_minutes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          route_name?: string
          start_location?: string
          end_location?: string
          stops?: Json
          distance_km?: number | null
          estimated_duration_minutes?: number | null
          created_at?: string
        }
      }
      bus_schedules: {
        Row: {
          id: string
          bus_id: string | null
          route_id: string | null
          departure_time: string
          arrival_time: string
          days_of_week: string[]
          fare: number
          created_at: string
        }
        Insert: {
          id?: string
          bus_id?: string | null
          route_id?: string | null
          departure_time: string
          arrival_time: string
          days_of_week?: string[]
          fare: number
          created_at?: string
        }
        Update: {
          id?: string
          bus_id?: string | null
          route_id?: string | null
          departure_time?: string
          arrival_time?: string
          days_of_week?: string[]
          fare?: number
          created_at?: string
        }
      }
      rides: {
        Row: {
          id: string
          user_id: string | null
          bus_id: string | null
          route_id: string | null
          schedule_id: string | null
          pickup_location: string
          dropoff_location: string
          booking_date: string
          ride_date: string
          status: string
          fare_paid: number
          passengers: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          bus_id?: string | null
          route_id?: string | null
          schedule_id?: string | null
          pickup_location: string
          dropoff_location: string
          booking_date?: string
          ride_date: string
          status?: string
          fare_paid: number
          passengers?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          bus_id?: string | null
          route_id?: string | null
          schedule_id?: string | null
          pickup_location?: string
          dropoff_location?: string
          booking_date?: string
          ride_date?: string
          status?: string
          fare_paid?: number
          passengers?: number
          created_at?: string
          updated_at?: string
        }
      }
      bus_locations: {
        Row: {
          id: string
          bus_id: string | null
          latitude: number
          longitude: number
          speed: number | null
          heading: number | null
          timestamp: string
        }
        Insert: {
          id?: string
          bus_id?: string | null
          latitude: number
          longitude: number
          speed?: number | null
          heading?: number | null
          timestamp?: string
        }
        Update: {
          id?: string
          bus_id?: string | null
          latitude?: number
          longitude?: number
          speed?: number | null
          heading?: number | null
          timestamp?: string
        }
      }
      feedback: {
        Row: {
          id: string
          ride_id: string | null
          user_id: string | null
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ride_id?: string | null
          user_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ride_id?: string | null
          user_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
  }
}
