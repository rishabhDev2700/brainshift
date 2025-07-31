import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login.page';
import RegisterPage from './pages/register.page';
import Dashboard from './pages/dashboard.page';
import Layout from './pages/layout';
import CalendarPage from './pages/calendar.page';
import TasksPage from './pages/tasks.page';
import MyDayPage from './pages/myday.page';
import TaskFormPage from './pages/task-form.page';
import { AuthProvider } from './contexts/auth-context';
import PrivateRoute from './components/private-route';
import { ThemeProvider } from './contexts/theme-provider';
import EventDetailsPage from './pages/event-details.page';
import GoalsPage from './pages/goals.page';
import GoalFormPage from './pages/goal-form.page';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<PrivateRoute />}>
              <Route path='dashboard' element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path='myday' element={<MyDayPage />} />
                <Route path='tasks/new' element={<TaskFormPage />} />
                <Route path='tasks/:id' element={<TaskFormPage />} />
                <Route path='tasks' element={<TasksPage />} />
                <Route path='goals' element={<GoalsPage />} />
                <Route path='goals/new' element={<GoalFormPage />} />\
                <Route path='goals/:id' element={<GoalFormPage />} />
                <Route path='calendar' element={<CalendarPage />} />
                <Route path="calendar/:id" element={<EventDetailsPage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;