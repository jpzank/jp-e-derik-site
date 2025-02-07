const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000/callback';

// Track IDs
const TRACKS = {
  SAUDADE_TROPICAL: process.env.REACT_APP_SAUDADE_TROPICAL,
  AQUI_TEM_TUDO: process.env.REACT_APP_AQUI_TEM_TUDO,
  SOTAQUE_BRASILEIRO: process.env.REACT_APP_SOTAQUE_BRASILEIRO
};

// Artist ID
const ARTIST_ID = process.env.REACT_APP_ARTIST_ID;

// Base64 encode string (browser-compatible)
const btoa_safe = (str) => {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (err) {
    console.error('Base64 encoding error:', err);
    return null;
  }
};

// Basic scopes needed for reading public data
const scopes = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  'user-read-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-playback-position',
  'streaming',
  'app-remote-control'
];

// Generate random string for state parameter
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Generate the Spotify OAuth URL
export const getSpotifyAuthUrl = () => {
  const state = generateRandomString(16);
  localStorage.setItem('spotify_auth_state', state);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
    scope: scopes.join(' '),
    show_dialog: true // Force showing the auth dialog
  });

  return `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
};

// Handle the OAuth callback
export const handleSpotifyCallback = async (code) => {
  try {
    if (!clientId || !clientSecret) {
      throw new Error('Missing client credentials');
    }

    const authString = btoa_safe(`${clientId}:${clientSecret}`);
    if (!authString) {
      throw new Error('Failed to encode client credentials');
    }

    console.log('Making token request...');

    const tokenResponse = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }).toString()
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token request failed:', {
        status: tokenResponse.status,
        error: errorData
      });
      throw new Error(errorData.error_description || 'Failed to exchange authorization code');
    }

    const data = await tokenResponse.json();
    console.log('Token request successful');

    // Store the tokens
    localStorage.setItem('spotify_access_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('spotify_refresh_token', data.refresh_token);
    }
    localStorage.setItem('spotify_token_expiry', Date.now() + (data.expires_in * 1000));

    return data;
  } catch (error) {
    console.error('Authentication Error:', error);
    throw error;
  }
};

// Get track's audio features
export const getTrackAudioFeatures = async (trackId) => {
  try {
    const token = await getValidToken();
    if (!token) return null;

    const response = await fetch(`${SPOTIFY_API_BASE}/audio-features/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return getTrackAudioFeatures(trackId);
        }
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching track audio features:', error);
    return null;
  }
};

// Get track's audio analysis
export const getTrackAudioAnalysis = async (trackId) => {
  try {
    const token = await getValidToken();
    if (!token) return null;

    const response = await fetch(`${SPOTIFY_API_BASE}/audio-analysis/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return getTrackAudioAnalysis(trackId);
        }
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching track audio analysis:', error);
    return null;
  }
};

// Get artist's related artists
export const getRelatedArtists = async () => {
  try {
    const token = await getValidToken();
    if (!token) return null;

    const response = await fetch(`${SPOTIFY_API_BASE}/artists/${ARTIST_ID}/related-artists`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return getRelatedArtists();
        }
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.artists;
  } catch (error) {
    console.error('Error fetching related artists:', error);
    return null;
  }
};

// Get track's appearance in playlists
export const getTrackPlaylists = async (trackId) => {
  try {
    const token = await getValidToken();
    if (!token) return [];

    // First try to get the track info
    const trackResponse = await fetch(`${SPOTIFY_API_BASE}/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!trackResponse.ok) {
      console.warn('Failed to get track info:', trackResponse.status);
      return [];
    }

    const trackData = await trackResponse.json();
    if (!trackData || !trackData.name || !trackData.artists || !trackData.artists[0]) {
      console.warn('Invalid track data received');
      return [];
    }
    
    // Search for playlists using the track name and artist
    const searchQuery = encodeURIComponent(`${trackData.name} ${trackData.artists[0].name}`);
    const response = await fetch(`${SPOTIFY_API_BASE}/search?q=${searchQuery}&type=playlist&limit=50`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.warn('Failed to search playlists:', response.status);
      return [];
    }

    const data = await response.json();
    if (!data || !data.playlists || !data.playlists.items) {
      console.warn('Invalid playlist data received');
      return [];
    }

    return data.playlists.items.filter(playlist => 
      playlist && playlist.name && playlist.id
    );
  } catch (error) {
    console.error('Error fetching track playlists:', error);
    return [];
  }
};

