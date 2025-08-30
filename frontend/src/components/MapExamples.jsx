import React from 'react';
import GoogleMapReact from './GoogleMapReact';

const MapExamples = () => {
  const handleLocationSelect = (locationData) => {
    console.log('Location selected:', locationData);
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">GoogleMap Component Examples</h1>
      
      {/* Example 1: Full-featured map (like donation form) */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">1. Full-featured Map (Donation Form Style)</h2>
        <p className="text-gray-600">Complete map with search, current location, and location selection.</p>
        <GoogleMapReact 
          onLocationSelect={handleLocationSelect}
          height="400px"
          autoCenterOnUserLocation={true}
        />
      </div>

      {/* Example 2: Read-only display map */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">2. Read-only Display Map</h2>
        <p className="text-gray-600">Map for displaying locations without interaction.</p>
        <GoogleMapReact 
          showSearch={false}
          showCurrentLocation={false}
          showControls={false}
          draggable={false}
          showMarker={false}
          autoCenterOnUserLocation={false}
          height="300px"
          className="border-2 border-gray-300"
        />
      </div>

      {/* Example 3: Minimal map with custom location */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">3. Custom Location Map (Mumbai)</h2>
        <p className="text-gray-600">Map centered on Mumbai with minimal controls.</p>
        <GoogleMapReact 
          initialLat={19.0760}
          initialLng={72.8777}
          zoom={10}
          showSearch={false}
          showCurrentLocation={false}
          showControls={false}
          draggable={false}
          showMarker={true}
          autoCenterOnUserLocation={false}
          height="250px"
        />
      </div>

      {/* Example 4: Compact map for sidebar */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">4. Compact Map (Sidebar Style)</h2>
        <p className="text-gray-600">Small map suitable for sidebars or cards.</p>
        <GoogleMapReact 
          showSearch={false}
          showCurrentLocation={false}
          showControls={false}
          draggable={false}
          showMarker={true}
          autoCenterOnUserLocation={false}
          height="200px"
          className="rounded-lg shadow-md"
        />
      </div>

      {/* Example 5: Map with custom styling */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">5. Custom Styled Map</h2>
        <p className="text-gray-600">Map with custom border and styling.</p>
        <GoogleMapReact 
          showSearch={true}
          showCurrentLocation={true}
          showControls={true}
          draggable={true}
          showMarker={true}
          autoCenterOnUserLocation={true}
          height="350px"
          className="border-4 border-green-500 rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default MapExamples;
