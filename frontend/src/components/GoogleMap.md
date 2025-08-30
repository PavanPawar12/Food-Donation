# GoogleMap Component Documentation

A reusable React component for displaying interactive Google Maps with location selection, search, and geolocation features.

## Features

- 🗺️ Interactive Google Map with draggable markers
- 🔍 Location search with Google Places API
- 📍 Current location detection
- 🎯 Auto-center on user location with fallback to default city
- 📱 Responsive design
- ⚙️ Highly configurable with multiple props

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
import GoogleMap from './components/GoogleMap';

function DonationForm() {
  const handleLocationSelect = (locationData) => {
    console.log('Selected location:', locationData);
    // Update form state with location data
  };

  return (
    <GoogleMap 
      onLocationSelect={handleLocationSelect}
      height="400px"
    />
  );
}
```

### Read-only Map (Display Only)
```jsx
<GoogleMap 
  showSearch={false}
  showCurrentLocation={false}
  showControls={false}
  draggable={false}
  showMarker={false}
  height="300px"
/>
```

### Custom Location with Different Default
```jsx
<GoogleMap 
  initialLat={19.0760}  // Mumbai
  initialLng={72.8777}
  zoom={10}
  onLocationSelect={handleLocationSelect}
/>
```

### Minimal Map for Display
```jsx
<GoogleMap 
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

## Styling

The component uses Tailwind CSS classes and can be customized with:
- `className` prop for additional styling
- `height` prop for custom dimensions
- Built-in responsive design

## Performance Considerations

- Google Maps script is loaded dynamically
- Geolocation requests are cached
- Reverse geocoding is debounced
- Component cleanup on unmount
