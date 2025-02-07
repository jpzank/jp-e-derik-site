import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSpotifyCallback } from '../utils/spotify';

const SpotifyCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Get URL parameters first
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      console.log('=== Starting Spotify Callback ===');

      // Get stored values
      const storedState = localStorage.getItem('spotify_auth_state');
      const returnPath = localStorage.getItem('spotify_return_path') || '/dashboard';

      // If there's an error parameter, handle it
      if (error) {
        console.error('Spotify auth error:', error);
        navigate('/dashboard', { 
          replace: true, 
          state: { error: error } 
        });
        return;
      }

      try {
        // Verify state match
        if (!state || !storedState || state !== storedState) {
          console.error('State verification failed');
          throw new Error('state_mismatch');
        }

        if (!code) {
          console.error('No code present in callback');
          throw new Error('no_code');
        }

        console.log('Processing Spotify callback with code');
        await handleSpotifyCallback(code);

        // Clear auth state after successful processing
        localStorage.removeItem('spotify_auth_state');
        localStorage.removeItem('spotify_return_path');

        console.log('Successfully processed callback, navigating to:', returnPath);
        navigate(returnPath, { replace: true, state: { auth: 'success' } });

      } catch (error) {
        console.error('Callback error:', error);
        
        // Clear auth state
        localStorage.removeItem('spotify_auth_state');
        localStorage.removeItem('spotify_return_path');

        navigate('/dashboard', { 
          replace: true, 
          state: { error: error.message || 'unknown_error' } 
        });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Conectando ao Spotify...</h2>
        <p className="text-gray-400">Por favor, aguarde enquanto processamos sua autenticação.</p>
      </div>
    </div>
  );
};

export default SpotifyCallback; 