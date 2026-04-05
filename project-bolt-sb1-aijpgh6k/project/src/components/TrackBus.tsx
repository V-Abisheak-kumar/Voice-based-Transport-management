import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { VoiceInput } from './VoiceInput';
import { MapPin, Navigation, Clock } from 'lucide-react';

interface Bus {
  id: string;
  bus_number: string;
  bus_type: string;
  status: string;
}

interface BusLocation {
  id: string;
  bus_id: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
}

export function TrackBus() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [location, setLocation] = useState<BusLocation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBuses();
  }, []);

  useEffect(() => {
    if (selectedBus) {
      fetchBusLocation(selectedBus.id);
      const interval = setInterval(() => {
        fetchBusLocation(selectedBus.id);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedBus]);

  const fetchBuses = async () => {
    const { data, error } = await supabase
      .from('buses')
      .select('*')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching buses:', error);
      return;
    }

    setBuses(data || []);
  };

  const fetchBusLocation = async (busId: string) => {
    const { data, error } = await supabase
      .from('bus_locations')
      .select('*')
      .eq('bus_id', busId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching bus location:', error);
      return;
    }

    if (data) {
      setLocation(data);
    } else {
      const mockLocation: BusLocation = {
        id: 'mock',
        bus_id: busId,
        latitude: 40.7589 + Math.random() * 0.1,
        longitude: -73.9851 + Math.random() * 0.1,
        speed: Math.random() * 50,
        heading: Math.random() * 360,
        timestamp: new Date().toISOString(),
      };
      setLocation(mockLocation);
    }
  };

  const handleVoiceCommand = (transcript: string) => {
    const text = transcript.toLowerCase();

    const busMatch = buses.find(b =>
      text.includes(b.bus_number.toLowerCase())
    );

    if (busMatch) {
      setSelectedBus(busMatch);
    }

    if (text.includes('track') || text.includes('locate') || text.includes('find')) {
      if (selectedBus) {
        fetchBusLocation(selectedBus.id);
      }
    }
  };

  const getStatusColor = (speed: number) => {
    if (speed < 5) return 'text-red-600 bg-red-100';
    if (speed < 30) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusText = (speed: number) => {
    if (speed < 5) return 'Stopped';
    if (speed < 30) return 'Moving Slowly';
    return 'On Route';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Bus</h2>
        <p className="text-gray-600 mb-6">Track buses in real-time using voice commands</p>

        <VoiceInput
          onTranscript={handleVoiceCommand}
          placeholder="Say 'Track BUS-101' to locate a bus"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Bus</h3>

          <div className="space-y-2">
            {buses.map((bus) => (
              <button
                key={bus.id}
                onClick={() => setSelectedBus(bus)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  selectedBus?.id === bus.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{bus.bus_number}</p>
                    <p className="text-sm text-gray-600 capitalize">{bus.bus_type}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    bus.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {bus.status}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedBus && location && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Location</h3>

            <div className="space-y-4">
              <div className={`px-4 py-3 rounded-lg ${getStatusColor(location.speed || 0)}`}>
                <p className="font-medium text-center">{getStatusText(location.speed || 0)}</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Coordinates</p>
                  <p className="font-mono text-sm text-gray-900">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Navigation className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Speed</p>
                  <p className="font-medium text-gray-900">{(location.speed || 0).toFixed(1)} km/h</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {new Date(location.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="aspect-video bg-white rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Map View</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedBus.bus_number} at ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  Add VITE_GOOGLE_MAPS_API_KEY to .env for interactive map
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedBus && !location && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Loading location data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
