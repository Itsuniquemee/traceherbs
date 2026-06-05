import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/AdvancedPASLanding.css';
import {
  Shield,
  Leaf,
  Users,
  CheckCircle,
  Play,
  Star,
  Database,
  Eye,
  ChevronDown,
  Phone,
  X,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Moon,
  Sun,
  MessageCircle,
  Send,
  Sparkles,
  Zap,
  Globe,
  Award,
  BarChart3,
  Clock,
  Rocket,
  MousePointer2,
  ArrowUpRight,
  CheckCircle2,
  TrendingUp,
  Lock,
  Cpu,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const PASLandingPage = () => {
  // Core State Management
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hi! I see you\'re interested in herbal traceability. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [hesitationTimerActive, setHesitationTimerActive] = useState(false);
  const [ctaPauseTimerActive, setCTAPauseTimerActive] = useState(false);
  
  // Advanced Interactive State
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Refs for Advanced Animations
  const chatbotRef = useRef(null);
  const agitationRef = useRef(null);
  const ctaSectionRef = useRef(null);
  const statsRef = useRef(null);
  
  // Scroll Progress Tracking
  const { scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Mouse Movement Tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Page Load Animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Intersection Observer hooks for animations
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [problemRef, problemInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [solutionRef, solutionInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Advanced Data Structures
  const agitatingTestimonials = [
    {
      quote: "We were losing entire shipments to contamination scandals. Nobody could trace where the problem started. It was costing us millions and destroying our reputation.",
      author: "Sarah Chen",
      title: "Quality Director",
      company: "GreenLeaf Pharmaceuticals",
      avatar: "/api/placeholder/60/60",
      rating: 5,
      impact: "$2.3M Lost",
      before: "Before TraceHerbss",
      gradient: "from-red-500 to-orange-500"
    },
    {
      quote: "Every time there was a recall, we had to throw away everything. No traceability meant no confidence from retailers. We were bleeding money.",
      author: "Marcus Rodriguez", 
      title: "Supply Chain Manager",
      company: "NaturalMed Corp",
      avatar: "/api/placeholder/60/60",
      rating: 5,
      impact: "40% Revenue Drop",
      before: "Before TraceHerbss",
      gradient: "from-pink-500 to-red-500"
    },
    {
      quote: "Compliance audits were nightmares. Paperwork everywhere, no digital trail. We failed two major certifications before finding a real solution.",
      author: "Dr. Priya Patel",
      title: "Compliance Officer",
      company: "HerbTech Industries",
      avatar: "/api/placeholder/60/60",
      rating: 5,
      impact: "3 Failed Audits",
      before: "Before TraceHerbss",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const clientLogos = [
    { name: "GreenLeaf Pharmaceuticals", logo: "/api/placeholder/120/60" },
    { name: "NaturalMed Corp", logo: "/api/placeholder/120/60" },
    { name: "HerbTech Industries", logo: "/api/placeholder/120/60" },
    { name: "BotanicalSupply Co", logo: "/api/placeholder/120/60" },
    { name: "OrganicTrace Ltd", logo: "/api/placeholder/120/60" },
    { name: "PureHerb International", logo: "/api/placeholder/120/60" }
  ];

  const problemStats = [
    { 
      id: "compliance-costs",
      number: "60%", 
      label: "average reduction in compliance costs with complete traceability",
      source: "HerbalTrace Customer Study 2024",
      icon: <Shield className="h-8 w-8" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      gradient: "from-emerald-500 to-blue-500",
      animatedNumber: 60,
      suffix: "%"
    },
    { 
      id: "roi-timeline",
      number: "3.2", 
      label: "months average ROI payback period",
      source: "Customer Success Analysis",
      icon: <TrendingUp className="h-8 w-8" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      gradient: "from-blue-500 to-emerald-500",
      animatedNumber: 3.2,
      suffix: " mo"
    },
    { 
      id: "supply-visibility",
      number: "100%", 
      label: "supply chain visibility from farm to consumer",
      source: "Blockchain Transparency Report",
      icon: <Eye className="h-8 w-8" />,
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      gradient: "from-emerald-600 to-green-600",
      animatedNumber: 100,
      suffix: "%"
    }
  ];

  // Enhanced Solution Benefits
  const solutionBenefits = [
    {
      id: "traceability",
      icon: <Shield className="h-12 w-12" />,
      title: "Complete Traceability",
      description: "Track every herb from seed to shelf with blockchain-secured records",
      benefit: "Eliminate contamination risks and recalls",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      stats: "99.9% Accuracy",
      features: ["Blockchain Security", "Real-time Tracking", "Instant Alerts"],
      roi: "300% ROI"
    },
    {
      id: "compliance",
      icon: <CheckCircle className="h-12 w-12" />,
      title: "Instant Compliance", 
      description: "Automated reporting meets all international standards",
      benefit: "Pass every audit without stress",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      stats: "100% Pass Rate",
      features: ["Auto Reports", "Global Standards", "Audit Ready"],
      roi: "60% Cost Reduction"
    },
    {
      id: "visibility",
      icon: <Eye className="h-12 w-12" />,
      title: "Real-Time Visibility",
      description: "See exactly where problems occur in your supply chain",
      benefit: "Stop issues before they become crises",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      stats: "24/7 Monitoring",
      features: ["Live Dashboard", "Predictive Analytics", "Issue Prevention"],
      roi: "85% Faster Response"
    }
  ];

  // Advanced GSAP ScrollTrigger Animations
  useEffect(() => {
    // Hero section staggered reveals with parallax
    gsap.fromTo(".hero-content > *", 
      { y: 100, opacity: 0 }, 
      { 
        y: 0, 
        opacity: 1, 
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".asymmetric-hero",
          start: "top 80%",
        }
      }
    );

    // Statistics counter animation
    gsap.fromTo(".stat-number", 
      { textContent: 0 },
      {
        textContent: (i, target) => target.getAttribute('data-value'),
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
        stagger: 0.3,
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 80%",
        }
      }
    );

    // Testimonial cards floating animation
    gsap.fromTo(".testimonial-card", 
      { y: 50, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".testimonials-section",
          start: "top 85%",
        }
      }
    );

    // Problem section crisis elements
    gsap.fromTo(".crisis-element", 
      { x: -100, opacity: 0, rotation: -5 },
      {
        x: 0,
        opacity: 1,
        rotation: 0,
        duration: 1,
        stagger: 0.15,
        ease: "elastic.out(1, 0.8)",
        scrollTrigger: {
          trigger: ".problem-section",
          start: "top 70%",
        }
      }
    );

    // Solution benefits reveal
    gsap.fromTo(".benefit-card", 
      { scale: 0, opacity: 0, rotation: 10 },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(2.5)",
        scrollTrigger: {
          trigger: ".solution-section",
          start: "top 75%",
        }
      }
    );

    // CTA section pulsing effect
    gsap.to(".cta-glow", {
      scale: 1.1,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 90%",
      }
    });

    // Parallax effect for background elements
    gsap.to(".parallax-bg", {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: ".parallax-container",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Dark Mode Toggle Effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Behavioral Triggers for Conversational AI
  useEffect(() => {
    let hesitationTimer, ctaPauseTimer;

    // 10-second hesitation trigger in Agitate section
    const handleAgitationHover = () => {
      if (!hesitationTimerActive) {
        setHesitationTimerActive(true);
        hesitationTimer = setTimeout(() => {
          setShowChatbot(true);
          setChatMessages(prev => [...prev, {
            type: 'bot',
            message: 'I notice you\'re reading about the problems in herbal traceability. These issues are costing companies millions. Would you like to see how TraceHerbss solves this?'
          }]);
        }, 10000);
      }
    };

    // 5-second CTA pause trigger
    const handleCTAHover = () => {
      if (!ctaPauseTimerActive) {
        setCTAPauseTimerActive(true);
        ctaPauseTimer = setTimeout(() => {
          if (!showChatbot) {
            setShowChatbot(true);
            setChatMessages(prev => [...prev, {
              type: 'bot',
              message: 'Ready to transform your herbal supply chain? I can connect you with our specialist for a personalized demo right now!'
            }]);
          }
        }, 5000);
      }
    };

    const agitationElement = agitationRef.current;
    const ctaElement = ctaSectionRef.current;

    if (agitationElement) {
      agitationElement.addEventListener('mouseenter', handleAgitationHover);
    }
    if (ctaElement) {
      ctaElement.addEventListener('mouseenter', handleCTAHover);
    }

    return () => {
      if (hesitationTimer) clearTimeout(hesitationTimer);
      if (ctaPauseTimer) clearTimeout(ctaPauseTimer);
      if (agitationElement) {
        agitationElement.removeEventListener('mouseenter', handleAgitationHover);
      }
      if (ctaElement) {
        ctaElement.removeEventListener('mouseenter', handleCTAHover);
      }
    };
  }, [hesitationTimerActive, ctaPauseTimerActive, showChatbot]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % agitatingTestimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [agitatingTestimonials.length]);

  // Advanced AI Chatbot Handler
  const sendChatMessage = () => {
    if (chatInput.trim()) {
      const userMessage = chatInput.toLowerCase();
      setChatMessages(prev => [...prev, { type: 'user', message: chatInput }]);
      
      // Smart contextual AI responses based on user input
      setTimeout(() => {
        let response = "";
        
        // Intelligent keyword detection and contextual responses
        if (userMessage.includes('price') || userMessage.includes('cost') || userMessage.includes('pricing')) {
          response = "💰 Great question about pricing! Our enterprise solutions start from $199/month with scalable tiers. ROI typically achieved in 3-4 months. Want me to calculate a custom quote based on your supply chain size?";
        } else if (userMessage.includes('demo') || userMessage.includes('see') || userMessage.includes('show')) {
          response = "🎯 Perfect! I'd love to show you our live platform. Our interactive demo reveals exactly how we track every herb from farm to consumer in real-time. Should I book you a 15-min personalized walkthrough?";
        } else if (userMessage.includes('blockchain') || userMessage.includes('technology') || userMessage.includes('how')) {
          response = "⚡ Excellent technical question! We use enterprise-grade blockchain + IoT sensors + AI analytics. Every herb batch gets an immutable digital fingerprint. This creates 100% transparency that's impossible to fake. Want the technical deep-dive?";
        } else if (userMessage.includes('fraud') || userMessage.includes('fake') || userMessage.includes('counterfeit')) {
          response = "🛡️ Fraud costs the herbal industry $40B annually! Our system eliminated counterfeit incidents by 98% for our clients through tamper-proof digital passports. Each herb gets blockchain-verified authenticity. Need our fraud prevention case studies?";
        } else if (userMessage.includes('compliance') || userMessage.includes('regulation') || userMessage.includes('fda')) {
          response = "✅ Compliance made simple! We auto-generate audit trails for FDA, USDA, EU regulations. 300+ companies passed inspections with zero compliance issues using our platform. Which specific regulations do you need help with?";
        } else if (userMessage.includes('integration') || userMessage.includes('system') || userMessage.includes('api')) {
          response = "🔗 Seamless integration guaranteed! We connect with 50+ systems (SAP, Oracle, QuickBooks, custom ERPs). API-first architecture means 2-3 day setup, not months. What systems do you currently use?";
        } else if (userMessage.includes('roi') || userMessage.includes('return') || userMessage.includes('benefit')) {
          response = "📈 ROI data you'll love: 67% compliance cost reduction, 45% faster audits, 89% supply chain visibility increase. Average payback: 3.2 months. Want me to calculate your specific ROI projections?";
        } else if (userMessage.includes('help') || userMessage.includes('support') || userMessage.includes('assistance')) {
          response = "🤝 I'm here to help! Whether it's technical questions, pricing, or seeing our platform in action - I've got you covered. What's your biggest herbal traceability challenge right now?";
        } else {
          const contextualResponses = [
            "🌟 Fantastic question! This is exactly the challenge our 500+ clients faced before TraceHerbss. Our blockchain solution delivers complete transparency from seed to shelf. Ready to see how?",
            "🎯 You're asking the right questions! This pain point costs companies $2.3M annually on average, but our clients see ROI within 4 months. Want me to share the success metrics?",
            "⚡ Perfect timing! We just launched new features addressing this exact issue. Our latest client saw 85% improvement in similar scenarios. Should I show you their case study?",
            "🚀 Brilliant insight! This is one of the top 3 challenges in herbal supply chains. Our AI-powered solution has a 98% success rate solving this. Want to see the proof?"
          ];
          response = contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
        }
        
        setChatMessages(prev => [...prev, { type: 'bot', message: response }]);
      }, 1200 + Math.random() * 800); // Realistic AI response timing
      
      setChatInput('');
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Crisis Alert Banner */}
      <motion.div
        className="bg-red-50 border-l-4 border-red-400 p-4 relative"
        style={{
          backgroundColor: '#fee2e2',
          borderLeft: '4px solid #f87171',
          color: '#991b1b',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)'
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>
              <strong>Supply Chain Crisis Alert:</strong> 73% of herbal companies experienced contamination issues in 2024.{' '}
              <a 
                href="#crisis-report" 
                className="underline hover:no-underline font-semibold"
                style={{ color: '#dc2626' }}
              >
                Learn More →
              </a>
            </span>
          </div>
          <motion.button
            className="text-red-600 hover:text-red-800 p-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Advanced Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      
      {/* Cursor Follower */}
      <motion.div
        className="fixed w-4 h-4 bg-green-500/30 rounded-full pointer-events-none z-40 mix-blend-difference"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
        animate={{
          scale: activeCard ? 2 : 1,
          opacity: activeCard ? 0.8 : 0.3,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Ultra-Modern Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1] }}
        className="fixed top-0 w-full bg-white/80 backdrop-blur-2xl border-b border-neutral-200/50 z-50"
        style={{ 
          transform: `scale(${scaleProgress})`,
          height: 'auto',
          minHeight: '60px'
        }}
      >
        <div className="container container-7xl" style={{ maxWidth: '1200px', padding: '0 1rem', margin: '0 auto' }}>
          <div className="flex justify-between items-center py-3" style={{ padding: '0.75rem 0' }}>
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <div className="relative">
                {/* Professional Logo Icon - Combining Leaf + Chain */}
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden"
                  style={{
                    background: 'var(--gradient-hero)',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  {/* Leaf element */}
                  <Leaf className="h-4 w-4 text-white absolute top-1 left-1" />
                  {/* Chain link element */}
                  <div className="absolute bottom-1 right-1 w-4 h-4 flex items-center justify-center">
                    <div className="w-2 h-2 border border-white rounded-full"></div>
                    <div className="w-1 h-3 border-l border-white ml-0.5"></div>
                  </div>
                </div>
                <div className="absolute -inset-1 rounded-lg blur-md opacity-30 animate-pulse"
                     style={{ background: 'var(--gradient-hero)' }}></div>
              </div>
              <span 
                className="font-bold"
                style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'var(--font-weight-bold)',
                  background: 'var(--gradient-hero)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                HerbalTrace
              </span>
            </motion.div>
            
            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-6" style={{ gap: '1.5rem' }}>
              <motion.a 
                href="#problem" 
                className="text-gray-700 hover:text-primary-600 transition-all font-medium"
                style={{ fontSize: '0.9rem', fontWeight: '500' }}
                whileHover={{ y: -2 }}
              >
                The Crisis
              </motion.a>
              <motion.a 
                href="#solution" 
                className="text-gray-700 hover:text-primary-600 transition-all font-medium"
                style={{ fontSize: '0.9rem', fontWeight: '500' }}
                whileHover={{ y: -2 }}
              >
                Our Solution
              </motion.a>
              <motion.a 
                href="#benefits" 
                className="text-gray-700 hover:text-primary-600 transition-all font-medium"
                style={{ fontSize: '0.9rem', fontWeight: '500' }}
                whileHover={{ y: -2 }}
              >
                Benefits
              </motion.a>
            </div>
            
            {/* CTA Button */}
            <div className="flex items-center gap-3" style={{ gap: '0.75rem' }}>
              <motion.button
                onClick={() => setShowJoinForm(true)}
                className="btn btn-primary btn-md btn-magnetic btn-glow"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="h-4 w-4" />
                Get Started
              </motion.button>
              
              {/* Theme Toggle */}
              <motion.button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                style={{ padding: '0.5rem' }}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </motion.button>
              
              {/* Mobile Menu Button */}
              <motion.button
                className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                style={{ padding: '0.5rem', display: 'block' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-5 h-5 flex flex-col justify-center items-center">
                  <span className="block w-4 h-0.5 bg-gray-600 mb-1"></span>
                  <span className="block w-4 h-0.5 bg-gray-600 mb-1"></span>
                  <span className="block w-4 h-0.5 bg-gray-600"></span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Professional Hero Section - Two Column Layout */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%),
            radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
          `,
          paddingTop: '6rem',
          paddingBottom: '2rem'
        }}
      >
        {/* Subtle geometric background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div 
            className="absolute top-20 left-20 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)'
            }}
          />
          <div 
            className="absolute bottom-20 right-20 w-80 h-80 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
            }}
          />
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rotate-45"
            style={{
              background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
            }}
          />
        </div>

        {/* Two-Column Hero Layout */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center min-h-[calc(100vh-8rem)]">
            
            {/* Left Column - Content (60%) */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl"
              >
                {/* Crisis Alert Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full border border-red-200 mb-6"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Supply Chain Crisis Alert</span>
                </motion.div>

                {/* Pre-headline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-blue-50 px-4 py-2 rounded-full border border-emerald-200 mb-6"
                >
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-emerald-700">
                    #1 Herbal Supply Chain Platform
                  </span>
                </motion.div>

                {/* Main Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="text-gray-900">Transform Your</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                    Herbal Supply Chain
                  </span>
                  <br />
                  <span className="text-gray-900">with Complete</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                    {" "}Traceability
                  </span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  End-to-end visibility from farm to pharmacy. Track, verify, and optimize 
                  your herbal products with blockchain-powered transparency that builds trust 
                  and ensures compliance.
                </p>

                {/* Key Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: "🔗", text: "Complete Chain Visibility" },
                    { icon: "🛡️", text: "Blockchain Security" },
                    { icon: "📊", text: "Real-time Analytics" },
                    { icon: "✅", text: "Compliance Ready" }
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xl">{benefit.icon}</span>
                      <span className="text-gray-700 font-medium">{benefit.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onClick={() => setShowJoinForm(true)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, var(--primary-color) 0%, #059669 100%)',
                      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    🚀 Start Free Trial
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    onClick={() => setIsVideoPlaying(true)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-600"
                    style={{
                      borderColor: 'var(--secondary-color)',
                      color: 'var(--secondary-color)'
                    }}
                  >
                    📊 View Live Demo
                  </motion.button>
                </div>

                {/* Trust Indicators */}
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">Trusted by leading herbal companies worldwide</p>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>99.9% Uptime SLA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>ISO 27001 Certified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>GDPR Compliant</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Visual (40%) */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* Dashboard Mockup Container */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">H</span>
                      </div>
                      <span className="font-semibold text-gray-900">Supply Chain Dashboard</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Supply Chain Map Visualization */}
                  <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-700">Live Tracking Map</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Live</span>
                    </div>
                    
                    {/* Interactive Supply Chain Nodes */}
                    <div className="relative h-32 bg-white rounded-lg border border-emerald-200 p-3">
                      <div className="flex items-center justify-between h-full">
                        {/* Farm */}
                        <div className="text-center">
                          <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center animate-pulse">
                            <span className="text-white text-xs">🌱</span>
                          </div>
                          <span className="text-xs text-gray-600">Farm</span>
                        </div>
                        
                        {/* Processing */}
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-green-300 to-blue-300 mx-2 relative">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <span className="text-white text-xs">⚙️</span>
                          </div>
                          <span className="text-xs text-gray-600">Processing</span>
                        </div>
                        
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 mx-2"></div>
                        
                        {/* Distribution */}
                        <div className="text-center">
                          <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <span className="text-white text-xs">📦</span>
                          </div>
                          <span className="text-xs text-gray-600">Distribution</span>
                        </div>
                        
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-300 to-emerald-300 mx-2"></div>
                        
                        {/* Retail */}
                        <div className="text-center">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <span className="text-white text-xs">🏪</span>
                          </div>
                          <span className="text-xs text-gray-600">Retail</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Batch Tracking Interface */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-700">Recent Batches</h3>
                      <span className="text-xs text-blue-600 cursor-pointer hover:underline">View All</span>
                    </div>
                    
                    {/* Batch Items */}
                    {[
                      { id: "HB001", product: "Turmeric Powder", status: "In Transit", progress: 75 },
                      { id: "HB002", product: "Ginger Extract", status: "Processing", progress: 45 },
                      { id: "HB003", product: "Ashwagandha", status: "Delivered", progress: 100 }
                    ].map((batch, index) => (
                      <motion.div
                        key={batch.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gray-500">{batch.id}</span>
                            <span className="text-sm font-medium text-gray-900">{batch.product}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                                style={{ width: `${batch.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{batch.progress}%</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            batch.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            batch.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {batch.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">98.5%</div>
                    <div className="text-xs text-gray-600">Traceability</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">24/7</div>
                    <div className="text-xs text-gray-600">Monitoring</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </motion.div>
      </section>

      {/* Advanced Problem Section - Crisis Reality */}
      <section 
        id="problem" 
        ref={(el) => {
          agitationRef.current = el;
          problemRef(el);
        }}
        className="section-lg bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-100/50 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-orange-200/50 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="container container-7xl relative z-10" style={{ maxWidth: '1200px', padding: '0 2rem', margin: '0 auto' }}>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={problemInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
            style={{ textAlign: 'center', marginBottom: '5rem' }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={problemInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <AlertTriangle className="h-4 w-4" />
              Industry Crisis Report
            </motion.div>

            <h2 className="heading-primary mb-6" style={{ textAlign: 'center' }}>
              The Hidden Cost of{' '}
              <span style={{ 
                background: 'var(--gradient-cta)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Supply Chain Blindness
              </span>
            </h2>
            
            <p className="text-lead max-w-4xl mx-auto" style={{ 
              fontSize: 'var(--font-size-body-lg)', 
              lineHeight: 'var(--line-height-body-lg)', 
              color: 'var(--color-gray-600)', 
              maxWidth: '800px', 
              margin: '0 auto',
              textAlign: 'center'
            }}>
              Without complete traceability, herbal companies face contamination crises, compliance failures, 
              and supply chain disruptions that cost the industry billions annually. Here's the real impact:
            </p>
          </motion.div>

          {/* Interactive Crisis Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {problemStats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={problemInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="card card-interactive group"
                onMouseEnter={() => setActiveCard(stat.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="card-content text-center">
                  {/* Icon with gradient background */}
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto text-white shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stat.icon}
                  </motion.div>

                  {/* Animated Number */}
                  <motion.div 
                    className="text-4xl lg:text-5xl font-bold mb-3"
                    style={{
                      background: `linear-gradient(135deg, ${stat.gradient.split(' ')[1]}, ${stat.gradient.split(' ')[3]})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {stat.prefix}{stat.number}{stat.suffix}
                  </motion.div>

                  <h3 className="font-semibold text-gray-800 mb-2 leading-tight">
                    {stat.label}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4">
                    {stat.source}
                  </p>

                  {/* Progress Bar Animation */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <motion.div
                      className={`bg-gradient-to-r ${stat.gradient} h-2 rounded-full`}
                      initial={{ width: 0 }}
                      animate={problemInView ? { width: `${stat.animatedNumber}%` } : { width: 0 }}
                      transition={{ duration: 2, delay: index * 0.3 }}
                    />
                  </div>

                  {/* Interactive Pulse Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={activeCard === stat.id ? {
                      boxShadow: [`0 0 0 0 rgba(239, 68, 68, 0.4)`, `0 0 0 10px rgba(239, 68, 68, 0)`]
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Agitating Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={problemInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                The Pain Is Universal
              </h3>
              <p className="text-lg text-gray-600">
                Industry leaders share their struggles with broken supply chains
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="text-center"
              >
                <div className="bg-white rounded-xl p-8 shadow-lg mb-6">
                  <div className="flex justify-center mb-4">
                    {Array.from({ length: agitatingTestimonials[currentTestimonial].rating }).map((_, i) => (
                      <Star key={`star-${agitatingTestimonials[currentTestimonial].name}-${i}`} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-gray-700 mb-6 italic leading-relaxed">
                    "{agitatingTestimonials[currentTestimonial].quote}"
                  </blockquote>
                  <div className="border-t border-gray-200 pt-6">
                    <div className="font-semibold text-gray-900">{agitatingTestimonials[currentTestimonial].author}</div>
                    <div className="text-gray-600">{agitatingTestimonials[currentTestimonial].title}</div>
                    <div className="text-sm text-gray-500">{agitatingTestimonials[currentTestimonial].company}</div>
                    <div className="text-xs text-red-600 font-medium mt-2">{agitatingTestimonials[currentTestimonial].before}</div>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial Dots */}
              <div className="flex justify-center space-x-2">
                {agitatingTestimonials.map((testimonial, index) => (
                  <button
                    key={`testimonial-dot-${testimonial.company}-${index}`}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Client Logos - Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={problemInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <p className="text-gray-600 mb-8">
              Companies losing millions due to supply chain failures:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60">
              {clientLogos.map((client, index) => (
                <div key={`client-logo-${client.name}-${index}`} className="flex justify-center">
                  <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                    {client.name.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Revolutionary Solution Section */}
      <section id="solution" ref={solutionRef} className="section-xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
          />
        </div>

        <div className="container container-7xl relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={solutionInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CheckCircle className="h-4 w-4" />
              Revolutionary Technology
            </motion.div>

            <h2 className="heading-display mb-6">
              Finally, A Solution That{' '}
              <span className="text-gradient bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
                Actually Works
              </span>
            </h2>
            
            <p className="text-lead max-w-4xl mx-auto">
              TraceHerbss eliminates supply chain blind spots with complete end-to-end traceability. 
              Our cutting-edge technology transforms chaos into clarity.
            </p>
          </motion.div>

          {/* Advanced Solution Benefits Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {solutionBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                animate={solutionInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: [0.645, 0.045, 0.355, 1]
                }}
                className="card card-3d group relative"
                style={{ transformPerspective: '1000px' }}
                onMouseEnter={() => setActiveCard(benefit.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Card Background Gradient */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.bgGradient} rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500`}
                />
                
                <div className="card-content relative z-10 text-center">
                  {/* Floating Icon */}
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-r ${benefit.gradient} rounded-3xl flex items-center justify-center mb-8 mx-auto text-white shadow-xl`}
                    whileHover={{ 
                      scale: 1.1, 
                      rotateY: 15,
                      boxShadow: '0 25px 50px -12px rgba(34, 197, 94, 0.25)'
                    }}
                    transition={{ duration: 0.4 }}
                    animate={activeCard === benefit.id ? { y: [-2, 2, -2] } : {}}
                  >
                    {benefit.icon}
                  </motion.div>

                  {/* Main Content */}
                  <h3 className="heading-tertiary mb-4 text-gray-800">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-body text-gray-600 mb-6 leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Stats Badge */}
                  <motion.div
                    className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full text-sm font-semibold text-gray-700 mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    {benefit.stats}
                  </motion.div>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {benefit.features.map((feature, idx) => (
                      <motion.div
                        key={feature}
                        className="flex items-center justify-center gap-2 text-sm text-gray-600"
                        initial={{ opacity: 0, x: -20 }}
                        animate={solutionInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.2 + idx * 0.1 }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </motion.div>
                    ))}
                  </div>

                  {/* ROI Highlight */}
                  <motion.div
                    className={`bg-gradient-to-r ${benefit.gradient} text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {benefit.roi}
                  </motion.div>

                  {/* Benefit Arrow */}
                  <motion.div 
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={solutionInView ? { opacity: 1 } : {}}
                    transition={{ delay: index * 0.2 + 0.5 }}
                  >
                    <div className="text-green-600 font-semibold">
                      → {benefit.benefit}
                    </div>
                  </motion.div>
                </div>

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${benefit.gradient.split(' ')[1]}15, ${benefit.gradient.split(' ')[3]}15)`,
                    filter: 'blur(20px)',
                    transform: 'scale(1.1)'
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Embedded Video Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              See TraceHerbss In Action
            </h3>
            <div className="max-w-4xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative bg-gray-900 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setIsVideoPlaying(true)}
              >
                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-600">
                  <div className="text-center text-white">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Play className="h-8 w-8 ml-1" />
                    </motion.div>
                    <h4 className="text-xl font-semibold mb-2">Watch Our 60-Second Demo</h4>
                    <p className="text-green-100">See how we eliminate supply chain chaos</p>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                  1:30
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ultimate CTA Section */}
      <section 
        ref={ctaRef} 
        className="section-xl relative overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, #059669 0%, #10b981 25%, #34d399 50%, #6ee7b7 75%, #a7f3d0 100%),
            radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
          `
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/15 rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 25, 0],
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Floating Success Icons */}
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={`cta-success-${i}`}
              className="absolute opacity-20"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              <CheckCircle className="h-8 w-8 text-white" />
            </motion.div>
          ))}
        </div>
        
        <div className="container container-6xl relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            {/* Urgency Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-semibold mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-2 h-2 bg-yellow-400 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Limited Time: 50% Off Implementation
            </motion.div>

            <h2 className="heading-display mb-8">
              Stop Losing Money to{' '}
              <span className="block bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Supply Chain Failures
              </span>
            </h2>
            
            <p className="text-lead text-green-50 max-w-4xl mx-auto mb-12">
              Join 500+ herbal companies who eliminated recalls, 
              passed every audit, and restored customer trust with TraceHerbss. 
              Transform your supply chain today.
            </p>

            {/* Advanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <motion.button
                onClick={() => setShowJoinForm(true)}
                className="group relative w-full sm:w-auto bg-white text-green-600 px-12 py-5 rounded-2xl text-xl font-bold shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Button Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                
                <div className="relative flex items-center justify-center gap-3">
                  <Zap className="h-6 w-6 group-hover:text-yellow-500 transition-colors" />
                  Get Started Now - FREE
                </div>
                
                {/* Pulse Ring */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-white"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.button>
              
              <motion.a
                href="tel:+1-555-0123"
                className="w-full sm:w-auto border-2 border-white/50 text-white px-8 py-5 rounded-2xl text-lg font-semibold backdrop-blur-sm hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.8)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="h-5 w-5" />
                Call Now: (555) 123-4567
              </motion.a>
            </div>

            {/* Enhanced Trust Indicators */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-green-100"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">No Setup Fees</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">30-Day Money Back</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-yellow-400" />
                <span className="font-medium">48-Hour Implementation</span>
              </div>
            </motion.div>

            {/* Success Stories Ticker */}
            <motion.div
              className="mt-12 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center justify-center gap-4 text-sm text-green-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  <span>Live: 23 companies signed up today</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-white/30" />
                <div className="hidden sm:flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>500+ success stories</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Join Us Modal */}
      {showJoinForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowJoinForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Start Your Free Trial</h3>
                <p className="text-gray-600 mt-2">Join as a Laboratory Partner</p>
              </div>
              <button
                onClick={() => setShowJoinForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex justify-center">
              <div className="group border-2 border-gray-200 rounded-xl p-8 hover:border-green-300 transition-all duration-300 cursor-pointer max-w-md w-full">
                <Link
                  to="/signup?role=laboratory"
                  className="block"
                  onClick={() => setShowJoinForm(false)}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Database className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">Laboratory Partner</h4>
                    <p className="text-gray-600 mb-6">
                      Provide testing services and quality verification for herbal products
                    </p>
                    <div className="space-y-3 text-left">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        Quality testing integration
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        Digital certification system
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        Lab management tools
                      </div>
                    </div>
                    <div className="mt-8">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-semibold group-hover:shadow-lg transition-all duration-300">
                        Start Free Trial →
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-700 font-medium"
                  onClick={() => setShowJoinForm(false)}
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Video Modal */}
      {isVideoPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setIsVideoPlaying(false)}
        >
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">TraceHerbss Platform Demo</h3>
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Professional Demo Video</p>
                <p className="text-sm opacity-75 mt-2">60-90 seconds with captions</p>
                <p className="text-xs opacity-50 mt-4">[ Embedded video player would go here ]</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dark Mode Toggle */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="theme-toggle"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </motion.button>

      {/* Conversational AI Chatbot */}
      <div className="chatbot-container" ref={chatbotRef}>
        <AnimatePresence>
          {showChatbot && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="chatbot-window"
            >
              <div className="chatbot-header">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">TraceHerbss Assistant</h4>
                    <p className="text-xs text-green-600">● Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatbot(false)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="chatbot-messages space-y-4">
                {chatMessages.map((message, index) => (
                  <motion.div
                    key={`chat-message-${message.type}-${index}-${message.message.slice(0, 10)}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="chatbot-input">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Ask about our traceability solution..."
                    className="form-field text-sm"
                  />
                  <button
                    onClick={sendChatMessage}
                    className="btn-primary py-2 px-3"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['How does it work?', 'Pricing info', 'Schedule demo', 'ROI calculator'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setChatInput(suggestion);
                        sendChatMessage();
                      }}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowChatbot(!showChatbot)}
          className="chatbot-trigger"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="h-6 w-6" />
          {!showChatbot && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
            />
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default PASLandingPage;