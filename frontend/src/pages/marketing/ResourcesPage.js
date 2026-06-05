import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  FileText,
  Video,
  Users,
  Award,
  Shield,
  TrendingUp,
  Globe,
  Lightbulb,
  Target,
  CheckCircle,
  ExternalLink,
  Tag,
  Eye,
  ThumbsUp,
  MessageCircle,
  Star
} from 'lucide-react';
import MarketingLayout from '../../components/layout/MarketingLayout';

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const resourceTypes = [
    { id: 'all', name: 'All Resources', icon: <Globe className="h-4 w-4" /> },
    { id: 'blog', name: 'Blog Articles', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'case-study', name: 'Case Studies', icon: <Award className="h-4 w-4" /> },
    { id: 'whitepaper', name: 'Whitepapers', icon: <FileText className="h-4 w-4" /> },
    { id: 'webinar', name: 'Webinars', icon: <Video className="h-4 w-4" /> },
    { id: 'guide', name: 'Regulatory Guides', icon: <Shield className="h-4 w-4" /> }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'compliance', name: 'Compliance & Regulatory' },
    { id: 'technology', name: 'Technology & Innovation' },
    { id: 'industry-trends', name: 'Industry Trends' },
    { id: 'best-practices', name: 'Best Practices' },
    { id: 'getting-started', name: 'Getting Started' }
  ];

  const featuredResources = [
    {
      id: 1,
      title: 'Complete Guide to FDA Herbal Compliance in 2024',
      description: 'Navigate the latest FDA requirements for herbal products with this comprehensive 45-page guide covering cGMP, labeling, and documentation requirements.',
      type: 'whitepaper',
      category: 'compliance',
      author: 'Dr. Sarah Chen',
      publishDate: '2024-10-15',
      readTime: '12 min read',
      downloads: 2847,
      rating: 4.9,
      image: '/images/resources/fda-compliance-guide.jpg',
      featured: true,
      tags: ['FDA', 'Compliance', 'cGMP', 'Regulations']
    },
    {
      id: 2,
      title: 'How BlockchainBotanicals Cut Compliance Costs by 67%',
      description: 'Discover how this leading herbal supplement company transformed their supply chain operations and achieved massive cost savings with HerbalTrace.',
      type: 'case-study',
      category: 'best-practices',
      author: 'HerbalTrace Team',
      publishDate: '2024-10-08',
      readTime: '8 min read',
      downloads: 1923,
      rating: 4.8,
      image: '/images/resources/blockchain-botanicals-case-study.jpg',
      featured: true,
      tags: ['Cost Reduction', 'ROI', 'Case Study', 'Success Story']
    },
    {
      id: 3,
      title: 'The Future of Herbal Supply Chain Transparency',
      description: 'Join industry experts as they discuss emerging trends, regulatory changes, and technology innovations shaping the herbal industry landscape.',
      type: 'webinar',
      category: 'industry-trends',
      author: 'Industry Panel',
      publishDate: '2024-09-28',
      readTime: '45 min watch',
      downloads: 1456,
      rating: 4.7,
      image: '/images/resources/future-transparency-webinar.jpg',
      featured: true,
      tags: ['Trends', 'Innovation', 'Panel Discussion', 'Future']
    }
  ];

  const allResources = [
    ...featuredResources,
    {
      id: 4,
      title: 'Understanding EU Novel Food Regulations for Herbal Products',
      description: 'Essential guide for companies planning to enter European markets with herbal supplements.',
      type: 'guide',
      category: 'compliance',
      author: 'Maria Rodriguez',
      publishDate: '2024-09-20',
      readTime: '15 min read',
      downloads: 987,
      rating: 4.6,
      image: '/images/resources/eu-regulations-guide.jpg',
      featured: false,
      tags: ['EU Regulations', 'Novel Food', 'International', 'Market Entry']
    },
    {
      id: 5,
      title: 'Implementing Blockchain: Lessons from Early Adopters',
      description: 'Real-world insights from companies who successfully implemented blockchain traceability systems.',
      type: 'blog',
      category: 'technology',
      author: 'Tech Team',
      publishDate: '2024-09-15',
      readTime: '7 min read',
      downloads: 756,
      rating: 4.5,
      image: '/images/resources/blockchain-lessons.jpg',
      featured: false,
      tags: ['Blockchain', 'Implementation', 'Technology', 'Lessons Learned']
    },
    {
      id: 6,
      title: 'Quality Control Automation in Herbal Manufacturing',
      description: 'How AI and IoT are revolutionizing quality assurance in herbal product manufacturing.',
      type: 'blog',
      category: 'technology',
      author: 'Dr. James Liu',
      publishDate: '2024-09-10',
      readTime: '9 min read',
      downloads: 642,
      rating: 4.4,
      image: '/images/resources/quality-automation.jpg',
      featured: false,
      tags: ['AI', 'IoT', 'Quality Control', 'Automation']
    },
    {
      id: 7,
      title: 'Getting Started: Your First 30 Days with HerbalTrace',
      description: 'Step-by-step guide to implementing HerbalTrace in your organization for maximum impact.',
      type: 'guide',
      category: 'getting-started',
      author: 'Customer Success Team',
      publishDate: '2024-09-05',
      readTime: '11 min read',
      downloads: 1234,
      rating: 4.9,
      image: '/images/resources/getting-started-guide.jpg',
      featured: false,
      tags: ['Onboarding', 'Implementation', 'Quick Start', 'Success Tips']
    },
    {
      id: 8,
      title: 'Sustainability Metrics That Matter in Herbal Supply Chains',
      description: 'Key performance indicators for measuring and improving sustainability in herbal sourcing.',
      type: 'whitepaper',
      category: 'best-practices',
      author: 'Sustainability Team',
      publishDate: '2024-08-28',
      readTime: '14 min read',
      downloads: 892,
      rating: 4.6,
      image: '/images/resources/sustainability-metrics.jpg',
      featured: false,
      tags: ['Sustainability', 'KPIs', 'Environment', 'Best Practices']
    },
    {
      id: 9,
      title: 'Building Consumer Trust Through Transparency',
      description: 'How transparent supply chains are becoming a key differentiator in the herbal market.',
      type: 'blog',
      category: 'industry-trends',
      author: 'Marketing Team',
      publishDate: '2024-08-22',
      readTime: '6 min read',
      downloads: 567,
      rating: 4.3,
      image: '/images/resources/consumer-trust.jpg',
      featured: false,
      tags: ['Consumer Trust', 'Transparency', 'Marketing', 'Brand Building']
    },
    {
      id: 10,
      title: 'Advanced Traceability Webinar Series: Episode 1',
      description: 'Deep dive into advanced traceability concepts, featuring real implementation examples.',
      type: 'webinar',
      category: 'technology',
      author: 'Technical Team',
      publishDate: '2024-08-15',
      readTime: '52 min watch',
      downloads: 423,
      rating: 4.7,
      image: '/images/resources/advanced-traceability-webinar.jpg',
      featured: false,
      tags: ['Advanced Topics', 'Technical', 'Webinar Series', 'Deep Dive']
    }
  ];

  const filteredResources = useMemo(() => {
    return allResources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
      const matchesType = selectedType === 'all' || resource.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchTerm, selectedCategory, selectedType]);

  const getResourceTypeIcon = (type) => {
    switch (type) {
      case 'blog': return <BookOpen className="h-5 w-5" />;
      case 'case-study': return <Award className="h-5 w-5" />;
      case 'whitepaper': return <FileText className="h-5 w-5" />;
      case 'webinar': return <Video className="h-5 w-5" />;
      case 'guide': return <Shield className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getResourceTypeName = (type) => {
    switch (type) {
      case 'blog': return 'Blog Article';
      case 'case-study': return 'Case Study';
      case 'whitepaper': return 'Whitepaper';
      case 'webinar': return 'Webinar';
      case 'guide': return 'Guide';
      default: return 'Resource';
    }
  };

  const newsletters = [
    {
      title: 'Weekly Industry Insights',
      description: 'Stay updated with the latest herbal industry news, regulatory changes, and market trends.',
      frequency: 'Weekly',
      subscribers: '12,000+'
    },
    {
      title: 'Compliance Updates',
      description: 'Monthly roundup of regulatory changes, new requirements, and compliance best practices.',
      frequency: 'Monthly',
      subscribers: '8,500+'
    },
    {
      title: 'Technology Spotlight',
      description: 'Quarterly deep dives into emerging technologies and innovations in supply chain management.',
      frequency: 'Quarterly',
      subscribers: '6,200+'
    }
  ];

  return (
    <MarketingLayout 
      title="Resources - Expert Insights & Guides for Herbal Supply Chain | HerbalTrace"
      description="Access expert resources, case studies, compliance guides, and industry insights to optimize your herbal supply chain. Free downloads, webinars, and actionable guides."
      keywords="herbal supply chain resources, compliance guides, case studies, industry insights, regulatory guides, best practices, webinars"
    >
      {/* Hero Section */}
      <section className="relative py-20 pt-32 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Resource Hub
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                  {" "}& Learning Center
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Expert insights, practical guides, and industry best practices to help you 
                master herbal supply chain management and compliance.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search resources, guides, and insights..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 shadow-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">50+</div>
                  <div className="text-gray-600">Expert Resources</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">25K+</div>
                  <div className="text-gray-600">Downloads</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">4.8★</div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-6 items-center justify-between">
            {/* Resource Type Filters */}
            <div className="flex flex-wrap gap-3">
              {resourceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedType === type.id
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.icon}
                  {type.name}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-gray-600">
            Showing {filteredResources.length} of {allResources.length} resources
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Featured Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our most popular and impactful resources, curated by industry experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center">
                    {getResourceTypeIcon(resource.type)}
                  </div>
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                      resource.type === 'whitepaper' ? 'bg-purple-600' :
                      resource.type === 'case-study' ? 'bg-emerald-600' :
                      resource.type === 'webinar' ? 'bg-blue-600' :
                      resource.type === 'blog' ? 'bg-orange-600' : 'bg-gray-600'
                    }`}>
                      {getResourceTypeName(resource.type)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">{resource.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                        +{resource.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {resource.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {resource.readTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {resource.downloads.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(resource.publishDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Resources Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              All Resources
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.filter(r => !r.featured).map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-2 rounded-lg ${
                    resource.type === 'whitepaper' ? 'bg-purple-100 text-purple-600' :
                    resource.type === 'case-study' ? 'bg-emerald-100 text-emerald-600' :
                    resource.type === 'webinar' ? 'bg-blue-100 text-blue-600' :
                    resource.type === 'blog' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getResourceTypeIcon(resource.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {resource.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {resource.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {resource.readTime}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {resource.downloads}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      {resource.rating}
                    </div>
                  </div>
                  
                  <button className="flex items-center gap-2 px-3 py-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-sm font-medium">
                    <Download className="h-3 w-3" />
                    Get
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Resources Found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                }}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Stay Informed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Subscribe to our newsletters and never miss important industry updates, 
              regulatory changes, or new resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {newsletters.map((newsletter, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-100"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 text-white rounded-xl mb-4">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {newsletter.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {newsletter.description}
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {newsletter.frequency}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {newsletter.subscribers}
                    </div>
                  </div>
                  <button className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                    Subscribe
                  </button>
                </div>
              </motion.div>
            ))}
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
              Put these insights into action. Start your free trial and see how HerbalTrace 
              can revolutionize your herbal supply chain operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-emerald-600 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Target className="h-5 w-5" />
                Start Free Trial
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Talk to Expert
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>30-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Expert Support Included</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default ResourcesPage;