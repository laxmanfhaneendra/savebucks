import React, { Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { App } from './App'
import { Skeleton } from './components/ui/Skeleton'

// Lazy load components for code splitting
const ListPage = React.lazy(() => import('./pages/ListPage'))
const SearchResults = React.lazy(() => import('./pages/SearchResults'))
const SocialHomepage = React.lazy(() => import('./pages/SocialHomepage'))
const CompactDealPage = React.lazy(() => import('./pages/Deals/CompactDealPage'))
const PostItem = React.lazy(() => import('./pages/Deals/PostItem'))
const AdminPage = React.lazy(() => import('./pages/Admin/AdminPage'))
const TagManagement = React.lazy(() => import('./pages/Admin/TagManagement'))
const Profile = React.lazy(() => import('./pages/User/Profile'))
const UserProfile = React.lazy(() => import('./pages/User/UserProfile'))
const ForumsHome = React.lazy(() => import('./pages/Forums/ForumsHome'))
const ForumThreads = React.lazy(() => import('./pages/Forums/ForumThreads'))
const ThreadComposer = React.lazy(() => import('./pages/Forums/ThreadComposer'))
const ThreadPage = React.lazy(() => import('./pages/Forums/ThreadPage'))
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'))
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage'))
const CompanyPage = React.lazy(() => import('./pages/CompanyPage'))
const CompaniesPage = React.lazy(() => import('./pages/CompaniesPage'))
const CouponsPage = React.lazy(() => import('./pages/CouponsPage'))
const FilterPage = React.lazy(() => import('./pages/FilterPage'))

const About = React.lazy(() => import('./pages/About'))
const Privacy = React.lazy(() => import('./pages/Legal/Privacy'))
const Terms = React.lazy(() => import('./pages/Legal/Terms'))
const Disclosure = React.lazy(() => import('./pages/Legal/Disclosure'))
const Contact = React.lazy(() => import('./pages/Contact'))
const NotFound = React.lazy(() => import('./pages/NotFound'))
const SignIn = React.lazy(() => import('./pages/Auth/SignIn'))
const SignUp = React.lazy(() => import('./pages/Auth/SignUp'))
const ForgotPassword = React.lazy(() => import('./pages/Auth/ForgotPassword'))
const ResetPassword = React.lazy(() => import('./pages/Auth/ResetPassword'))
const AuthCallback = React.lazy(() => import('./pages/Auth/AuthCallback'))
const SavedSearches = React.lazy(() => import('./pages/User/SavedSearches'))
const SavedItems = React.lazy(() => import('./pages/User/SavedItems'))
const PersonalizedDashboard = React.lazy(() => import('./components/Personalization/PersonalizedDashboard'))
const UserPreferences = React.lazy(() => import('./components/Personalization/UserPreferences'))
const Achievements = React.lazy(() => import('./pages/User/Achievements'))
const Settings = React.lazy(() => import('./pages/User/Settings'))
// const Chat = React.lazy(() => import('./pages/Chat'))
// const AILogs = React.lazy(() => import('./pages/AILogs'))
const LandingPage = React.lazy(() => import('./pages/Landing/LandingPage'))

// New feature pages
const ReferralDashboard = React.lazy(() => import('./components/Referral/ReferralDashboard'))
// const AnalyticsDashboard = React.lazy(() => import('./components/Analytics/AnalyticsDashboard')) // Removed
const NotificationSettings = React.lazy(() => import('./pages/User/NotificationSettings'))

const PageLoader = () => (
  <div className="container mx-auto px-4 py-8">
    <Skeleton className="h-8 w-48 mb-4" />
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SocialHomepage />
          </Suspense>
        ),
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SearchResults />
          </Suspense>
        ),
      },
      {
        path: 'new',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ListPage />
          </Suspense>
        ),
      },
      {
        path: 'trending',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FilterPage />
          </Suspense>
        ),
      },
      {
        path: 'under-20',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FilterPage />
          </Suspense>
        ),
      },
      {
        path: '50-percent-off',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FilterPage />
          </Suspense>
        ),
      },
      {
        path: 'free-shipping',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FilterPage />
          </Suspense>
        ),
      },
      {
        path: 'new-arrivals',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FilterPage />
          </Suspense>
        ),
      },
      {
        path: 'hot-deals',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FilterPage />
          </Suspense>
        ),
      },
      {
        path: 'ending-soon',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FilterPage />
          </Suspense>
        ),
      },
      {
        path: 'deal/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CompactDealPage />
          </Suspense>
        ),
      },
      {
        path: 'post',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PostItem />
          </Suspense>
        ),
      },
      {
        path: 'admin',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/tags',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TagManagement />
          </Suspense>
        ),
      },
      {
        path: 'coupons',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CouponsPage />
          </Suspense>
        ),
      },
      {
        path: 'saved-searches',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SavedSearches />
          </Suspense>
        ),
      },
      {
        path: 'saved-items',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SavedItems />
          </Suspense>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PersonalizedDashboard />
          </Suspense>
        ),
      },
      {
        path: 'preferences',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserPreferences />
          </Suspense>
        ),
      },
      {
        path: 'achievements',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Achievements />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: 'u/:handle',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: 'user/:handle',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserProfile />
          </Suspense>
        ),
      },
      {
        path: 'forums',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ForumsHome />
          </Suspense>
        ),
      },
      {
        path: 'forums/:slug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ForumThreads />
          </Suspense>
        ),
      },
      {
        path: 'forums/:slug/new',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ThreadComposer />
          </Suspense>
        ),
      },
      {
        path: 'forums/:slug/thread/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ThreadPage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<PageLoader />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: 'privacy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Privacy />
          </Suspense>
        ),
      },
      {
        path: 'terms',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Terms />
          </Suspense>
        ),
      },
      {
        path: 'disclosure',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Disclosure />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Contact />
          </Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CategoriesPage />
          </Suspense>
        ),
      },
      {
        path: 'category/:slug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CategoryPage />
          </Suspense>
        ),
      },
      {
        path: 'company/:slug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CompanyPage />
          </Suspense>
        ),
      },
      {
        path: 'companies',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CompaniesPage />
          </Suspense>
        ),
      },
      /*
      {
        path: 'chat',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Chat />
          </Suspense>
        ),
      },
      {
        path: 'admin/logs',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AILogs />
          </Suspense>
        ),
      },
      */
      {
        path: 'referrals',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReferralDashboard />
          </Suspense>
        ),
      },
      /* Analytics route removed
      {
        path: 'analytics',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AnalyticsDashboard />
          </Suspense>
        ),
      },
      */
      {
        path: 'notification-settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotificationSettings />
          </Suspense>
        ),
      },
      {
        path: 'welcome',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LandingPage />
          </Suspense>
        ),
      },

    ],
  },
  // Authentication routes (outside main app layout)
  {
    path: 'signin',
    element: (
      <Suspense fallback={<PageLoader />}>
        <SignIn />
      </Suspense>
    ),
  },
  {
    path: 'signup',
    element: (
      <Suspense fallback={<PageLoader />}>
        <SignUp />
      </Suspense>
    ),
  },
  {
    path: 'forgot-password',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ForgotPassword />
      </Suspense>
    ),
  },
  {
    path: 'reset-password',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ResetPassword />
      </Suspense>
    ),
  },
  {
    path: 'auth/callback',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthCallback />
      </Suspense>
    ),
  },
  // Catch all route
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    ),
  },
])
