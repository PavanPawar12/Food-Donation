# Environment Setup Guide

## Setting up Environment Variables for Sharebutes Frontend

### Step 1: Create the .env file

Create a new file called `.env` in the `frontend` directory (same level as `package.json`).

### Step 2: Add the following environment variables

```env
# Google Maps API Configuration
# Get your API key from: https://console.cloud.google.com/apis/credentials
# Enable the following APIs:
# - Maps JavaScript API
# - Places API
# - Geocoding API
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

### Step 3: Get your Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "API Key"
6. Copy the generated API key
7. Replace `your_google_maps_api_key_here` in your `.env` file with the actual API key

### Step 4: Secure your API Key (Recommended)

1. In Google Cloud Console, click on your API key
2. Under "Application restrictions", select "HTTP referrers (web sites)"
3. Add your domain(s):
   - For development: `http://localhost:3000/*`
   - For production: `https://yourdomain.com/*`
4. Under "API restrictions", select "Restrict key"
5. Select the APIs you enabled (Maps JavaScript API, Places API, Geocoding API)

### Step 5: Verify the setup

1. Make sure your `.env` file is in the correct location: `frontend/.env`
2. Restart your development server: `npm run dev`
3. Check the browser console for any API key related errors
4. Test the Google Maps integration in the donation form

### Important Notes

- **Never commit your `.env` file to version control**
- The `.env` file should already be in your `.gitignore`
- All environment variables must start with `VITE_` to be accessible in the frontend
- The Google Maps API key is required for the map functionality to work
- Make sure your backend is running on the correct port (default: 5000)

### Troubleshooting

If you encounter issues:

1. **Map not loading**: Check if the API key is correct and the required APIs are enabled
2. **CORS errors**: Make sure your API key has the correct domain restrictions
3. **Geolocation not working**: Ensure you're using HTTPS in production
4. **API quota exceeded**: Check your Google Cloud Console for usage limits

### Example .env file structure

Your final `.env` file should look like this:

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBYourActualAPIKeyHere123456789
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Sharebutes
VITE_APP_VERSION=1.0.0
VITE_DEV_MODE=true
VITE_ENABLE_LOGGING=true
VITE_ENABLE_GOOGLE_MAPS=true
VITE_ENABLE_GEOLOCATION=true
VITE_ENABLE_NOTIFICATIONS=true
```

Replace `AIzaSyBYourActualAPIKeyHere123456789` with your real Google Maps API key.
