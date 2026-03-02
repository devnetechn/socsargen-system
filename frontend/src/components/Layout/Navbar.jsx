import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown, FiLoader } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import TopBar from './TopBar';
import DropdownMenu from './DropdownMenu';
import ThemeToggle from './ThemeToggle';
import logo from '../../assets/newlogo.jfif';

// Dropdown data configurations
const servicesDropdown = {
  header: "Comprehensive healthcare services with state-of-the-art facilities and expert medical professionals.",
  columns: [
    {
      title: 'Cardiac & Surgical',
      items: [
        { label: 'Catheterization Laboratory', href: '/services', description: 'Advanced cardiac diagnostics' },
        { label: 'Open-Heart Surgeries', href: '/services', description: 'Complex cardiac procedures' },
        { label: 'Bypass Surgery', href: '/services', description: 'Coronary artery treatment' },
        { label: 'Cancer Care Center', href: '/services', description: 'Comprehensive oncology care' },
        { label: 'OR/DR', href: '/services', description: 'Operating & delivery rooms' }
      ]
    },
    {
      title: 'Emergency & Critical Care',
      items: [
        { label: 'ICU', href: '/services', description: 'Intensive care unit' },
        { label: 'NICU', href: '/services', description: 'Neonatal intensive care' },
        { label: 'Emergency Care', href: '/services', description: '24/7 emergency services' },
        { label: 'Urgent Care Center', href: '/services', description: 'Immediate medical attention' },
        { label: 'Outpatient Services', href: '/services', description: 'Same-day medical care' }
      ]
    },
    {
      title: 'Diagnostics & Therapy',
      items: [
        { label: 'Laboratory', href: '/services', description: 'Clinical testing services' },
        { label: 'Radiology / Imaging', href: '/services', description: 'X-ray, CT, MRI scans' },
        { label: 'Cardio-Pulmonary', href: '/services', description: 'Heart & lung diagnostics' },
        { label: 'Physical Therapy', href: '/services', description: 'Rehabilitation services' },
        { label: 'Speech Therapy', href: '/services', description: 'Communication disorders' }
      ]
    },
    {
      title: 'Specialty Services',
      items: [
        { label: 'Dental Services', href: '/services', description: 'Oral health care' },
        { label: 'Hemodialysis', href: '/services', description: 'Kidney treatment' },
        { label: 'Nutrition & Dietetics', href: '/services', description: 'Dietary counseling' },
        { label: 'Sleep Studies', href: '/services', description: 'Sleep disorder diagnosis' }
      ]
    }
  ],
  footer: { label: 'View All Services', href: '/services' }
};

const doctorsDropdown = {
  header: "At Socsargen County Hospital, we believe in honoring the guardians of health - our esteemed doctors.",
  columns: [
    {
      items: [
        { label: 'Cardiology', href: '/doctors?dept=Department of Cardiology', description: 'Heart & cardiovascular care' },
        { label: 'Orthopedics', href: '/doctors?dept=Department of Orthopedics', description: 'Bone, joint & muscle treatment' },
        { label: 'Neurology', href: '/doctors?dept=Department of Neurology', description: 'Brain & nervous system' },
        { label: 'Gastroenterology', href: '/doctors?dept=Department of Gastroenterology', description: 'Digestive system disorders' },
        { label: 'Oncology', href: '/doctors?dept=Department of Oncology', description: 'Cancer diagnosis & treatment' },
        { label: 'Internal Medicine', href: '/doctors?dept=Department of Internal Medicine', description: 'Adult disease management' },
        { label: 'Pediatrics', href: '/doctors?dept=Department of Pediatrics', description: 'Children\'s healthcare' }
      ]
    },
    {
      items: [
        { label: 'OB-Gynecology', href: '/doctors?dept=Department of OB-GYN', description: 'Women\'s health & prenatal care' },
        { label: 'Surgery', href: '/doctors?dept=Department of Surgery', description: 'Surgical procedures' },
        { label: 'Anesthesiology', href: '/doctors?dept=Department of Anesthesiology', description: 'Pain management & sedation' },
        { label: 'Family Medicine', href: '/doctors?dept=Department of Family Medicine', description: 'Comprehensive family care' },
        { label: 'Dental Medicine', href: '/doctors?dept=Department of Dental Medicine', description: 'Oral health services' },
        { label: 'Pathology', href: '/doctors?dept=Department of Pathology', description: 'Laboratory diagnosis' },
        { label: 'Radiology', href: '/doctors?dept=Department of Radiology', description: 'Medical imaging services' }
      ]
    }
  ],
  footer: { label: 'View All Doctors', href: '/doctors' }
};

