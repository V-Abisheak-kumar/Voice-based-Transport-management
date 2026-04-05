import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookRide } from './BookRide';
import { TrackBus } from './TrackBus';
import { RideHistory } from './RideHistory';
import { UserProfile } from './UserProfile';
import { Bus, History, MapPin, User, LogOut, Mic } from 'lucide-react';

type View = 'book' | 'track' | 'history' | 'profile';

export function Dashboard() {
  const [activeView, setActiveView] = useState<View>('book');
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Voice Transport</h1>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  Voice-enabled
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveView('book')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeView === 'book'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bus className="w-5 h-5" />
                  Book Ride
                </button>

                <button
                  onClick={() => setActiveView('track')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeView === 'track'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  Track Bus
                </button>

                <button
                  onClick={() => setActiveView('history')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeView === 'history'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <History className="w-5 h-5" />
                  Ride History
                </button>

                <button
                  onClick={() => setActiveView('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeView === 'profile'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            {activeView === 'book' && <BookRide />}
            {activeView === 'track' && <TrackBus />}
            {activeView === 'history' && <RideHistory />}
            {activeView === 'profile' && <UserProfile />}
          </main>
        </div>
      </div>
    </div>
  );
}
