import React, { useState, useRef, useEffect } from 'react';
import { Play, Instagram, Youtube, Twitter } from 'lucide-react';

const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="currentColor"/>
  </svg>
);

const LandingPage = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const videoRef = useRef(null);

  const toggleVideo = (song) => {
    setActiveVideo(activeVideo === song ? null : song);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.log("Autoplay was prevented:", error));
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 p-4 z-10 max-w-6xl mx-auto w-full">
        <img src="white192.png" alt="JPeDerikLogo" className="w-24" />
      </header>

      {/* Main content */}
      <main className="flex-grow mt-16">
        {/* Video section */}
        <section className="mb-8 relative">
          <video 
            ref={videoRef}
            className="w-full"
            loop
            muted
            playsInline
          >
            <source src="main-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </section>

        {/* CTA section */}
        <section className="max-w-6xl mx-auto px-4 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Contrate Nosso Show!</h2>
            <p className="mb-4">Quer levar a energia do JP e Derik para o seu evento? </p>
            <button className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition-colors">
              Entre em contato conosco!
            </button>
          </div>
        </section>

        {/* Karaoke section */}
        <section className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-light mb-2">Karaokê JP e Derik</h2>
          <p className="text-sm text-gray-400 mb-4">/ Sing with us</p>
          <div className="space-y-4">
            {[
              { title: 'Saudade Tropical', youtubeId: 'nK8Av3tWlcQ' },
              { title: 'Aqui Tem Tudo, Só Falta...' }
            ].map((song) => (
              <div key={song.title} className="border-b border-gray-700 pb-4">
                <button 
                  onClick={() => toggleVideo(song.title)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-lg">{song.title}</span>
                  <Play size={20} />
                </button>
                {activeVideo === song.title && (
                  <div className="mt-4 aspect-video">
                    {song.youtubeId ? (
                      <iframe
                        width="100%"
                        height="650"
                        src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1`}
                        title={`${song.title} Karaoke`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="bg-gray-800 flex items-center justify-center h-full">
                        <span className="text-xl text-gray-400">{song.title} Video Placeholder</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer with social media buttons */}
      <footer className="mt-8 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-6">
            <a href="https://www.instagram.com/jpederik/" target="_blank" rel="noopener noreferrer">
              <Instagram size={24} />
            </a>
            <a href="https://www.tiktok.com/@jpederik" target="_blank" rel="noopener noreferrer">
              <TikTokIcon />
            </a>
            <a href="https://www.youtube.com/@jpederik" target="_blank" rel="noopener noreferrer">
              <Youtube size={24} />
            </a>
            <a href="https://www.twitter.com/JPeDerik" target="_blank" rel="noopener noreferrer">
              <Twitter size={24} />
            </a>
          </div>
        </div>
        <p className="text-center text-xs mt-4 text-gray-500">
          Copyright © 2024 JP e Derik - Powered by JPD Events
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;