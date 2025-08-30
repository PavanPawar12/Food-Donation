# GoogleMapReact Component Documentation

A React component for displaying interactive Google Maps using the official `@react-google-maps/api` library with location selection, search, and geolocation features.

## Features

- 🗺️ Interactive Google Map with draggable markers using official React Google Maps API
- 🔍 Location search with Google Places API (StandaloneSearchBox)
- 📍 Current location detection with browser geolocation
- 🎯 Auto-center on user location with fallback to default city (Kolhapur)
- 📱 Responsive design with Tailwind CSS
- ⚙️ Highly configurable with multiple props
- 🔄 Real-time location updates and reverse geocoding

## Installation

```bash
npm install @react-google-maps/api
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onLocationSelect` | `function` | - | Callback function called when location is selected |
| `initialLat` | `number` | `16.7050` | Default latitude (Kolhapur) |
| `initialLng` | `number` | `74.2433` | Default longitude (Kolhapur) |
| `height` | `string` | `"400px"` | Map container height |
| `showSearch` | `boolean` | `true` | Show location search box |
| `showCurrentLocation` | `boolean` | `true` | Show "Use Current Location" button |
| `autoCenterOnUserLocation` | `boolean` | `true` | Auto-center map on user's location |
| `zoom` | `number` | `13` | Initial map zoom level |
| `draggable` | `boolean` | `true` | Allow marker dragging |
| `showMarker` | `boolean` | `true` | Show map marker |
| `showControls` | `boolean` | `true` | Show control buttons and instructions |
| `className` | `string` | `""` | Additional CSS classes |

## Location Data Structure

The `onLocationSelect` callback receives an object with the following structure:

```javascript
{
  lat: number,                    // Latitude
  lng: number,                    // Longitude
  formattedAddress: string,       // Full formatted address
  addressComponents: Array        // Detailed address components from Google
}
```

## Usage Examples

### Basic Usage (Donation Form)
```jsx
import GoogleMapReact from './components/GoogleMapReact';

function DonationForm() {
  const handleLocationSelect = (locationData) => {
    console.log('Selected location:', locationData);
    // Update form state with location data
    setForm(prev => ({
      ...prev,
      latitude: String(locationData.lat),
      longitude: String(locationData.lng),
      location: locationData.formattedAddress
    }));
  };

  return (
    <GoogleMapReact 
      onLocationSelect={handleLocationSelect}
      height="300px"
      autoCenterOnUserLocation={true}
    />
  );
}
```

### Read-only Map (Display Only)
```jsx
<GoogleMapReact 
  showSearch={false}
  showCurrentLocation={false}
  showControls={false}
  draggable={false}
  showMarker={false}
  autoCenterOnUserLocation={false}
  height="300px"
/>
```

### Custom Location with Different Default
```jsx
<GoogleMapReact 
  initialLat={19.0760}  // Mumbai
  initialLng={72.8777}
  zoom={10}
  onLocationSelect={handleLocationSelect}
/>
```

### Minimal Map for Display
```jsx
<GoogleMapReact 
  showSearch={false}
  showCurrentLocation={false}
  showControls={false}
  showMarker={false}
  autoCenterOnUserLocation={false}
  height="250px"
  className="border-2 border-gray-300"
/>
```

## Environment Variables Required

Make sure you have the following in your `.env` file:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## API Requirements

The component requires the following Google Maps APIs to be enabled:
- Maps JavaScript API
- Places API
- Geocoding API

## Key Features Implementation

### 1. Auto-center on User Location
```javascript
// Automatically centers map on user's current location
React.useEffect(() => {
  if (isLoaded && autoCenterOnUserLocation) {
    getUserLocation()
      .then((userLoc) => {
        setCenter(userLoc);
        if (marker) {
          marker.setPosition(userLoc);
        }
        reverseGeocode(userLoc.lat, userLoc.lng);
      })
      .catch((error) => {
        console.log('Using default location (Kolhapur):', error.message);
      });
  }
}, [isLoaded, autoCenterOnUserLocation, getUserLocation, marker]);
```

### 2. Draggable Marker with Reverse Geocoding
```javascript
const handleMarkerDragEnd = useCallback((event) => {
  const position = event.latLng;
  const lat = position.lat();
  const lng = position.lng();
  reverseGeocode(lat, lng);
}, []);
```

### 3. Search Box Integration
```javascript
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
```

### 4. Current Location Button
```javascript
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
}, [marker, map]);
```

## Browser Compatibility

- Modern browsers with Geolocation API support
- HTTPS required for geolocation features
- Google Maps JavaScript API support

## Error Handling

The component handles various error scenarios:
- Missing API key
- Geolocation not supported
- Network errors during geocoding
- Google Maps API loading failures

## Performance Considerations

- Uses `useCallback` for event handlers to prevent unnecessary re-renders
- Google Maps script is loaded efficiently via `useJsApiLoader`
- Geolocation requests are cached
- Reverse geocoding is optimized
- Component cleanup on unmount

## Styling

The component uses Tailwind CSS classes and can be customized with:
- `className` prop for additional styling
- `height` prop for custom dimensions
- Built-in responsive design

## Integration with Donation Form

The component is specifically designed to work with the donation form:

1. **Location Selection**: Users can click on the map or drag the marker to select a location
2. **Address Resolution**: Automatically fetches the full address using Google Geocoding API
3. **Form Integration**: Updates form state with latitude, longitude, and formatted address
4. **Validation**: Ensures a location is selected before form submission
5. **Database Storage**: Coordinates and address are stored in the donation record

## Migration from Custom GoogleMap Component

To migrate from the custom GoogleMap component:

1. Install `@react-google-maps/api`
2. Replace import: `import GoogleMapReact from './components/GoogleMapReact'`
3. Update component usage: `<GoogleMapReact ... />`
4. The props interface remains the same for backward compatibility
