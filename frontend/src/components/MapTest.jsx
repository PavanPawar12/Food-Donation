import React, { useState } from 'react';
import GoogleMapReact from './GoogleMapReact';

const MapTest = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationSelect = (locationData) => {
    console.log('Location selected in test:', locationData);
    setSelectedLocation(locationData);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Google Maps Test</h1>
      
      <div className="mb-4">
        <GoogleMapReact
          onLocationSelect={handleLocationSelect}
          height="400px"
          showSearch={true}
          showCurrentLocation={true}
          autoCenterOnUserLocation={true}
        />
      </div>

      {selectedLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Selected Location:</h3>
          <p><strong>Address:</strong> {selectedLocation.formattedAddress}</p>
          <p><strong>Latitude:</strong> {selectedLocation.lat}</p>
          <p><strong>Longitude:</strong> {selectedLocation.lng}</p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>• Click on the map to place a marker</p>
        <p>• Drag the marker to move it</p>
        <p>• Use the search box to find locations</p>
        <p>• Click "Use Current Location" to get your position</p>
      </div>
    </div>
  );
};

export default MapTest;
