import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { VoiceInput } from './VoiceInput';
import { Calendar, MapPin, Users, DollarSign, Clock } from 'lucide-react';

interface Route {
  id: string;
  route_name: string;
  start_location: string;
  end_location: string;
  distance_km: number;
}

interface Schedule {
  id: string;
  departure_time: string;
  arrival_time: string;
  fare: number;
  bus: {
    bus_number: string;
    bus_type: string;
    capacity: number;
  };
  route: Route;
}

export function BookRide() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from('bus_schedules')
      .select(`
        id,
        departure_time,
        arrival_time,
        fare,
        bus_id,
        route_id,
        buses!inner(bus_number, bus_type, capacity),
        routes!inner(id, route_name, start_location, end_location, distance_km)
      `);

    if (error) {
      console.error('Error fetching schedules:', error);
      return;
    }

    const formattedData = data.map((item: any) => ({
      id: item.id,
      departure_time: item.departure_time,
      arrival_time: item.arrival_time,
      fare: item.fare,
      bus: item.buses,
      route: item.routes,
    }));

    setSchedules(formattedData);
  };

  const handleVoiceCommand = useCallback((transcript: string) => {
    const text = transcript.toLowerCase();

    const routeMatch = schedules.find(s =>
      text.includes(s.route.route_name.toLowerCase()) ||
      text.includes(s.route.start_location.toLowerCase()) ||
      text.includes(s.route.end_location.toLowerCase())
    );

    if (routeMatch) {
      setSelectedSchedule(routeMatch);
      setPickup(routeMatch.route.start_location);
      setDropoff(routeMatch.route.end_location);
    }

    const dateMatch = text.match(/today|tomorrow|(\d+)/);
    if (dateMatch) {
      if (text.includes('today')) {
        setDate(new Date().toISOString().split('T')[0]);
      } else if (text.includes('tomorrow')) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow.toISOString().split('T')[0]);
      }
    }

    const passengerMatch = text.match(/(\d+)\s*(passenger|person|people)/);
    if (passengerMatch) {
      setPassengers(parseInt(passengerMatch[1]));
    }

    if (text.includes('book') || text.includes('confirm')) {
      handleBooking();
    }
  }, [schedules]);

  const handleBooking = async () => {
    if (!selectedSchedule || !pickup || !dropoff) {
      alert('Please select a route and enter pickup/dropoff locations');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase.from('rides').insert({
        user_id: user?.id,
        bus_id: selectedSchedule.bus.bus_number,
        route_id: selectedSchedule.route.id,
        schedule_id: selectedSchedule.id,
        pickup_location: pickup,
        dropoff_location: dropoff,
        ride_date: date,
        fare_paid: selectedSchedule.fare * passengers,
        passengers,
        status: 'confirmed',
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error booking ride:', error);
      alert('Failed to book ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book a Ride</h2>
        <p className="text-gray-600 mb-6">Use voice commands or fill the form below</p>

        <VoiceInput
          onTranscript={handleVoiceCommand}
          placeholder="Say something like 'Book Downtown Express for tomorrow, 2 passengers'"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Route
              </label>
              <select
                value={selectedSchedule?.id || ''}
                onChange={(e) => {
                  const schedule = schedules.find(s => s.id === e.target.value);
                  setSelectedSchedule(schedule || null);
                  if (schedule) {
                    setPickup(schedule.route.start_location);
                    setDropoff(schedule.route.end_location);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a route...</option>
                {schedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.route.route_name} - {schedule.bus.bus_number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Pickup Location
              </label>
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter pickup location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Dropoff Location
              </label>
              <input
                type="text"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter dropoff location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Users className="w-4 h-4 inline mr-1" />
                Passengers
              </label>
              <input
                type="number"
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                min="1"
                max="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={loading || !selectedSchedule}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>

          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">Ride booked successfully!</p>
            </div>
          )}
        </div>

        {selectedSchedule && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Details</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Route</p>
                  <p className="font-medium text-gray-900">{selectedSchedule.route.route_name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedSchedule.route.start_location} → {selectedSchedule.route.end_location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Schedule</p>
                  <p className="font-medium text-gray-900">
                    {selectedSchedule.departure_time} - {selectedSchedule.arrival_time}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fare</p>
                  <p className="font-medium text-gray-900">
                    ${(selectedSchedule.fare * passengers).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    ${selectedSchedule.fare.toFixed(2)} × {passengers} passenger{passengers > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-600">
                  <strong>Bus:</strong> {selectedSchedule.bus.bus_number}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Type:</strong> {selectedSchedule.bus.bus_type}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Distance:</strong> {selectedSchedule.route.distance_km} km
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
