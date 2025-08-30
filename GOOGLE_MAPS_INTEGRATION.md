# Google Maps Integration for Food Donation Form

## Overview
The food donation form now includes Google Maps integration that allows donors to:
- Search for locations using the Google Places API
- Drop pins on the map to select exact locations
- Use their current location with GPS
- Get formatted addresses and coordinates automatically

## Features Added

### 1. Google Maps Component (`frontend/src/components/GoogleMap.jsx`)
- Interactive map with draggable marker
- Location search functionality
- Current location detection
- Reverse geocoding for address lookup
- Real-time coordinate and address display

### 2. Enhanced Donation Form
- Toggle button to show/hide the map
- Location selection with visual feedback
- Automatic address parsing and form population
- Formatted address display below the map

### 3. Backend Updates
- Added `formattedAddress` field to the Donation model
- Enhanced location data storage with structured address components

## Setup Requirements

### 1. Google Maps API Key
You need a Google Maps API key with the following APIs enabled:
- Maps JavaScript API
- Places API
- Geocoding API

### 2. Environment Configuration
Create a `.env` file in the `frontend` directory with the following variables:

```env
# Google Maps API Configuration
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Application Configuration
VITE_APP_NAME=Sharebutes
VITE_APP_VERSION=1.0.0

# Development Configuration
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true

# Feature Flags
VITE_ENABLE_GOOGLE_MAPS=true
VITE_ENABLE_GEOLOCATION=true
VITE_ENABLE_NOTIFICATIONS=true
```

**Important**: Replace `your_google_maps_api_key_here` with your actual Google Maps API key.

### 3. Getting a Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the required APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

## How It Works

### Location Selection Process
1. **Manual Input**: Users can type an address in the location field
2. **Map Selection**: Users can click "Show Map & Select Location" to open the interactive map
3. **Search**: Users can search for locations using the search box
4. **Pin Drop**: Users can click anywhere on the map to place a marker
5. **Current Location**: Users can use the "Use Current Location" button for GPS-based location

### Data Flow
1. User selects a location (via any method)
2. Google Maps API provides coordinates and formatted address
3. Address components are parsed (street, city, state, zip, country)
4. Form fields are automatically populated
5. On submission, all location data is saved to the database

### Database Schema
The donation location now includes:
```javascript
location: {
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  coordinates: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  formattedAddress: String, // New field
  pickupInstructions: String
}
```

## User Experience

### For Donors
1. **Simple Location Entry**: Type an address or use the map
2. **Visual Confirmation**: See the selected location on the map
3. **Accurate Coordinates**: Precise location data for pickup
4. **Formatted Address**: Clean, standardized address format

### For Recipients
1. **Precise Location**: Exact coordinates for navigation
2. **Formatted Address**: Easy-to-read address display
3. **Map Integration**: Can be used for directions and navigation

## Security Considerations
- API key should be restricted to your domain
- HTTPS is required for geolocation features
- User consent is required for location access

## Troubleshooting

### Common Issues
1. **Map not loading**: Check API key and enabled APIs
2. **Location not working**: Ensure HTTPS and user permission
3. **Search not working**: Verify Places API is enabled
4. **Geocoding errors**: Check Geocoding API quota and limits

### Error Handling
- Graceful fallback to manual input if map fails
- User-friendly error messages for location issues
- Form validation ensures required location data

## Future Enhancements
- Distance calculation for nearby donations
- Route planning for pickup
- Location clustering for multiple donations
- Offline map support
- Custom map styling
