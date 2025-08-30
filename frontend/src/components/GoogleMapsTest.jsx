import React, { useState, useEffect } from 'react';

const GoogleMapsTest = () => {
  const [apiKeyStatus, setApiKeyStatus] = useState('checking');
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const checkApiKey = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        setApiKeyStatus('missing');
        return;
      }

      setApiKeyStatus('found');

      // Test the API key with a simple geocoding request
      try {
        const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Kolhapur&key=${apiKey}`;
        const response = await fetch(testUrl);
        const data = await response.json();
        
        if (data.status === 'OK') {
          setTestResult({
            status: 'success',
            message: 'API key is working correctly',
            data: data.results[0]
          });
        } else {
          setTestResult({
            status: 'error',
            message: `API Error: ${data.status}`,
            error: data.error_message
          });
        }
      } catch (error) {
        setTestResult({
          status: 'error',
          message: 'Network error',
          error: error.message
        });
      }
    };

    checkApiKey();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Google Maps API Test</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">API Key Status:</h3>
          <p className={`font-mono text-sm ${
            apiKeyStatus === 'found' ? 'text-green-600' : 
            apiKeyStatus === 'missing' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {apiKeyStatus === 'checking' && 'Checking...'}
            {apiKeyStatus === 'found' && '✅ API Key Found'}
            {apiKeyStatus === 'missing' && '❌ API Key Missing'}
          </p>
        </div>

        {apiKeyStatus === 'found' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">API Key Value:</h3>
            <p className="font-mono text-sm text-gray-600">
              {import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.substring(0, 20)}...
            </p>
          </div>
        )}

        {testResult && (
          <div className={`border rounded-lg p-4 ${
            testResult.status === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <p className={`text-sm ${
              testResult.status === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {testResult.message}
            </p>
            {testResult.error && (
              <p className="text-sm text-red-600 mt-2">
                Error: {testResult.error}
              </p>
            )}
            {testResult.data && (
              <div className="mt-2 text-sm text-gray-600">
                <p><strong>Test Address:</strong> {testResult.data.formatted_address}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Environment Variables:</h3>
          <div className="space-y-1 text-sm">
            <p><strong>VITE_GOOGLE_MAPS_API_KEY:</strong> {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Set' : 'Not Set'}</p>
            <p><strong>VITE_API_BASE_URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'Not Set'}</p>
            <p><strong>VITE_APP_NAME:</strong> {import.meta.env.VITE_APP_NAME || 'Not Set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsTest;
