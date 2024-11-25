import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import Modal from 'react-modal';
import { Play, Instagram, Youtube, Twitter, Menu, X } from 'lucide-react';
import JPD_Sobre from '/Users/joaopaulozanchetvilela/Library/CloudStorage/GoogleDrive-jpederik@gmail.com/My Drive/1. Midia/6. Website/jp-e-derik-site/src/JPD_Sobre.png';

const TikTokIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="currentColor"/>
  </svg>
);

const SpotifyIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" fill="currentColor"/>
  </svg>
);

const LandingPage = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal
  const [activeSong, setActiveSong] = useState(null); // State for active song
  const videoRef = useRef(null);

  const toggleVideo = (song) => {
    setActiveSong(song);
    setShowModal(true); 
  };
  const closeModal = () => {
    setShowModal(false);
    setActiveSong(null);
  };
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.log("Autoplay was prevented:", error));
    }
  }, []);

  const socialMediaLinks = [
    { icon: Instagram, url: "https://www.instagram.com/jpederik/" },
    { icon: TikTokIcon, url: "https://www.tiktok.com/@jpederik" },
    { icon: Youtube, url: "https://www.youtube.com/@jpederik" },
    { icon: Twitter, url: "https://www.twitter.com/JPeDerik" },
    { icon: SpotifyIcon, url: "https://open.spotify.com/artist/03G5jjy5zWZYoMwP7w394X?si=9zZkM3SmSeWO2271280ZTw" },
  ];

  const songs = [
    { 
      title: 'Saudade Tropical', 
      youtubeId: 'nK8Av3tWlcQ',
      coverUrl: '/SAUDADE_TROPICAL_CAPA.png'
    },
    { 
      title: 'Aqui Tem Tudo, Só Falta...', 
      youtubeId: 'rGTmPZFhK8g',
      coverUrl: '/AQUI_TEM_TUDO_SÓ_FALTA_CAPA.png'
    },
    { 
      title: 'Sotaque Brasileiro', 
      youtubeId: 'PXOCwPnCAis',
      coverUrl: '/Sotaque_Brasileiro.jpg'
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      
            {/* Background texture */}
            <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: 'url("/Background.png")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.05, // Adjust this value to make the texture lighter or darker
          mixBlendMode: 'overlay'
        }}
      ></div>
      
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black bg-opacity-50">
        <div className="max-w-4xl mx-auto px-4 py-2 flex justify-center items-center">
          <nav className="hidden md:flex items-center space-x-4">
            <a href="#about" className="hover:text-gray-300 text-sm">Biografia</a>
            <a href="#music" className="hover:text-gray-300 text-sm">Música</a>
            <img src="white512.png" alt="JPeDerikLogo" className="w-24 h-24 object-contain mx-4" />
            <a href="#karaoke" className="hover:text-gray-300 text-sm-bold">Cante!</a>
            <a href="#contact" className="hover:text-gray-300 text-sm">Contato</a>
          </nav>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            <Menu size={24} />
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-black bg-opacity-90 p-4">
            <a href="#about" className="block py-2 text-sm">Biografia</a>
            <a href="#music" className="block py-2 text-sm">Música</a>
            <a href="#karaoke" className="block py-2 text-sm-bold">Cante!</a>
            <a href="#contact" className="block py-2 text-sm">Contato</a>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {/* Hero section with background video */}
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
          <video 
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            muted
            playsInline
          >
            <source src="main-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* SVG Filter Overlay */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="blur" x="0" y="0" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" />
              </filter>
              <pattern id="diagonalLines" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
                <line x1="0" y="0" x2="0" y2="5" style={{ stroke: 'black', strokeWidth: 4 }} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonalLines)" filter="url(#blur)" opacity="0.3" />
          </svg>

          <div className="relative z-10 text-center">
            <p className="text-xl md:text-2xl mb-8">Seu evento em uma verdadeira experiência</p>
            <a 
              href="#contact"
              className="inline-block bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Contrate Nosso Show
            </a>
          </div>
        </section>

      {/* Social Media Sidebar */}
      <aside className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col space-y-6 p-4 rounded-full bg-opacity-50">
          {socialMediaLinks.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors duration-200">
              <link.icon size={24} className="opacity-70 hover:opacity-100" />
            </a>
          ))}
        </div>
      </aside>

        {/* Decorative separator before Biografia */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent my-4"></div>

        {/* Biografia section - updated */}
        <section id="about" className="relative py-20 bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black opacity-50"></div>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-6xl font-bold mb-12 text-center">Biografia</h2>
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                <div className="text-lg space-y-6 text-justify leading-relaxed">
                  <p>
                    JP & Derik estão levando o sertanejo ou pagonejo para novos horizontes, misturando tradição e modernidade com uma energia contagiante. A dupla é formada por dois amigos apaixonados pela música e pela arte de conectar pessoas através das suas canções.
                  </p>
                  <p>
                    JP, natural de Cuiabá-MT, cresceu cercado por uma diversidade cultural e musical. Adolescente na Bahia, ele absorveu os ritmos locais e ampliou seu repertório de influências, que hoje incluem o pagode e o sertanejo. Sempre ligado na vida social, JP encontrou em Vancouver, no Canadá um palco perfeito para espalhar sua música e fazer conexões que transcendem fronteiras.
                  </p>
                  <p>
                    Derik, de São Paulo-SP, combina sua paixão pela música com um talento nato para resolver problemas, até mesmo os mais desafiadores. Além de cantor e compositor, é engenheiro mecânico, um multitarefas que transita entre churrascos com amigos e criações musicais no estúdio. Suas experiências e hobbies se traduzem em uma abordagem criativa e versátil no palco.
                  </p>
                  <p>
                    Com mais de dois anos de estrada, JP & Derik trazem o calor do Brasil em suas canções, explorando temas como saudade, conquistas e os desafios de ser imigrante. Cada apresentação é uma experiência para quem ama se conectar através da música.
                  </p>
                  <p>
                    Acompanhe a dupla e descubra como JP & Derik estão redefinindo o sertanejo na gringa! 🎶
                  </p>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center relative mt-8 md:mt-0">
                <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <circle cx="50" cy="50" r="50" fill="white" />
                </svg>
                <img src={JPD_Sobre} alt="JP & Derik" className="rounded-full shadow-lg relative z-10" style={{ height: 'auto', maxHeight: '400px', marginLeft: '16px' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Decorative separator after Biografia */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent my-8"></div>

        {/* Extra spacing */}
        <div className="h-28"></div>

        {/* Karaoke section */}
        <section id="karaoke" className="py-16 bg-gray-900">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-5xl font-bold mb-4 text-center">Karaokê JP e Derik</h2>
            <p className="text-lg text-center mb-8">Sinta a vibe do nosso som!</p>
            <div className="grid md:grid-cols-3 gap-8">
              {songs.map((song) => (
                <div key={song.title} className="bg-gray-800 rounded-lg overflow-hidden p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-24 h-24 bg-gray-700 rounded-full mr-4 overflow-hidden flex-shrink-0">
                      <img 
                        src={song.coverUrl} 
                        alt={`${song.title} Cover`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold">{song.title}</h3>
                  </div>
                  <button 
                    onClick={() => toggleVideo(song)}
                    className="karaoke-button flex items-center justify-between w-full p-3 text-left bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg"
                  >
                    <span className="text-sm font-medium">Cantar Agora!</span>
                    <Play size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
      </section>

        {/* Music section (merged) */}
        <section id="music" className="py-16 bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold mb-2">Plataformas</h2>
            <p className="text-lg text-center mb-8">Ouça na sua preferida!</p>
            <div className="spotify-embed mb-8">
              <iframe style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/artist/03G5jjy5zWZYoMwP7w394X?utm_source=generator" width="100%" height="152" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
            <h3 className="text-2xl font-italic mb-4">Ouça também no:</h3>
            <div className="flex flex-wrap justify-center space-x-4">
              <a href="https://www.youtube.com/playlist?list=OLAK5uy_mc-hIT5TYJ6ynhOMsLEm_avP8CHqAVw18" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">YouTube</a>
              <a href="https://geo.music.apple.com/us/album/aqui-tem-tudo-s%C3%B3-falta-single/1699073690?app=music&ls=1" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">Apple Music</a>
              <a href="https://www.deezer.com/album/468157285" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">Deezer</a>
              <a href="https://music.amazon.com/albums/B0CCPV3Q7L?ref=dm_ff_featurefm" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">Amazon Music</a>
              <a href="http://www.tidal.com/album/306960620" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">Tidal</a>
              <a href="https://play.anghami.com/album/1041813014?refer=featurefm" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">Anghami</a>
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section id="contact" className="py-16 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-6xl font-bold mb-8">Contrate Nosso Show</h2>
            <p className="text-xl mb-8">Quer levar a energia do JP e Derik para o seu evento?</p>
            <a 
              href="https://linktr.ee/jpederik" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Entre em contato conosco!
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-8">
        <div className="max-w-md mx-auto px-4">
          <p className="text-center text-sm text-gray-500">
            Copyright © 2024 JP e Derik - Powered by JPD Events
          </p>
        </div>
        {/* Social Media Links for mobile */}
        <div className="md:hidden flex justify-center mt-4 space-x-4">
          {socialMediaLinks.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors duration-200">
              <link.icon size={24} className="opacity-70 hover:opacity-100" />
            </a>
          ))}
        </div>
      </footer>

{/* Modal for Karaoke */}
      <Modal 
        isOpen={showModal}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
          },
          content: {
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: '#000',
            border: 'none',
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        {activeSong && ( 
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${activeSong.youtubeId}`}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              config={{
                youtube: {
                  playerVars: { autoplay: 1 },
                },
              }}
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 bg-white text-black rounded-full hover:bg-gray-200"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LandingPage;