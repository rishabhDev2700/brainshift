import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from "motion/react";

const LoginPage = React.lazy(() => import('./pages/login.page'));
const RegisterPage = React.lazy(() => import('./pages/register.page'));
const Dashboard = React.lazy(() => import('./pages/dashboard.page'));
const Layout = React.lazy(() => import('./pages/layout'));
const CalendarPage = React.lazy(() => import('./pages/calendar.page'));
const TasksPage = React.lazy(() => import('./pages/tasks.page'));
const TaskFormPage = React.lazy(() => import('./pages/task-form.page'));
const EventDetailsPage = React.lazy(() => import('./pages/event-details.page'));
const GoalsPage = React.lazy(() => import('./pages/goals.page'));
const GoalFormPage = React.lazy(() => import('./pages/goal-form.page'));
const SessionsPage = React.lazy(() => import('./pages/sessions.page'));
const ProfilePage = React.lazy(() => import('./pages/profile.page'));
const AnalyticsPage = React.lazy(() => import('./pages/analytics.page'));
const VerifyEmailPage = React.lazy(() => import('./pages/verify-email.page'));
const FeedbackPage = React.lazy(() => import('./pages/feedback.page'));
const FriendsPage = React.lazy(() => import('./pages/friends.page'));
const SubscriptionPage = React.lazy(() => import('./pages/subscription.page'));
const SettingsPage = React.lazy(() => import('./pages/settings.page'));

import { AuthProvider } from './contexts/auth-context';
import PrivateRoute from './components/private-route';
import { ThemeProvider } from './contexts/theme-provider';
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Loader2 } from "lucide-react";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-10 w-10 animate-spin" /></div>}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LoginPage />
              </motion.div>
            }
          />
          <Route
            path="/verify-email"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <VerifyEmailPage />
              </motion.div>
            }
          />
          <Route
            path="/register"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RegisterPage />
              </motion.div>
            }
          />
          <Route element={<PrivateRoute />}>
            <Route path='dashboard' element={<Layout />}>
              <Route index element={<Dashboard />} />

              <Route path='tasks/new' element={<TaskFormPage />} />
              <Route path='tasks/:id' element={<TaskFormPage />} />
              <Route path='tasks' element={<TasksPage />} />
              <Route path='goals' element={<GoalsPage />} />
              <Route path='goals/new' element={<GoalFormPage />} />
              <Route path='goals/:id' element={<GoalFormPage />} />
              <Route path='calendar' element={<CalendarPage />} />
              <Route path="calendar/:id" element={<EventDetailsPage />} />
              <Route path="sessions" element={<SessionsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path='analytics' element={<AnalyticsPage />} />
              <Route path='feedback' element={<FeedbackPage />} />
              <Route path='friends' element={<FriendsPage />} />
              <Route path='subscription' element={<SubscriptionPage />} />
              <Route path='settings' element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <AnimatedRoutes />
          </AuthProvider>
        </ThemeProvider>
        <Toaster richColors />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
