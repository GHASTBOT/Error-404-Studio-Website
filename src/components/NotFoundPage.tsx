import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, Search, AlertTriangle, Music, Volume2, VolumeX, Gamepad2, Zap, Star } from 'lucide-react';

export function NotFoundPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    // Create audio element for background music
    // Upload your music file to the public folder and reference it here
    const audioElement = new Audio('/music/404-background.mp3');
    audioElement.loop = true;
    audioElement.volume = 0.2;
    setAudio(audioElement);

    // Cleanup on unmount
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(error => {
          console.error('Audio playback failed:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleGoHome = () => {
    window.history.pushState(null, '', '/');
    window.location.reload();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const currentPath = window.location.pathname;

  // Enhanced suggestions based on URL path
  const getSuggestions = (path: string) => {
    const suggestions = [];
    
    if (path.includes('team') || path.includes('member') || path.includes('staff')) {
      suggestions.push({ text: 'Meet Our Team', path: '/#team-section', icon: '👥' });
    }
    if (path.includes('map') || path.includes('realm') || path.includes('download') || path.includes('world')) {
      suggestions.push({ text: 'Explore Realms', path: '/#realms-section', icon: '🗺️' });
    }
    if (path.includes('about') || path.includes('info') || path.includes('story')) {
      suggestions.push({ text: 'About Error 404', path: '/#about-section', icon: 'ℹ️' });
    }
    if (path.includes('contact') || path.includes('support') || path.includes('help')) {
      suggestions.push({ text: 'Get In Touch', path: '/#contact-section', icon: '📧' });
    }
    
    // Default suggestions if no matches
    if (suggestions.length === 0) {
      suggestions.push(
        { text: 'Explore Realms', path: '/#realms-section', icon: '🗺️' },
        { text: 'Meet Our Team', path: '/#team-section', icon: '👥' },
        { text: 'Contact Us', path: '/#contact-section', icon: '📧' }
      );
    }
    
    return suggestions;
  };

  const suggestions = getSuggestions(currentPath);

  const triggerEasterEgg = () => {
    setShowEasterEgg(true);
    setGlitchEffect(true);
    setTimeout(() => {
      setShowEasterEgg(false);
      setGlitchEffect(false);
    }, 2000);
  };

  const navigateToSection = (path: string) => {
    if (path.startsWith('/#')) {
      window.history.pushState(null, '', '/');
      window.location.reload();
    } else {
      window.history.pushState(null, '', path);
      window.location.reload();
    }
  };

  return (
    <div className={`min-h-screen bg-black text-zinc-100 relative overflow-hidden ${glitchEffect ? 'animate-pulse' : ''}`}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float ${
              i % 3 === 0 ? 'w-2 h-2 bg-red-500/30' : 
              i % 3 === 1 ? 'w-1 h-1 bg-white/20' : 
              'w-3 h-3 bg-zinc-600/20'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      {/* Music control */}
      <button
        onClick={toggleMusic}
        className="fixed top-6 right-6 z-50 bedrock-button p-4 rounded-full hover:scale-110 transition-all duration-300"
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </button>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main 404 Section */}
          <div className="mb-16">
            {/* Error 404 Logo */}
            <div className="mb-12 relative">
              <div className="relative inline-block group">
                <img 
                  src="https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/error404logo.png" 
                  alt="Error 404" 
                  className="w-40 h-40 mx-auto rounded-xl mb-8 hover:scale-110 transition-all duration-500 cursor-pointer shadow-2xl"
                  onClick={triggerEasterEgg}
                />
                {showEasterEgg && (
                  <div className="absolute inset-0 bg-red-500/30 rounded-xl animate-ping" />
                )}
                <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Giant 404 with glitch effect */}
              <div className="relative mb-8">
                <div className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-600 mb-6 select-none leading-none">
                  404
                </div>
                <div className="absolute inset-0 text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold text-red-500/10 animate-pulse leading-none">
                  404
                </div>
                {glitchEffect && (
                  <div className="absolute inset-0 text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold text-blue-500/30 animate-bounce leading-none">
                    404
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-shimmer">
                Page Not Found
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 mb-6 max-w-3xl mx-auto">
                Looks like this page got lost in the Minecraft void... 
                <br className="hidden md:block" />
                Even our best mapmakers can't find it!
              </p>
              
              {/* URL Display */}
              <div className="flex items-center justify-center gap-3 text-zinc-500 mb-8 flex-wrap">
                <AlertTriangle className="w-5 h-5 animate-bounce text-red-400" />
                <code className="text-sm bg-zinc-800/50 px-4 py-2 rounded-lg border border-zinc-700 break-all">
                  {currentPath}
                </code>
                <AlertTriangle className="w-5 h-5 animate-bounce text-red-400" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          </div>

          {/* Error 404 Themed Message */}
          <div className="mb-16">
            <div className="bedrock-card p-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <Gamepad2 className="w-6 h-6 text-red-400" />
                    <h3 className="text-xl font-bold text-red-400">Error 404 Team Says:</h3>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    "Just like our team name suggests, this page couldn't be found! 
                    But don't worry - our Minecraft maps are much easier to navigate 
                    than our website apparently... 😅"
                  </p>
                  <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-800/30">
                    <p className="text-red-300 text-sm">
                      💡 <strong>Fun Fact:</strong> We chose "Error 404" as our team name 
                      because we're always finding creative solutions to "not found" problems!
                    </p>
                  </div>
                </div>
                
                <div className="text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-bold text-blue-400">Technical Details:</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Status Code:</span>
                      <span className="text-red-400 font-mono">404</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Page Status:</span>
                      <span className="text-red-400">Missing in Action</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Last Seen:</span>
                      <span className="text-zinc-500">Never existed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Recovery Chance:</span>
                      <span className="text-red-400">0.00%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Recommended Action:</span>
                      <span className="text-green-400">Navigate home</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8 text-zinc-300 flex items-center justify-center gap-3">
                <Search className="w-8 h-8 text-blue-400" />
                Were you looking for:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => navigateToSection(suggestion.path)}
                    className="bedrock-card p-6 hover-lift text-center group transition-all duration-500"
                  >
                    <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                      {suggestion.icon}
                    </div>
                    <div className="font-semibold text-white group-hover:text-zinc-200 transition-colors">
                      {suggestion.text}
                    </div>
                    <div className="text-sm text-zinc-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to navigate
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
              <button
                onClick={handleGoHome}
                className="bedrock-button flex items-center justify-center gap-3 px-8 py-4 text-lg hover:scale-105 transition-all duration-300"
              >
                <Home className="w-6 h-6" />
                Return Home
              </button>
              <button
                onClick={handleGoBack}
                className="bedrock-button flex items-center justify-center gap-3 px-8 py-4 text-lg hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="w-6 h-6" />
                Go Back
              </button>
            </div>
          </div>

          {/* Quick Navigation Grid */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-zinc-300 flex items-center justify-center gap-3">
              <Star className="w-6 h-6 text-yellow-400" />
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { name: 'Our Realms', icon: '🗺️', section: 'realms-section', desc: 'Explore maps' },
                { name: 'Meet Team', icon: '👥', section: 'team-section', desc: 'Our creators' },
                { name: 'About Us', icon: 'ℹ️', section: 'about-section', desc: 'Our story' },
                { name: 'Contact', icon: '📧', section: 'contact-section', desc: 'Get in touch' }
              ].map((link, index) => (
                <button
                  key={index}
                  onClick={() => navigateToSection(`/#${link.section}`)}
                  className="bedrock-card p-4 hover-lift text-center group transition-all duration-500"
                >
                  <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">
                    {link.icon}
                  </div>
                  <div className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors mb-1">
                    {link.name}
                  </div>
                  <div className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {link.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Fun Stats */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bedrock-card p-6 text-center hover-lift">
                <div className="text-4xl font-bold text-red-400 mb-2">404</div>
                <div className="text-sm text-zinc-400">Error Code</div>
                <div className="text-xs text-zinc-600 mt-1">Page not found</div>
              </div>
              <div className="bedrock-card p-6 text-center hover-lift">
                <div className="text-4xl font-bold text-blue-400 mb-2">∞</div>
                <div className="text-sm text-zinc-400">Better Pages</div>
                <div className="text-xs text-zinc-600 mt-1">Available to explore</div>
              </div>
              <div className="bedrock-card p-6 text-center hover-lift">
                <div className="text-4xl font-bold text-green-400 mb-2">1</div>
                <div className="text-sm text-zinc-400">Way Home</div>
                <div className="text-xs text-zinc-600 mt-1">Click the button above</div>
              </div>
            </div>
          </div>

          {/* Easter Egg Hint */}
          <div className="text-center">
            <p className="text-xs text-zinc-600 mb-2">
              💡 <strong>Easter Egg:</strong> Click the Error 404 logo for a surprise!
            </p>
            <p className="text-xs text-zinc-700">
              🎵 Toggle the music button in the top-right corner
            </p>
          </div>
        </div>
      </div>

      {/* Glitch effect overlay */}
      {showEasterEgg && (
        <div className="fixed inset-0 pointer-events-none z-20">
          <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent animate-ping" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-red-500/5 animate-bounce" />
        </div>
      )}
    </div>
  );
}