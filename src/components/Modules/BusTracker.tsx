import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Navigation, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface BusRoute {
  id: string;
  routeName: string;
  stops: string[];
  schedule: { stop: string; time: string }[];
  driverId: string;
  busNumber: string;
  capacity: number;
  currentLocation?: { lat: number; lng: number };
  delay: number; // in minutes
  status: 'active' | 'delayed' | 'cancelled';
  nextStop?: string;
  estimatedArrival?: string;
}

const BusTracker: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  const [routes, setRoutes] = useState<BusRoute[]>([
    {
      id: 'RT001',
      routeName: 'Main Campus - City Center',
      stops: ['Main Gate', 'Library', 'Hostel Block A', 'Hostel Block B', 'City Center', 'Railway Station'],
      schedule: [
        { stop: 'Main Gate', time: '08:00' },
        { stop: 'Library', time: '08:05' },
        { stop: 'Hostel Block A', time: '08:10' },
        { stop: 'Hostel Block B', time: '08:15' },
        { stop: 'City Center', time: '08:30' },
        { stop: 'Railway Station', time: '08:45' },
      ],
      driverId: 'DRV001',
      busNumber: 'CU-001',
      capacity: 40,
      currentLocation: { lat: 12.9716, lng: 77.5946 },
      delay: 5,
      status: 'delayed',
      nextStop: 'Hostel Block A',
      estimatedArrival: '08:15',
    },
    {
      id: 'RT002',
      routeName: 'Campus - Tech Park',
      stops: ['Main Gate', 'Engineering Block', 'Admin Block', 'Tech Park Gate 1', 'Tech Park Gate 2'],
      schedule: [
        { stop: 'Main Gate', time: '09:00' },
        { stop: 'Engineering Block', time: '09:05' },
        { stop: 'Admin Block', time: '09:10' },
        { stop: 'Tech Park Gate 1', time: '09:25' },
        { stop: 'Tech Park Gate 2', time: '09:30' },
      ],
      driverId: 'DRV002',
      busNumber: 'CU-002',
      capacity: 35,
      currentLocation: { lat: 12.9716, lng: 77.5946 },
      delay: 0,
      status: 'active',
      nextStop: 'Tech Park Gate 1',
      estimatedArrival: '09:25',
    },
    {
      id: 'RT003',
      routeName: 'Hostel - Shopping Mall',
      stops: ['Hostel Block A', 'Hostel Block B', 'Hostel Block C', 'Metro Station', 'Shopping Mall'],
      schedule: [
        { stop: 'Hostel Block A', time: '10:00' },
        { stop: 'Hostel Block B', time: '10:05' },
        { stop: 'Hostel Block C', time: '10:10' },
        { stop: 'Metro Station', time: '10:20' },
        { stop: 'Shopping Mall', time: '10:35' },
      ],
      driverId: 'DRV003',
      busNumber: 'CU-003',
      capacity: 30,
      currentLocation: { lat: 12.9716, lng: 77.5946 },
      delay: 0,
      status: 'cancelled',
      nextStop: 'Hostel Block A',
      estimatedArrival: '10:00',
    },
  ]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredRoutes = selectedRoute === 'all' 
    ? routes 
    : routes.filter(route => route.id === selectedRoute);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'delayed':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}:00`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bus Tracker</h1>
          <p className="mt-1 text-gray-600">Live tracking of college buses with routes and delays</p>
        </div>
        <div className="mt-4 sm:mt-0 text-sm text-gray-600">
          Last updated: {currentTime.toLocaleTimeString()}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: 'Active Routes', value: routes.filter(r => r.status === 'active').length, color: 'bg-green-500' },
          { label: 'Delayed', value: routes.filter(r => r.status === 'delayed').length, color: 'bg-yellow-500' },
          { label: 'Cancelled', value: routes.filter(r => r.status === 'cancelled').length, color: 'bg-red-500' },
          { label: 'Total Buses', value: routes.length, color: 'bg-blue-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Route Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Route:</label>
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Routes</option>
            {routes.map(route => (
              <option key={route.id} value={route.id}>{route.routeName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Routes List */}
      <div className="space-y-6">
        {filteredRoutes.map((route) => (
          <div key={route.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(route.status)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{route.routeName}</h3>
                  <p className="text-sm text-gray-600">Bus {route.busNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(route.status)}`}>
                  {route.status}
                  {route.delay > 0 && route.status === 'delayed' && ` (+${route.delay}m)`}
                </span>
              </div>
            </div>

            {/* Current Status */}
            {route.status !== 'cancelled' && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Next Stop</p>
                      <p className="text-sm text-gray-600">{route.nextStop}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Estimated Arrival</p>
                      <p className="text-sm text-gray-600">{formatTime(route.estimatedArrival || '')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Capacity</p>
                      <p className="text-sm text-gray-600">{route.capacity} passengers</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Route Schedule */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Route Schedule</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {route.schedule.map((stop, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      stop.stop === route.nextStop && route.status !== 'cancelled'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        stop.stop === route.nextStop && route.status !== 'cancelled'
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                      }`} />
                      <span className="text-sm font-medium text-gray-900">{stop.stop}</span>
                    </div>
                    <span className="text-sm text-gray-600">{formatTime(stop.time)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Map Placeholder */}
            <div className="mt-4 bg-gray-100 rounded-lg p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Live map tracking coming soon</p>
              <p className="text-sm text-gray-500">Current location: {route.currentLocation?.lat.toFixed(4)}, {route.currentLocation?.lng.toFixed(4)}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredRoutes.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
          <p className="text-gray-600">Try selecting a different route filter.</p>
        </div>
      )}

      {/* Emergency Contact */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h4 className="text-sm font-medium text-red-800">Emergency Contact</h4>
        </div>
        <p className="text-sm text-red-700 mt-1">
          For bus-related emergencies or issues, contact: <strong>+91-9876543210</strong>
        </p>
      </div>
    </div>
  );
};

export default BusTracker;
