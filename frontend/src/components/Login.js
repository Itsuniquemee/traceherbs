import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  User, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Leaf
} from 'lucide-react';

const Login = ({ onLogin, isLoading = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isRememberMe, setIsRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      role: 'farmer'
    }
  });

  const onSubmit = async (data) => {
    setLoginError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication
      if (data.email === 'admin@traceherb.com' && data.password === 'admin123') {
        onLogin({
          id: 1,
          name: 'Admin User',
          email: data.email,
          role: 'admin',
          avatar: null
        });
      } else if (data.email === 'farmer@traceherb.com' && data.password === 'farmer123') {
        onLogin({
          id: 2,
          name: 'Rajesh Kumar',
          email: data.email,
          role: 'farmer',
          avatar: null
        });
      } else if (data.email === 'consumer@traceherb.com' && data.password === 'consumer123') {
        onLogin({
          id: 3,
          name: 'Priya Sharma',
          email: data.email,
          role: 'consumer',
          avatar: null
        });
      } else {
        setLoginError('Invalid email or password');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    }
  };

  const roleOptions = [
    { value: 'farmer', label: 'Farmer', icon: User },
    { value: 'processor', label: 'Processor', icon: Shield },
    { value: 'regulator', label: 'Regulator', icon: Shield },
    { value: 'consumer', label: 'Consumer', icon: User },
    { value: 'admin', label: 'Admin', icon: Shield }
  ];

  const demoAccounts = [
    { email: 'admin@traceherb.com', password: 'admin123', role: 'admin', name: 'Admin User' },
    { email: 'farmer@traceherb.com', password: 'farmer123', role: 'farmer', name: 'Rajesh Kumar' },
    { email: 'consumer@traceherb.com', password: 'consumer123', role: 'consumer', name: 'Priya Sharma' }
  ];

  const handleDemoLogin = (account) => {
    reset({
      email: account.email,
      password: account.password,
      role: account.role
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">TraceHerb</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Role</label>
              <select
                {...register('role', { required: 'Please select a role' })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  return (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  );
                })}
              </select>
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isRememberMe}
                  onChange={(e) => setIsRememberMe(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Error Message */}
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">{loginError}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-medium text-foreground mb-3">Demo Accounts</h3>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(account)}
                  className="w-full text-left p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="text-sm font-medium text-foreground">{account.name}</div>
                  <div className="text-xs text-muted-foreground">{account.email}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="#" className="text-primary hover:underline font-medium">
                Sign up
              </a>
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-foreground">Secure</h3>
            <p className="text-sm text-muted-foreground">End-to-end encryption</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <Leaf className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-foreground">Traceable</h3>
            <p className="text-sm text-muted-foreground">Complete supply chain</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-foreground">Verified</h3>
            <p className="text-sm text-muted-foreground">Quality assured</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;