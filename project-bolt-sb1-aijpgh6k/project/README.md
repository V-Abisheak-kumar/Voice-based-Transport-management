# Voice-based Transport Management System

A modern, voice-enabled bus booking and tracking system built with React, TypeScript, Supabase, and the Web Speech API.

## Features

### Core Functionality
- **Voice Recognition**: Book rides and track buses using natural voice commands
- **User Authentication**: Secure email/password authentication with Supabase
- **Ride Booking**: Book bus rides with voice or traditional form input
- **Real-time Bus Tracking**: Track active buses with live location updates
- **Ride History**: View past and upcoming rides with detailed information
- **Feedback System**: Rate and review completed rides
- **User Profile Management**: Update personal information and view account statistics

### Voice Commands
The system supports natural language voice commands such as:
- "Book Downtown Express for tomorrow, 2 passengers"
- "Track BUS-101"
- "Find bus to Airport"

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Voice Recognition**: Web Speech API
- **Icons**: Lucide React
- **Build Tool**: Vite

## Database Schema

### Tables
- **user_profiles**: Extended user information (name, phone)
- **buses**: Bus fleet information (bus number, type, capacity, status)
- **routes**: Bus routes with stops and details
- **bus_schedules**: Departure/arrival times and fares
- **rides**: User ride bookings and status
- **bus_locations**: Real-time bus location tracking
- **feedback**: User ratings and reviews

All tables have Row Level Security (RLS) enabled for data protection.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Supabase account
- Modern web browser (Chrome, Edge, or Safari for voice recognition)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voice-transport-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Update the `.env` file with your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key (optional)
   ```

   To get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the Project URL and anon/public key

4. **Database setup**

   The database schema has already been applied through migrations. Your Supabase database includes:
   - All necessary tables (users, buses, routes, rides, feedback, etc.)
   - Sample data (buses, routes, and schedules)
   - Row Level Security policies

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## Usage Guide

### Getting Started

1. **Sign Up/Login**
   - Create a new account or login with existing credentials
   - Your profile will be automatically created

2. **Book a Ride**
   - Navigate to "Book Ride" section
   - Click the microphone icon and say your command
   - Or use the traditional form to select route, date, and passengers
   - Confirm your booking

3. **Track Buses**
   - Go to "Track Bus" section
   - Select a bus from the list or use voice command
   - View real-time location and status

4. **View History**
   - Check "Ride History" for past and upcoming rides
   - Leave feedback on completed rides

5. **Update Profile**
   - Visit "Profile" section
   - Update your name and phone number
   - View account statistics

### Voice Command Examples

**Booking:**
- "Book Downtown Express for tomorrow"
- "I want to book City Loop for 3 passengers"
- "Reserve a seat on Suburb Connect"

**Tracking:**
- "Track BUS-101"
- "Where is BUS-102?"
- "Locate express bus"

## Browser Compatibility

### Voice Recognition Support
- ✅ Chrome (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)
- ✅ Safari (Desktop & iOS)
- ❌ Firefox (Not supported)

The app will display a message if voice recognition is not available in your browser.

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthForm.tsx    # Login/Signup form
│   ├── Dashboard.tsx   # Main dashboard layout
│   ├── BookRide.tsx    # Ride booking interface
│   ├── TrackBus.tsx    # Bus tracking interface
│   ├── RideHistory.tsx # Ride history and feedback
│   ├── UserProfile.tsx # User profile management
│   └── VoiceInput.tsx  # Voice recognition component
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── hooks/              # Custom React hooks
│   └── useVoiceRecognition.ts
├── lib/                # Utilities and configurations
│   ├── supabase.ts     # Supabase client
│   └── database.types.ts # TypeScript types
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## Security Features

- **Row Level Security (RLS)**: All database tables protected with RLS policies
- **Authentication Required**: All operations require valid authentication
- **User Data Isolation**: Users can only access their own rides and profile
- **Secure Password Storage**: Passwords hashed by Supabase Auth
- **Input Validation**: Form inputs validated on client and server

## Development

### Available Scripts

- `npm run dev` - Start development server (auto-started by system)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run typecheck` - Type check TypeScript

### Adding New Features

1. Create component in `src/components/`
2. Add necessary database tables via migrations
3. Update types in `database.types.ts`
4. Implement RLS policies for new tables
5. Test thoroughly before deployment

## Troubleshooting

### Voice Recognition Not Working
- Ensure you're using a supported browser (Chrome, Edge, or Safari)
- Check microphone permissions in browser settings
- Try using HTTPS (required for some browsers)

### Database Connection Issues
- Verify Supabase credentials in `.env`
- Check if Supabase project is active
- Ensure RLS policies are correctly configured

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run typecheck`
- Verify all environment variables are set

## Future Enhancements

- Google Maps integration for interactive map view
- Real-time notifications for ride updates
- Payment gateway integration
- Multi-language support
- Mobile app (React Native)
- Advanced route optimization
- Driver app for bus operators

## License

This project is available for educational and commercial use.

## Support

For issues, questions, or contributions, please refer to the project repository.
