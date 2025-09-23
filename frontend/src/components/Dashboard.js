import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  Leaf, 
  MapPin, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Package,
  Globe,
  Clock,
  RefreshCw,
  Filter
} from 'lucide-react';
import DashboardStats from './DashboardStats';
import ModernDashboard from './ModernDashboard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data
  const [dashboardData] = useState({
    totalCollections: 1247,
    activeFarmers: 342,
    qualityTestsPassed: '98.7%',
    geographicCoverage: '15 States',
    productsTracked: 2891,
    consumerScans: 45672
  });

  const [healthData] = useState({
    blockchainSync: 99.8,
    apiResponse: 98.5,
    database: 99.2,
    fileStorage: 95.8
  });

  const [activities] = useState([
    {
      id: 1,
      type: 'collection',
      message: 'New collection from Rajasthan region',
      time: '2 minutes ago',
      icon: Leaf,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'quality',
      message: 'Quality test completed for batch #1234',
      time: '15 minutes ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'alert',
      message: 'Temperature alert in storage facility',
      time: '1 hour ago',
      icon: AlertTriangle,
      color: 'text-yellow-600'
    }
  ]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'map', label: 'Geographic View', icon: MapPin }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardStats 
            data={dashboardData}
            healthData={healthData}
            activities={activities}
          />
        );
      case 'analytics':
        return <ModernDashboard />;
      case 'map':
        return <GeographicView />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

// Geographic View Component
const GeographicView = () => {
  const [mapCenter] = useState([20.5937, 78.9629]); // India center
  const [zoom] = useState(5);

  const collectionPoints = [
    { id: 1, name: 'Rajasthan Collection', lat: 26.2389, lng: 73.0243, collections: 450, quality: 96 },
    { id: 2, name: 'Kerala Collection', lat: 10.8505, lng: 76.2711, collections: 320, quality: 98 },
    { id: 3, name: 'Himachal Collection', lat: 31.1048, lng: 77.1734, collections: 280, quality: 94 },
    { id: 4, name: 'Uttarakhand Collection', lat: 30.0668, lng: 79.0193, collections: 250, quality: 97 }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Collection Points Map</h3>
        <div className="h-96 rounded-lg overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {collectionPoints.map((point) => (
              <Marker key={point.id} position={[point.lat, point.lng]}>
                <Popup>
                  <div className="p-2">
                    <h4 className="font-semibold text-foreground">{point.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Collections: {point.collections}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quality Score: {point.quality}%
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Collection Points Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {collectionPoints.map((point, index) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">{point.name}</h4>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Collections: <span className="font-medium text-foreground">{point.collections}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Quality: <span className="font-medium text-foreground">{point.quality}%</span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;