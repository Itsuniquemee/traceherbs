import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  CheckCircle,
  Play,
  Zap,
  Eye,
  Link as LinkIcon,
  Activity,
  FileText,
  Shield,
  Award,
  Globe,
  Smartphone,
  Database,
  Lock,
  Clock,
  Users,
  BarChart3,
  Settings,
  Bell
} from 'lucide-react';
import MarketingLayout from '../../components/layout/MarketingLayout';

const HowItWorksPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'connect',
      number: '01',
      title: 'Connect Your Supply Chain',
      subtitle: 'Seamless integration with existing systems',
      description: 'Connect HerbalTrace to your existing ERP, warehouse management, and quality systems through our robust API or pre-built integrations. No disruption to your current operations.',
      features: [
        'API-first architecture for easy integration',
        'Pre-built connectors for major ERP systems',
        'Real-time data synchronization',
        'Bulk data import tools',
        'Custom integration support',
        'Zero-downtime implementation'
      ],
      integrationMethods: [
        {
          title: 'API Integration',
          description: 'RESTful APIs for real-time data exchange',
          icon: <LinkIcon className="h-6 w-6" />
        },
        {
          title: 'File Import',
          description: 'CSV, Excel, and XML batch imports',
          icon: <FileText className="h-6 w-6" />
        },
        {
          title: 'Direct Connectors',
          description: 'Pre-built integrations for popular systems',
          icon: <Settings className="h-6 w-6" />
        }
      ],
      timeline: '1-2 weeks',
      image: '/api/placeholder/600/400'
    },
    {
      id: 'track',
      number: '02',
      title: 'Track Every Batch',
      subtitle: 'Real-time monitoring and documentation',
      description: 'Track every batch from farm to pharmacy with blockchain-powered transparency. Capture all critical data points, quality metrics, and chain of custody information automatically.',
      features: [
        'Blockchain-secured batch tracking',
        'Automatic data capture from IoT devices',
        'QR code generation and scanning',
        'Real-time location tracking',
        'Quality parameter monitoring',
        'Chain of custody documentation'
      ],
      trackingPoints: [
        {
          title: 'Farm Origins',
          description: 'Growing conditions, harvest data, certifications',
          icon: <Globe className="h-6 w-6" />
        },
        {
          title: 'Processing Steps',
          description: 'Manufacturing processes, quality tests, ingredients',
          icon: <Activity className="h-6 w-6" />
        },
        {
          title: 'Distribution',
          description: 'Shipping, storage conditions, delivery tracking',
          icon: <BarChart3 className="h-6 w-6" />
        }
      ],
      timeline: 'Real-time',
      image: '/api/placeholder/600/400'
    },
    {
      id: 'report',
      number: '03',
      title: 'Generate Reports',
      subtitle: 'Automated compliance and analytics',
      description: 'Automatically generate comprehensive reports for regulatory compliance, quality assurance, and business intelligence. Never miss an audit requirement again.',
      features: [
        'Automated regulatory reporting',
        'Custom report templates',
        'Real-time compliance monitoring',
        'Audit trail generation',
        'Performance analytics',
        'Predictive quality insights'
      ],
      reportTypes: [
        {
          title: 'Compliance Reports',
          description: 'FDA, USDA, and international regulatory reports',
          icon: <Shield className="h-6 w-6" />
        },
        {
          title: 'Quality Analytics',
          description: 'Quality trends, batch analysis, and predictions',
          icon: <Award className="h-6 w-6" />
        },
        {
          title: 'Supply Chain Insights',
          description: 'Performance metrics and optimization opportunities',
          icon: <BarChart3 className="h-6 w-6" />
        }
      ],
      timeline: 'Instant',
      image: '/api/placeholder/600/400'
    }
  ];

  const architecture = {
    layers: [
      {
        title: 'Data Collection Layer',
        description: 'IoT sensors, mobile apps, and API integrations collect data from all supply chain touchpoints',
        technologies: ['IoT Sensors', 'Mobile Apps', 'API Gateways', 'Edge Computing'],
        icon: <Database className="h-8 w-8" />
      },
      {
        title: 'Blockchain Layer',
        description: 'Immutable ledger ensures data integrity and creates permanent audit trails',
        technologies: ['Ethereum', 'Smart Contracts', 'Consensus Algorithms', 'Digital Signatures'],
        icon: <Lock className="h-8 w-8" />
      },
      {
        title: 'Analytics Layer',
        description: 'AI and machine learning provide predictive insights and automated decision making',
        technologies: ['Machine Learning', 'Predictive Analytics', 'Real-time Processing', 'Data Mining'],
        icon: <BarChart3 className="h-8 w-8" />
      },
      {
        title: 'Application Layer',
        description: 'User-friendly interfaces and APIs provide access to all platform capabilities',
        technologies: ['Web Dashboard', 'Mobile Apps', 'REST APIs', 'Webhooks'],
        icon: <Smartphone className="h-8 w-8" />
      }
    ]
  };

  const integrationPartners = [
    { name: 'SAP', category: 'ERP', logo: '/api/placeholder/120/60' },
    { name: 'Oracle', category: 'ERP', logo: '/api/placeholder/120/60' },
    { name: 'Microsoft Dynamics', category: 'ERP', logo: '/api/placeholder/120/60' },
    { name: 'Salesforce', category: 'CRM', logo: '/api/placeholder/120/60' },
    { name: 'Shopify', category: 'E-commerce', logo: '/api/placeholder/120/60' },
    { name: 'WooCommerce', category: 'E-commerce', logo: '/api/placeholder/120/60' },
    { name: 'NetSuite', category: 'ERP', logo: '/api/placeholder/120/60' },
    { name: 'QuickBooks', category: 'Accounting', logo: '/api/placeholder/120/60' }
  ];

  const securityFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'End-to-End Encryption',
      description: 'AES-256 encryption for data in transit and at rest'
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Blockchain Security',
      description: 'Immutable ledger with cryptographic verification'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Compliance Certified',
      description: 'SOC 2 Type II, ISO 27001, GDPR compliant'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Access Controls',
      description: 'Role-based permissions and multi-factor authentication'
    }
  ];

  return (
    <MarketingLayout 
      title="How It Works - 3-Step Supply Chain Transformation | HerbalTrace"
      description="Learn how HerbalTrace transforms herbal supply chains in 3 simple steps: Connect your systems, Track every batch, Generate automated reports for complete traceability."
      keywords="how herbal traceability works, supply chain integration, blockchain tracking process, automated compliance reporting"
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
                Transform Your Supply Chain in
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                  {" "}3 Simple Steps
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                See exactly how HerbalTrace connects your existing systems, 
                tracks every batch, and generates automated compliance reports.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/demo"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <Play className="h-5 w-5" />
                  Watch Demo
                </Link>
                <Link
                  to="/pricing"
                  className="px-8 py-4 bg-white text-emerald-600 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-emerald-600 hover:bg-emerald-50 flex items-center justify-center gap-2"
                >
                  <Zap className="h-5 w-5" />
                  Start Free Trial
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Steps Navigation */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-center gap-4 lg:gap-8">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left ${
                  activeStep === index
                    ? 'bg-emerald-100 shadow-lg'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  activeStep === index
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.number}
                </div>
                <div>
                  <div className={`font-semibold ${
                    activeStep === index ? 'text-emerald-700' : 'text-gray-700'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500">{step.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Step Detail */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Step Content */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl">
                  {steps[activeStep].number}
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {steps[activeStep].title}
                  </h2>
                  <p className="text-xl text-emerald-600 font-medium">
                    {steps[activeStep].subtitle}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Implementation: {steps[activeStep].timeline}</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {steps[activeStep].description}
              </p>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {steps[activeStep].features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-specific Content */}
              <div className="space-y-4">
                {steps[activeStep].integrationMethods && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900">Integration Methods</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {steps[activeStep].integrationMethods.map((method, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-emerald-600">{method.icon}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{method.title}</h4>
                            <p className="text-gray-600">{method.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {steps[activeStep].trackingPoints && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900">Tracking Points</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {steps[activeStep].trackingPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-emerald-600">{point.icon}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{point.title}</h4>
                            <p className="text-gray-600">{point.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {steps[activeStep].reportTypes && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900">Report Types</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {steps[activeStep].reportTypes.map((report, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-emerald-600">{report.icon}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{report.title}</h4>
                            <p className="text-gray-600">{report.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Step Visualization */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src={steps[activeStep].image}
                  alt={steps[activeStep].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Step {steps[activeStep].number}: {steps[activeStep].title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {steps[activeStep].subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Arrows */}
          <div className="flex justify-between items-center mt-12">
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <ArrowRight className="h-5 w-5 rotate-180" />
              Previous Step
            </button>

            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    activeStep === index ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
              disabled={activeStep === steps.length - 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeStep === steps.length - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              Next Step
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Enterprise-Grade Architecture
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on modern, scalable infrastructure with enterprise security 
              and compliance at every layer.
            </p>
          </div>

          <div className="space-y-8">
            {architecture.layers.map((layer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-emerald-600">{layer.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900">{layer.title}</h3>
                  </div>
                  <p className="text-lg text-gray-600 mb-6">{layer.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {layer.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="aspect-video bg-gradient-to-br from-emerald-200 to-blue-200 rounded-xl shadow-lg flex items-center justify-center">
                    <div className="text-6xl text-emerald-600/30">{layer.icon}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Blockchain */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Blockchain-Powered Security
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Every transaction is cryptographically secured and permanently recorded 
                on the blockchain, creating an immutable audit trail that ensures 
                complete data integrity and transparency.
              </p>

              <div className="space-y-6">
                {securityFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl shadow-2xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <Lock className="h-24 w-24 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Blockchain Secured
                  </h3>
                  <p className="text-gray-600">
                    Immutable ledger with cryptographic verification
                  </p>
                </div>
              </div>
              
              {/* Floating security badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="text-center">
                  <Award className="h-8 w-8 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-semibold text-gray-900">SOC 2</div>
                  <div className="text-xs text-gray-600">Type II</div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-emerald-600 mx-auto mb-1" />
                  <div className="text-sm font-semibold text-gray-900">ISO 27001</div>
                  <div className="text-xs text-gray-600">Certified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Trusted Integration Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pre-built connectors and partnerships with leading platforms 
              ensure seamless integration with your existing systems.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {integrationPartners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group text-center"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-12 mx-auto mb-3 opacity-60 group-hover:opacity-100 transition-opacity"
                />
                <h3 className="font-semibold text-gray-900 mb-1">{partner.name}</h3>
                <p className="text-sm text-gray-500">{partner.category}</p>
              </motion.div>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              See how easy it is to transform your supply chain with complete traceability.
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
                <Play className="h-5 w-5" />
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
                <span>1-2 Week Implementation</span>
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

export default HowItWorksPage;