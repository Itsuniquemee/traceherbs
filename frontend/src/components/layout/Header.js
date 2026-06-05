import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown,
  Leaf,
  Shield,
  Users,
  FileText,
  Phone,
  Info
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: <Leaf className="h-4 w-4" />
    },
    {
      name: 'Features',
      href: '/features',
      icon: <Shield className="h-4 w-4" />,
      dropdown: [
        { name: 'Complete Traceability', href: '/features#traceability', description: 'End-to-end supply chain visibility' },
        { name: 'Instant Compliance', href: '/features#compliance', description: 'Automated reporting and audit readiness' },
        { name: 'Real-Time Analytics', href: '/features#analytics', description: 'Live dashboards and insights' },
        { name: 'Integration Hub', href: '/features#integrations', description: 'Connect with existing systems' },
        { name: 'Mobile Access', href: '/features#mobile', description: 'Track on-the-go with mobile apps' },
        { name: 'Team Collaboration', href: '/features#collaboration', description: 'Multi-user workspace tools' }
      ]
    },
    {
      name: 'How It Works',
      href: '/how-it-works',
      icon: <Users className="h-4 w-4" />
    },
    {
      name: 'Pricing',
      href: '/pricing',
      icon: <FileText className="h-4 w-4" />
    },
    {
      name: 'Resources',
      href: '/resources',
      icon: <FileText className="h-4 w-4" />,
      dropdown: [
        { name: 'Blog', href: '/resources/blog', description: 'Latest industry insights' },
        { name: 'Case Studies', href: '/resources/case-studies', description: 'Success stories from clients' },
        { name: 'Whitepapers', href: '/resources/whitepapers', description: 'In-depth industry reports' },
        { name: 'Webinars', href: '/resources/webinars', description: 'Educational events and recordings' },
        { name: 'Documentation', href: '/resources/docs', description: 'Technical guides and API docs' }
      ]
    },
    {
      name: 'About',
      href: '/about',
      icon: <Info className="h-4 w-4" />
    },
    {
      name: 'Contact',
      href: '/contact',
      icon: <Phone className="h-4 w-4" />
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full opacity-75 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                HerbalTrace
              </span>
              <span className="text-xs text-gray-500 -mt-1">Supply Chain Intelligence</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item, index) => (
              <div 
                key={item.name} 
                className="relative group"
                onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
                onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                  onClick={() => !item.dropdown && setActiveDropdown(null)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {item.dropdown && (
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === index ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="p-2">
                          {item.dropdown.map((dropdownItem, dropIndex) => (
                            <Link
                              key={dropIndex}
                              to={dropdownItem.href}
                              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                            >
                              <div className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors">
                                {dropdownItem.name}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {dropdownItem.description}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-medium rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-white border-t border-gray-100 mt-2 rounded-b-xl shadow-lg"
            >
              <div className="p-4 space-y-2">
                {navigation.map((item, index) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between">
                      <Link
                        to={item.href}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex-1 ${
                          isActive(item.href)
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                      {item.dropdown && (
                        <button
                          onClick={() => handleDropdownToggle(index)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <ChevronDown 
                            className={`h-4 w-4 transition-transform duration-200 ${
                              activeDropdown === index ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                      )}
                    </div>
                    
                    {/* Mobile Dropdown */}
                    {item.dropdown && activeDropdown === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 mt-2 space-y-2"
                      >
                        {item.dropdown.map((dropdownItem, dropIndex) => (
                          <Link
                            key={dropIndex}
                            to={dropdownItem.href}
                            className="block p-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors duration-200"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
                
                {/* Mobile CTA Buttons */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2 text-center text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-lg transition-all duration-200"
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;