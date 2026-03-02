import { Routes, Route } from 'react-router-dom';

// Layout Components
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ChatWidget from './components/Chat/ChatWidget';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Doctors from './pages/Doctors';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Careers from './pages/Careers';
import MyApplications from './pages/MyApplications';

// About Sub-pages
import AboutHistory from './pages/about/History';
import AboutMission from './pages/about/Mission';
import AboutValues from './pages/about/Values';
import AboutLeadership from './pages/about/Leadership';
import AboutAccreditations from './pages/about/Accreditations';

// Dashboard Pages
import PatientDashboard from './pages/patient/Dashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import DoctorDashboard from './pages/doctor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminDoctors from './pages/admin/Doctors';
import AdminAppointments from './pages/admin/Appointments';
import AdminNews from './pages/admin/News';
import AdminJobs from './pages/admin/Jobs';
import AdminApplications from './pages/admin/Applications';
import AdminAnalytics from './pages/admin/Analytics';
import AdminChat from './pages/admin/Chat';
import AdminHRManagement from './pages/admin/HRManagement';
import AdminServices from './pages/admin/Services';

import AdminAwards from './pages/admin/Awards';

// HR Pages
import HRDashboard from './pages/hr/Dashboard';
import HRJobs from './pages/hr/Jobs';
import HRApplications from './pages/hr/Applications';

function App() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Scroll to top on route change */}
      <ScrollToTop />

      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main id="main-content" className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/history" element={<AboutHistory />} />
          <Route path="/about/mission" element={<AboutMission />} />
          <Route path="/about/values" element={<AboutValues />} />
          <Route path="/about/leadership" element={<AboutLeadership />} />
          <Route path="/about/accreditations" element={<AboutAccreditations />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/my-applications" element={<MyApplications />} />

          {/* Patient Routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute roles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/book"
            element={
              <ProtectedRoute roles={['patient']}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute roles={['patient']}>
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute roles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/news"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminNews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/chat"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hr"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminHRManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminServices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/awards"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminAwards />
              </ProtectedRoute>
            }
          />

          {/* HR Routes */}
          <Route
            path="/hr/dashboard"
            element={
              <ProtectedRoute roles={['hr']}>
                <HRDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/jobs"
            element={
              <ProtectedRoute roles={['hr']}>
                <HRJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/applications"
            element={
              <ProtectedRoute roles={['hr']}>
                <HRApplications />
              </ProtectedRoute>
            }
          />

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Page not found</p>
                  <a href="/" className="btn btn-primary">
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;