// Get user's top tracks
export const getUserTopTracks = async () => {
  try {
    const token = await getValidToken();
    if (!token) return null;

    const response = await fetch(`${SPOTIFY_API_BASE}/me/top/tracks?limit=50`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return getUserTopTracks();
        }
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching user top tracks:', error);
    return null;
  }
};

// Get artist information
export const getArtistStats = async () => {
  try {
    const token = await getValidToken();
    if (!token) {
      console.error('No valid token available');
      return null;
    }

    if (!ARTIST_ID) {
      console.error('Artist ID is undefined. Check environment variables.');
      return null;
    }

    console.log('Fetching artist stats for ID:', ARTIST_ID);

    // Get artist info
    const response = await fetch(`${SPOTIFY_API_BASE}/artists/${ARTIST_ID}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error('Artist fetch error:', {
        status: response.status,
        statusText: response.statusText
      });
      if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return getArtistStats();
        }
      }
      return null;
    }

    const data = await response.json();

    // Get artist's top tracks
    const topTracksResponse = await fetch(`${SPOTIFY_API_BASE}/artists/${ARTIST_ID}/top-tracks?market=BR`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    let topTracksData = { tracks: [] };
    if (topTracksResponse.ok) {
      topTracksData = await topTracksResponse.json();
    } else {
      console.warn('Failed to fetch top tracks:', topTracksResponse.status);
    }

    // Get related artists
    const relatedArtistsResponse = await fetch(`${SPOTIFY_API_BASE}/artists/${ARTIST_ID}/related-artists`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    let relatedArtistsData = { artists: [] };
    if (relatedArtistsResponse.ok) {
      relatedArtistsData = await relatedArtistsResponse.json();
    } else {
      console.warn('Failed to fetch related artists:', relatedArtistsResponse.status);
    }

    return {
      id: data.id,
      name: data.name,
      followers: data.followers?.total || 0,
      popularity: data.popularity || 0,
      genres: data.genres || [],
      images: data.images || [],
      spotifyUrl: data.external_urls?.spotify,
      topTracks: (topTracksData.tracks || []).map(track => ({
        id: track.id,
        name: track.name,
        popularity: track.popularity,
        previewUrl: track.preview_url,
        albumImage: track.album?.images[0]?.url,
        spotifyUrl: track.external_urls?.spotify
      })),
      relatedArtists: (relatedArtistsData.artists || []).map(artist => ({
        id: artist.id,
        name: artist.name,
        popularity: artist.popularity,
        genres: artist.genres || [],
        image: artist.images?.[0]?.url,
        spotifyUrl: artist.external_urls?.spotify
      }))
    };
  } catch (error) {
    console.error('Error fetching artist stats:', error);
    return null;
  }
};

// Get artist's top tracks
export const getTopTracks = async () => {
  try {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) return null;

    const response = await fetch(`https://api.spotify.com/v1/artists/${ARTIST_ID}/top-tracks?market=BR`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          return getTopTracks();
        }
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.tracks.map(track => ({
      id: track.id,
      name: track.name,
      popularity: track.popularity,
      durationMs: track.duration_ms,
      previewUrl: track.preview_url,
      spotifyUrl: track.external_urls.spotify,
      albumImage: track.album.images[0]?.url
    }));
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return null;
  }
};

