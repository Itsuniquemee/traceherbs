import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet-async';

const MarketingLayout = ({ 
  children, 
  title = "HerbalTrace - Supply Chain Traceability Platform",
  description = "Transform your herbal supply chain with blockchain-powered transparency. Track every batch from farm to pharmacy with complete visibility and compliance.",
  canonical,
  keywords = "herbal traceability, supply chain, blockchain, compliance, quality control, batch tracking",
  ogImage = "/images/og-default.jpg"
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Canonical URL */}
        {canonical && <link rel="canonical" href={canonical} />}
        
        {/* Additional meta tags for SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="HerbalTrace" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "HerbalTrace",
            "applicationCategory": "Supply Chain Management",
            "operatingSystem": "Web-based",
            "description": "Blockchain-powered herbal supply chain traceability platform ensuring quality, compliance, and transparency from farm to pharmacy.",
            "url": "https://herbaltrace.com",
            "creator": {
              "@type": "Organization",
              "name": "HerbalTrace Inc."
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": "99",
              "priceValidUntil": "2025-12-31"
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default MarketingLayout;