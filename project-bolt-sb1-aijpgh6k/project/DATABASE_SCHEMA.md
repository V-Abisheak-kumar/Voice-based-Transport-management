# Database Schema Documentation

## Overview

The Voice Transport Management System uses Supabase (PostgreSQL) with the following tables. All tables have Row Level Security (RLS) enabled.

## Tables

### user_profiles

Extended user information beyond the basic auth.users table.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key, references auth.users(id) |
| full_name | text | User's full name |
| phone | text | User's phone number (optional) |
| created_at | timestamptz | Profile creation timestamp |
| updated_at | timestamptz | Last update timestamp |

**RLS Policies:**
- Users can view their own profile
- Users can update their own profile
- Users can insert their own profile

---

### buses

Information about the bus fleet.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| bus_number | text | Unique bus identifier (e.g., "BUS-101") |
| capacity | integer | Maximum passenger capacity |
| bus_type | text | Type: 'standard', 'express', 'luxury' |
| status | text | Status: 'active', 'inactive', 'maintenance' |
| created_at | timestamptz | Record creation timestamp |

**RLS Policies:**
- All authenticated users can view buses

---

### routes

Bus routes with stops and journey details.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| route_name | text | Name of the route |
| start_location | text | Starting point |
| end_location | text | Destination |
| stops | jsonb | Array of stop objects with name, lat, lng |
| distance_km | decimal | Total route distance in kilometers |
| estimated_duration_minutes | integer | Expected journey time |
| created_at | timestamptz | Record creation timestamp |

**Stops Format:**
```json
[
  {"name": "Central Station", "lat": 40.7589, "lng": -73.9851},
  {"name": "Market Square", "lat": 40.7614, "lng": -73.9776}
]
```

**RLS Policies:**
- All authenticated users can view routes

---

### bus_schedules

Schedule information for buses on specific routes.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| bus_id | uuid | References buses(id) |
| route_id | uuid | References routes(id) |
| departure_time | time | Scheduled departure time |
| arrival_time | time | Scheduled arrival time |
| days_of_week | text[] | Array of applicable days |
| fare | decimal | Ticket price |
| created_at | timestamptz | Record creation timestamp |

**RLS Policies:**
- All authenticated users can view schedules

---

### rides

User ride bookings and their status.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References auth.users(id) |
| bus_id | uuid | References buses(id) |
| route_id | uuid | References routes(id) |
| schedule_id | uuid | References bus_schedules(id) |
| pickup_location | text | Pickup point |
| dropoff_location | text | Drop-off point |
| booking_date | timestamptz | When booking was made |
| ride_date | date | Scheduled ride date |
| status | text | Status: 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled' |
| fare_paid | decimal | Total fare paid |
| passengers | integer | Number of passengers |
| created_at | timestamptz | Record creation timestamp |
| updated_at | timestamptz | Last update timestamp |

**RLS Policies:**
- Users can view their own rides
- Users can create their own rides
- Users can update their own rides

---

### bus_locations

Real-time location tracking for buses.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| bus_id | uuid | References buses(id) |
| latitude | decimal | GPS latitude coordinate |
| longitude | decimal | GPS longitude coordinate |
| speed | decimal | Current speed in km/h |
| heading | decimal | Direction in degrees (0-360) |
| timestamp | timestamptz | Location update timestamp |

**RLS Policies:**
- All authenticated users can view bus locations

**Indexes:**
- idx_bus_locations_bus_id on bus_id
- idx_bus_locations_timestamp on timestamp (descending)

---

### feedback

User ratings and reviews for completed rides.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| ride_id | uuid | References rides(id) |
| user_id | uuid | References auth.users(id) |
| rating | integer | Rating from 1 to 5 stars |
| comment | text | Optional text feedback |
| created_at | timestamptz | Feedback submission timestamp |

**Constraints:**
- rating must be between 1 and 5

**RLS Policies:**
- Users can view their own feedback
- Users can create feedback for their own rides

**Indexes:**
- idx_feedback_ride_id on ride_id

---

## Relationships

```
auth.users (Supabase Auth)
    ↓
user_profiles (1:1)
    ↓
rides (1:many) ← bus_schedules (many:1) → buses
    ↓                                        ↓
feedback                              bus_locations
                   routes
                     ↓
              bus_schedules
```

## Sample Queries

### Get all available buses on a route
```sql
SELECT
  b.bus_number,
  b.bus_type,
  bs.departure_time,
  bs.arrival_time,
  bs.fare,
  r.route_name
FROM bus_schedules bs
JOIN buses b ON b.id = bs.bus_id
JOIN routes r ON r.id = bs.route_id
WHERE b.status = 'active'
ORDER BY bs.departure_time;
```

### Get user's ride history with details
```sql
SELECT
  r.ride_date,
  r.pickup_location,
  r.dropoff_location,
  r.status,
  r.fare_paid,
  rt.route_name
FROM rides r
LEFT JOIN routes rt ON rt.id = r.route_id
WHERE r.user_id = auth.uid()
ORDER BY r.ride_date DESC;
```

### Get latest bus location
```sql
SELECT
  b.bus_number,
  bl.latitude,
  bl.longitude,
  bl.speed,
  bl.timestamp
FROM bus_locations bl
JOIN buses b ON b.id = bl.bus_id
WHERE bl.bus_id = 'bus-uuid-here'
ORDER BY bl.timestamp DESC
LIMIT 1;
```

## Migration Files

All schema changes are tracked in Supabase migrations located in the `supabase/migrations/` directory.

Current migration: `create_transport_system_schema`

## Security Considerations

1. **RLS Enabled**: All tables have Row Level Security enabled
2. **User Isolation**: Users can only access their own data (rides, profiles, feedback)
3. **Public Read**: Buses, routes, schedules, and bus locations are readable by all authenticated users
4. **Cascading Deletes**: Related records are deleted when parent records are removed
5. **Constraints**: Data integrity enforced through foreign keys and check constraints

## Backup and Recovery

Supabase provides automatic backups. For manual backups:

1. Export data using Supabase dashboard
2. Use pg_dump for full database backup
3. Keep migration files version controlled

## Performance Optimization

Indexes are created on:
- rides.user_id (user ride lookups)
- rides.ride_date (date-based queries)
- bus_locations.bus_id (location tracking)
- bus_locations.timestamp (recent locations)
- feedback.ride_id (feedback lookups)

## Data Seeding

Sample data is automatically inserted for:
- 5 buses (BUS-101 through BUS-105)
- 3 routes (Downtown Express, City Loop, Suburb Connect)
- 3 bus schedules (one for each route)

This provides immediate functionality for testing and demonstration.
