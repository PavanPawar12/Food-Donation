import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaRoute, FaClock, FaCar, FaWalking, FaBicycle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/api';

const ClaimDonation = () => {
  const { donationId } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [donation, setDonation] = useState(null);
  const [requesterLocation, setRequesterLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [travelMode, setTravelMode] = useState('driving');
  const [isLoading, setIsLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [map, setMap] = useState(null);
  const [donorMarker, setDonorMarker] = useState(null);
  const [requesterMarker, setRequesterMarker] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  // Load donation data
  useEffect(() => {
    const loadDonation = async () => {
      try {
        const { data } = await api.get(`/donations/${donationId}`);
        setDonation(data.data.donation);
      } catch (error) {
        toast.error('Failed to load donation details');
        navigate('/donations');
      }
    };
    loadDonation();
  }, [donationId, navigate]);

  // Initialize map and get requester location
  useEffect(() => {
    if (!donation) return;

    const initMap = async () => {
      const apiKey = import.meta?.env?.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        toast.error('Google Maps API key not found');
        return;
      }

      // Load Google Maps script if not already loaded
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
        script.async = true;
        script.defer = true;
        script.onload = () => createMap();
        document.head.appendChild(script);
      } else {
        createMap();
      }
    };

    const createMap = () => {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      setMap(mapInstance);

      // Create directions renderer
      const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#3B82F6',
          strokeWeight: 4
        }
      });
      directionsRendererInstance.setMap(mapInstance);
      setDirectionsRenderer(directionsRendererInstance);

      // Get requester's current location
      getRequesterLocation(mapInstance);
    };

    initMap();
  }, [donation]);

  const getRequesterLocation = (mapInstance) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setRequesterLocation({ lat, lng });
        
        // Create requester marker
        const requesterMarkerInstance = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          title: 'Your Location',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });
        setRequesterMarker(requesterMarkerInstance);

        // Create donor marker if we have donation coordinates
        if (donation?.location?.coordinates) {
          const donorCoords = donation.location.coordinates;
          const donorMarkerInstance = new window.google.maps.Marker({
            position: { lat: donorCoords[1], lng: donorCoords[0] },
            map: mapInstance,
            title: 'Donation Location',
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(32, 32)
            }
          });
          setDonorMarker(donorMarkerInstance);

          // Calculate route
          calculateRoute({ lat, lng }, { lat: donorCoords[1], lng: donorCoords[0] });
        }

        // Fit map to show both markers
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend({ lat, lng });
        if (donation?.location?.coordinates) {
          bounds.extend({ lat: donation.location.coordinates[1], lng: donation.location.coordinates[0] });
        }
        mapInstance.fitBounds(bounds);

        setIsLoading(false);
      },
      (error) => {
        toast.error('Unable to get your current location');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const calculateRoute = async (origin, destination) => {
    if (!directionsRenderer) return;

    const directionsService = new window.google.maps.DirectionsService();
    
    try {
      const result = await directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode[travelMode.toUpperCase()],
        unitSystem: window.google.maps.UnitSystem.METRIC
      });

      directionsRenderer.setDirections(result);

      // Extract distance and duration
      const route = result.routes[0];
      const leg = route.legs[0];
      
      setDistance(leg.distance.text);
      setDuration(leg.duration.text);
    } catch (error) {
      console.error('Error calculating route:', error);
      // Fallback to distance calculation using geometry library
      calculateDistance(origin, destination);
    }
  };

  const calculateDistance = (origin, destination) => {
    const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
      new window.google.maps.LatLng(origin.lat, origin.lng),
      new window.google.maps.LatLng(destination.lat, destination.lng)
    );
    
    const distanceKm = (distance / 1000).toFixed(1);
    setDistance(`${distanceKm} km`);
    
    // Estimate travel time based on mode
    const estimatedTime = estimateTravelTime(distanceKm, travelMode);
    setDuration(estimatedTime);
  };

  const estimateTravelTime = (distanceKm, mode) => {
    const speeds = {
      driving: 40, // km/h average city speed
      walking: 5,  // km/h walking speed
      bicycling: 15 // km/h cycling speed
    };
    
    const speed = speeds[mode] || speeds.driving;
    const timeHours = distanceKm / speed;
    const timeMinutes = Math.round(timeHours * 60);
    
    if (timeMinutes < 60) {
      return `${timeMinutes} min`;
    } else {
      const hours = Math.floor(timeMinutes / 60);
      const minutes = timeMinutes % 60;
      return `${hours}h ${minutes}min`;
    }
  };

  const handleTravelModeChange = (mode) => {
    setTravelMode(mode);
    if (requesterLocation && donation?.location?.coordinates) {
      const donorCoords = donation.location.coordinates;
      calculateRoute(
        requesterLocation,
        { lat: donorCoords[1], lng: donorCoords[0] }
      );
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported');
      return;
    }

    setIsTracking(true);
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setRequesterLocation({ lat, lng });
        
        // Update requester marker
        if (requesterMarker) {
          requesterMarker.setPosition({ lat, lng });
        }

        // Recalculate route if we have donor location
        if (donation?.location?.coordinates) {
          const donorCoords = donation.location.coordinates;
          calculateRoute(
            { lat, lng },
            { lat: donorCoords[1], lng: donorCoords[0] }
          );
        }
      },
      (error) => {
        console.error('Error tracking location:', error);
        setIsTracking(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );

    // Store watch ID for cleanup
    return () => navigator.geolocation.clearWatch(watchId);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donation details...</p>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Donation not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Claim Donation</h1>
              <p className="text-gray-600">{donation.title}</p>
            </div>
            <button
              onClick={() => navigate('/donations')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              ← Back to Donations
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Route to Donation</h2>
              </div>
              <div 
                ref={mapRef} 
                className="w-full h-96"
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Donation Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Title</p>
                  <p className="font-medium">{donation.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-medium">{donation.quantity?.amount} {donation.quantity?.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{donation.location?.formattedAddress || 'Address not available'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-medium">{donation.donor?.phone || 'Phone not available'}</p>
                </div>
              </div>
            </div>

            {/* Route Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Information</h3>
              
              {/* Travel Mode Selector */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Travel Mode</p>
                <div className="flex gap-2">
                  {[
                    { mode: 'driving', icon: FaCar, label: 'Drive' },
                    { mode: 'walking', icon: FaWalking, label: 'Walk' },
                    { mode: 'bicycling', icon: FaBicycle, label: 'Bike' }
                  ].map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => handleTravelModeChange(mode)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        travelMode === mode
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance and Duration */}
              {distance && duration && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <FaRoute className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="font-semibold text-blue-900">{distance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <FaClock className="text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Estimated Time</p>
                      <p className="font-semibold text-green-900">{duration}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tracking Controls */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Location Tracking</p>
                {!isTracking ? (
                  <button
                    onClick={startTracking}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Start Tracking
                  </button>
                ) : (
                  <button
                    onClick={stopTracking}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Stop Tracking
                  </button>
                )}
                {isTracking && (
                  <p className="text-xs text-gray-500 mt-2">
                    Your location is being tracked and route will update automatically
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.open(`https://maps.google.com/maps?daddr=${donation.location?.coordinates?.[1]},${donation.location?.coordinates?.[0]}`, '_blank')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaMapMarkerAlt />
                  Open in Google Maps
                </button>
                <button
                  onClick={() => navigate('/donations')}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back to Donations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDonation;
