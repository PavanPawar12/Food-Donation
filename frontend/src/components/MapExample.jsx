import React, { useState } from 'react';
import GoogleMap from './GoogleMap';

const MapExample = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData);
    console.log('Selected location:', locationData);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Google Maps Integration Example</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Location Selection</h2>
        
        <GoogleMap
          onLocationSelect={handleLocationSelect}
          height="400px"
        />
        
        {selectedLocation && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Selected Location Data:</h3>
            <pre className="text-sm text-green-800 overflow-auto">
              {JSON.stringify(selectedLocation, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapExample;
