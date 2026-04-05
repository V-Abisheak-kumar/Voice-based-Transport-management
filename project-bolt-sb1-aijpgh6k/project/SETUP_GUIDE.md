# Voice Transport System - Quick Setup Guide

## What You Need to Do

### 1. Configure Environment Variables

Open the `.env` file and update it with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### How to Get Supabase Credentials:

1. Go to your Supabase project at https://supabase.com/dashboard
2. Select your project
3. Click on Settings (gear icon) in the sidebar
4. Go to "API" section
5. Copy:
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon/public key** → Use as `VITE_SUPABASE_ANON_KEY`

#### Google Maps API Key (Optional):

The app works without Google Maps, but for enhanced map features:
1. Go to https://console.cloud.google.com/
2. Enable Maps JavaScript API
3. Create an API key
4. Add it as `VITE_GOOGLE_MAPS_API_KEY`

### 2. That's It!

The database is already set up with:
- All necessary tables (users, buses, routes, rides, feedback)
- Sample data (5 buses, 3 routes, 3 schedules)
- Row Level Security policies
- Indexes for performance

## Using the Application

### Create an Account

1. Open the application
2. Click "Sign Up"
3. Enter your email, password, and full name
4. Click "Sign Up"

### Book a Ride with Voice

1. Navigate to "Book Ride"
2. Click the microphone icon
3. Say: "Book Downtown Express for tomorrow, 2 passengers"
4. Review the details
5. Click "Confirm Booking"

### Track a Bus

1. Navigate to "Track Bus"
2. Click the microphone icon or select a bus
3. Say: "Track BUS-101"
4. View real-time location

### View Ride History

1. Navigate to "Ride History"
2. View all your past and upcoming rides
3. Leave feedback on completed rides

### Update Profile

1. Navigate to "Profile"
2. Update your name and phone number
3. Click "Save Changes"

## Voice Command Examples

### Booking Commands:
- "Book Downtown Express"
- "I want City Loop for tomorrow"
- "Reserve Suburb Connect for 3 passengers"
- "Book express bus for today"

### Tracking Commands:
- "Track BUS-101"
- "Where is BUS-102?"
- "Locate luxury bus"
- "Find express bus"

## Browser Requirements

For voice recognition to work, use:
- ✅ Chrome (Desktop or Mobile)
- ✅ Edge (Desktop or Mobile)
- ✅ Safari (Desktop or iOS)
- ❌ Firefox (Not supported)

## Sample Data Available

The database comes pre-loaded with:

### Buses:
- BUS-101 (Standard, 45 seats)
- BUS-102 (Express, 50 seats)
- BUS-103 (Luxury, 30 seats)
- BUS-104 (Standard, 45 seats)
- BUS-105 (Express, 50 seats)

### Routes:
1. **Downtown Express**: Central Station → Airport (25.5 km)
2. **City Loop**: Main Street → University Campus (15.2 km)
3. **Suburb Connect**: North Terminal → South Bay (18.7 km)

### Schedules:
- BUS-101 on Downtown Express: 08:00 - 08:45 ($12.50)
- BUS-102 on City Loop: 09:30 - 10:00 ($8.00)
- BUS-103 on Suburb Connect: 10:00 - 10:35 ($10.00)

## Troubleshooting

### Voice Recognition Not Working
- Check if you're using a supported browser
- Allow microphone permissions when prompted
- Make sure you're on HTTPS (required for some browsers)

### Can't Login
- Check if you entered the correct email and password
- Password must be at least 6 characters
- Try the "Sign Up" tab if you don't have an account

### No Buses Showing
- Make sure your `.env` file has correct Supabase credentials
- Check browser console for error messages
- Verify you're logged in

### Build Errors
```bash
rm -rf node_modules
npm install
npm run build
```

## Need Help?

1. Check the `README.md` for detailed documentation
2. Review `DATABASE_SCHEMA.md` for database structure
3. Check browser console for error messages
4. Verify all environment variables are set correctly

## Key Features

✅ Voice-based ride booking
✅ Real-time bus tracking
✅ User authentication
✅ Ride history with feedback
✅ User profile management
✅ Secure database with RLS
✅ Responsive design
✅ Sample data included

Enjoy your Voice Transport System!
