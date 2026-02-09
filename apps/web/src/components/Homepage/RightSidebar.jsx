import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import {
  ArrowRight,
  Building2
} from 'lucide-react';
import { Separator } from '../ui/Separator';
import { TooltipProvider } from '../ui/Tooltip';



export function RightSidebar() {
  return (
    <TooltipProvider delayDuration={300}>
      <aside className="space-y-8">
        <CouponsWidget />
        <Separator className="bg-slate-100" />
        <TopCompaniesWidget />
      </aside>
    </TooltipProvider>
  );
}


function CouponsWidget() {
  const { data: coupons, isLoading } = useQuery({
    queryKey: ['coupons', 'latest'],
    queryFn: () => api.listCoupons({ limit: 5, sort: 'newest', include: 'company' }),
    staleTime: 5 * 60 * 1000,
  });

  return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 rounded-2xl p-4 border border-slate-700/50"
      >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Latest Coupons
        </h3>
        <Link to="/coupons" className="text-xs font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1 group">
          View All <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i} 
              className="h-14 rounded-xl overflow-hidden relative bg-slate-700/50"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      ) : coupons?.length > 0 ? (
        <div className="space-y-2">
          {coupons.slice(0, 5).map((coupon, index) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.08, ease: [0.215, 0.61, 0.355, 1] }}
            >
              <Link
                to={`/coupon/${coupon.id}`}
                className="flex items-center gap-3 p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-300 group border border-transparent hover:border-slate-600/50"
              >
                {/* Company Logo */}
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  className="w-11 h-11 rounded-xl bg-slate-700 border border-slate-600/50 flex items-center justify-center overflow-hidden shrink-0"
                >
                  {coupon.company?.logo_url ? (
                    <img
                      src={coupon.company.logo_url}
                      alt={coupon.company.name}
                      className="w-full h-full object-contain p-1.5"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-500 flex items-center justify-center text-sm font-bold">
                      {coupon.company?.name?.[0] || 'C'}
                    </div>
                  )}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-200 truncate block group-hover:text-amber-500 transition-colors">
                    {coupon.company?.name || 'Unknown Store'}
                  </span>
                  <span className="text-xs text-slate-500 truncate block mt-0.5">
                    {coupon.title}
                  </span>
                </div>
                
                {coupon.discount_value && (
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="text-xs font-bold text-slate-900 bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1.5 rounded-lg shrink-0 shadow-sm"
                  >
                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-slate-500">
          No active coupons
        </div>
      )}
    </motion.div>
  );
}

function TopCompaniesWidget() {
  const { data: companies, isLoading } = useQuery({
    queryKey: ['top-companies'],
    queryFn: () => api.getCompanies({ limit: 6, sort: 'newest', verified: true }),
    staleTime: 10 * 60 * 1000,
  });

  const fallbackCompanies = [
    { id: 1, name: 'Amazon', slug: 'amazon', initial: 'A', gradient: 'from-orange-400 to-amber-500' },
    { id: 2, name: 'Target', slug: 'target', initial: 'T', gradient: 'from-red-400 to-rose-500' },
    { id: 3, name: 'Best Buy', slug: 'best-buy', initial: 'B', gradient: 'from-blue-400 to-cyan-500' },
    { id: 4, name: 'Walmart', slug: 'walmart', initial: 'W', gradient: 'from-sky-400 to-blue-500' },
    { id: 5, name: 'Sony', slug: 'sony', initial: 'S', gradient: 'from-slate-400 to-slate-600' },
    { id: 6, name: 'Nike', slug: 'nike', initial: 'N', gradient: 'from-amber-500 to-orange-500' },
  ];

  const displayCompanies = companies?.length > 0 ? companies : fallbackCompanies;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-1"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          Top Stores
        </h3>
        <Link to="/companies" className="text-xs font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1 group">
          View All <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <motion.div 
              key={i} 
              className="aspect-square rounded-2xl bg-slate-700/50"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {displayCompanies.slice(0, 6).map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.06, type: 'spring', stiffness: 150 }}
            >
              <Link
                to={`/company/${company.slug}?tab=coupons`}
                className="group flex flex-col items-center justify-center aspect-square bg-slate-800 border border-slate-700/50 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/10 rounded-2xl transition-all duration-300 p-3"
                title={company.name}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="h-8 w-auto object-contain mb-2"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className={`w-10 h-10 bg-gradient-to-br ${company.gradient || 'from-amber-500 to-orange-500'} rounded-xl flex items-center justify-center text-white text-sm font-bold mb-2 shadow-md`}>
                      {company.initial || company.name?.[0] || '?'}
                    </div>
                  )}
                </motion.div>
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-amber-500 truncate w-full text-center transition-colors">
                    {company.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
