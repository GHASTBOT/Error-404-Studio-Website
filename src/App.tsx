import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { ContactForm } from './components/ContactForm';
import { JoinForm } from './components/JoinForm';
import { Notification } from './components/Notification';
import { MapPage } from './components/MapPage';
import { MemberPage } from './components/MemberPage';
import { NotFoundPage } from './components/NotFoundPage';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [konamiActive, setKonamiActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPixelTrail, setShowPixelTrail] = useState(false);
  const [secretMessage, setSecretMessage] = useState('');
  const [pixelTrail, setPixelTrail] = useState<{ x: number; y: number; color: string }[]>([]);
  const [matrixMode, setMatrixMode] = useState(false);
  const [gravitySwitched, setGravitySwitched] = useState(false);
  const [partyMode, setPartyMode] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [rainbowMode, setRainbowMode] = useState(false);
  const [expandedRealm, setExpandedRealm] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedMap, setSelectedMap] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [currentPath, setCurrentPath] = useState('');
  const [showNotFound, setShowNotFound] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Ultra-smooth scrolling state for both desktop and mobile
  const targetScrollY = useRef(0);
  const currentScrollY = useRef(0);
  const scrollVelocity = useRef(0);
  const isScrolling = useRef(false);
  const animationFrame = useRef<number>();
  const isMobile = useRef(false);

  const realmsProjects = [
    {
      name: 'Desolation',
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/DesolationThumbnailUpdated.png',
      description: 'Survive the harsh desert wasteland and discover hidden oases in this challenging survival experience.',
      status: 'Active',
      genre: 'Survival/Adventure',
      lastUpdated: '2024-12-15',
      features: ['Water Management', 'Sandstorm Events', 'Ancient Ruins', 'Oasis Discovery', 'Resource Scarcity', 'Temperature System'],
      details: 'Navigate the unforgiving desert landscape of Desolation, where every drop of water counts and ancient mysteries lie buried beneath the shifting sands. Discover hidden oases, explore forgotten ruins, and master the art of desert survival in this immersive and challenging map experience.'
    },
    {
      name: 'Coming Soon',
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/ghastbanner.png',
      description: 'Coming Soon',
      status: 'Coming Soon',
      genre: 'Coming Soon',
      lastUpdated: 'Coming Soon',
      features: ['Coming Soon'],
      details: 'Coming Soon'
    },
    {
      name: 'Coming Soon',
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/ghastbanner.png',
      description: 'Coming Soon',
      status: 'Coming Soon',
      genre: 'Coming Soon',
      lastUpdated: 'Coming Soon',
      features: ['Coming Soon'],
      details: 'Coming Soon'
    },
    {
      name: 'Coming Soon',
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/ghastbanner.png',
      description: 'Coming Soon',
      status: 'Coming Soon',
      genre: 'Coming Soon',
      lastUpdated: 'Coming Soon',
      features: ['Coming Soon'],
      details: 'Coming Soon'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Initialize background music
    const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
    audio.loop = true;
    audio.volume = 0.2;
    setBackgroundMusic(audio);

    // Enhanced URL routing with proper validation
    const handleRouting = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      setShowNotFound(false);
      
      // Home page
      if (path === '/') {
        setSelectedMap(null);
        setSelectedMember(null);
        return;
      }
      
      // Parse map routes with validation
      const mapMatch = path.match(/^\/maps\/map(\d+)$/);
      if (mapMatch) {
        const mapIndex = parseInt(mapMatch[1]) - 1;
        if (mapIndex >= 0 && mapIndex < realmsProjects.length) {
          setSelectedMap(mapIndex);
          setSelectedMember(null);
          return;
        } else {
          // Invalid map number
          setShowNotFound(true);
          return;
        }
      }
      
      // Parse member routes with validation
      if (path.startsWith('/glitches/')) {
        const memberName = path.replace('/glitches/', '');
        if (memberName) {
          const memberIndex = teamMembers.findIndex(member => 
            member.name.toLowerCase().replace(/[^a-z0-9]/g, '') === memberName.toLowerCase()
          );
          if (memberIndex !== -1) {
            setSelectedMember(memberIndex);
            setSelectedMap(null);
            return;
          }
        }
        // Invalid member name or empty
        setShowNotFound(true);
        return;
      }
      
      // Check for common typos and invalid paths
      if (path.startsWith('/glitchess') || 
          path.startsWith('/map') || 
          path.startsWith('/team') || 
          path.startsWith('/about') || 
          path.startsWith('/contact')) {
        setShowNotFound(true);
        return;
      }
      
      // Any other path is invalid
      setShowNotFound(true);
    };

    // Initial route handling on page load
    handleRouting();
    
    // Listen for browser navigation
    const handlePopState = () => {
      handleRouting();
    };
    
    window.addEventListener('popstate', handlePopState);
    // Detect mobile device
    isMobile.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Calculate scroll progress
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (currentScrollY / documentHeight) * 100;
      setScrollProgress(progress);
    };

    // Ultra-smooth scrolling animation loop - optimized for both desktop and mobile
    const smoothScrollStep = () => {
      const difference = targetScrollY.current - currentScrollY.current;
      
      if (Math.abs(difference) > 0.1) {
        // Adaptive easing based on device type - faster on mobile for responsiveness
        const easing = isMobile.current ? 0.12 : 0.08; // Increased mobile speed from 0.06 to 0.12
        currentScrollY.current += difference * easing;
        
        // Apply the smooth scroll
        window.scrollTo(0, currentScrollY.current);
        
        // Update scroll-dependent states
        setScrollY(currentScrollY.current);
        
        // Calculate scroll progress
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (currentScrollY.current / documentHeight) * 100;
        setScrollProgress(progress);
        
        animationFrame.current = requestAnimationFrame(smoothScrollStep);
      } else {
        // Snap to final position and stop
        currentScrollY.current = targetScrollY.current;
        window.scrollTo(0, currentScrollY.current);
        isScrolling.current = false;
      }
    };

    // Desktop wheel handling - ultra smooth
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Slower scroll speed for butter-smooth feel
      const scrollSpeed = 0.7; // Optimized for smoothness
      const scrollAmount = e.deltaY * scrollSpeed;
      
      // Update target scroll position
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollY.current = Math.max(0, Math.min(targetScrollY.current + scrollAmount, maxScroll));
      
      // Start smooth scrolling if not already running
      if (!isScrolling.current) {
        isScrolling.current = true;
        currentScrollY.current = window.scrollY;
        animationFrame.current = requestAnimationFrame(smoothScrollStep);
      }
    };

    // Mobile touch handling - ultra smooth with perfect momentum
    let touchStartY = 0;
    let lastTouchY = 0;
    let touchStartTime = 0;
    let touchVelocity = 0;
    let lastTouchTime = 0;
    let touchMoveCount = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      lastTouchY = touchStartY;
      touchStartTime = Date.now();
      lastTouchTime = touchStartTime;
      touchVelocity = 0;
      touchMoveCount = 0;
      
      // Stop any existing scroll animation
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      isScrolling.current = false;
      currentScrollY.current = window.scrollY;
      targetScrollY.current = window.scrollY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      
      const currentY = e.touches[0].clientY;
      const currentTime = Date.now();
      const deltaY = lastTouchY - currentY;
      const deltaTime = currentTime - lastTouchTime;
      
      // Calculate velocity for momentum
      if (deltaTime > 0) {
        touchVelocity = deltaY / deltaTime;
      }
      
      // Enhanced touch scroll speed for mobile responsiveness
      const touchScrollSpeed = 1.4; // Increased from 1.0 to 1.4 for faster response
      const scrollAmount = deltaY * touchScrollSpeed;
      
      // Update target scroll position
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScrollY.current = Math.max(0, Math.min(targetScrollY.current + scrollAmount, maxScroll));
      
      // Start smooth scrolling
      if (!isScrolling.current) {
        isScrolling.current = true;
        animationFrame.current = requestAnimationFrame(smoothScrollStep);
      }
      
      lastTouchY = currentY;
      lastTouchTime = currentTime;
      touchMoveCount++;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchDuration = Date.now() - touchStartTime;
      const touchDistance = touchStartY - lastTouchY;
      
      // Apply momentum based on velocity and gesture
      if (touchMoveCount > 3 && Math.abs(touchVelocity) > 0.1) {
        // Enhanced momentum calculation for natural feel - increased for mobile
        const momentumMultiplier = isMobile.current ? 400 : 200; // Increased from 300 to 400
        const momentum = touchVelocity * momentumMultiplier;
        
        // Apply momentum decay for natural deceleration
        const decayFactor = 0.96; // Slightly improved from 0.95
        const finalMomentum = momentum * decayFactor;
        
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetScrollY.current = Math.max(0, Math.min(targetScrollY.current + finalMomentum, maxScroll));
        
        // Start smooth scrolling with momentum
        if (!isScrolling.current) {
          isScrolling.current = true;
          animationFrame.current = requestAnimationFrame(smoothScrollStep);
        }
      }
    };

    // Enhanced mobile scroll handling with passive event listeners where appropriate
    const addEventListeners = () => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      if (!isMobile.current) {
        // Desktop: Use wheel event for custom smooth scrolling
        window.addEventListener('wheel', handleWheel, { passive: false });
      } else {
        // Mobile: Use touch events for ultra-smooth scrolling
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
      }
    };

    const removeEventListeners = () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    addEventListeners();
    
    let konamiSequence: string[] = [];
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let secretWord = '';
    const validSecretWord = 'minecraft';
    
    let mPressCount = 0;
    let lastMPress = 0;
    let rPressCount = 0;
    let lastRPress = 0;
    let gPressCount = 0;
    let lastGPress = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      konamiSequence.push(e.key);
      if (konamiSequence.length > konamiCode.length) {
        konamiSequence.shift();
      }
      
      if (JSON.stringify(konamiSequence) === JSON.stringify(konamiCode)) {
        setKonamiActive(true);
        document.body.style.transform = 'rotate(180deg)';
        document.body.style.transition = 'transform 1s';
        setTimeout(() => {
          document.body.style.transform = 'none';
        }, 3000);
      }
      
      secretWord += e.key.toLowerCase();
      if (secretWord.length > validSecretWord.length) {
        secretWord = secretWord.substring(1);
      }
      
      if (secretWord.includes(validSecretWord)) {
        setShowPixelTrail(true);
        setSecretMessage('You Found The Secret Word :D');
        setTimeout(() => setSecretMessage(''), 3000);
      }

      if (e.key === 'm') {
        const now = Date.now();
        if (!lastMPress || now - lastMPress < 500) {
          mPressCount++;
          if (mPressCount === 3) {
            setMatrixMode(prev => !prev);
            mPressCount = 0;
          }
        } else {
          mPressCount = 1;
        }
        lastMPress = now;
      }

      if (e.key === 'r') {
        const now = Date.now();
        if (!lastRPress || now - lastRPress < 500) {
          rPressCount++;
          if (rPressCount === 3) {
            setRainbowMode(prev => !prev);
            if (!rainbowMode) {
              document.body.style.animation = 'rainbow 3s linear infinite';
            } else {
              document.body.style.animation = '';
            }
            rPressCount = 0;
          }
        } else {
          rPressCount = 1;
        }
        lastRPress = now;
      }

      if (e.key === 'g') {
        const now = Date.now();
        if (!lastGPress || now - lastGPress < 500) {
          gPressCount++;
          if (gPressCount === 3) {
            setGravitySwitched(prev => !prev);
            document.body.style.transform = gravitySwitched ? 'none' : 'scaleY(-1)';
            gPressCount = 0;
          }
        } else {
          gPressCount = 1;
        }
        lastGPress = now;
      }

      if (e.key === 'Escape') {
        setShowJoinForm(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (showPixelTrail) {
        const newPixel = {
          x: e.clientX,
          y: e.clientY,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`
        };
        setPixelTrail(prev => [...prev.slice(-50), newPixel]);
      }
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      removeEventListeners();
      
      // Clean up animation frame
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [showPixelTrail, gravitySwitched, rainbowMode]);

  const toggleBackgroundMusic = () => {
    if (backgroundMusic) {
      if (isMusicPlaying) {
        backgroundMusic.pause();
      } else {
        backgroundMusic.play().catch(console.error);
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  // Team members data
  const teamMembers = [
    { 
      name: 'NOTGHAST', 
      role: 'Coordinator', 
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/notghastavatar.png', 
      specialty: 'Error 404',
      bio: 'Lead coordinator and founder of Error 404. Specializes in project management, team coordination, and overall map design vision.',
      skills: ['Project Management', 'Team Leadership', 'Map Design', 'Quality Assurance'],
      joinDate: '2024-01-01',
      projects: ['Project Alpha', 'Beta Testing Framework', 'Team Organization'],
      achievements: ['Founded Error 404', 'Led 5+ successful map releases', 'Built amazing team']
    },
    { 
      name: 'Kahterina', 
      role: 'Commands Expert', 
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/kahterinaavatar.png', 
      specialty: 'Error 404',
      bio: 'Master of Minecraft commands and technical implementations. Creates complex command systems that power our maps.',
      skills: ['Command Blocks', 'Redstone Engineering', 'Technical Systems', 'Debugging'],
      joinDate: '2024-01-15',
      projects: ['Advanced Command Systems', 'Map Mechanics', 'Technical Framework'],
      achievements: ['Command System Architect', 'Technical Innovation Award', 'Bug Squasher Supreme']
    },
    { 
      name: 'wFanta', 
      role: 'Blockbench Expert', 
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/wfantaavatar.png', 
      specialty: 'Error 404',
      bio: 'Expert 3D modeler and texture artist. Creates stunning custom models and textures that bring our maps to life.',
      skills: ['3D Modeling', 'Texture Design', 'Blockbench', 'Resource Packs'],
      joinDate: '2024-02-01',
      projects: ['Custom Model Library', 'Texture Pack Design', '3D Asset Creation'],
      achievements: ['Master Modeler', 'Texture Artist of the Year', 'Creative Excellence']
    },
    { 
      name: 'Zumvo', 
      role: 'Building Expert', 
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/zumvoavatar.png', 
      specialty: 'Error 404',
      bio: 'Architectural genius and master builder. Designs and constructs the incredible structures that define our maps.',
      skills: ['Architecture', 'Landscape Design', 'Structural Engineering', 'Artistic Vision'],
      joinDate: '2024-02-10',
      projects: ['Mega Structures', 'Landscape Architecture', 'Building Framework'],
      achievements: ['Master Architect', 'Building Competition Winner', 'Structural Innovator']
    },
    { 
      name: 'BugTracker_', 
      role: 'Building Expert', 
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/bugtrackeravatar.png', 
      specialty: 'Error 404',
      bio: 'Detail-oriented builder and quality assurance specialist. Ensures every structure meets our high standards.',
      skills: ['Quality Assurance', 'Detail Work', 'Bug Testing', 'Optimization'],
      joinDate: '2024-02-20',
      projects: ['QA Framework', 'Detail Enhancement', 'Bug Tracking System'],
      achievements: ['Quality Guardian', 'Bug Hunter Extraordinaire', 'Perfectionist Award']
    },
    { 
      name: 'Spair_tv', 
      role: 'Blockbench Expert', 
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/spairavatar.png', 
      specialty: 'Error 404',
      bio: 'Creative 3D artist and model designer. Specializes in character models and animated elements.',
      skills: ['Character Modeling', 'Animation', 'Creative Design', 'Asset Optimization'],
      joinDate: '2024-03-01',
      projects: ['Character Models', 'Animated Elements', 'Creative Assets'],
      achievements: ['Animation Master', 'Character Design Expert', 'Creative Innovator']
    },
    { 
      name: 'CallMeArthys', 
      role: 'Creative Expert', 
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/arthysavatar.png', 
      specialty: 'Error 404',
      bio: 'Creative visionary and concept artist. Develops the artistic direction and creative concepts for our projects.',
      skills: ['Concept Art', 'Creative Direction', 'Artistic Vision', 'Design Philosophy'],
      joinDate: '2024-03-10',
      projects: ['Concept Development', 'Artistic Direction', 'Creative Framework'],
      achievements: ['Creative Director', 'Artistic Excellence', 'Visionary Award']
    },
    { 
      name: 'Betta_Lantana', 
      role: 'Design Expert', 
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/lantanaavatar.png', 
      specialty: 'Error 404',
      bio: 'UI/UX designer and visual design specialist. Creates beautiful interfaces and cohesive visual experiences.',
      skills: ['UI/UX Design', 'Visual Design', 'User Experience', 'Design Systems'],
      joinDate: '2024-03-20',
      projects: ['Interface Design', 'Visual Systems', 'User Experience'],
      achievements: ['Design Excellence', 'UX Innovation', 'Visual Harmony Master']
    },
    {
      name: 'PixelCrafter', 
      role: 'Texture Artist', 
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/error404logo.png', 
      specialty: 'Error 404',
      bio: 'Master texture artist and pixel perfectionist. Creates stunning texture packs and visual effects that enhance our maps.',
      skills: ['Texture Design', 'Pixel Art', 'Visual Effects', 'Resource Pack Creation'],
      joinDate: '2024-04-01',
      projects: ['HD Texture Packs', 'Visual Enhancement', 'Pixel Art Assets'],
      achievements: ['Pixel Perfect Award', 'Texture Innovation', 'Visual Excellence']
    },
    { 
      name: 'CodeGlitch', 
      role: 'Technical Expert', 
      image: 'https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/error404logo.png', 
      specialty: 'Error 404',
      bio: 'Technical wizard and system architect. Handles complex technical implementations and optimization for our maps.',
      skills: ['System Architecture', 'Performance Optimization', 'Technical Innovation', 'Code Review'],
      joinDate: '2024-04-15',
      projects: ['Performance Framework', 'Technical Systems', 'Code Optimization'],
      achievements: ['Technical Excellence', 'System Architect', 'Innovation Leader']
    }
  ];
  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 10) {
      setShowSecret(true);
      setClickCount(0);
      const logo = document.querySelector('.logo-image') as HTMLElement;
      if (logo) {
        logo.style.animation = 'spin 1s linear infinite';
        setTimeout(() => {
          logo.style.animation = '';
          setSecretMessage('You found a secret!');
          setTimeout(() => setSecretMessage(''), 3000);
        }, 3000);
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.style.transform = 'scale(1.5)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 500);
  };

  const toggleRealm = (index: number) => {
    setExpandedRealm(expandedRealm === index ? null : index);
  };

  // Ultra-smooth scrolling to sections - optimized for mobile
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = 80;
      const targetPosition = section.offsetTop - headerHeight;
      
      // Stop any existing scroll animation
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      
      // Set up smooth scroll to target
      targetScrollY.current = targetPosition;
      currentScrollY.current = window.scrollY;
      isScrolling.current = true;
      
      // Start the ultra-smooth animation
      const smoothScrollToTarget = () => {
        const difference = targetScrollY.current - currentScrollY.current;
        
        if (Math.abs(difference) > 0.5) {
          // Adaptive easing for navigation based on device - faster on mobile
          const easing = isMobile.current ? 0.15 : 0.12; // Increased mobile from 0.10 to 0.15
          currentScrollY.current += difference * easing;
          
          window.scrollTo(0, currentScrollY.current);
          setScrollY(currentScrollY.current);
          
          animationFrame.current = requestAnimationFrame(smoothScrollToTarget);
        } else {
          // Snap to final position
          currentScrollY.current = targetScrollY.current;
          window.scrollTo(0, currentScrollY.current);
          setScrollY(currentScrollY.current);
          isScrolling.current = false;
        }
      };
      
      animationFrame.current = requestAnimationFrame(smoothScrollToTarget);
    }
  };

  const scrollToRealms = () => {
    scrollToSection('realms-section');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400 bg-green-400/20';
      case 'Beta Testing': return 'text-yellow-400 bg-yellow-400/20';
      case 'Coming Soon': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const showNotificationMessage = (message: string, type: 'success' | 'error') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setTimeout(() => setNotificationMessage(''), 300);
    }, 5000);
  };

  const dismissNotification = () => {
    setShowNotification(false);
    setTimeout(() => setNotificationMessage(''), 300);
  };

  const handleContactSuccess = () => {
    showNotificationMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
  };

  const handleContactError = (message: string) => {
    showNotificationMessage(message, 'error');
  };

  const handleJoinSuccess = () => {
    showNotificationMessage('Application submitted successfully! We\'ll review it and get back to you.', 'success');
  };

  const handleJoinError = (message: string) => {
    showNotificationMessage(message, 'error');
  };

  const handleMapClick = (index: number) => {
    const mapUrl = `/maps/map${index + 1}`;
    window.history.pushState(null, '', mapUrl);
    setSelectedMap(index);
    setSelectedMember(null);
    setShowNotFound(false);
  };

  const handleBackToRealms = () => {
    window.history.pushState(null, '', '/');
    setSelectedMap(null);
    setShowNotFound(false);
  };

  const handleMemberClick = (index: number) => {
    const member = teamMembers[index];
    const memberUrl = `/glitches/${member.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    window.history.pushState(null, '', memberUrl);
    setSelectedMember(index);
    setSelectedMap(null);
    setShowNotFound(false);
  };

  const handleBackToTeam = () => {
    window.history.pushState(null, '', '/');
    setSelectedMember(null);
    setShowNotFound(false);
  };
  
  // If showing 404 page
  if (showNotFound) {
    return <NotFoundPage />;
  }
  
  // If a map is selected, show the map page
  if (selectedMap !== null) {
    return (
      <MapPage 
        map={realmsProjects[selectedMap]} 
        onBack={handleBackToRealms}
      />
    );
  }

  // If a member is selected, show the member page
  if (selectedMember !== null) {
    return (
      <MemberPage 
        member={teamMembers[selectedMember]} 
        onBack={handleBackToTeam}
      />
    );
  }
  return (
    <div className={`min-h-screen bg-black text-zinc-100 ultra-smooth-scroll ${matrixMode ? 'matrix-effect' : ''}`}>
      {/* Scroll progress indicator */}
      <div 
        className="scroll-indicator"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      {pixelTrail.map((pixel, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            left: pixel.x,
            top: pixel.y,
            width: '4px',
            height: '4px',
            backgroundColor: pixel.color,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: (i / pixelTrail.length),
            transition: 'opacity 0.5s'
          }}
        />
      ))}
      
      {secretMessage && (
        <div className="fixed top-32 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-[9999] animate-bounce">
          {secretMessage}
        </div>
      )}

      {/* Notification system */}
      <Notification
        message={notificationMessage}
        type={notificationType}
        show={showNotification}
        onDismiss={dismissNotification}
      />

      {/* Join Team Modal */}
      {showJoinForm && (
        <JoinForm
          onSuccess={handleJoinSuccess}
          onError={handleJoinError}
          onClose={() => setShowJoinForm(false)}
        />
      )}

      <nav className="fixed top-0 left-0 right-0 z-[9998] bg-black/80 border-4 border-black">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand - far left */}
            <div className="flex items-center space-x-3">
              <img 
                src="https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/error404logo.png" 
                alt="Error 404" 
                className={`w-10 h-10 rounded-md cursor-pointer transition-transform logo-image ${showSecret ? 'animate-spin' : ''}`}
                onClick={handleLogoClick}
                onDoubleClick={handleDoubleClick}
              />
              <span className="text-lg font-medium">Error 404</span>
            </div>

            {/* Navigation Links - far right */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('realms-section')}
                className="text-zinc-300 hover:text-white transition-colors text-sm font-medium px-4 py-2 border-2 border-zinc-600 hover:border-white hover:bg-zinc-800/50 rounded"
              >
                Realms
              </button>
              <button
                onClick={() => scrollToSection('team-section')}
                className="text-zinc-300 hover:text-white transition-colors text-sm font-medium px-4 py-2 border-2 border-zinc-600 hover:border-white hover:bg-zinc-800/50 rounded"
              >
                Team
              </button>
              <button
                onClick={() => scrollToSection('about-section')}
                className="text-zinc-300 hover:text-white transition-colors text-sm font-medium px-4 py-2 border-2 border-zinc-600 hover:border-white hover:bg-zinc-800/50 rounded"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact-section')}
                className="text-zinc-300 hover:text-white transition-colors text-sm font-medium px-4 py-2 border-2 border-zinc-600 hover:border-white hover:bg-zinc-800/50 rounded"
              >
                Contact
              </button>
            </div>

            {/* Mobile hamburger menu */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-zinc-300 hover:text-white transition-colors p-2 border-2 border-zinc-600 hover:border-white hover:bg-zinc-800/50 rounded"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile menu dropdown */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 border-t-2 border-zinc-600">
              <div className="flex flex-col space-y-2 pt-4">
                <button
                  onClick={() => {
                    scrollToSection('realms-section');
                    setShowMobileMenu(false);
                  }}
                  className="text-zinc-300 hover:text-white transition-colors text-sm font-medium px-4 py-3 border-2 border-zinc-600 hover:border-white hover:bg-zinc-800/50 rounded text-left"
                >
                  Realms
                </button>
                <button
                  onClick={() => {
                    scrollToSection('team-section');
                    setShowMobileMenu(false);
                  }}
                  className="text-zinc-300 hover:text-white transition-colors text-sm font-medium px-4 py-3 border-2 border-zinc-600 hover:border-white hover:bg-zinc-800/50 rounded text-left"
                >
                  Team
                </button>
                <button
                  onClick={() => {
                    scrollToSection('about-section');
                    setShowMobileMenu(false);
                  }}
                  className="text-zinc-300 hover:text-white transition-colors text-sm font-medium px-4 py-3 border-2 border-zinc-600 hover:border-white hover:bg-zinc-800/50 rounded text-left"
                >
                  About
                </button>
                <button
                  onClick={() => {
                    scrollToSection('contact-section');
                    setShowMobileMenu(false);
                  }}
                  className="text-zinc-300 hover:text-white transition-colors text-sm font-medium px-4 py-3 border-2 border-zinc-600 hover:border-white hover:bg-zinc-800/50 rounded text-left"
                >
                  Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/backgroundimage.png')] bg-cover bg-center transition-all duration-100 ease-out"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            filter: `brightness(${Math.max(0.4, 1 - scrollY * 0.001)})`
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/40 to-black"
        />
        <div className={`text-center z-10 animate-float transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl mb-6 tracking-tight">Welcome To Error 404</h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-8">Minecraft Mapmaking Team</p>
          <button 
            className="bedrock-button group relative overflow-hidden"
            onClick={scrollToRealms}
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              btn.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
              setTimeout(() => {
                btn.style.transform = 'none';
              }, 100);
            }}
          >
            Explore Realms
          </button>
        </div>
      </header>

      <section id="realms-section" className="py-16 md:py-24 bg-zinc-950 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(45deg, transparent 30%, rgba(63, 20, 20, 0.1) 50%, transparent 70%)`,
            transform: `translateX(${scrollY * 0.1}px)`
          }}
        />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-16 animate-slide-up-bounce">
            <h2 className="text-3xl md:text-4xl mb-4">Java Realms</h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Experience our latest Minecraft Java Edition Realms Maps
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {realmsProjects.map((realm, index) => (
              <div 
                key={index} 
                className="bedrock-card p-6 md:p-8 cursor-pointer map-card-hover animate-pop-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  transform: `translateY(${Math.sin(scrollY * 0.01 + index) * 5}px)`
                }}
              >
                <div className="relative mb-6 overflow-hidden rounded-lg">
                  <img 
                    src={realm.image}
                    alt={realm.name}
                    className="w-full h-48 md:h-56 object-cover map-image"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(realm.status)}`}>
                      {realm.status}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRealm(index);
                      }}
                      className="bg-black/60 backdrop-blur-sm rounded-full p-1 hover:bg-black/80 transition-colors"
                    >
                      <ChevronDown 
                        className={`w-5 h-5 text-white transition-transform ${expandedRealm === index ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl md:text-2xl mb-2">{realm.name}</h3>
                    <p className="text-zinc-400 text-sm md:text-base leading-relaxed">{realm.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                    <div className="flex items-center gap-2">
                      <span>Last Updated: {realm.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {realm.features.map((feature, i) => (
                      <span key={i} className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {expandedRealm === index && (
                    <div className="mt-6 p-4 bg-black/50 rounded-lg space-y-4 animate-fade-in">
                      <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-4">
                        {realm.details}
                      </p>
                      <button
                        onClick={() => handleMapClick(index)}
                        className="bedrock-button w-full"
                      >
                        View Full Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team-section" className="py-16 bedrock-gradient relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,255,255,0.02) 50px, rgba(255,255,255,0.02) 100px)`,
            transform: `translateX(${-scrollY * 0.05}px)`
          }}
        />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl mb-12 text-center animate-scale-bounce">Glitches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bedrock-card p-6 text-center member-card-hover cursor-pointer animate-pop-in-delayed h-full flex flex-col"
                onClick={() => handleMemberClick(index)}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  transform: `translateY(${Math.cos(scrollY * 0.01 + index) * 3}px)`
                }}
              >
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-lg mx-auto mb-4 object-contain"
                />
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg md:text-xl mb-2">{member.name}</h3>
                  <p className="text-sm md:text-base text-zinc-400 mb-1">{member.role}</p>
                  <p className="text-sm md:text-base text-zinc-500">{member.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about-section" className="py-24 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-12 animate-scale-bounce">About</h2>
          <div className="bedrock-card p-8 about-card-hover animate-slide-up-bounce">
            <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
              Error 404 is a Minecraft mapmaking team that focuses on creating original and well-designed maps. 
              We enjoy experimenting with gameplay ideas and putting together fun, polished experiences.
            </p>
          </div>
        </div>
      </section>

      <section id="contact-section" className="py-24 bedrock-gradient">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl mb-12 text-center animate-scale-bounce">Contact Us</h2>
          <div className="grid md:grid-cols-2 gap-8 h-full">
            <div className="bedrock-card p-8 flex flex-col h-full contact-card-hover animate-slide-in-left">
              <div className="flex items-center justify-center mb-6">
                <h3 className="text-xl md:text-2xl text-center">Get In Touch</h3>
              </div>
              <div className="flex-1 flex flex-col">
                <ContactForm
                  onSuccess={handleContactSuccess}
                  onError={handleContactError}
                />
              </div>
            </div>
            <div className="flex flex-col gap-8 h-full">
              <a 
                href="https://discord.gg/43xVRKxtd7" 
                target="_blank"
                rel="noopener noreferrer"
                className="bedrock-card p-8 text-center hover:scale-105 transition-transform block flex-1 flex flex-col justify-center contact-card-hover animate-slide-in-right"
              >
                <img 
                  src="https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/discordicon.png"
                  alt="Discord"
                  className="w-32 h-32 rounded-lg mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl md:text-2xl mb-2">Our Discord</h3>
                <p className="text-sm md:text-base text-zinc-400">Connect With Fellow Mapmakers</p>
              </a>
              <button 
                onClick={() => setShowJoinForm(true)}
                className="bedrock-card p-8 text-center hover:scale-105 transition-transform flex-1 flex flex-col justify-center contact-card-hover animate-slide-in-right"
                style={{ animationDelay: '0.2s' }}
              >
                <img 
                  src="https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/heartimage.png"
                  alt="Join The Team"
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover filter grayscale"
                />
                <h3 className="text-xl md:text-2xl mb-2 text-center">Join The Team</h3>
                <p className="text-sm md:text-base text-zinc-400 text-center">Apply to Become a Glitch</p>
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 bg-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand section */}
            <div className="md:col-span-2 animate-slide-in-left">
              <div className="flex items-center mb-4">
                <img 
                  src="https://raw.githubusercontent.com/GHASTBOT/Error404/refs/heads/main/error404logo.png" 
                  alt="Error 404" 
                  className="w-12 h-12 rounded-md mr-3"
                />
                <span className="text-2xl font-bold">Error 404</span>
              </div>
              <p className="text-zinc-400 mb-6 max-w-md">
                Creating original and well-designed Minecraft maps. We experiment with gameplay ideas 
                and put together fun, polished experiences for the community.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://discord.gg/43xVRKxtd7" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link text-zinc-400 hover:text-white p-2 bg-zinc-800 rounded-lg transition-colors"
                >
                  Discord
                </a>
                <a 
                  href="mailto:Error404Team@outlook.com" 
                  className="footer-link text-zinc-400 hover:text-white p-2 bg-zinc-800 rounded-lg transition-colors"
                >
                  Email
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => scrollToSection('realms-section')}
                    className="footer-link text-zinc-400 hover:text-white transition-colors"
                  >
                    Our Realms
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('team-section')}
                    className="footer-link text-zinc-400 hover:text-white transition-colors"
                  >
                    Meet the Team
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('about-section')}
                    className="footer-link text-zinc-400 hover:text-white transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact-section')}
                    className="footer-link text-zinc-400 hover:text-white transition-colors"
                  >
                    Join Our Team
                  </button>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <h4 className="text-lg font-semibold mb-4 text-white">Community</h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://discord.gg/43xVRKxtd7" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link text-zinc-400 hover:text-white transition-colors"
                  >
                    Discord Server
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact-section')}
                    className="footer-link text-zinc-400 hover:text-white transition-colors"
                  >
                    Contact Support
                  </button>
                </li>
                <li>
                  <span className="text-zinc-400">Map Downloads</span>
                  <span className="text-xs text-zinc-500 block">Coming Soon</span>
                </li>
                <li>
                  <span className="text-zinc-400">Community Forum</span>
                  <span className="text-xs text-zinc-500 block">Coming Soon</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-zinc-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <span className="text-sm text-zinc-600">404 Not Found :(</span>
                </div>
                <p className="text-sm text-zinc-400">
                  Making Maps For Everyone • By Error 404 Team
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-zinc-500">
                <span>Est. 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
      </footer>

      <style jsx>{`
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }

        @keyframes matrix {
          0% { color: #0f0; text-shadow: 0 0 8px #0f0; }
          30% { color: #0a0; text-shadow: 0 0 8px #0a0; }
          100% { color: #0f0; text-shadow: 0 0 8px #0f0; }
        }

        .matrix-effect {
          background-color: black;
          color: #0f0;
          text-shadow: 0 0 8px #0f0;
          animation: matrix 2s infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes sweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

export default App;