const aboutDropdown = {
  header: "Welcome to Socsargen County Hospital! Here, you're more than just a patient, you're family.",
  columns: [
    {
      title: 'Our Story',
      items: [
        { label: 'History & Milestones', href: '/about/history', description: 'Our journey since establishment' },
        { label: 'Mission & Vision', href: '/about/mission', description: 'Our purpose and goals' },
        { label: 'Core Values', href: '/about/values', description: 'Principles that guide us' }
      ]
    },
    {
      title: 'Organization',
      items: [
        { label: 'Leadership', href: '/about/leadership', description: 'Meet our executives' },
        { label: 'Accreditations', href: '/about/accreditations', description: 'Certifications & awards' },
        { label: 'Careers', href: '/careers', description: 'Join our team' }
      ]
    }
  ],
  footer: { label: 'Learn More About Us', href: '/about' }
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Detect scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    window.location.href = '/';
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    return `/${user.role}/dashboard`;
  };

  const toggleMobileDropdown = (name) => {
    setMobileDropdown(mobileDropdown === name ? null : name);
  };

  return (
    <header className="sticky top-0 z-40">
      {/* Top Bar */}
      <TopBar />

      {/* Main Navigation */}
      <nav className={`transition-all duration-300 border-b ${
        scrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-md border-gray-100/50 dark:border-slate-700/50'
          : 'bg-white dark:bg-slate-900 shadow-sm border-gray-100 dark:border-slate-700'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 lg:h-[68px]">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 focus:outline-none group"
            >
              <div className="relative">
                <img
                  src={logo}
                  alt="Socsargen County Hospital Logo"
                  className="h-10 w-10 sm:h-11 sm:w-11 object-contain rounded-full ring-2 ring-primary-100 group-hover:ring-primary-300 transition-all"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs sm:text-sm font-extrabold text-primary-800 dark:text-primary-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                  SOCSARGEN
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 tracking-wide font-medium">
                  County Hospital
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-0.5">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/news" className="nav-link">News</Link>
              <DropdownMenu label="Our Services" columns={servicesDropdown.columns} header={servicesDropdown.header} footer={servicesDropdown.footer} />
              <DropdownMenu label="Our Doctors" columns={doctorsDropdown.columns} header={doctorsDropdown.header} footer={doctorsDropdown.footer} />
              <DropdownMenu label="About Us" columns={aboutDropdown.columns} header={aboutDropdown.header} footer={aboutDropdown.footer} />
              <Link to="/contact" className="nav-link">Contact Us</Link>

              <ThemeToggle />

              {/* Login/User */}
              {user ? (
                <div className="flex items-center space-x-2 ml-3">
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-sm hover:shadow-md text-sm"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-1 text-gray-500 hover:text-primary-600 transition p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    aria-label="Logout"
                  >
                    {loggingOut ? (
                      <FiLoader className="w-5 h-5 animate-spin" />
                    ) : (
                      <FiLogOut className="w-5 h-5" />
                    )}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-5 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all ml-3 shadow-sm hover:shadow-md text-sm"
                  style={{ fontFamily: 'var(--font-display)' }}
                  aria-label="Login"
                >
                  <FiUser className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile: Theme Toggle + Menu Button */}
            <div className="lg:hidden flex items-center gap-1">
              <ThemeToggle />
              <button
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition dark:text-slate-300 dark:hover:bg-slate-700"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden pb-4 border-t border-gray-100 dark:border-slate-700 mt-2 pt-4 animate-fade-in">
              <Link to="/" className="block py-3 px-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition font-medium" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/news" className="block py-3 px-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition font-medium" onClick={() => setIsOpen(false)}>News</Link>

              {/* Mobile Accordion - Services */}
              <div className="border-b border-gray-50">
                <button
                  className="w-full flex items-center justify-between py-3 px-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition font-medium"
                  onClick={() => toggleMobileDropdown('services')}
                  aria-expanded={mobileDropdown === 'services'}
                >
                  <span>Our Services</span>
                  <FiChevronDown className={`w-5 h-5 transition-transform ${mobileDropdown === 'services' ? 'rotate-180' : ''}`} />
                </button>
                {mobileDropdown === 'services' && (
                  <div className="pl-4 pb-3 space-y-0.5">
                    <p className="text-xs text-gray-400 px-3 py-2 italic">{servicesDropdown.header}</p>
                    {servicesDropdown.columns.flatMap((col) =>
                      col.items.map((item) => (
                        <Link key={`service-${item.label}`} to={item.href} className="block py-2.5 px-3 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded transition" onClick={() => setIsOpen(false)}>{item.label}</Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Accordion - Doctors */}
              <div className="border-b border-gray-50">
                <button
                  className="w-full flex items-center justify-between py-3 px-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition font-medium"
                  onClick={() => toggleMobileDropdown('doctors')}
                  aria-expanded={mobileDropdown === 'doctors'}
                >
                  <span>Our Doctors</span>
                  <FiChevronDown className={`w-5 h-5 transition-transform ${mobileDropdown === 'doctors' ? 'rotate-180' : ''}`} />
                </button>
                {mobileDropdown === 'doctors' && (
                  <div className="pl-4 pb-3 space-y-0.5">
                    <p className="text-xs text-gray-400 px-3 py-2 italic">{doctorsDropdown.header}</p>
                    {doctorsDropdown.columns.flatMap((col) =>
                      col.items.map((item) => (
                        <Link key={`doctor-${item.label}`} to={item.href} className="block py-2.5 px-3 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded transition" onClick={() => setIsOpen(false)}>{item.label}</Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Accordion - About */}
              <div className="border-b border-gray-50">
                <button
                  className="w-full flex items-center justify-between py-3 px-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition font-medium"
                  onClick={() => toggleMobileDropdown('about')}
                  aria-expanded={mobileDropdown === 'about'}
                >
                  <span>About Us</span>
                  <FiChevronDown className={`w-5 h-5 transition-transform ${mobileDropdown === 'about' ? 'rotate-180' : ''}`} />
                </button>
                {mobileDropdown === 'about' && (
                  <div className="pl-4 pb-3 space-y-0.5">
                    <p className="text-xs text-gray-400 px-3 py-2 italic">{aboutDropdown.header}</p>
                    {aboutDropdown.columns.flatMap((col) =>
                      col.items.map((item) => (
                        <Link key={`about-${item.label}`} to={item.href} className="block py-2.5 px-3 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded transition" onClick={() => setIsOpen(false)}>{item.label}</Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              <Link to="/contact" className="block py-3 px-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition font-medium" onClick={() => setIsOpen(false)}>Contact Us</Link>

              {/* Login/User */}
              <div className="border-t border-gray-200 mt-3 pt-3">
                {user ? (
                  <>
                    <Link to={getDashboardPath()} className="flex items-center gap-2 py-3 px-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition font-medium" onClick={() => setIsOpen(false)}>
                      <FiUser className="w-5 h-5" /> Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      disabled={loggingOut}
                      className="flex items-center gap-2 w-full py-3 px-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition font-medium text-left disabled:opacity-50"
                    >
                      {loggingOut ? (<><FiLoader className="w-5 h-5 animate-spin" /> Logging out...</>) : (<><FiLogOut className="w-5 h-5" /> Logout</>)}
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 py-3 px-3 text-primary-600 hover:bg-primary-50 rounded-lg transition font-semibold" onClick={() => setIsOpen(false)}>
                    <FiUser className="w-5 h-5" /> Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
