import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Star, Award, MapPin, Calendar, Leaf, TrendingUp } from 'lucide-react';

const ConsumerCompare = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [availableProducts] = useState([
    {
      id: 1,
      name: 'Organic Turmeric Powder',
      brand: 'Ayurvedic Heritage',
      price: '$12.99',
      rating: 4.8,
      qualityScore: 95,
      sustainability: 92,
      origin: 'Rajasthan, India',
      certification: 'Organic',
      harvestDate: '2024-01-10'
    },
    {
      id: 2,
      name: 'Premium Turmeric Powder',
      brand: 'Herbal Plus',
      price: '$15.99',
      rating: 4.6,
      qualityScore: 88,
      sustainability: 85,
      origin: 'Kerala, India',
      certification: 'Fair Trade',
      harvestDate: '2024-01-08'
    },
    {
      id: 3,
      name: 'Wild Turmeric Extract',
      brand: "Nature's Best",
      price: '$18.99',
      rating: 4.9,
      qualityScore: 97,
      sustainability: 98,
      origin: 'Himachal Pradesh, India',
      certification: 'Organic + Wild',
      harvestDate: '2024-01-05'
    }
  ]);

  const addProductToComparison = (product) => {
    if (selectedProducts.length < 3 && !selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeProductFromComparison = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Compare Products</h1>
        <p className="text-muted-foreground">
          Compare up to 3 products side by side to make informed decisions
        </p>
      </motion.div>

      {/* Available Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold text-foreground mb-4">Available Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableProducts.map((product) => (
            <div key={product.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{product.price}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Quality</span>
                    <span className={`font-medium ${getScoreColor(product.qualityScore)}`}>
                      {product.qualityScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sustainability</span>
                    <span className={`font-medium ${getScoreColor(product.sustainability)}`}>
                      {product.sustainability}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => addProductToComparison(product)}
                  disabled={selectedProducts.length >= 3 || selectedProducts.find(p => p.id === product.id)}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {selectedProducts.find(p => p.id === product.id) ? 'Added' : 'Add to Compare'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Comparison Table */}
      {selectedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Product Comparison</h2>
            <button
              onClick={() => setSelectedProducts([])}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Feature</th>
                  {selectedProducts.map((product) => (
                    <th key={product.id} className="text-center py-3 px-4 min-w-[200px]">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                        <button
                          onClick={() => removeProductFromComparison(product.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 px-4 font-medium">Price</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="py-3 px-4 text-center">
                      <span className="text-lg font-bold text-primary">{product.price}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Rating</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Quality Score</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="py-3 px-4 text-center">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getScoreBg(product.qualityScore)} ${getScoreColor(product.qualityScore)}`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {product.qualityScore}%
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Sustainability</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="py-3 px-4 text-center">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getScoreBg(product.sustainability)} ${getScoreColor(product.sustainability)}`}>
                        <Leaf className="h-3 w-3 mr-1" />
                        {product.sustainability}%
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Origin</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{product.origin}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Certification</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="py-3 px-4 text-center">
                      <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        <Award className="h-3 w-3 mr-1" />
                        {product.certification}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Harvest Date</td>
                  {selectedProducts.map((product) => (
                    <td key={product.id} className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{product.harvestDate}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {selectedProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Products Selected
          </h3>
          <p className="text-muted-foreground">
            Add products from the list above to start comparing
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ConsumerCompare;