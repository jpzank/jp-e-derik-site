import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSpotifyCallback } from './utils/spotify';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code and state from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const storedState = localStorage.getItem('spotify_auth_state');

        // Verify state match
        if (!state || !storedState || state !== storedState) {
          console.error('State verification failed:', {
            receivedState: state,
            storedState: storedState
          });
          // Clear any existing tokens on state mismatch
          localStorage.removeItem('spotify_access_token');
          localStorage.removeItem('spotify_refresh_token');
          localStorage.removeItem('spotify_token_expiry');
          navigate('/dashboard?error=state_mismatch');
          return;
        }

        // Clear state after verification
        localStorage.removeItem('spotify_auth_state');

        if (code) {
          await handleSpotifyCallback(code);
          navigate('/dashboard?auth=success');
        } else {
          navigate('/dashboard?error=no_code');
        }
      } catch (error) {
        console.error('Callback error:', error);
        navigate(`/dashboard?error=${encodeURIComponent(error.message)}`);
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

export default Callback; 