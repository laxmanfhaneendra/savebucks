import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  Utensils, 
  Tag, 
  Clock, 
  Star,
  ChevronRight,
  Smartphone,
  Store,
  Users,
  TrendingUp,
  Gift,
  Pizza,
  Coffee
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { setPageMeta } from '../../lib/head';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Stats data
const STATS = [
  { value: '10,000+', label: 'Active Deals' },
  { value: '5,000+', label: 'Restaurants' },
  { value: '1M+', label: 'Deals Claimed' },
  { value: '50+', label: 'Cities' }
];

// How it works steps
const HOW_IT_WORKS = [
  {
    icon: MapPin,
    title: 'Find Local Deals',
    description: 'Enter your location to discover restaurant deals near you'
  },
  {
    icon: Tag,
    title: 'Claim Your Deal',
    description: 'Save deals and get exclusive promo codes instantly'
  },
  {
    icon: Utensils,
    title: 'Enjoy & Save',
    description: 'Show the deal at the restaurant and enjoy your discount'
  }
];

// Featured categories
const CATEGORIES = [
  { icon: Pizza, name: 'Pizza', slug: 'pizza', color: 'bg-orange-500' },
  { icon: Coffee, name: 'Coffee', slug: 'coffee-bakery', color: 'bg-amber-600' },
  { icon: Utensils, name: 'Fine Dining', slug: 'fine-dining', color: 'bg-purple-600' },
  { icon: Gift, name: 'Fast Food', slug: 'fast-food', color: 'bg-red-500' }
];

// Testimonials
const TESTIMONIALS = [
  {
    quote: "Found an amazing 50% off deal at my favorite Italian place. Saved $40 on dinner!",
    author: "Sarah M.",
    location: "Austin, TX",
    rating: 5
  },
  {
    quote: "As a restaurant owner, Savebucks helped us reach 200+ new customers last month.",
    author: "Chef Marco",
    location: "Miami, FL",
    rating: 5
  },
  {
    quote: "I check this app every day before deciding where to eat. So many great deals!",
    author: "James K.",
    location: "Seattle, WA",
    rating: 5
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    setPageMeta({
      title: 'Savebucks - Discover Restaurant Deals Near You',
      description: 'Find the best local restaurant deals, coupons, and discounts. Save money on dining out with exclusive offers from restaurants near you.',
      canonical: window.location.origin
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      navigate(`/?location=${encodeURIComponent(location)}`);
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          navigate(`/?lat=${latitude}&lng=${longitude}`);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsLocating(false);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-orange-50" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-40">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Over 10,000 deals updated daily</span>
            </motion.div>

            {/* Main headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Discover Amazing{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Restaurant Deals
              </span>{' '}
              Near You
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            >
              Save up to 50% at your favorite local restaurants. 
              Find exclusive coupons, daily specials, and limited-time offers.
            </motion.p>

            {/* Search form */}
            <motion.form 
              variants={fadeInUp}
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8"
            >
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city, state or zip code..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-lg"
                />
              </div>
              <Button 
                type="submit"
                className="py-4 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Find Deals
              </Button>
            </motion.form>

            {/* Auto-detect location */}
            <motion.button
              variants={fadeInUp}
              onClick={handleGetLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <MapPin className="w-4 h-4" />
              {isLocating ? 'Detecting location...' : 'Use my current location'}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Save money on every meal in just 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center p-8 rounded-2xl bg-gray-50 hover:bg-emerald-50 transition-colors"
              >
                {/* Step number */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-emerald-600" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find deals for every craving
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, index) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/category/${cat.slug}`}
                  className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center`}>
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{cat.name}</div>
                    <div className="text-sm text-gray-500">View deals</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              to="/categories"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              View all categories
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* For Restaurants CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Store className="w-4 h-4" />
                <span>For Restaurant Owners</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Reach More Hungry Customers
              </h2>
              
              <p className="text-xl text-emerald-100 mb-8">
                List your restaurant for free and promote your deals to thousands 
                of local customers looking for their next meal.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold"
                  onClick={() => navigate('/business/signup')}
                >
                  List Your Restaurant
                </Button>
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl font-semibold"
                  onClick={() => navigate('/business')}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: Users, value: '10k+', label: 'Monthly visitors' },
                { icon: TrendingUp, value: '25%', label: 'Avg increase in orders' },
                { icon: Star, value: '4.9', label: 'Restaurant satisfaction' },
                { icon: Clock, value: '5 min', label: 'To get started' }
              ].map((item) => (
                <div 
                  key={item.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
                >
                  <item.icon className="w-8 h-8 mx-auto mb-3 text-emerald-200" />
                  <div className="text-2xl font-bold mb-1">{item.value}</div>
                  <div className="text-sm text-emerald-200">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What People Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of happy deal hunters
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-8"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 text-lg">
                  "{testimonial.quote}"
                </p>

                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App CTA (Future) */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Smartphone className="w-16 h-16 mx-auto mb-6 text-emerald-400" />
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Mobile App Coming Soon
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Get deal alerts on your phone. Never miss a discount at your favorite restaurants.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  disabled
                  className="bg-gray-700 text-gray-300 px-8 py-3 rounded-xl font-semibold cursor-not-allowed"
                >
                  App Store - Coming Soon
                </Button>
                <Button 
                  disabled
                  className="bg-gray-700 text-gray-300 px-8 py-3 rounded-xl font-semibold cursor-not-allowed"
                >
                  Google Play - Coming Soon
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Saving?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of users saving money on their favorite restaurants every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg"
                onClick={() => navigate('/signup')}
              >
                Create Free Account
              </Button>
              <Button 
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-xl font-semibold text-lg"
                onClick={handleGetLocation}
              >
                Browse Deals Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
