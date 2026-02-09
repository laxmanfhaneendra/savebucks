import React, { useState, useEffect, useRef } from 'react';
import { setPageMeta } from '../lib/head';
import { FilterSidebar } from '../components/Homepage/FilterSidebar';
import { InfiniteFeed } from '../components/Homepage/InfiniteFeed';
import { RightSidebar } from '../components/Homepage/RightSidebar';
import { useLocation } from '../context/LocationContext';
import { CommandPalette } from '../components/ui/CommandPalette';
import PersonalizedRecommendations from '../components/Personalization/PersonalizedRecommendations';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Clock,
  Tag,
  Zap,
  Flame,
  Percent
} from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'All Deals', icon: Sparkles },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'new-arrivals', label: 'New', icon: Zap },
  { id: '50-off', label: '50%+ Off', icon: Percent },
  { id: 'under-20', label: 'Under $20', icon: Tag },
  { id: 'ending-soon', label: 'Ending Soon', icon: Clock },
];

export default function SocialHomepage() {
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState(null);
  const { location } = useLocation();

  useEffect(() => {
    setPageMeta({
      title: 'SaveBucks - Discover Amazing Deals & Save Big',
      description: 'Find the hottest deals, exclusive coupons, and biggest discounts.',
      canonical: window.location.origin,
    });
  }, []);

  const locationParam = location?.latitude && location?.longitude
    ? { lat: location.latitude, lng: location.longitude }
    : null;

  // Ref for main feed scroll area
  const feedRef = useRef(null);

  // Check if For You filter is active
  const isForYouActive = filter === 'for-you';

  return (
    <div className="h-screen overflow-hidden bg-slate-900 pt-14 lg:pt-16">
      {/* Command Palette - ⌘K */}
      <CommandPalette onFilterChange={setFilter} />

      {/* Main Content - Fluid width: Full on mobile, 96% on laptop, 90% on desktop (5% gaps) */}
      <div className="h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4rem)] w-full lg:w-[96%] xl:w-[90%] mx-auto transition-all duration-300">
        <div className="flex h-full">
          {/* Left Sidebar - Compact, no scrollbar */}
          <aside className="hidden lg:block w-[260px] flex-shrink-0">
            <div className="sticky top-20 px-3 py-4 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide">
              <FilterSidebar
                activeFilter={filter}
                onFilterChange={setFilter}
                activeCategory={category}
                onCategoryChange={setCategory}
              />
            </div>
          </aside>

          {/* Main Feed */}
            <main className="relative flex-1 min-w-0 flex flex-col h-full">
              {/* Content Area */}
              <div
                ref={feedRef}
                className="flex-1 overflow-y-auto scrollbar-hide"
              style={{
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                willChange: 'scroll-position'
              }}
            >
              <motion.div
                key={isForYouActive ? "for-you-feed" : "feed"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="px-4 lg:px-8 py-6"
              >
                {isForYouActive ? (
                  <PersonalizedRecommendations
                    limit={24}
                    showTitle={true}
                    className=""
                  />
                ) : (
                  <InfiniteFeed
                    filter={filter}
                    category={category}
                    location={locationParam}
                  />
                )}
              </motion.div>
            </div>
          </main>

          {/* Right Sidebar - Reserved for future ads */}
          {/* <aside className="hidden lg:block w-[340px] flex-shrink-0">
            <div className="sticky top-20 px-3 py-4 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide">
              <RightSidebar />
            </div>
          </aside> */}
        </div>
      </div>
    </div>
  );
}
