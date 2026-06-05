import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle,
  Play,
  CheckCircle,
  X,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Star,
  Award,
  Clock,
  BarChart3,
  Globe,
  Smartphone,
  FileCheck,
  Target,
  ChevronRight
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import MarketingLayout from '../../components/layout/MarketingLayout';

const HomePage = () => {
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(true);
  
  const heroRef = useRef(null);

  // Animation refs for scroll-triggered animations
  const [problemRef, problemInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [solutionRef, solutionInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.2, triggerOnce: true });

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Complete Traceability",
      description: "Track every batch from farm to pharmacy with blockchain-powered transparency",
      link: "/features#traceability"
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: "Instant Compliance",
      description: "Automated reporting and audit-ready documentation for regulatory compliance",
      link: "/features#compliance"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Real-Time Analytics",
      description: "Live dashboards with insights, alerts, and predictive analytics",
      link: "/features#analytics"
    }
  ];

  const stats = [
    { number: "500+", label: "Companies Trust Us", icon: Users },
    { number: "98.5%", label: "Traceability Achieved", icon: Target },
    { number: "60%", label: "Compliance Cost Reduction", icon: TrendingUp },
    { number: "24/7", label: "Real-Time Monitoring", icon: Clock }
  ];

  const testimonials = [
    {
      quote: "HerbalTrace transformed our supply chain visibility. We can now track every batch in real-time and respond to issues before they become problems.",
      author: "Sarah Chen",
      title: "Quality Director",
      company: "GreenLeaf Pharmaceuticals",
      avatar: "/api/placeholder/60/60",
      rating: 5
    },
    {
      quote: "The compliance automation alone saved us 60% on audit costs. The ROI was immediate and the peace of mind is invaluable.",
      author: "Michael Rodriguez",
      title: "Operations Manager",
      company: "NaturalMed Corp",
      avatar: "/api/placeholder/60/60",
      rating: 5
    },
    {
      quote: "Finally, a solution that understands the herbal industry. The blockchain integration gives our customers complete confidence in our products.",
      author: "Dr. Priya Patel",
      title: "Compliance Officer",
      company: "HerbTech Industries",
      avatar: "/api/placeholder/60/60",
      rating: 5
    }
  ];

  return (
    <MarketingLayout 
      title="HerbalTrace - Transform Your Herbal Supply Chain"
      description="End-to-end herbal supply chain traceability platform. Track every batch from farm to pharmacy with blockchain-powered transparency, ensuring quality and compliance."
      keywords="herbal traceability, supply chain transparency, blockchain tracking, compliance automation, batch tracking, quality control"
    >
      {/* Crisis Alert Banner */}
      <AnimatePresence>
        {showCrisisAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative bg-red-50 border-l-4 border-red-400 p-4"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <p className="text-sm font-medium text-red-800">
                      Supply Chain Crisis Alert: $2.8B lost annually due to contamination and traceability gaps
                    </p>
                    <Link 
                      to="/resources/crisis-report"
                      className="text-sm text-red-600 hover:text-red-500 font-medium underline"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
                <button
                  onClick={() => setShowCrisisAlert(false)}
                  className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden pt-20"
        style={{
          background: `
            linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%),
            radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
          `
        }}
      >
        {/* Background Elements */}
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
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center min-h-[calc(100vh-8rem)]">
            
            {/* Left Column - Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl"
              >
                {/* Pre-headline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
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
                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Zap className="h-5 w-5" />
                    Start Free Trial
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    onClick={() => setIsVideoPlaying(true)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-600 flex items-center justify-center gap-2"
                  >
                    <Play className="h-5 w-5" />
                    View Live Demo
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

            {/* Right Column - Dashboard Mockup */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* Dashboard Preview Component */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
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

                  {/* Supply Chain Visualization */}
                  <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-700">Live Tracking</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Live</span>
                    </div>
                    
                    <div className="relative h-32 bg-white rounded-lg border border-emerald-200 p-3">
                      <div className="flex items-center justify-between h-full">
                        <div className="text-center">
                          <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center animate-pulse">
                            <span className="text-white text-xs">🌱</span>
                          </div>
                          <span className="text-xs text-gray-600">Farm</span>
                        </div>
                        
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-green-300 to-blue-300 mx-2 relative">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <span className="text-white text-xs">📦</span>
                          </div>
                          <span className="text-xs text-gray-600">Retail</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Batch Tracking */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-700">Recent Batches</h3>
                      <Link to="/features" className="text-xs text-blue-600 hover:underline">View All</Link>
                    </div>
                    
                    {[
                      { id: "HB001", product: "Turmeric Powder", progress: 75 },
                      { id: "HB002", product: "Ginger Extract", progress: 45 },
                      { id: "HB003", product: "Ashwagandha", progress: 100 }
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
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating Stats */}
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
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section ref={problemRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={problemInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              The <span className="text-red-600">$2.8 Billion</span> Problem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every year, the herbal industry loses billions due to contamination, 
              recalls, and compliance failures. The root cause? Invisible supply chains.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
                title: "Contamination Crises",
                stat: "73% Risk",
                description: "Most herbal products can't trace their origin, leading to contamination that affects millions of consumers."
              },
              {
                icon: <FileCheck className="h-12 w-12 text-orange-500" />,
                title: "Compliance Failures", 
                stat: "$1.2B Lost",
                description: "Manual documentation and paper trails fail audits, resulting in massive fines and lost business."
              },
              {
                icon: <Clock className="h-12 w-12 text-red-500" />,
                title: "Recall Nightmares",
                stat: "14 Days",
                description: "Average time to trace a contaminated batch - by then, it's too late to prevent widespread damage."
              }
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={problemInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center"
              >
                <div className="mb-4">{problem.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{problem.title}</h3>
                <div className="text-2xl font-bold text-red-600 mb-4">{problem.stat}</div>
                <p className="text-gray-600">{problem.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Overview Section */}
      <section ref={solutionRef} className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              The Complete <span className="text-emerald-600">Traceability Solution</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your herbal supply chain with end-to-end visibility, 
              automated compliance, and real-time insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={solutionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                >
                  Learn More
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Link
              to="/features"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Explore All Features
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Proven Results Across the Industry
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Join hundreds of companies already transforming their supply chains
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <stat.icon className="h-8 w-8 text-white mx-auto mb-4" />
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-emerald-100 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            See HerbalTrace in Action
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Watch how leading herbal companies are achieving complete supply chain transparency
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative max-w-4xl mx-auto cursor-pointer group"
            onClick={() => setIsVideoPlaying(true)}
          >
            <div className="aspect-video bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-black/20"></div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center z-10 shadow-lg"
              >
                <Play className="h-8 w-8 text-emerald-600 ml-1" />
              </motion.div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-lg font-semibold">3-Minute Product Demo</div>
                <div className="text-emerald-200">See complete traceability in action</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See why leading herbal companies choose HerbalTrace for their supply chain transformation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.title}</div>
                    <div className="text-sm text-emerald-600">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Supply Chain?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Join 500+ companies already using HerbalTrace to achieve complete transparency, 
              reduce compliance costs, and build consumer trust.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/signup"
                className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-3"
              >
                <Zap className="h-6 w-6" />
                Start Free Trial
                <span className="bg-emerald-800 text-emerald-100 px-2 py-1 rounded-full text-sm ml-2">
                  30 Days Free
                </span>
              </Link>
              
              <Link
                to="/contact"
                className="px-10 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center gap-3"
              >
                <Users className="h-6 w-6" />
                Talk to Sales
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Free 30-Day Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>No Setup Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="relative max-w-4xl w-full aspect-video bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Form Modal */}
      <AnimatePresence>
        {showJoinForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowJoinForm(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Your Free Trial</h3>
                <p className="text-gray-600">Get complete access for 30 days, no credit card required.</p>
              </div>
              
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Business Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free Trial
                </button>
              </form>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MarketingLayout>
  );
};

export default HomePage;