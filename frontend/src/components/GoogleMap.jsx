import React, { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaSearch, FaCrosshairs } from 'react-icons/fa';

const GoogleMap = ({ 
  onLocationSelect, 
  initialLat = 16.7050, // Kolhapur coordinates as default
  initialLng = 74.2433, 
  height = "400px",
  showSearch = true,
  showCurrentLocation = true,
  autoCenterOnUserLocation = true, // New prop to auto-center on user location
  zoom = 13,
  draggable = true,
  showMarker = true,
  showControls = true,
  className = ""
}) => {
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location
  const getUserLocation = () => {
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
          setUserLocation(location);
          resolve(location);
        },
        (error) => {
          console.error('Error getting current location:', error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  useEffect(() => {
    const initMap = async () => {
      const apiKey = import.meta?.env?.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key not found');
        return;
      }

      // Load Google Maps script if not already loaded
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => createMap();
        document.head.appendChild(script);
      } else {
        await createMap();
      }
    };

    const createMap = async () => {
      let centerLat = initialLat;
      let centerLng = initialLng;

      // Try to get user location if auto-center is enabled
      if (autoCenterOnUserLocation) {
        try {
          const userLoc = await getUserLocation();
          centerLat = userLoc.lat;
          centerLng = userLoc.lng;
        } catch (error) {
          console.log('Using default location (Kolhapur):', error.message);
        }
      }

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: zoom,
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

      // Create marker if enabled
      if (showMarker) {
        const mapMarker = new window.google.maps.Marker({
          position: { lat: centerLat, lng: centerLng },
          map: mapInstance,
          draggable: draggable,
          animation: window.google.maps.Animation.DROP
        });

        setMarker(mapMarker);

        // Handle marker drag events
        if (draggable) {
          mapMarker.addListener('dragend', () => {
            const position = mapMarker.getPosition();
            reverseGeocode(position.lat(), position.lng());
          });
        }
      }

      setMap(mapInstance);

      // Create search box if enabled
      if (showSearch && searchBoxRef.current) {
        const searchBoxInstance = new window.google.maps.places.SearchBox(searchBoxRef.current);
        setSearchBox(searchBoxInstance);

        // Bias search results to current map viewport
        mapInstance.addListener('bounds_changed', () => {
          searchBoxInstance.setBounds(mapInstance.getBounds());
        });

        // Listen for search results
        searchBoxInstance.addListener('places_changed', () => {
          const places = searchBoxInstance.getPlaces();
          if (places.length === 0) return;

          const place = places[0];
          if (!place.geometry || !place.geometry.location) return;

          // Update map and marker
          mapInstance.setCenter(place.geometry.location);
          mapInstance.setZoom(16);
          if (marker) {
            marker.setPosition(place.geometry.location);
          }

          // Update selected location
          const locationData = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            formattedAddress: place.formatted_address,
            addressComponents: place.address_components
          };
          setSelectedLocation(locationData);
          if (onLocationSelect) {
            onLocationSelect(locationData);
          }
        });
      }

      // Handle map click events
      mapInstance.addListener('click', (event) => {
        const position = event.latLng;
        if (marker) {
          marker.setPosition(position);
        }
        reverseGeocode(position.lat(), position.lng());
      });

      // If we have user location and auto-center is enabled, update the marker position
      if (userLocation && marker) {
        marker.setPosition({ lat: userLocation.lat, lng: userLocation.lng });
        reverseGeocode(userLocation.lat, userLocation.lng);
      }
    };

    initMap();
  }, [initialLat, initialLng, showSearch, showMarker, draggable, zoom, autoCenterOnUserLocation]);

  const reverseGeocode = async (lat, lng) => {
    setIsLoading(true);
    try {
      const apiKey = import.meta?.env?.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) return;

      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const locationData = {
          lat,
          lng,
          formattedAddress: result.formatted_address,
          addressComponents: result.address_components
        };
        setSelectedLocation(locationData);
        if (onLocationSelect) {
          onLocationSelect(locationData);
        }
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (map && marker) {
          const newPosition = new window.google.maps.LatLng(lat, lng);
          map.setCenter(newPosition);
          map.setZoom(16);
          marker.setPosition(newPosition);
          reverseGeocode(lat, lng);
        }
      },
      (error) => {
        console.error('Error getting current location:', error);
        alert('Unable to get your current location.');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const parseAddressComponents = (components) => {
    if (!components) return {};
    
    const getComponent = (type) => {
      const component = components.find(c => c.types.includes(type));
      return component ? component.long_name : '';
    };

    return {
      street: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
      city: getComponent('locality') || getComponent('administrative_area_level_2'),
      state: getComponent('administrative_area_level_1'),
      zipCode: getComponent('postal_code'),
      country: getComponent('country')
    };
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Box */}
      {showSearch && (
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={searchBoxRef}
            type="text"
            placeholder="Search for a location..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      )}

      {/* Map Container */}
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-300 overflow-hidden"
      />

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

export default GoogleMap;
