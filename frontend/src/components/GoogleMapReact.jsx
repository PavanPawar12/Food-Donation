import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { FaCrosshairs, FaMapMarkerAlt } from 'react-icons/fa';

const GoogleMapReact = ({ 
  onLocationSelect, 
  initialLat = 16.7050, // Kolhapur coordinates as default
  initialLng = 74.2433, 
  height = "400px",
  showSearch = true,
  showCurrentLocation = true,
  autoCenterOnUserLocation = true,
  zoom = 13,
  draggable = true,
  showMarker = true,
  showControls = true,
  className = ""
}) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [center, setCenter] = useState({ lat: initialLat, lng: initialLng });
  const searchBoxRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  // Reverse geocoding function
  const reverseGeocode = useCallback(async (lat, lng) => {
    console.log('reverseGeocode called with:', lat, lng);
    setIsLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key not found');
        return;
      }

      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
      console.log('Making geocoding request to:', url);
      const response = await fetch(url);
      const data = await response.json();
      console.log('Geocoding response:', data);

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const locationData = {
          lat,
          lng,
          formattedAddress: result.formatted_address,
          addressComponents: result.address_components
        };
        console.log('Setting selected location:', locationData);
        setSelectedLocation(locationData);
        if (onLocationSelect) {
          console.log('Calling onLocationSelect with:', locationData);
          onLocationSelect(locationData);
        }
      } else {
        console.error('Geocoding failed with status:', data.status);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onLocationSelect]);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          resolve(location);
        },
        (error) => {
          console.error('Error getting current location:', error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  // Initialize map with user location if available
  useEffect(() => {
    if (isLoaded && autoCenterOnUserLocation) {
      getUserLocation()
        .then((userLoc) => {
          console.log('User location obtained:', userLoc);
          setCenter(userLoc);
          // Get address for the user location
          reverseGeocode(userLoc.lat, userLoc.lng);
        })
        .catch((error) => {
          console.log('Using default location (Kolhapur):', error.message);
        });
    }
  }, [isLoaded, autoCenterOnUserLocation, getUserLocation, reverseGeocode]);

  const onLoad = useCallback((mapInstance) => {
    console.log('Map loaded');
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onMarkerLoad = useCallback((markerInstance) => {
    console.log('Marker loaded');
    setMarker(markerInstance);
  }, []);

  const onSearchBoxLoad = useCallback((ref) => {
    searchBoxRef.current = ref;
  }, []);

  const onPlacesChanged = useCallback(() => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      if (!place.geometry || !place.geometry.location) return;

      const newCenter = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      setCenter(newCenter);
      if (marker) {
        marker.setPosition(newCenter);
      }
      if (map) {
        map.setZoom(16);
      }

      // Update selected location
      const locationData = {
        lat: newCenter.lat,
        lng: newCenter.lng,
        formattedAddress: place.formatted_address,
        addressComponents: place.address_components
      };
      setSelectedLocation(locationData);
      if (onLocationSelect) {
        onLocationSelect(locationData);
      }
    }
  }, [marker, map, onLocationSelect]);

  const handleMarkerDragEnd = useCallback((event) => {
    const position = event.latLng;
    const lat = position.lat();
    const lng = position.lng();
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  const handleMapClick = useCallback((event) => {
    console.log('Map clicked!');
    const position = event.latLng;
    const lat = position.lat();
    const lng = position.lng();
    
    console.log('Clicked coordinates:', lat, lng);
    
    // Update center to the clicked position
    setCenter({ lat, lng });
    
    // Update marker position if marker exists
    if (showMarker && marker) {
      marker.setPosition(position);
    }
    
    // Always reverse geocode the clicked position
    reverseGeocode(lat, lng);
    
    // Fallback: If reverseGeocode fails, still call onLocationSelect with basic data
    setTimeout(() => {
      if (!selectedLocation) {
        console.log('Fallback: Calling onLocationSelect with basic data');
        const fallbackData = {
          lat,
          lng,
          formattedAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          addressComponents: []
        };
        if (onLocationSelect) {
          onLocationSelect(fallbackData);
        }
      }
    }, 2000); // Wait 2 seconds for reverseGeocode to complete
  }, [showMarker, marker, reverseGeocode, selectedLocation, onLocationSelect]);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const newCenter = { lat, lng };

        console.log('Current location obtained:', newCenter);
        setCenter(newCenter);
        if (marker) {
          marker.setPosition(newCenter);
        }
        if (map) {
          map.setZoom(16);
        }
        reverseGeocode(lat, lng);
      },
      (error) => {
        console.error('Error getting current location:', error);
        alert('Unable to get your current location.');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [marker, map, reverseGeocode]);

  if (loadError) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-800">Error loading Google Maps. Please check your API key.</p>
        <p className="text-red-600 text-sm mt-2">Error: {loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Box */}
      {showSearch && (
        <div className="relative">
          <StandaloneSearchBox
            onLoad={onSearchBoxLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <input
              type="text"
              placeholder="Search for a location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </StandaloneSearchBox>
          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      )}

      {/* Map Container */}
      <div 
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-300 overflow-hidden"
      >
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
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
          }}
        >
          {showMarker && (
            <Marker
              position={center}
              draggable={draggable}
              onLoad={onMarkerLoad}
              onDragEnd={handleMarkerDragEnd}
              animation={window.google?.maps?.Animation?.DROP}
            />
          )}
        </GoogleMap>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex flex-col sm:flex-row gap-2">
          {showCurrentLocation && (
            <button
              onClick={getCurrentLocation}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <FaCrosshairs />
              {isLoading ? 'Getting Location...' : 'Use Current Location'}
            </button>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaMapMarkerAlt />
            <span>Click on map or drag marker to set location</span>
          </div>
        </div>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">✅ Location Selected:</h4>
          <div className="space-y-1 text-sm">
            <p className="text-green-800">
              <strong>Address:</strong> {selectedLocation.formattedAddress}
            </p>
            <p className="text-green-700">
              <strong>Coordinates:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapReact;
