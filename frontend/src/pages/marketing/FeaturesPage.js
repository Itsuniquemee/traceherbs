import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield,
  FileCheck,
  BarChart3,
  Smartphone,
  Users,
  Puzzle,
  CheckCircle,
  ArrowRight,
  Zap,
  Clock,
  Globe,
  Lock,
  Target,
  Award,
  Leaf,
  Workflow,
  Eye,
  Bell,
  Download,
  Share2,
  Settings,
  Database
} from 'lucide-react';
import MarketingLayout from '../../components/layout/MarketingLayout';

const FeaturesPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const mainFeatures = [
    {
      id: 'traceability',
      icon: <Workflow className="h-12 w-12" />,
      title: 'Complete Traceability',
      subtitle: 'End-to-end visibility from farm to pharmacy',
      description: 'Track every batch through the entire supply chain with blockchain-powered transparency. Know exactly where your herbs come from, how they\'re processed, and where they go.',
      benefits: [
        'Blockchain-secured batch tracking',
        'Real-time location updates',
        'Complete ingredient provenance',
        'Instant contamination source identification',
        'Automated chain of custody documentation',
        'QR code consumer verification'
      ],
      useCases: [
        {
          title: 'Contamination Response',
          description: 'Identify the exact source of contamination within minutes, not weeks'
        },
        {
          title: 'Quality Assurance',
          description: 'Verify organic certifications and growing conditions for every batch'
        },
        {
          title: 'Consumer Trust',
          description: 'Let customers scan QR codes to see the complete journey of their products'
        }
      ],
      image: '/api/placeholder/600/400',
      testimonial: {
        quote: 'HerbalTrace helped us trace a contaminated batch to its source in under 2 hours. Before, this would have taken us 2 weeks.',
        author: 'Sarah Chen',
        title: 'Quality Director',
        company: 'GreenLeaf Pharmaceuticals'
      }
    },
    {
      id: 'compliance',
      icon: <FileCheck className="h-12 w-12" />,
      title: 'Instant Compliance',
      subtitle: 'Automated reporting and audit readiness',
      description: 'Never fail another audit. Our platform automatically generates all required documentation and maintains audit trails for regulatory compliance across all jurisdictions.',
      benefits: [
        'Automated regulatory reporting',
        'Real-time audit trail generation',
        'Multi-jurisdiction compliance support',
        'Digital certificate management',
        'Automated compliance monitoring',
        'Instant report generation'
      ],
      useCases: [
        {
          title: 'FDA Inspections',
          description: 'Generate complete audit packages instantly for regulatory inspections'
        },
        {
          title: 'Organic Certifications',
          description: 'Maintain digital trails for USDA Organic and other certification requirements'
        },
        {
          title: 'International Trade',
          description: 'Automatically generate export documentation for international markets'
        }
      ],
      image: '/api/placeholder/600/400',
      testimonial: {
        quote: 'Our audit preparation time went from 3 weeks to 3 hours. The compliance automation is a game-changer.',
        author: 'Michael Rodriguez',
        title: 'Operations Manager',
        company: 'NaturalMed Corp'
      }
    },
    {
      id: 'analytics',
      icon: <BarChart3 className="h-12 w-12" />,
      title: 'Real-Time Analytics',
      subtitle: 'Live dashboards with actionable insights',
      description: 'Make data-driven decisions with real-time analytics, predictive insights, and customizable dashboards that give you complete visibility into your operations.',
      benefits: [
        'Real-time supply chain monitoring',
        'Predictive quality analytics',
        'Custom dashboard creation',
        'Automated alert systems',
        'Performance benchmarking',
        'Trend analysis and forecasting'
      ],
      useCases: [
        {
          title: 'Quality Predictions',
          description: 'Use AI to predict quality issues before they occur'
        },
        {
          title: 'Supply Chain Optimization',
          description: 'Identify bottlenecks and optimize routes for maximum efficiency'
        },
        {
          title: 'Performance Tracking',
          description: 'Monitor KPIs and track performance against industry benchmarks'
        }
      ],
      image: '/api/placeholder/600/400',
      testimonial: {
        quote: 'The predictive analytics helped us prevent 3 major quality issues last quarter. It\'s like having a crystal ball.',
        author: 'Dr. Priya Patel',
        title: 'Chief Quality Officer',
        company: 'HerbTech Industries'
      }
    },
    {
      id: 'integrations',
      icon: <Puzzle className="h-12 w-12" />,
      title: 'Integration Capabilities',
      subtitle: 'Connect with your existing systems seamlessly',
      description: 'Integrate HerbalTrace with your existing ERP, WMS, and quality management systems through our robust API and pre-built connectors.',
      benefits: [
        'RESTful API integration',
        'Pre-built ERP connectors',
        'Real-time data synchronization',
        'Custom integration support',
        'Webhook notifications',
        'Data export capabilities'
      ],
      useCases: [
        {
          title: 'ERP Integration',
          description: 'Sync with SAP, Oracle, or other ERP systems for unified data management'
        },
        {
          title: 'Quality Systems',
          description: 'Connect with LIMS and quality management platforms'
        },
        {
          title: 'E-commerce Platforms',
          description: 'Integrate with Shopify, WooCommerce, and other sales channels'
        }
      ],
      image: '/api/placeholder/600/400',
      testimonial: {
        quote: 'The seamless integration with our existing systems made implementation painless. No disruption to our operations.',
        author: 'James Wilson',
        title: 'IT Director',
        company: 'OrganicTrace Ltd'
      }
    },
    {
      id: 'mobile',
      icon: <Smartphone className="h-12 w-12" />,
      title: 'Mobile App Access',
      subtitle: 'Track and manage on-the-go',
      description: 'Native mobile apps for iOS and Android allow your team to track batches, scan QR codes, and access critical information from anywhere.',
      benefits: [
        'Native iOS and Android apps',
        'Offline capability',
        'QR code scanning',
        'Photo documentation',
        'GPS location tracking',
        'Push notifications'
      ],
      useCases: [
        {
          title: 'Field Operations',
          description: 'Farmers and field workers can log activities directly from mobile devices'
        },
        {
          title: 'Warehouse Management',
          description: 'Scan and track inventory movements in real-time'
        },
        {
          title: 'Consumer Engagement',
          description: 'Consumers can verify product authenticity by scanning QR codes'
        }
      ],
      image: '/api/placeholder/600/400',
      testimonial: {
        quote: 'Our field teams love the mobile app. They can now log activities instantly without paperwork.',
        author: 'Maria Santos',
        title: 'Field Operations Manager',
        company: 'PureHerb International'
      }
    },
    {
      id: 'collaboration',
      icon: <Users className="h-12 w-12" />,
      title: 'Team Collaboration Tools',
      subtitle: 'Multi-user workspace with role-based access',
      description: 'Collaborate effectively with role-based permissions, real-time notifications, and shared workspaces that keep your entire team aligned.',
      benefits: [
        'Role-based access control',
        'Real-time collaboration',
        'Activity notifications',
        'Shared workspaces',
        'Comment and annotation system',
        'Audit trail for all actions'
      ],
      useCases: [
        {
          title: 'Cross-Department Collaboration',
          description: 'Quality, operations, and compliance teams work together seamlessly'
        },
        {
          title: 'Supplier Coordination',
          description: 'Give suppliers controlled access to update their batch information'
        },
        {
          title: 'Customer Transparency',
          description: 'Share relevant information with customers through controlled access'
        }
      ],
      image: '/api/placeholder/600/400',
      testimonial: {
        quote: 'The collaboration tools eliminated the silos between our departments. Everyone is now on the same page.',
        author: 'Robert Kim',
        title: 'VP of Operations',
        company: 'BotanicalSupply Co'
      }
    }
  ];

  const additionalFeatures = [
    {
      icon: <Lock className="h-8 w-8" />,
      title: 'Enterprise Security',
      description: 'Bank-level security with encryption, secure access controls, and compliance certifications'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Global Scale',
      description: 'Multi-language support and global compliance frameworks for international operations'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: '24/7 Monitoring',
      description: 'Continuous system monitoring with 99.9% uptime SLA and proactive support'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Certified Platform',
      description: 'SOC 2 Type II, ISO 27001, and GDPR compliant with regular security audits'
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: 'Data Ownership',
      description: 'You own your data with flexible export options and no vendor lock-in'
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: 'Custom Workflows',
      description: 'Configure the platform to match your specific processes and requirements'
    }
  ];

  return (
    <MarketingLayout 
      title="Features - Complete Herbal Supply Chain Traceability | HerbalTrace"
      description="Explore HerbalTrace's comprehensive features: blockchain traceability, automated compliance, real-time analytics, mobile access, integrations, and team collaboration tools."
      keywords="herbal traceability features, blockchain tracking, compliance automation, supply chain analytics, mobile tracking app, ERP integration"
    >
      {/* Hero Section */}
      <section className="relative py-20 pt-32 bg-gradient-to-br from-emerald-50 to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Complete Supply Chain
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                  {" "}Visibility
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Every feature you need to transform your herbal supply chain with 
                complete traceability, automated compliance, and real-time insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/pricing"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <Zap className="h-5 w-5" />
                  Start Free Trial
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-8 py-4 bg-white text-emerald-600 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-emerald-600 hover:bg-emerald-50 flex items-center justify-center gap-2"
                >
                  <Eye className="h-5 w-5" />
                  See How It Works
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Navigation */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {mainFeatures.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(index)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeFeature === index
                    ? 'bg-emerald-100 text-emerald-700 shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className={`${activeFeature === index ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {React.cloneElement(feature.icon, { className: 'h-5 w-5' })}
                </div>
                {feature.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Feature Detail */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Feature Content */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-emerald-600">
                  {mainFeatures[activeFeature].icon}
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {mainFeatures[activeFeature].title}
                  </h2>
                  <p className="text-xl text-emerald-600 font-medium">
                    {mainFeatures[activeFeature].subtitle}
                  </p>
                </div>
              </div>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {mainFeatures[activeFeature].description}
              </p>

              {/* Benefits List */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mainFeatures[activeFeature].benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Use Cases</h3>
                <div className="space-y-4">
                  {mainFeatures[activeFeature].useCases.map((useCase, index) => (
                    <div key={index} className="border-l-4 border-emerald-500 pl-4">
                      <h4 className="font-semibold text-gray-900">{useCase.title}</h4>
                      <p className="text-gray-600">{useCase.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-gray-50 rounded-xl p-6">
                <blockquote className="text-gray-700 italic mb-4">
                  "{mainFeatures[activeFeature].testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-semibold">
                      {mainFeatures[activeFeature].testimonial.author[0]}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {mainFeatures[activeFeature].testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {mainFeatures[activeFeature].testimonial.title}
                    </div>
                    <div className="text-sm text-emerald-600">
                      {mainFeatures[activeFeature].testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Image/Demo */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src={mainFeatures[activeFeature].image}
                  alt={mainFeatures[activeFeature].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {mainFeatures[activeFeature].title} Dashboard
                    </h4>
                    <p className="text-sm text-gray-600">
                      Real-time view of your {mainFeatures[activeFeature].title.toLowerCase()} operations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Built for Enterprise Scale
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Additional capabilities that ensure HerbalTrace scales with your business 
              and meets the highest standards for security and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Seamless Integrations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect HerbalTrace with your existing systems through our robust API 
              and pre-built integrations with leading platforms.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[
              'SAP', 'Oracle', 'Salesforce', 'Shopify', 'WooCommerce', 'NetSuite',
              'QuickBooks', 'Slack', 'Microsoft Teams', 'Zapier', 'AWS', 'Azure'
            ].map((integration, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-xl p-6 flex items-center justify-center h-20 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <span className="font-semibold text-gray-700">{integration}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/integrations"
              className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
            >
              View All Integrations
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Supply Chain?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              See how these features work together to create complete supply chain transparency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-emerald-600 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Zap className="h-5 w-5" />
                Start Free Trial
              </Link>
              <Link
                to="/demo"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Eye className="h-5 w-5" />
                Schedule Demo
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>30-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>No Setup Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default FeaturesPage;