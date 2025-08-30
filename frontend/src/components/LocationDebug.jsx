import React, { useState } from 'react';
import GoogleMapReact from './GoogleMapReact';

const LocationDebug = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formState, setFormState] = useState({
    latitude: '',
    longitude: '',
    location: '',
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressZip: '',
    addressCountry: ''
  });

  const handleLocationSelect = (locationData) => {
    console.log('LocationDebug - handleLocationSelect called with:', locationData);
    setSelectedLocation(locationData);
    
    // Parse address components
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

    const addressComponents = parseAddressComponents(locationData.addressComponents);
    
    setFormState(prev => ({
      ...prev,
      latitude: String(locationData.lat),
      longitude: String(locationData.lng),
      location: locationData.formattedAddress,
      addressStreet: addressComponents.street || locationData.formattedAddress,
      addressCity: addressComponents.city || '',
      addressState: addressComponents.state || '',
      addressZip: addressComponents.zipCode || '',
      addressCountry: addressComponents.country || ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('=== SUBMISSION DEBUG ===');
    console.log('selectedLocation:', selectedLocation);
    console.log('formState:', formState);
    
    if (!selectedLocation || !formState.latitude || !formState.longitude) {
      alert('Validation failed! Please check console for details.');
      return;
    }
    
    alert('Validation passed! Check console for details.');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Location Selection Debug</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Interactive Map</h2>
          <GoogleMapReact
            onLocationSelect={handleLocationSelect}
            height="400px"
            showSearch={true}
            showCurrentLocation={true}
            autoCenterOnUserLocation={true}
          />
        </div>

        {/* Debug Info Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Debug Information</h2>
          
          {/* Selected Location */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Selected Location State:</h3>
            <pre className="text-sm text-blue-800 overflow-auto">
              {selectedLocation ? JSON.stringify(selectedLocation, null, 2) : 'No location selected'}
            </pre>
          </div>

          {/* Form State */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Form State:</h3>
            <pre className="text-sm text-green-800 overflow-auto">
              {JSON.stringify(formState, null, 2)}
            </pre>
          </div>

          {/* Validation Test */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Validation Test:</h3>
            <div className="space-y-1 text-sm">
              <p><strong>selectedLocation:</strong> {selectedLocation ? '✅ Set' : '❌ Not Set'}</p>
              <p><strong>formState.latitude:</strong> {formState.latitude ? '✅ Set' : '❌ Not Set'}</p>
              <p><strong>formState.longitude:</strong> {formState.longitude ? '✅ Set' : '❌ Not Set'}</p>
              <p><strong>Validation would pass:</strong> {
                selectedLocation && formState.latitude && formState.longitude ? '✅ Yes' : '❌ No'
              }</p>
            </div>
            <button
              onClick={handleSubmit}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Test Submission
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Click on the map to select a location</li>
              <li>• Watch the debug information update</li>
              <li>• Check the browser console for detailed logs</li>
              <li>• Click "Test Submission" to validate</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDebug;
