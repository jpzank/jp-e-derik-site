import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import Modal from 'react-modal';
import { Play, Instagram, Youtube, Twitter, Menu, X, Youtube as YoutubeIcon, Music as AppleMusicIcon, Music2 as DeezerIcon, Music3 as TidalIcon, Music4 as AmazonMusicIcon } from 'lucide-react';

// Image component with debugging and error handling
const ImageWithFallback = ({ src, alt, className, style, fallbackSrc = '/Sotaque_Aguarde.png', ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ attempts: 0, errors: [] });

  useEffect(() => {
    console.log(`[Image Debug] Starting load for ${alt}:`, {
      originalSrc: src,
      currentSrc: imgSrc,
      fallbackSrc: fallbackSrc,
      alt: alt,
      loading: loading,
      error: error,
      debugInfo: debugInfo
    });

    const img = new Image();
    img.src = src;

    img.onload = () => {
      console.log(`[Image Debug] Successfully loaded ${alt} from:`, img.src);
      setImgSrc(src);
      setLoading(false);
      setError(false);
    };

    img.onerror = (e) => {
      const errorInfo = {
        timestamp: new Date().toISOString(),
        attemptedPath: img.src,
        error: e.type,
        message: `Failed to load image: ${img.src}`
      };

      console.error(`[Image Debug] Error loading ${alt}:`, errorInfo);
      setDebugInfo(prev => ({
        attempts: prev.attempts + 1,
        errors: [...prev.errors, errorInfo]
      }));

      // Try with absolute path if relative path fails
      if (!src.startsWith('/') && debugInfo.attempts === 0) {
        console.log('[Image Debug] Trying with absolute path...');
        const absolutePath = `/${src}`;
        setImgSrc(absolutePath);
      } else if (imgSrc !== fallbackSrc) {
        console.log('[Image Debug] Loading fallback image...');
        setImgSrc(fallbackSrc);
      }

      setError(true);
      setLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, imgSrc, alt, loading, error, debugInfo, fallbackSrc]);

  return (
    <div className="relative">
      {loading && !error && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-inherit" />
      )}
      <img
        {...props}
        src={imgSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        style={style}
        onLoad={(e) => {
          console.log(`[Image Debug] ${alt} loaded successfully:`, {
            src: e.target.src,
            naturalWidth: e.target.naturalWidth,
            naturalHeight: e.target.naturalHeight
          });
          setLoading(false);
        }}
        onError={(e) => {
          console.error(`[Image Debug] ${alt} error event:`, {
            src: e.target.src,
            error: e.type,
            target: e.target
          });
          setError(true);
          setLoading(false);
        }}
      />
      {error && debugInfo.attempts > 1 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <div className="text-xs text-white text-center p-2">
            <p>Failed to load image</p>
            <p>Alt: {alt}</p>
            <p>Path: {imgSrc}</p>
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeSong, setActiveSong] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSpotifyPlaying, setIsSpotifyPlaying] = useState(false);
  const videoRef = useRef(null);
  const spotifyRef = useRef(null);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      coverUrl: 'SAUDADE_TROPICAL_CAPA.png'
    },
    { 
      title: 'Aqui Tem Tudo, Só Falta...', 
      youtubeId: 'rGTmPZFhK8g',
      coverUrl: 'AQUI_TEM_TUDO_SO_FALTA_CAPA.png'
    },
    { 
      title: 'Sotaque Brasileiro', 
      youtubeId: 'PXOCwPnCAis',
      coverUrl: 'Sotaque_Brasileiro.jpg'
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      
            {/* Background texture */}
            <div 
        className="fixed inset-0 z-0 pointer-events-none bg-noise" 
        style={{
          backgroundImage: 'url("Background.png")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.08,
          mixBlendMode: 'soft-light'
        }}
      ></div>
      
      {/* Header */}
      <header className={`fixed top-0 left-0 w-full z-50 backdrop-blur-[2px] transition-all duration-500 ${isScrolled ? 'bg-black/30 py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-4xl mx-auto px-4 flex justify-center items-center">
          <nav className="hidden md:flex items-center space-x-4">
            <a href="#about" className="nav-link hover:text-gray-300 text-sm transition-colors duration-200">Biografia</a>
            <a href="#karaoke" className="nav-link hover:text-gray-300 text-sm transition-colors duration-200">Cante!</a>
            <div className={`transition-all duration-500 transform ${isScrolled ? 'w-16 h-16' : 'w-32 h-32'}`}>
              <ImageWithFallback
                src="/white512.png"
                alt="JPeDerikLogo"
                className="w-full h-full object-contain transition-transform duration-500"
                loading="eager"
                fallbackSrc="/logo512.png"
              />
            </div>
            <a href="#music" className="nav-link hover:text-gray-300 text-sm transition-colors duration-200">Plataformas</a>
            <a href="#contact" className="nav-link hover:text-gray-300 text-sm transition-colors duration-200">Contato</a>
          </nav>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white/90 hover:text-white transition-colors duration-200">
            <Menu size={24} />
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-black/40 backdrop-blur-sm p-4">
            <a href="#about" className="nav-link block py-2 text-sm hover:text-gray-300 transition-colors duration-200">Biografia</a>
            <a href="#karaoke" className="nav-link block py-2 text-sm hover:text-gray-300 transition-colors duration-200">Cante!</a>
            <a href="#music" className="nav-link block py-2 text-sm hover:text-gray-300 transition-colors duration-200">Plataformas</a>
            <a href="#contact" className="nav-link block py-2 text-sm hover:text-gray-300 transition-colors duration-200">Contato</a>
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

          {/* Social Media Sidebar */}
          <aside className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
            <div className="flex flex-col space-y-6 p-4 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-300">
              {socialMediaLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/70 hover:text-white transform hover:scale-110 transition-all duration-300"
                  title={link.url.split('/')[2]}
                >
                  <link.icon size={24} />
                </a>
              ))}
            </div>
          </aside>

          {/* Mobile social media links */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-50">
            <div className="flex justify-center space-x-8 p-4">
              {socialMediaLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-white/70 hover:text-white transform hover:scale-110 transition-all duration-300"
                >
                  <link.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Hero section content */}
          <div className="relative z-10 text-center animate-fadeIn">
            <p className="hero-text text-2xl md:text-3xl mb-8 animate-slideUp">Seu evento em uma verdadeira experiência</p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  const musicSection = document.getElementById('music');
                  if (musicSection) {
                    musicSection.scrollIntoView({ behavior: 'smooth' });
                    setIsSpotifyPlaying(true);
                    if (spotifyRef.current) {
                      spotifyRef.current.src = "https://open.spotify.com/embed/artist/03G5jjy5zWZYoMwP7w394X?utm_source=generator&autoplay=1";
                    }
                  }
                }}
                className="primary-button flex items-center gap-2 px-8 py-3 rounded-full bg-white/90 text-black hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20 animate-slideUp group"
              >
                <Play size={20} className="transform transition-transform duration-300 group-hover:scale-110" />
                <span>Ouvir Agora</span>
              </button>
            </div>
          </div>
        </section>

        {/* Decorative separator before Biografia */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent my-4"></div>

        {/* Biografia section - updated */}
        <section id="about" className="relative py-20 bg-gradient-to-b from-gray-900 via-black to-gray-900">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-black/50 backdrop-blur-[1px]"></div>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="section-title text-6xl mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white">Biografia</h2>
            
            {/* Intro Section */}
            <div className="flex flex-col-reverse md:flex-row items-center gap-12 mb-20">
              <div className="md:w-1/2">
                <div className="body-text text-lg space-y-6">
                  <p className="hero-text text-2xl mb-6 text-white/90">
                    JP & Derik estão levando o pagonejo para novos horizontes!
                  </p>
                  <p className="text-white/80 text-justify">
                    Com uma mistura única de sertanejo e pagode, tradição e modernidade, a dupla transmite originalidade e energia singular em cada música.
                  </p>
                  <p className="text-white/80 text-justify">
                    Formada por dois amigos apaixonados por conectar pessoas através da música, a dupla busca criar experiências autênticas que falam diretamente ao coração.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 relative group">
                {/* Background glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-70 group-hover:opacity-100"></div>
                {/* Animated border */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-teal-500/20 animate-border-rotate"></div>
                {/* Image container */}
                <div className="relative rounded-full overflow-hidden transform transition-transform duration-700 group-hover:scale-[1.02] ring-1 ring-white/10">
                  <ImageWithFallback
                    src="/JPD_Sobre.png"
                    alt="JP & Derik"
                    className="w-full h-full object-cover transition-all duration-700"
                    style={{ aspectRatio: '1/1' }}
                    fallbackSrc="/Sotaque_Aguarde.png"
                  />
                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              </div>
            </div>

            {/* Members Section */}
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              {/* JP Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl">🎤</span>
                  <h3 className="section-title text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">JP</h3>
                </div>
                <div className="body-text space-y-4 text-white/80">
                  <p className="text-justify">
                    Natural de Cuiabá-MT, cresceu cercado por uma diversidade musical. Durante a adolescência na Bahia, absorveu os ritmos locais, misturando pagode e sertanejo ao seu estilo.
                  </p>
                  <p className="text-justify">
                    Hoje, no Canadá, encontrou um novo palco para espalhar sua musicalidade e composições.
                  </p>
                </div>
              </div>

              {/* Derik Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl">🎸</span>
                  <h3 className="section-title text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">Derik</h3>
                </div>
                <div className="body-text space-y-4 text-white/80">
                  <p className="text-justify">
                    De São Paulo-SP, combina sua paixão pela música com um talento nato para resolver desafios. Além de cantor e compositor, é engenheiro mecânico e formado em engenharia musical pela SAE Vancouver.
                  </p>
                  <p className="text-justify">
                    Entre estúdio, shows e churrascos com amigos, ele imprime sua criatividade em tudo o que faz.
                  </p>
                </div>
              </div>
            </div>

            {/* Final Message */}
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="hero-text text-2xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white">
                Música que une
              </h3>
              <p className="body-text text-lg text-white/80 text-justify">
                Com três anos de estrada, JP & Derik traz o calor do Brasil para suas canções, cantando sobre saudade, conquistas e os desafios da vida de imigrante. Cada show é uma experiência própria para quem carrega a música brasileira no coração.
              </p>
            </div>
          </div>
        </section>

        {/* Decorative separator after Biografia */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent my-8"></div>

        {/* Extra spacing */}
        <div className="h-28"></div>

        {/* Karaoke section */}
        <section id="karaoke" className="py-16 bg-gradient-to-b from-gray-900 via-black to-gray-900">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="section-title text-5xl mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white">Karaokê JP e Derik</h2>
            <p className="hero-text text-xl text-center mb-8 text-gray-300">Aprenda a letra e cante com a gente!</p>
            <div className="grid md:grid-cols-3 gap-8">
              {songs.map((song) => (
                <div key={song.title} className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden p-4 transition-all duration-300 hover:bg-gray-800/70 hover:transform hover:scale-[1.02]">
                  <div className="flex items-center mb-4">
                    <div className="w-24 h-24 bg-gray-700/50 rounded-full mr-4 overflow-hidden flex-shrink-0 ring-2 ring-white/10">
                      <ImageWithFallback
                        src={`/${song.coverUrl}`}
                        alt={`${song.title} Cover`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-100">{song.title}</h3>
                  </div>
                  <button 
                    onClick={() => toggleVideo(song)}
                    className="karaoke-button flex items-center justify-between w-full p-3 text-left bg-white/10 hover:bg-white/20 transition-all duration-300 rounded-lg group"
                  >
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white">Cantar Agora!</span>
                    <Play size={20} className="transform transition-transform duration-300 group-hover:scale-110" />
                  </button>
                </div>
              ))}
            </div>
          </div>
      </section>

        {/* Music section (merged) */}
        <section id="music" className="py-16 bg-gradient-to-b from-black via-gray-900 to-black">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="section-title text-5xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white">Plataformas</h2>
            <p className="hero-text text-xl text-center mb-8 text-gray-300">Ouça na sua preferida!</p>
            <div className="spotify-embed mb-8">
              <iframe 
                ref={spotifyRef}
                style={{ borderRadius: '12px' }} 
                src={`https://open.spotify.com/embed/artist/03G5jjy5zWZYoMwP7w394X?utm_source=generator${isSpotifyPlaying ? '&autoplay=1' : ''}`}
                width="100%" 
                height="152" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                title="JP e Derik Spotify Player"
              ></iframe>
            </div>
            <h3 className="section-title text-2xl mb-6">Ouça também no:</h3>
            <div className="flex flex-wrap justify-center gap-6 items-center">
              <a 
                href="https://www.youtube.com/playlist?list=OLAK5uy_mc-hIT5TYJ6ynhOMsLEm_avP8CHqAVw18" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <YoutubeIcon size={18} className="text-red-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="nav-link text-white/80 group-hover:text-white transition-colors duration-300">YouTube</span>
              </a>
              <a 
                href="https://geo.music.apple.com/us/album/aqui-tem-tudo-s%C3%B3-falta-single/1699073690?app=music&ls=1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <AppleMusicIcon size={18} className="text-pink-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="nav-link text-white/80 group-hover:text-white transition-colors duration-300">Apple Music</span>
              </a>
              <a 
                href="https://www.deezer.com/album/468157285" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <DeezerIcon size={18} className="text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="nav-link text-white/80 group-hover:text-white transition-colors duration-300">Deezer</span>
              </a>
              <a 
                href="https://music.amazon.com/albums/B0CCPV3Q7L?ref=dm_ff_featurefm" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <AmazonMusicIcon size={18} className="text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="nav-link text-white/80 group-hover:text-white transition-colors duration-300">Amazon Music</span>
              </a>
              <a 
                href="http://www.tidal.com/album/306960620" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <TidalIcon size={18} className="text-teal-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="nav-link text-white/80 group-hover:text-white transition-colors duration-300">Tidal</span>
              </a>
              <a 
                href="https://play.anghami.com/album/1041813014?refer=featurefm" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-[18px] h-[18px] text-orange-500 group-hover:scale-110 transition-transform duration-300"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                </svg>
                <span className="nav-link text-white/80 group-hover:text-white transition-colors duration-300">Anghami</span>
              </a>
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section id="contact" className="py-16 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="section-title text-6xl mb-8">Contrate Nosso Show</h2>
            <p className="hero-text text-2xl mb-8">Quer levar a energia do JP e Derik para o seu evento?</p>
            <a 
              href="https://linktr.ee/jpederik" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="primary-button inline-block bg-white text-black px-8 py-3 rounded-full text-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105"
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
            © 2025 JP e Derik - JPD Events
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
        closeTimeoutMS={300}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 1000,
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#000',
            border: 'none',
            padding: '0',
            width: '90vw',
            height: '90vh',
            maxWidth: '1200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        {activeSong && ( 
          <div className="video-container">
            <div className="video-loading"></div>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${activeSong.youtubeId}`}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              config={{
                youtube: {
                  playerVars: { 
                    autoplay: 1,
                    modestbranding: 1,
                    rel: 0,
                  },
                },
              }}
              onReady={() => {
                const loader = document.querySelector('.video-loading');
                if (loader) loader.style.display = 'none';
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LandingPage;