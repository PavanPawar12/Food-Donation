import React, { useState } from 'react';
import GoogleMapReact from './GoogleMapReact';

const SimpleLocationTest = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    address: ''
  });

  const handleLocationSelect = (locationData) => {
    console.log('SimpleLocationTest - handleLocationSelect called with:', locationData);
    setSelectedLocation(locationData);
    setFormData({
      latitude: String(locationData.lat),
      longitude: String(locationData.lng),
      address: locationData.formattedAddress
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('=== SIMPLE TEST SUBMISSION ===');
    console.log('selectedLocation:', selectedLocation);
    console.log('formData:', formData);
    
    if (!selectedLocation || !formData.latitude || !formData.longitude) {
      alert('❌ Validation failed! Location not selected properly.');
      return;
    }
    
    alert('✅ Validation passed! Location selected successfully.');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simple Location Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Map</h2>
          <GoogleMapReact
            onLocationSelect={handleLocationSelect}
            height="400px"
            showSearch={true}
            showCurrentLocation={true}
            autoCenterOnUserLocation={true}
          />
        </div>

        {/* Status */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Status</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Selected Location:</h3>
            {selectedLocation ? (
              <div className="text-sm text-blue-800">
                <p><strong>Address:</strong> {selectedLocation.formattedAddress}</p>
                <p><strong>Latitude:</strong> {selectedLocation.lat}</p>
                <p><strong>Longitude:</strong> {selectedLocation.lng}</p>
              </div>
            ) : (
              <p className="text-blue-600">No location selected</p>
            )}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Form Data:</h3>
            <div className="text-sm text-green-800">
              <p><strong>Latitude:</strong> {formData.latitude || 'Not set'}</p>
              <p><strong>Longitude:</strong> {formData.longitude || 'Not set'}</p>
              <p><strong>Address:</strong> {formData.address || 'Not set'}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Validation:</h3>
            <div className="text-sm text-yellow-800">
              <p><strong>Location Selected:</strong> {selectedLocation ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Latitude Set:</strong> {formData.latitude ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Longitude Set:</strong> {formData.longitude ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Would Pass Validation:</strong> {
                selectedLocation && formData.latitude && formData.longitude ? '✅ Yes' : '❌ No'
              }</p>
            </div>
            <button
              onClick={handleSubmit}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Test Submit
            </button>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Click on the map to select a location</li>
              <li>• Watch the status boxes update</li>
              <li>• Click "Test Submit" to validate</li>
              <li>• Check browser console for logs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLocationTest;
