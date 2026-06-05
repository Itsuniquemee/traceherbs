import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Filter, Search, Award } from 'lucide-react';

const ConsumerReviews = () => {
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  
  const [reviews] = useState([
    {
      id: 1,
      productName: 'Organic Turmeric Powder',
      productBrand: 'Ayurvedic Heritage',
      rating: 5,
      reviewerName: 'Priya Sharma',
      reviewDate: '2024-01-18',
      verifiedPurchase: true,
      title: 'Excellent quality and authentic taste',
      content: 'I have been using this turmeric powder for 3 months now. The quality is exceptional, and the color and aroma are exactly what you expect from authentic turmeric. The packaging ensures freshness, and the QR code verification gave me confidence in its authenticity.',
      helpful: 24,
      images: ['turmeric1.jpg'],
      tags: ['Authentic', 'Fresh', 'Good Packaging']
    },
    {
      id: 2,
      productName: 'Ashwagandha Extract',
      productBrand: 'Herbal Plus',
      rating: 4,
      reviewerName: 'Rajesh Kumar',
      reviewDate: '2024-01-15',
      verifiedPurchase: true,
      title: 'Good quality but slightly expensive',
      content: 'The ashwagandha extract works well for stress relief. I noticed improvements in my sleep quality after 2 weeks of use. The only downside is the price point, but the quality justifies it. The traceability feature is a nice touch.',
      helpful: 18,
      images: [],
      tags: ['Effective', 'Expensive', 'Traceable']
    },
    {
      id: 3,
      productName: 'Neem Capsules',
      productBrand: "Nature's Best",
      rating: 3,
      reviewerName: 'Anita Desai',
      reviewDate: '2024-01-12',
      verifiedPurchase: false,
      title: 'Average product, packaging could be better',
      content: 'The neem capsules are okay in terms of quality, but I expected better packaging. The bottle arrived with a loose cap, though the contents were fine. The product seems authentic based on the QR verification.',
      helpful: 8,
      images: [],
      tags: ['Average', 'Packaging Issues']
    },
    {
      id: 4,
      productName: 'Organic Turmeric Powder',
      productBrand: 'Ayurvedic Heritage',
      rating: 5,
      reviewerName: 'Dr. Meera Patel',
      reviewDate: '2024-01-10',
      verifiedPurchase: true,
      title: 'Perfect for medicinal use',
      content: 'As an Ayurvedic practitioner, I recommend this turmeric to my patients. The curcumin content is high, and the sourcing transparency through the traceability system builds trust. The farmer details and harvest information are particularly valuable.',
      helpful: 35,
      images: [],
      tags: ['Professional', 'High Quality', 'Medicinal']
    }
  ]);

  const [products] = useState([
    'Organic Turmeric Powder',
    'Ashwagandha Extract',
    'Neem Capsules',
    'Ginger Tablets',
    'Tulsi Drops'
  ]);

  const filteredReviews = reviews
    .filter(review => selectedProduct === 'all' || review.productName === selectedProduct)
    .filter(review => filterRating === 'all' || review.rating >= parseInt(filterRating))
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.reviewDate) - new Date(a.reviewDate);
        case 'oldest':
          return new Date(a.reviewDate) - new Date(b.reviewDate);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getAverageRating = () => {
    const filtered = reviews.filter(review => 
      selectedProduct === 'all' || review.productName === selectedProduct
    );
    if (filtered.length === 0) return 0;
    return (filtered.reduce((sum, review) => sum + review.rating, 0) / filtered.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const filtered = reviews.filter(review => 
      selectedProduct === 'all' || review.productName === selectedProduct
    );
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    filtered.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Product Reviews & Ratings</h1>
        <p className="text-muted-foreground">
          Read authentic reviews from verified buyers and share your experience
        </p>
      </motion.div>

      {/* Filters and Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Products</option>
                {products.map((product) => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Minimum Rating</label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>
          </div>

          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">
              {getAverageRating()}
            </div>
            <div className="flex items-center justify-center space-x-1 mb-2">
              {renderStars(Math.round(parseFloat(getAverageRating())))}
            </div>
            <p className="text-muted-foreground">
              Based on {filteredReviews.length} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Rating Distribution</h3>
            {Object.entries(getRatingDistribution())
              .reverse()
              .map(([rating, count]) => (
                <div key={rating} className="flex items-center space-x-2 mb-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${filteredReviews.length > 0 ? (count / filteredReviews.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  {review.reviewerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-foreground">{review.reviewerName}</h3>
                    {review.verifiedPurchase && (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                        <Award className="h-3 w-3" />
                        <span>Verified Purchase</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mb-1">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {review.productName} by {review.productBrand}
                  </p>
                  <p className="text-xs text-muted-foreground">{review.reviewDate}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
              <p className="text-muted-foreground leading-relaxed">{review.content}</p>
            </div>

            {review.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {review.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm">{review.helpful}</span>
                </button>
                <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsDown className="h-4 w-4" />
                </button>
                <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">Reply</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Reviews Found
          </h3>
          <p className="text-muted-foreground">
            No reviews match your current filters. Try adjusting your criteria.
          </p>
        </motion.div>
      )}

      {/* Write Review Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-6 right-6"
      >
        <button className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center">
          <MessageSquare className="h-6 w-6" />
        </button>
      </motion.div>
    </div>
  );
};

export default ConsumerReviews;