// Enhanced getTrackDetailedStats to include more information
export const getTrackDetailedStats = async (trackId) => {
  try {
    const token = await getValidToken();
    if (!token) return null;

    // Fetch track info first
    const trackInfoResponse = await fetch(`${SPOTIFY_API_BASE}/tracks/${trackId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!trackInfoResponse.ok) {
      console.error('Failed to fetch track info:', trackInfoResponse.status);
      return null;
    }

    const trackInfo = await trackInfoResponse.json();

    // Initialize with basic track info
    const result = {
      // Basic track info
      id: trackInfo.id,
      name: trackInfo.name,
      uri: trackInfo.uri,
      type: trackInfo.type,
      isLocal: trackInfo.is_local,
      isPlayable: trackInfo.is_playable,
      popularity: trackInfo.popularity,
      previewUrl: trackInfo.preview_url,
      durationMs: trackInfo.duration_ms,
      explicit: trackInfo.explicit,
      externalIds: trackInfo.external_ids,
      externalUrls: trackInfo.external_urls,
      href: trackInfo.href,

      // Album info
      album: {
        id: trackInfo.album?.id,
        name: trackInfo.album?.name,
        albumType: trackInfo.album?.album_type,
        totalTracks: trackInfo.album?.total_tracks,
        releaseDate: trackInfo.album?.release_date,
        releaseDatePrecision: trackInfo.album?.release_date_precision,
        images: trackInfo.album?.images || [],
        artists: trackInfo.album?.artists?.map(artist => ({
          id: artist.id,
          name: artist.name,
          uri: artist.uri,
          href: artist.href,
          externalUrls: artist.external_urls
        })) || []
      },

      // Artists info
      artists: trackInfo.artists?.map(artist => ({
        id: artist.id,
        name: artist.name,
        uri: artist.uri,
        href: artist.href,
        externalUrls: artist.external_urls
      })) || [],

      // Market info
      availableMarkets: trackInfo.available_markets || [],
      marketCoverage: 0,
      totalMarkets: 0,

      // Initialize empty values for optional data
      audioFeatures: null,
      audioAnalysis: null,
      playlists: [],
      playlistCount: 0,
      totalPlaylistFollowers: 0,
      averagePlaylistFollowers: 0
    };

    // Try to fetch audio features
    try {
      const audioFeaturesResponse = await fetch(`${SPOTIFY_API_BASE}/audio-features/${trackId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (audioFeaturesResponse.ok) {
        const audioFeatures = await audioFeaturesResponse.json();
        result.audioFeatures = {
          ...audioFeatures,
          energyLevel: audioFeatures.energy > 0.8 ? 'Alta' : 
                      audioFeatures.energy > 0.4 ? 'Média' : 'Baixa',
          danceabilityLevel: audioFeatures.danceability > 0.8 ? 'Alta' : 
                            audioFeatures.danceability > 0.4 ? 'Média' : 'Baixa',
          moodLevel: audioFeatures.valence > 0.8 ? 'Muito Positiva' : 
                    audioFeatures.valence > 0.6 ? 'Positiva' :
                    audioFeatures.valence > 0.4 ? 'Neutra' :
                    audioFeatures.valence > 0.2 ? 'Melancólica' : 'Muito Melancólica'
        };
      } else {
        console.warn('Audio features not available:', audioFeaturesResponse.status);
      }
    } catch (error) {
      console.warn('Error fetching audio features:', error);
    }

    // Try to fetch audio analysis
    try {
      const audioAnalysisResponse = await fetch(`${SPOTIFY_API_BASE}/audio-analysis/${trackId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (audioAnalysisResponse.ok) {
        const audioAnalysis = await audioAnalysisResponse.json();
        result.audioAnalysis = {
          duration: audioAnalysis.track?.duration,
          tempo: audioAnalysis.track?.tempo,
          timeSignature: audioAnalysis.track?.time_signature,
          key: audioAnalysis.track?.key,
          mode: audioAnalysis.track?.mode,
          loudness: audioAnalysis.track?.loudness,
          sections: audioAnalysis.sections?.length || 0,
          averageSectionDuration: audioAnalysis.sections?.length ? 
            audioAnalysis.sections.reduce((acc, section) => acc + section.duration, 0) / audioAnalysis.sections.length : 0,
          beats: audioAnalysis.beats?.length || 0,
          averageBeatDuration: audioAnalysis.beats?.length ?
            audioAnalysis.beats.reduce((acc, beat) => acc + beat.duration, 0) / audioAnalysis.beats.length : 0
        };
      } else {
        console.warn('Audio analysis not available:', audioAnalysisResponse.status);
      }
    } catch (error) {
      console.warn('Error fetching audio analysis:', error);
    }

    // Try to fetch playlists
    try {
      const playlists = await getTrackPlaylists(trackId);
      if (playlists && playlists.length > 0) {
        result.playlists = playlists.map(playlist => ({
          id: playlist.id,
          name: playlist.name,
          followers: playlist.followers?.total || 0,
          images: playlist.images || [],
          owner: playlist.owner?.display_name,
          public: playlist.public,
          tracks: playlist.tracks?.total || 0
        }));
        result.playlistCount = playlists.length;
        result.totalPlaylistFollowers = playlists.reduce((acc, curr) => acc + (curr.followers?.total || 0), 0);
        result.averagePlaylistFollowers = result.playlistCount ? 
          result.totalPlaylistFollowers / result.playlistCount : 0;
      }
    } catch (error) {
      console.warn('Error fetching playlists:', error);
    }

    // Try to fetch market coverage
    try {
      const marketsResponse = await fetch(`${SPOTIFY_API_BASE}/markets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (marketsResponse.ok) {
        const marketsData = await marketsResponse.json();
        result.totalMarkets = marketsData.markets?.length || 0;
        result.marketCoverage = result.totalMarkets ? 
          (result.availableMarkets.length / result.totalMarkets) * 100 : 0;
      }
    } catch (error) {
      console.warn('Error fetching markets:', error);
    }

    return result;
  } catch (error) {
    console.error('Error fetching track stats:', error);
    return null;
  }
};

// Get the current access token or refresh if needed
const getValidToken = async () => {
  const expiry = localStorage.getItem('spotify_token_expiry');
  const token = localStorage.getItem('spotify_access_token');

  console.log('Checking token validity...');
  
  if (!token) {
    console.log('No token found');
    return null;
  }

  if (!expiry) {
    console.log('No expiry found, clearing token');
    localStorage.removeItem('spotify_access_token');
    return null;
  }

  if (Date.now() > parseInt(expiry)) {
    console.log('Token expired, attempting refresh');
    return await refreshAccessToken();
  }

  console.log('Token is valid');
  return token;
};

// Refresh the access token
const refreshAccessToken = async () => {
  try {
    console.log('Refreshing access token...');
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    if (!refreshToken) {
      console.log('No refresh token found');
      return null;
    }

    const authString = btoa_safe(`${clientId}:${clientSecret}`);
    if (!authString) {
      console.error('Failed to encode client credentials');
      return null;
    }

    const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Token refresh failed:', data);
      // If refresh fails, clear all tokens
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
      localStorage.removeItem('spotify_token_expiry');
      return null;
    }

    console.log('Token refresh successful');
    if (data.access_token) {
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_token_expiry', Date.now() + (data.expires_in * 1000));
      if (data.refresh_token) {
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }
    }

    return data.access_token;
  } catch (error) {
    console.error('Token Refresh Error:', error);
    return null;
  }
};

// Fetch multiple tracks at once
export const getMultipleTrackStats = async (trackIds) => {
  try {
    const token = await getValidToken();
    if (!token) return null;

    const response = await fetch(`${SPOTIFY_API_BASE}/tracks?ids=${trackIds.join(',')}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.tracks.map(track => ({
      id: track.id,
      streams: track.popularity,
      url: track.external_urls.spotify,
      name: track.name,
      albumCover: track.album.images[0]?.url,
    }));
  } catch (error) {
    console.error('Error fetching multiple track stats:', error);
    return null;
  }
}; 