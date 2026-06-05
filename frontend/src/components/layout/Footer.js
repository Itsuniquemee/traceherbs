import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Leaf,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Shield,
  Award,
  Clock,
  Users,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Security', href: '/security' },
        { name: 'Integrations', href: '/features#integrations' },
        { name: 'API Documentation', href: '/resources/docs' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '/resources/blog' },
        { name: 'Case Studies', href: '/resources/case-studies' },
        { name: 'Whitepapers', href: '/resources/whitepapers' },
        { name: 'Webinars', href: '/resources/webinars' },
        { name: 'Help Center', href: '/support' },
        { name: 'Community', href: '/community' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press Kit', href: '/press' },
        { name: 'Partners', href: '/partners' },
        { name: 'Contact', href: '/contact' },
        { name: 'Success Stories', href: '/success-stories' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/support' },
        { name: 'Contact Support', href: '/contact?type=support' },
        { name: 'System Status', href: '/status', external: true },
        { name: 'Report Issue', href: '/report-issue' },
        { name: 'Feature Requests', href: '/feedback' },
        { name: 'Training', href: '/training' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/herbaltrace', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/herbaltrace', icon: Linkedin },
    { name: 'GitHub', href: 'https://github.com/herbaltrace', icon: Github },
    { name: 'YouTube', href: 'https://youtube.com/herbaltrace', icon: Youtube }
  ];

  const certifications = [
    { name: 'SOC 2 Type II', icon: Shield, description: 'Security & Privacy Certified' },
    { name: 'ISO 27001', icon: Award, description: 'Information Security Certified' },
    { name: 'GDPR Compliant', icon: Users, description: 'Data Protection Compliant' },
    { name: '99.9% Uptime', icon: Clock, description: 'Enterprise SLA Guaranteed' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Security Policy', href: '/security' },
    { name: 'Compliance', href: '/compliance' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300">
                  <Leaf className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full opacity-75" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">HerbalTrace</span>
                <span className="text-sm text-gray-400">Supply Chain Intelligence</span>
              </div>
            </Link>

            <p className="text-gray-400 mb-6 leading-relaxed">
              Transforming herbal supply chains with blockchain-powered transparency. 
              From farm to pharmacy, ensure quality, compliance, and trust in every batch.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span>support@herbaltrace.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          to={link.href}
                          className="text-gray-400 hover:text-emerald-400 transition-colors duration-200 flex items-center group text-sm"
                          {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        >
                          <span>{link.name}</span>
                          {link.external && (
                            <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup Section */}
        <div className="bg-gradient-to-r from-emerald-600/10 to-blue-600/10 rounded-2xl p-8 mb-12 border border-emerald-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Stay Updated with Industry Insights
              </h3>
              <p className="text-gray-400">
                Get the latest trends, case studies, and best practices in herbal supply chain management.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center space-x-2 whitespace-nowrap">
                <span>Subscribe</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Certifications & Trust Badges */}
        <div className="border-t border-gray-800 pt-12 mb-12">
          <h3 className="text-lg font-semibold text-white mb-6 text-center">
            Trusted by Industry Leaders
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <motion.div
                key={cert.name}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center group hover:border-emerald-500/50 transition-all duration-200"
              >
                <cert.icon className="h-8 w-8 text-emerald-400 mx-auto mb-2 group-hover:text-emerald-300 transition-colors" />
                <div className="text-sm font-semibold text-white mb-1">{cert.name}</div>
                <div className="text-xs text-gray-400">{cert.description}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social Links & Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-400">Follow us:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center space-x-6">
              {legalLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-gray-600">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} HerbalTrace. All rights reserved. Built with ❤️ for the herbal industry.
            </p>
            <p className="text-sm text-gray-500">
              Powered by blockchain technology and industry expertise.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;