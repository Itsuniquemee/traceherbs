import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Leaf, Camera, Users, Tractor } from 'lucide-react';

const FarmerApp = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Farmer App</h1>
          <p className="text-muted-foreground">Mobile application for farmers to record collections</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: 'Collection Recording',
            description: 'Record herb collections with location and quality data',
            icon: Leaf,
            color: 'bg-green-500'
          },
          {
            title: 'GPS Tracking',
            description: 'Automatic location tracking for collection sites',
            icon: MapPin,
            color: 'bg-blue-500'
          },
          {
            title: 'Photo Documentation',
            description: 'Capture photos of herbs during collection',
            icon: Camera,
            color: 'bg-purple-500'
          },
          {
            title: 'Farmer Profile',
            description: 'Manage farmer information and certifications',
            icon: Users,
            color: 'bg-orange-500'
          },
          {
            title: 'Equipment Tracking',
            description: 'Track farming equipment and tools',
            icon: Tractor,
            color: 'bg-yellow-500'
          },
          {
            title: 'Quality Standards',
            description: 'Guidelines for herb quality assessment',
            icon: Leaf,
            color: 'bg-green-600'
          }
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* App Download Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-lg p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-foreground mb-4">Download the Farmer App</h2>
        <p className="text-muted-foreground mb-6">
          Get the mobile app to start recording your herb collections on the go
        </p>
        <div className="flex justify-center space-x-4">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Download for Android
          </button>
          <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors">
            Download for iOS
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FarmerApp;