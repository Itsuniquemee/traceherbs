import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircle,
  X,
  Zap,
  Star,
  Users,
  Shield,
  Phone,
  Calculator,
  ArrowRight,
  Award,
  Globe,
  Clock,
  Headphones
} from 'lucide-react';
import MarketingLayout from '../../components/layout/MarketingLayout';

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('annual'); // 'monthly' or 'annual'
  const [roiInputs, setRoiInputs] = useState({
    annualRevenue: 5000000,
    complianceCosts: 50000,
    recallRisk: 100000
  });

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small herbal businesses getting started with traceability',
      monthlyPrice: 99,
      annualPrice: 990,
      popular: false,
      features: [
        'Up to 100 batches per month',
        'Basic blockchain tracking',
        'QR code generation',
        'Mobile app access',
        'Email support',
        'Standard reporting',
        'API access',
        '1 integration included'
      ],
      notIncluded: [
        'Advanced analytics',
        'Custom workflows',
        'Priority support',
        'Dedicated account manager'
      ],
      ctaText: 'Start Free Trial',
      ctaLink: '/signup?plan=starter'
    },
    {
      name: 'Professional',
      description: 'Comprehensive solution for growing herbal companies',
      monthlyPrice: 299,
      annualPrice: 2990,
      popular: true,
      features: [
        'Up to 1,000 batches per month',
        'Advanced blockchain tracking',
        'Complete compliance automation',
        'Real-time analytics dashboard',
        'Priority email & phone support',
        'Custom report templates',
        'Advanced API access',
        '5 integrations included',
        'Multi-user collaboration',
        'Audit trail management',
        'Quality prediction analytics',
        'Mobile & web apps'
      ],
      notIncluded: [
        'Unlimited batches',
        'Dedicated account manager',
        'Custom development',
        'On-premise deployment'
      ],
      ctaText: 'Start Free Trial',
      ctaLink: '/signup?plan=professional'
    },
    {
      name: 'Enterprise',
      description: 'Complete supply chain transformation for large organizations',
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      popular: false,
      features: [
        'Unlimited batches',
        'Enterprise blockchain network',
        'Full compliance automation',
        'Advanced AI & ML analytics',
        '24/7 priority support',
        'Dedicated account manager',
        'Custom integrations',
        'Unlimited API calls',
        'Advanced security features',
        'Custom workflows & rules',
        'On-premise deployment option',
        'White-label solutions',
        'Custom development',
        'Training & onboarding',
        'SLA guarantees'
      ],
      notIncluded: [],
      ctaText: 'Contact Sales',
      ctaLink: '/contact?type=enterprise'
    }
  ];

  const features = [
    {
      category: 'Core Features',
      items: [
        { name: 'Blockchain Tracking', starter: true, professional: true, enterprise: true },
        { name: 'QR Code Generation', starter: true, professional: true, enterprise: true },
        { name: 'Mobile Apps', starter: true, professional: true, enterprise: true },
        { name: 'Basic Reporting', starter: true, professional: false, enterprise: false },
        { name: 'Advanced Analytics', starter: false, professional: true, enterprise: true },
        { name: 'AI Predictions', starter: false, professional: true, enterprise: true },
        { name: 'Custom Workflows', starter: false, professional: false, enterprise: true }
      ]
    },
    {
      category: 'Compliance',
      items: [
        { name: 'Audit Trails', starter: true, professional: true, enterprise: true },
        { name: 'Basic Compliance Reports', starter: true, professional: false, enterprise: false },
        { name: 'Automated Compliance', starter: false, professional: true, enterprise: true },
        { name: 'Multi-Jurisdiction Support', starter: false, professional: true, enterprise: true },
        { name: 'Custom Compliance Rules', starter: false, professional: false, enterprise: true }
      ]
    },
    {
      category: 'Integrations',
      items: [
        { name: 'API Access', starter: 'Basic', professional: 'Advanced', enterprise: 'Unlimited' },
        { name: 'Pre-built Connectors', starter: '1', professional: '5', enterprise: 'Unlimited' },
        { name: 'Custom Integrations', starter: false, professional: false, enterprise: true },
        { name: 'Webhook Support', starter: true, professional: true, enterprise: true }
      ]
    },
    {
      category: 'Support',
      items: [
        { name: 'Email Support', starter: true, professional: true, enterprise: true },
        { name: 'Phone Support', starter: false, professional: true, enterprise: true },
        { name: '24/7 Support', starter: false, professional: false, enterprise: true },
        { name: 'Dedicated Account Manager', starter: false, professional: false, enterprise: true },
        { name: 'Training & Onboarding', starter: false, professional: 'Basic', enterprise: 'Full' }
      ]
    }
  ];

  const faq = [
    {
      question: 'How does the free trial work?',
      answer: 'You get full access to all features in your chosen plan for 30 days, no credit card required. You can upgrade, downgrade, or cancel anytime during the trial.'
    },
    {
      question: 'What happens if I exceed my batch limits?',
      answer: 'You\'ll receive notifications as you approach your limit. You can either upgrade your plan or purchase additional batch capacity. We never stop your service without warning.'
    },
    {
      question: 'Can I change plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the billing accordingly.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use bank-level security with AES-256 encryption, blockchain verification, and are SOC 2 Type II and ISO 27001 certified.'
    },
    {
      question: 'Do you offer custom integrations?',
      answer: 'Yes, our Enterprise plan includes custom integrations. We can connect to virtually any system through our API or custom development.'
    },
    {
      question: 'What about compliance requirements?',
      answer: 'Our platform is designed to meet FDA, USDA, EU, and other international regulatory requirements. We stay updated with regulation changes automatically.'
    }
  ];

  const calculateROI = () => {
    const { annualRevenue, complianceCosts, recallRisk } = roiInputs;
    
    // Conservative ROI calculations
    const complianceSavings = complianceCosts * 0.6; // 60% reduction in compliance costs
    const recallPrevention = recallRisk * 0.8; // 80% reduction in recall risk
    const efficiencyGains = annualRevenue * 0.02; // 2% efficiency improvement
    
    const totalBenefits = complianceSavings + recallPrevention + efficiencyGains;
    const annualCost = billingPeriod === 'annual' ? 2990 : 299 * 12; // Professional plan cost
    const roi = ((totalBenefits - annualCost) / annualCost) * 100;
    const paybackMonths = (annualCost / (totalBenefits / 12));

    return {
      totalBenefits: Math.round(totalBenefits),
      roi: Math.round(roi),
      paybackMonths: Math.round(paybackMonths * 10) / 10
    };
  };

  const roiResults = calculateROI();

  return (
    <MarketingLayout 
      title="Pricing - Transparent Supply Chain Traceability Plans | HerbalTrace"
      description="Choose the perfect HerbalTrace plan for your herbal business. Starter, Professional, and Enterprise options with 30-day free trial. Calculate your ROI instantly."
      keywords="herbal traceability pricing, supply chain software cost, blockchain tracking plans, compliance automation pricing"
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
                Simple, Transparent
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                  {" "}Pricing
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Choose the perfect plan for your herbal supply chain needs. 
                Start with a 30-day free trial, no credit card required.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <span className={`font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                  className={`relative w-16 h-8 rounded-full transition-colors ${
                    billingPeriod === 'annual' ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                    billingPeriod === 'annual' ? 'translate-x-9' : 'translate-x-1'
                  }`} />
                </button>
                <span className={`font-medium ${billingPeriod === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Annual
                </span>
                {billingPeriod === 'annual' && (
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-sm font-medium">
                    Save 17%
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 -mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  plan.popular 
                    ? 'border-emerald-500 scale-105' 
                    : 'border-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      {typeof plan.monthlyPrice === 'number' ? (
                        <>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-4xl md:text-5xl font-bold text-gray-900">
                              ${billingPeriod === 'annual' ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice}
                            </span>
                            <span className="text-gray-500">/month</span>
                          </div>
                          {billingPeriod === 'annual' && (
                            <div className="text-sm text-gray-500 mt-2">
                              ${plan.annualPrice} billed annually
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-4xl md:text-5xl font-bold text-gray-900">
                          {plan.monthlyPrice}
                        </div>
                      )}
                    </div>

                    <Link
                      to={plan.ctaLink}
                      className={`w-full px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {plan.name === 'Enterprise' ? <Phone className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                      {plan.ctaText}
                    </Link>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        What's included:
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.notIncluded.length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <X className="h-5 w-5 text-gray-400" />
                          Not included:
                        </h4>
                        <ul className="space-y-2">
                          {plan.notIncluded.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-3 text-sm text-gray-400">
                              <X className="h-4 w-4 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-16">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>30-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>No Setup Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span>Money-Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Calculate Your ROI
              </h2>
              <p className="text-xl text-gray-600">
                See how much you can save with HerbalTrace's Professional plan
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calculator Inputs */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Calculator className="h-6 w-6 text-emerald-600" />
                    Your Current Situation
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Annual Revenue
                      </label>
                      <input
                        type="number"
                        value={roiInputs.annualRevenue}
                        onChange={(e) => setRoiInputs({...roiInputs, annualRevenue: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="5000000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Annual Compliance Costs
                      </label>
                      <input
                        type="number"
                        value={roiInputs.complianceCosts}
                        onChange={(e) => setRoiInputs({...roiInputs, complianceCosts: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="50000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Potential Recall Risk
                      </label>
                      <input
                        type="number"
                        value={roiInputs.recallRisk}
                        onChange={(e) => setRoiInputs({...roiInputs, recallRisk: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="100000"
                      />
                    </div>
                  </div>
                </div>

                {/* ROI Results */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="h-6 w-6 text-emerald-600" />
                    Your ROI with HerbalTrace
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600 mb-2">
                          {roiResults.roi}%
                        </div>
                        <div className="text-sm text-emerald-700">Annual ROI</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">
                          ${roiResults.totalBenefits.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Annual Savings</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">
                          {roiResults.paybackMonths}
                        </div>
                        <div className="text-sm text-gray-600">Months to Payback</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      * ROI calculated based on industry averages: 60% reduction in compliance costs, 
                      80% reduction in recall risk, and 2% operational efficiency improvement.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  to="/signup?plan=professional"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 inline-flex items-center gap-2"
                >
                  <Zap className="h-5 w-5" />
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Compare Plans & Features
            </h2>
            <p className="text-xl text-gray-600">
              Detailed breakdown of what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Features</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Starter</th>
                  <th className="px-6 py-4 text-center font-semibold text-emerald-700 bg-emerald-50">Professional</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((category, categoryIndex) => (
                  <React.Fragment key={categoryIndex}>
                    <tr className="border-t-2 border-gray-200">
                      <td colSpan="4" className="px-6 py-4 bg-gray-50">
                        <h3 className="font-semibold text-gray-900">{category.category}</h3>
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="border-t border-gray-100">
                        <td className="px-6 py-4 text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 text-center">
                          {typeof item.starter === 'boolean' ? (
                            item.starter ? (
                              <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-700">{item.starter}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center bg-emerald-50">
                          {typeof item.professional === 'boolean' ? (
                            item.professional ? (
                              <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-emerald-700 font-medium">{item.professional}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {typeof item.enterprise === 'boolean' ? (
                            item.enterprise ? (
                              <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-gray-300 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-700">{item.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600">
                Get answers to common questions about our pricing and plans
              </p>
            </div>

            <div className="space-y-6">
              {faq.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {item.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </motion.div>
              ))}
            </div>
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
              Ready to Start Your Free Trial?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of herbal companies already transforming their supply chains with HerbalTrace.
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
                to="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold text-lg rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Headphones className="h-5 w-5" />
                Talk to Sales
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
                <span>Setup in 1-2 Weeks</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default PricingPage;