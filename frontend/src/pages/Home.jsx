import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiArrowRight,
  FiPhone,
  FiMail,
  FiMapPin,
  FiUser,
  FiActivity,
  FiHeart,
  FiCalendar,
  FiAward,
  FiUsers,
  FiClock,
  FiShield,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiBriefcase
} from 'react-icons/fi';
import api from '../utils/api';
import { getBaseURL } from '../utils/url';
import hmoPartnersImg from '../assets/hmo-partners.jpg';
import hospitalAerialImg from '../assets/hospital-aerial.jpg';
import hero1Img from '../assets/hero1.jpg';
import hero3Img from '../assets/hero3.jpg';
import hero4Img from '../assets/hero4.jpg';
import hero5Img from '../assets/hero5.jpg';
import hero6Img from '../assets/hero6.jpg';
import storyVideo1 from '../assets/video1.mp4';

const Home = () => {
  // Hero slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Video state and ref
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  // Hardcoded patient testimonials
  const patientTestimonials = [
    {
      id: 1,
      title: 'Recovery Journey',
      patientName: 'KARELLE M. RABIA',
      quote: 'I am deeply grateful to Socsargen County Hospital. It was here that I truly experienced genuine compassion and care from every staff member.',
      year: '2025',
    },
    {
      id: 2,
      title: 'Heart Surgery Success',
      patientName: 'JUAN D. SANTOS',
      quote: 'The doctors and nurses went above and beyond to make sure I was comfortable throughout my treatment. I felt like family here.',
      year: '2025',
    },
    {
      id: 3,
      title: 'Safe Delivery',
      patientName: 'MARIA L. CRUZ',
      quote: 'From admission to discharge, every step was handled with professionalism and warmth. I highly recommend this hospital to everyone.',
      year: '2024',
    },
  ];

  // Testimonial slider state
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const currentStory = patientTestimonials[currentStoryIndex] || null;

  const goToPrevStory = () => {
    setCurrentStoryIndex((prev) => (prev - 1 + patientTestimonials.length) % patientTestimonials.length);
  };

  const goToNextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % patientTestimonials.length);
  };

  const heroSlides = [
    {
      image: hero1Img,
      alt: 'Catheterization Laboratory',
      facility: 'Catheterization Laboratory',
      description: 'State-of-the-art cardiac care with minimally invasive diagnostic tests and treatment procedures.',
      link: '/services/catheterization-laboratory'
    },
    {
      image: hero3Img,
      alt: 'Emergency Services',
      facility: 'Emergency Services',
      description: '24/7 Emergency Department equipped with advanced life-saving equipment and experienced physicians.',
      link: '/services/emergency-services'
    },
    {
      image: hero4Img,
      alt: 'ICU',
      facility: 'ICU',
      description: 'Advanced ICU with monitoring systems, ventilators, and round-the-clock specialized care.',
      link: '/services/icu'
    },
    {
      image: hero5Img,
      alt: 'OR/DR',
      facility: 'OR/DR',
      description: 'Modern surgical suites with cutting-edge technology for various procedures.',
      link: '/services/or-dr'
    },
    {
      image: hero6Img,
      alt: 'Radiology / Imaging',
      facility: 'Radiology / Imaging',
      description: 'Complete imaging services including CT Scan, MRI, X-Ray, and Ultrasound.',
      link: '/services/radiology-imaging'
    }
  ];

  // Navigation functions
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  // Auto-slide effect for hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Fetch featured services from API
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['services', 'featured'],
    queryFn: () => api.get('/services/featured').then(res => res.data).catch((error) => {
      console.error('Failed to fetch services:', error);
      return null;
    })
  });

  // Fetch doctors from API
  const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
    queryKey: ['doctors', 'home'],
    queryFn: () => api.get('/doctors?limit=6').then(res => res.data).catch((error) => {
      console.error('Failed to fetch doctors:', error);
      return null;
    })
  });

  // Service icons mapping
  const getServiceIcon = (iconName) => {
    const icons = {
      'emergency': <FiActivity className="w-8 h-8" />,
      'outpatient': <FiUser className="w-8 h-8" />,
      'lab': <FiShield className="w-8 h-8" />,
      'radiology': <FiActivity className="w-8 h-8" />,
      'pharmacy': <FiHeart className="w-8 h-8" />,
      'surgery': <FiActivity className="w-8 h-8" />,
      'cardiology': <FiHeart className="w-8 h-8" />,
      'pediatrics': <FiUsers className="w-8 h-8" />,
      'obstetrics': <FiHeart className="w-8 h-8" />,
      'icu': <FiActivity className="w-8 h-8" />,
      'default': <FiActivity className="w-8 h-8" />
    };
    return icons[iconName] || icons['default'];
  };

  // Doctor categories
  const doctorCategories = [
    'Admitting Physician',
    'Anesthesiologist',
    'Attending Physician',
    'Resident on Duty',
    'Surgeon',
    'Referral'
  ];

  // Get doctor photo URL
  const getDoctorPhotoUrl = (photoUrl) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith('http')) return photoUrl;
    return `${getBaseURL()}${photoUrl}`;
  };

  // Health packages
  const healthPackages = [
    {
      id: 1,
      title: '2-Benefit Heart Surgery Package',
      description: 'Comprehensive cardiac care including surgery and post-operative care',
      icon: <FiHeart className="w-10 h-10" />
    },
    {
      id: 2,
      title: 'Z-Benefit Package for Breast Cancer',
      description: 'Complete breast cancer treatment and support services',
      icon: <FiShield className="w-10 h-10" />
    },
    {
      id: 3,
      title: 'All-Inclusive Maternity Package',
      description: 'Full maternity care from prenatal to postnatal services',
      icon: <FiUsers className="w-10 h-10" />
    },
    {
      id: 4,
      title: 'Angiogram Package',
      description: 'Diagnostic imaging for cardiovascular assessment',
      icon: <FiActivity className="w-10 h-10" />
    }
  ];

  // Fetch news from API (get more for featured slider + card carousel)
  const { data: newsData, isLoading: newsLoading } = useQuery({
    queryKey: ['news', 'home'],
    queryFn: () => api.get('/news?limit=10').then(res => res.data).catch((error) => {
      console.error('Failed to fetch news:', error);
      return null;
    })
  });

  // Fetch active jobs from API
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs', 'home'],
    queryFn: () => api.get('/jobs?limit=6').then(res => res.data).catch((error) => {
      console.error('Failed to fetch jobs:', error);
      return null;
    })
  });

  // HMO Partners data and state
  const [hmoSearchQuery, setHmoSearchQuery] = useState('');
  const [hmoSelectedCategory, setHmoSelectedCategory] = useState('All');

  const hmoCategories = ['All', 'HMO', 'Insurance', 'Government', 'Corporate'];

  const hmoPartners = [
    // HMO
    { id: 1, name: 'Maxicare', category: 'HMO', color: 'bg-blue-500' },
    { id: 2, name: 'Intellicare', category: 'HMO', color: 'bg-green-500' },
    { id: 3, name: 'Medicard', category: 'HMO', color: 'bg-red-500' },
    { id: 4, name: 'PhilCare', category: 'HMO', color: 'bg-purple-500' },
    { id: 5, name: 'Cocolife Healthcare', category: 'HMO', color: 'bg-yellow-500' },
    { id: 6, name: 'Caritas Health Shield', category: 'HMO', color: 'bg-teal-500' },
    { id: 7, name: 'Asianlife', category: 'HMO', color: 'bg-indigo-500' },
    { id: 8, name: 'Valucare', category: 'HMO', color: 'bg-orange-500' },
    { id: 9, name: 'Eastwest Healthcare', category: 'HMO', color: 'bg-pink-500' },
    { id: 10, name: 'Insular Health Care', category: 'HMO', color: 'bg-cyan-500' },
    { id: 11, name: 'Medicare Plus', category: 'HMO', color: 'bg-lime-500' },
    { id: 12, name: 'Pacific Cross', category: 'HMO', color: 'bg-rose-500' },
    // Insurance
    { id: 13, name: 'Sun Life', category: 'Insurance', color: 'bg-amber-500' },
    { id: 14, name: 'Pru Life UK', category: 'Insurance', color: 'bg-red-600' },
    { id: 15, name: 'AXA Philippines', category: 'Insurance', color: 'bg-blue-600' },
    { id: 16, name: 'Manulife', category: 'Insurance', color: 'bg-green-600' },
    { id: 17, name: 'BPI-Philam', category: 'Insurance', color: 'bg-red-500' },
    { id: 18, name: 'Allianz PNB Life', category: 'Insurance', color: 'bg-blue-700' },
    // Government
    { id: 19, name: 'PhilHealth', category: 'Government', color: 'bg-green-700' },
    { id: 20, name: 'GSIS', category: 'Government', color: 'bg-blue-800' },
    { id: 21, name: 'SSS', category: 'Government', color: 'bg-sky-600' },
    // Corporate
    { id: 22, name: 'DSWD AICS', category: 'Corporate', color: 'bg-orange-600' },
    { id: 23, name: 'PCSO', category: 'Corporate', color: 'bg-yellow-600' },
    { id: 24, name: 'DOH Medical Assistance', category: 'Corporate', color: 'bg-emerald-600' },
  ];

  const filteredHmoPartners = hmoPartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(hmoSearchQuery.toLowerCase());
    const matchesCategory = hmoSelectedCategory === 'All' || partner.category === hmoSelectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Format date helper
  const formatNewsDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="overflow-hidden">
      {/* Section 1: Hero Section with Slideshow */}
      <section className="relative h-[calc(100vh-80px)] sm:h-[calc(100vh-100px)] min-h-[480px] overflow-hidden">
        {/* Slideshow Images */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 30%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          </div>
        ))}

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent z-[5]"></div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent-400 rounded-full animate-pulse"></span>
                <span className="text-accent-300 font-semibold text-[10px] sm:text-xs uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>
                  Featured: {heroSlides[currentSlide].facility}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-5 leading-[1.1] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Welcome to<br />
                <span className="bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
                  Socsargen County
                </span><br />
                Hospital
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-5 sm:mb-8 leading-relaxed max-w-xl">
                {heroSlides[currentSlide].description}
              </p>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                <Link
                  to={heroSlides[currentSlide].link}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 font-semibold px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary-500/25 hover:shadow-xl text-sm sm:text-base"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <span className="sm:hidden">Explore</span>
                  <span className="hidden sm:inline">Explore {heroSlides[currentSlide].facility}</span>
                  <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 font-semibold px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl transition-all duration-300 text-sm sm:text-base"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  All Services
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all border border-white/10"
          aria-label="Previous slide"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNextSlide}
          className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all border border-white/10"
          aria-label="Next slide"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? 'bg-white w-10'
                  : 'bg-white/40 hover:bg-white/60 w-4'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Quick Help Section */}
      <section className="py-12 sm:py-20 bg-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #059669 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-8 sm:mb-14">
            <p className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-display)' }}>How can we help?</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Quality Healthcare in<br className="hidden sm:block" /> General Santos City
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-400 mx-auto rounded-full mt-3 sm:mt-4"></div>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-5xl mx-auto">
            <Link
              to="/doctors"
              className="group bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center hover:shadow-2xl hover:shadow-primary-100 hover:-translate-y-1 transition-all duration-500"
            >
              <div className="mx-auto mb-3 sm:mb-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-500 rotate-3 group-hover:rotate-0" style={{ width: '52px', height: '52px' }}>
                <FiUser className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-xs sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2 group-hover:text-primary-600 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Find a Doctor</h3>
              <p className="text-gray-500 text-[10px] sm:text-sm hidden sm:block">Search our medical specialists</p>
            </Link>

            <Link
              to="/services"
              className="group bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center hover:shadow-2xl hover:shadow-primary-100 hover:-translate-y-1 transition-all duration-500"
            >
              <div className="mx-auto mb-3 sm:mb-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-500 -rotate-3 group-hover:rotate-0" style={{ width: '52px', height: '52px' }}>
                <FiActivity className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-xs sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2 group-hover:text-primary-600 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Book a Check Up</h3>
              <p className="text-gray-500 text-[10px] sm:text-sm hidden sm:block">Comprehensive health screening</p>
            </Link>

            <Link
              to="/services"
              className="group bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center hover:shadow-2xl hover:shadow-primary-100 hover:-translate-y-1 transition-all duration-500"
            >
              <div className="mx-auto mb-3 sm:mb-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-500 rotate-3 group-hover:rotate-0" style={{ width: '52px', height: '52px' }}>
                <FiHeart className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-xs sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2 group-hover:text-primary-600 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Wellness Packages</h3>
              <p className="text-gray-500 text-[10px] sm:text-sm hidden sm:block">Preventive care programs</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: Our Services Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-14">
            <p className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-display)' }}>What We Offer</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Our Services
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              With a full range of services and advanced treatments, we ensure every patient receives the care they need with heart, skill, and commitment.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-400 mx-auto rounded-full mt-5"></div>
          </div>

          {servicesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                  <div className="h-32 sm:h-40 bg-gray-200"></div>
                  <div className="p-3 sm:p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
              {(servicesData?.data || servicesData || []).slice(0, 10).map((service, index) => {
                const slug = (service?.name || 'service')
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '');
                const name = (service?.name || '').toLowerCase();
                const category = (service?.category || '').toLowerCase();
                const gradientColor = name.includes('cardiac') || name.includes('heart') || name.includes('cardio') || category.includes('cardiac') ? 'from-red-500 to-red-600'
                  : name.includes('surgery') || name.includes('surgical') || category.includes('surgical') ? 'from-blue-500 to-blue-600'
                  : name.includes('emergency') || name.includes('urgent') || category.includes('emergency') ? 'from-orange-500 to-orange-600'
                  : name.includes('lab') || name.includes('diagnostic') || category.includes('diagnostic') ? 'from-purple-500 to-purple-600'
                  : name.includes('therapy') || name.includes('rehab') || category.includes('therapy') ? 'from-teal-500 to-teal-600'
                  : name.includes('icu') || name.includes('intensive') || category.includes('critical') ? 'from-rose-500 to-rose-600'
                  : 'from-green-500 to-green-600';
                return (
                  <Link
                    key={service?.id || index}
                    to={`/services/${slug}`}
                    className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-500 group block"
                  >
                    <div className={`h-32 sm:h-40 bg-gradient-to-br ${gradientColor} relative overflow-hidden`}>
                      {service?.imageUrl ? (
                        <img
                          src={`${getBaseURL()}${service.imageUrl}`}
                          alt={service?.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiActivity className="text-white/20 text-4xl sm:text-5xl" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {service?.name || 'Service'}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mt-1">
                        {service?.description || 'Quality healthcare service'}
                      </p>
                    </div>
                  </Link>
                );
              })}
              {/* Fallback services if API returns empty */}
              {(!servicesData || (servicesData?.data || servicesData || []).length === 0) && (
                <>
                  {[
                    { id: 'fallback-emergency', name: 'Emergency Care', icon: 'emergency', description: '24/7 emergency medical services', gradient: 'from-orange-500 to-orange-600' },
                    { id: 'fallback-outpatient', name: 'Outpatient Services', icon: 'outpatient', description: 'Comprehensive outpatient care', gradient: 'from-green-500 to-green-600' },
                    { id: 'fallback-lab', name: 'Laboratory', icon: 'lab', description: 'Advanced diagnostic testing', gradient: 'from-purple-500 to-purple-600' },
                    { id: 'fallback-radiology', name: 'Radiology', icon: 'radiology', description: 'Medical imaging services', gradient: 'from-indigo-500 to-indigo-600' },
                    { id: 'fallback-pharmacy', name: 'Pharmacy', icon: 'pharmacy', description: 'In-hospital pharmacy', gradient: 'from-cyan-500 to-cyan-600' },
                    { id: 'fallback-surgery', name: 'Surgery', icon: 'surgery', description: 'Surgical procedures', gradient: 'from-blue-500 to-blue-600' },
                    { id: 'fallback-cardiology', name: 'Cardiology', icon: 'cardiology', description: 'Heart care services', gradient: 'from-red-500 to-red-600' },
                    { id: 'fallback-pediatrics', name: 'Pediatrics', icon: 'pediatrics', description: 'Child healthcare', gradient: 'from-teal-500 to-teal-600' },
                    { id: 'fallback-obstetrics', name: 'Obstetrics', icon: 'obstetrics', description: 'Maternity services', gradient: 'from-pink-500 to-pink-600' },
                    { id: 'fallback-icu', name: 'ICU', icon: 'icu', description: 'Intensive care unit', gradient: 'from-rose-500 to-rose-600' }
                  ].map((service) => {
                    const slug = service.name
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '');
                    return (
                      <Link
                        key={service.id}
                        to={`/services/${slug}`}
                        className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-500 group block"
                      >
                        <div className={`h-32 sm:h-40 bg-gradient-to-br ${service.gradient} relative overflow-hidden`}>
                          <div className="w-full h-full flex items-center justify-center">
                            <FiActivity className="text-white/20 text-4xl sm:text-5xl" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {service.name}
                          </h3>
                          <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mt-1">
                            {service.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </>
              )}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 text-lg"
            >
              View All Services
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Facilities Overview */}
      <section className="py-12 sm:py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-8 sm:mb-14">
            <p className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-display)' }}>Our Facilities</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              World-Class Facilities
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
              Our hospital is equipped with state-of-the-art facilities to provide you with the best healthcare experience.
            </p>
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-400 mx-auto rounded-full mt-4 sm:mt-5"></div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 max-w-6xl mx-auto">
            {heroSlides.map((slide, index) => (
              <Link
                key={index}
                to={slide.link}
                className="group bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center hover:shadow-2xl hover:shadow-primary-100 hover:-translate-y-1 transition-all duration-500"
              >
                <div className="w-11 h-11 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-500 rotate-3 group-hover:rotate-0">
                  <FiActivity className="w-5 h-5 sm:w-7 sm:h-7 text-primary-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-[10px] sm:text-sm font-bold text-gray-800 group-hover:text-primary-600 transition-colors leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  {slide.facility}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Meet Our Doctors Section */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-800 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-primary-300 font-semibold text-sm uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-display)' }}>Our Medical Team</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Meet our Doctors
            </h2>
            <p className="text-primary-200/80 text-sm sm:text-base max-w-2xl mx-auto">
              Meet the seasoned experts of Socsargen County Hospital.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-accent-400 mx-auto rounded-full mt-5"></div>
          </div>

          {/* Doctor Categories - horizontal scroll on mobile */}
          <div className="flex gap-2 sm:gap-3 mb-8 sm:mb-10 overflow-x-auto scrollbar-hide sm:flex-wrap sm:justify-center pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {doctorCategories.map((category, index) => (
              <button
                key={index}
                type="button"
                className="bg-white/10 border-2 border-white/30 text-white px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-white hover:text-primary-700 hover:border-white transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Doctor Cards */}
          {doctorsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-6xl mx-auto mb-8 sm:mb-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/20 rounded-xl h-48 sm:h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (doctorsData?.data || doctorsData || []).length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-6xl mx-auto mb-8 sm:mb-10">
              {(doctorsData?.data || doctorsData || []).slice(0, 6).map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    {doctor.photoUrl || doctor.photo_url ? (
                      <img
                        src={getDoctorPhotoUrl(doctor.photoUrl || doctor.photo_url)}
                        alt={doctor.name || `Dr. ${doctor.firstName} ${doctor.lastName}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{ objectPosition: 'center 20%' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                        <FiUser className="w-10 h-10 sm:w-16 sm:h-16 text-primary-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 sm:p-4 text-center">
                    <h3 className="font-semibold text-gray-800 text-xs sm:text-sm mb-0.5 sm:mb-1 leading-tight line-clamp-2">
                      {doctor.name || `Dr. ${doctor.firstName || doctor.first_name} ${doctor.lastName || doctor.last_name}`}
                    </h3>
                    <p className="text-primary-600 text-[10px] sm:text-xs font-medium line-clamp-1">
                      {doctor.specialization || doctor.specialty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 mb-8 sm:mb-10">
              <div className="bg-white/20 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
                <FiUser className="text-2xl sm:text-3xl text-white/70" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Doctors Yet</h3>
              <p className="text-primary-200 text-sm">Our medical team will be added soon.</p>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-lg transition-all duration-300"
            >
              View All Doctors
              <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Health Packages Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-14">
            <p className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-display)' }}>Care Plans</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Health Packages
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
              Comprehensive care packages designed to make quality healthcare accessible and affordable for every patient.
            </p>
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-400 mx-auto rounded-full mt-4 sm:mt-5"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 max-w-6xl mx-auto">
            {healthPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-300 group"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                  {pkg.icon}
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2 leading-tight">
                  {pkg.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {pkg.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 text-lg"
            >
              View All Health Packages
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 7: About Hospital Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-primary-300 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-display)' }}>About Us</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-4 tracking-tight max-w-4xl mx-auto" style={{ fontFamily: 'var(--font-display)' }}>
              A Private ISO-Accredited Tertiary Hospital in General Santos City
            </h2>
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-primary-400 to-accent-400 mx-auto rounded-full mt-4 sm:mt-5"></div>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="grid md:grid-cols-2">
                <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                  <p className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-4" style={{ fontFamily: 'var(--font-display)' }}>Established</p>
                  <Link
                    to="/about/history"
                    className="text-5xl sm:text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2 sm:mb-4 block hover:from-primary-500 hover:to-primary-700 transition-all cursor-pointer" style={{ fontFamily: 'var(--font-display)' }}
                  >
                    1992
                  </Link>
                  <p className="text-gray-500 text-sm sm:text-lg leading-relaxed mb-4 sm:mb-6">
                    Serving the people of General Santos City and setting the standards of healthcare in Region 12.
                  </p>
                  <Link
                    to="/about/history"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 font-semibold px-6 py-3 rounded-xl transition-all duration-300 w-fit shadow-lg hover:shadow-xl" style={{ fontFamily: 'var(--font-display)' }}
                  >
                    History & Milestones
                    <FiArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className="h-64 md:h-auto">
                  <img
                    src={hospitalAerialImg}
                    alt="Socsargen County Hospital Aerial View"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Patient Stories/Testimonials Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-14">
            <p className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-display)' }}>Testimonials</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Our SCH Stories
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
              Featuring real patients whose journeys remind us that healing starts with compassion and care.
            </p>
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-400 mx-auto rounded-full mt-4 sm:mt-5"></div>
          </div>

          <div className="max-w-5xl mx-auto relative">
            {/* Previous Button */}
            {patientTestimonials.length > 1 && (
              <button
                onClick={goToPrevStory}
                className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white hover:bg-primary-50 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border border-gray-200"
                aria-label="Previous story"
              >
                <FiChevronLeft className="w-6 h-6 text-primary-600" />
              </button>
            )}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* LEFT: Single Video */}
                <div className="relative aspect-video md:aspect-auto md:h-full bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src={storyVideo1} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {/* Video controls */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <button
                      onClick={toggleVideoMute}
                      className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                      aria-label={isVideoMuted ? 'Unmute video' : 'Mute video'}
                    >
                      {isVideoMuted ? (
                        <FiVolumeX className="w-5 h-5 text-gray-700" />
                      ) : (
                        <FiVolume2 className="w-5 h-5 text-primary-600" />
                      )}
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                      aria-label="Fullscreen"
                    >
                      <FiMaximize className="w-5 h-5 text-gray-700 hover:text-primary-600" />
                    </button>
                  </div>
                </div>

                {/* RIGHT: Rotating Patient Comments */}
                <div className="p-5 sm:p-8 md:p-10 flex flex-col justify-center">
                  <span className="inline-block bg-primary-100 text-primary-700 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mb-4 sm:mb-6 w-fit">
                    {currentStory?.title || 'Patient Highlight'}
                  </span>
                  <blockquote className="text-base sm:text-xl md:text-2xl text-gray-700 italic mb-5 sm:mb-8 leading-relaxed relative">
                    <span className="absolute -top-3 -left-1 sm:-top-4 sm:-left-2 text-4xl sm:text-6xl text-primary-200 font-serif leading-none">"</span>
                    <span className="relative z-10">
                      {currentStory?.quote}
                    </span>
                  </blockquote>
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiUser className="w-5 h-5 sm:w-7 sm:h-7 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm sm:text-lg">{currentStory?.patientName}</p>
                      <p className="text-gray-500 text-xs sm:text-sm">Patient - {currentStory?.year}</p>
                    </div>
                  </div>

                  {/* Slide indicators */}
                  {patientTestimonials.length > 1 && (
                    <div className="flex items-center gap-2 mb-6">
                      {patientTestimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentStoryIndex(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            index === currentStoryIndex
                              ? 'bg-primary-600 w-6'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to story ${index + 1}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {currentStoryIndex + 1} / {patientTestimonials.length}
                      </span>
                    </div>
                  )}

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300 w-fit"
                  >
                    Contact Us
                    <FiArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Next Button */}
            {patientTestimonials.length > 1 && (
              <button
                onClick={goToNextStory}
                className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white hover:bg-primary-50 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border border-gray-200"
                aria-label="Next story"
              >
                <FiChevronRight className="w-6 h-6 text-primary-600" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Section 9: HMO Partners Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-14">
            <p className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-display)' }}>Partners</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              HMO &amp; Insurance Partners
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
              We partner with leading Health Maintenance Organizations (HMOs) to make quality healthcare more accessible.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-400 mx-auto rounded-full mt-5"></div>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search HMO or Insurance..."
                value={hmoSearchQuery}
                onChange={(e) => setHmoSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {hmoCategories.map((category) => (
              <button
                key={category}
                onClick={() => setHmoSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  hmoSelectedCategory === category
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Partners Grid */}
          <div className="max-w-5xl mx-auto">
            {filteredHmoPartners.length === 0 ? (
              <div className="text-center py-12">
                <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No partners found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredHmoPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-primary-300 transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 ${partner.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <span className="text-white font-bold text-lg">
                        {partner.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-800 text-center line-clamp-2">
                      {partner.name}
                    </h3>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      {partner.category}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Partner Count */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Showing {filteredHmoPartners.length} of {hmoPartners.length} partners
          </p>
        </div>
      </section>

      {/* Facebook Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"></div>
        <div className="max-w-5xl mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-10">
            {/* Left Content */}
            <div className="text-center lg:text-left text-white lg:flex-1">
              <p className="text-primary-300 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-display)' }}>Follow Us</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Stay Connected with <br className="hidden md:block" />Socsargen County Hospital!
              </h2>
              <p className="text-primary-200/80 text-sm sm:text-lg leading-relaxed">
                Don't miss out on the latest hospital news, health tips,
                and upcoming events. Like our Facebook page to stay
                informed and be part of our growing community!
              </p>
              <a
                href="https://www.facebook.com/SocsargenCountyHospitalOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl" style={{ fontFamily: 'var(--font-display)' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Follow Us on Facebook
              </a>
            </div>

            {/* Right Facebook Embed - Responsive */}
            <div className="w-full lg:w-auto flex justify-center">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden inline-block">
                {/* Mobile: 320px width, Desktop: 400px width */}
                <div className="block md:hidden">
                  <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FSocsargenCountyHospitalOfficial&tabs=timeline&width=320&height=380&small_header=true&adapt_container_width=false&hide_cover=false&show_facepile=false"
                    width="320"
                    height="380"
                    style={{ border: 'none', overflow: 'hidden', display: 'block' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="Socsargen County Hospital Facebook Page"
                  ></iframe>
                </div>
                <div className="hidden md:block">
                  <iframe
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FSocsargenCountyHospitalOfficial&tabs=timeline&width=400&height=450&small_header=false&adapt_container_width=false&hide_cover=false&show_facepile=true"
                    width="400"
                    height="450"
                    style={{ border: 'none', overflow: 'hidden', display: 'block' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title="Socsargen County Hospital Facebook Page"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: News and Events Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center mb-6 sm:mb-10">
          <p className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-display)' }}>Stay Updated</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            News and Events
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
            Stay updated on Socsargen County Hospital latest news, events, and wellness initiatives.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-400 mx-auto rounded-full mt-5"></div>
        </div>

        {newsLoading ? (
          <div className="space-y-8">
            <div className="relative h-[400px] md:h-[500px] bg-gray-200 animate-pulse rounded-xl max-w-6xl mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 h-64 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        ) : (newsData?.data || []).length > 0 ? (
          <div className="space-y-12">
            {/* Featured News Slider - Top */}
            <FeaturedNewsSlider newsItems={(newsData?.data || []).slice(0, 3)} />

            {/* News Cards - Bottom */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 text-center mb-6">Latest Updates</h3>
              <NewsSlider newsItems={newsData?.data || []} />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No News Yet</h3>
            <p className="text-gray-500">Check back later for updates and announcements.</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 text-lg"
          >
            View All News &amp; Events
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Patient's Choice Award Section */}
      <PatientChoiceAwardHome />

      {/* Section 11: Careers/Hiring Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-14">
            <p className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-display)' }}>Careers</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Join Our Team
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
              Be part of our mission to provide quality healthcare. Explore career opportunities at Socsargen County Hospital.
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-400 mx-auto rounded-full mt-5"></div>
          </div>

          {jobsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 h-48 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (jobsData?.data || jobsData || []).length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {(jobsData?.data || jobsData || []).slice(0, 6).map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-primary-300 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500 transition-colors">
                      <FiBriefcase className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{job.department}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full">
                          {job.jobType || job.job_type || 'Full-time'}
                        </span>
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {job.location || 'General Santos City'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <FiBriefcase className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Open Positions</h3>
              <p className="text-gray-500">Check back later for career opportunities.</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 bg-primary-600 text-white hover:bg-primary-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            >
              View All Job Openings
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 12: Contact Preview Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-14">
              <p className="text-primary-300 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-display)' }}>Get In Touch</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Contact Us
              </h2>
              <p className="text-primary-200/80 text-sm sm:text-lg">
                We are here to take care of you
              </p>
              <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-primary-400 to-accent-400 mx-auto rounded-full mt-4 sm:mt-5"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center hover:bg-white/20 transition-all duration-500 hover:-translate-y-1 group">
                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-white/30 transition-colors">
                  <FiPhone className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2" style={{ fontFamily: 'var(--font-display)' }}>Phone</h3>
                <p className="text-primary-200/80 text-sm">553-8906 / 553-8907</p>
                <p className="text-primary-200/80 text-sm">0932-692-4708</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center hover:bg-white/20 transition-all duration-500 hover:-translate-y-1 group">
                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-white/30 transition-colors">
                  <FiMail className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2" style={{ fontFamily: 'var(--font-display)' }}>Email</h3>
                <p className="text-primary-200/80 text-sm">edpsocsargen@gmail.com</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center hover:bg-white/20 transition-all duration-500 hover:-translate-y-1 group">
                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-white/30 transition-colors">
                  <FiMapPin className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2" style={{ fontFamily: 'var(--font-display)' }}>Address</h3>
                <p className="text-primary-200/80 text-xs sm:text-sm">L. Arradaza St., Bula-Lagao Road, Lagao, General Santos City</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl" style={{ fontFamily: 'var(--font-display)' }}
              >
                Get in Touch
                <FiArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency CTA Bar */}
      <section className="py-3 sm:py-5 bg-gradient-to-r from-accent-500 via-accent-400 to-accent-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.05) 20px, rgba(0,0,0,0.05) 40px)' }}></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 text-center">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent-900/10 rounded-lg flex items-center justify-center">
                <FiClock className="w-4 h-4 sm:w-5 sm:h-5 text-accent-900" />
              </div>
              <span className="font-bold text-accent-900 tracking-wide text-xs sm:text-base" style={{ fontFamily: 'var(--font-display)' }}>24/7 Emergency Services</span>
            </div>
            <span className="hidden sm:inline text-accent-700/40">|</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent-900/10 rounded-lg flex items-center justify-center">
                <FiPhone className="w-4 h-4 sm:w-5 sm:h-5 text-accent-900" />
              </div>
              <span className="font-extrabold text-accent-900 text-sm sm:text-lg tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>553-8906 / 0932-692-4708</span>
            </div>
          </div>
        </div>
      </section>

      {/* Find Us on the Map Section */}
      <section className="bg-white">
        <div className="text-center py-8 sm:py-14">
          <p className="text-primary-600 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-display)' }}>Location</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Find Us on the Map</h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Visit us at Socsargen County Hospital in Lagao, General Santos City
          </p>
          <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-400 mx-auto rounded-full mt-4 sm:mt-5"></div>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5610.317122515964!2d125.18693377253548!3d6.118144569811807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f79fb707dc388d%3A0x3dc68b9d61e2c8c4!2sSocsargen%20County%20Hospital!5e0!3m2!1sen!2sph!4v1768029721585!5m2!1sen!2sph"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Socsargen County Hospital Location"
          className="w-full"
        ></iframe>
      </section>
    </div>
  );
};

// Color theme mapping for awards
const AWARD_THEMES = {
  rose:    { gradient: 'from-rose-500 to-pink-600',    bgLight: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200' },
  amber:   { gradient: 'from-amber-500 to-yellow-600',  bgLight: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200' },
  emerald: { gradient: 'from-emerald-500 to-green-600', bgLight: 'bg-emerald-50',  text: 'text-emerald-600',  border: 'border-emerald-200' },
  blue:    { gradient: 'from-blue-500 to-indigo-600',   bgLight: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200' },
  purple:  { gradient: 'from-purple-500 to-violet-600', bgLight: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-200' },
};

// Patient's Choice Award Section for Home Page
const PatientChoiceAwardHome = () => {
  const API_URL = getBaseURL();
  const { data: awards, isLoading } = useQuery({
    queryKey: ['awards', 'home'],
    queryFn: () => api.get('/awards?limit=3').then(res => res.data)
  });

  if (isLoading) {
    return (
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse border border-gray-100">
                <div className="h-64 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!awards || awards.length === 0) return null;

  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <FiAward className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-amber-600 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-display)' }}>Recognition</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Patient's Choice Award
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto">
            Celebrating the departments recognized by our patients for their exceptional care and service.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full mt-5"></div>
        </div>

        {/* Award Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {awards.map((award) => {
            const theme = AWARD_THEMES[award.colorTheme] || AWARD_THEMES.amber;
            const photoSrc = award.photoUrl
              ? (award.photoUrl.startsWith('http') ? award.photoUrl : `${API_URL}${award.photoUrl}`)
              : null;

            return (
              <div
                key={award.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border ${theme.border} group`}
              >
                {/* Photo */}
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {photoSrc ? (
                    <img
                      src={photoSrc}
                      alt={award.recipient}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                      <FiAward className="w-16 h-16 text-white/40" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Award badge */}
                  <div className={`absolute top-3 right-3 ${theme.bgLight} backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm`}>
                    <FiAward className={`w-3.5 h-3.5 ${theme.text}`} />
                    <span className={`text-[11px] font-bold ${theme.text} uppercase tracking-wide`}>Award</span>
                  </div>

                  {/* Title on photo */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
                      {award.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Recipient */}
                  <p className={`font-semibold ${theme.text} text-sm mb-2`}>
                    {award.recipient}
                  </p>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    {award.description}
                  </p>

                  {/* Vote count */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <FiHeart className={`w-4 h-4 ${theme.text}`} />
                    <span className="text-sm text-gray-600">
                      <span className="font-bold text-gray-800">{award.votes?.toLocaleString()}</span> patient votes
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Featured News Slider - Full-width background image/video slider with auto-rotate
const FeaturedNewsSlider = ({ newsItems }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef({});
  const API_URL = getBaseURL();

  const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  // Auto-rotate: 10s for videos, 5s for images
  useEffect(() => {
    if (newsItems.length <= 1) return;
    const currentNews = newsItems[currentSlide];
    const duration = currentNews?.videoUrl ? 10000 : 5000;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % newsItems.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [newsItems.length, currentSlide, newsItems]);

  // Handle video play/pause when slide changes
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([idx, video]) => {
      if (!video) return;
      if (parseInt(idx) === currentSlide) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % newsItems.length);
  };

  if (newsItems.length === 0) return null;

  return (
    <div className="relative h-[350px] md:h-[450px] max-w-6xl mx-auto rounded-xl overflow-hidden shadow-xl">
      {/* Slides */}
      {newsItems.map((news, index) => (
        <div
          key={news.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background: Video or Image */}
          {news.videoUrl ? (
            <video
              ref={(el) => { videoRefs.current[index] = el; }}
              src={getMediaUrl(news.videoUrl)}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay={index === 0}
              muted
              loop
              playsInline
              preload="auto"
            />
          ) : news.imageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${getMediaUrl(news.imageUrl)})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            <div className="max-w-2xl">
              <h3 className="text-xl md:text-3xl font-bold text-white mb-4 line-clamp-3">
                {news.title}
              </h3>
              <p className="text-gray-200 text-sm md:text-base mb-4 line-clamp-2 hidden md:block">
                {news.excerpt}
              </p>
              <Link
                to={`/news/${news.slug}`}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-300"
              >
                Learn More
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={goToPrev}
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
        aria-label="Next slide"
      >
        <FiChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {newsItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-6 md:w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// News Carousel Component - Shows 3 cards on desktop, 1 on mobile with left/right navigation
const NewsSlider = ({ newsItems }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const API_URL = getBaseURL();

  // Update visible count based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1); // Mobile: 1 card
      } else {
        setVisibleCount(3); // Desktop: 3 cards
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // Reset startIndex when visibleCount changes to prevent out of bounds
  useEffect(() => {
    if (startIndex + visibleCount > newsItems.length) {
      setStartIndex(Math.max(0, newsItems.length - visibleCount));
    }
  }, [visibleCount, newsItems.length, startIndex]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_URL}${imageUrl}`;
  };

  const prevSlide = () => {
    setStartIndex((prev) => {
      const newIndex = prev - 1;
      if (newIndex < 0) {
        return Math.max(0, newsItems.length - visibleCount);
      }
      return newIndex;
    });
  };

  const nextSlide = () => {
    setStartIndex((prev) => {
      const newIndex = prev + 1;
      if (newIndex + visibleCount > newsItems.length) {
        return 0;
      }
      return newIndex;
    });
  };

  // Get visible news items
  const visibleNews = newsItems.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="relative max-w-6xl mx-auto px-4">
      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-0 md:left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 bg-primary-600 text-white hover:bg-primary-700 shadow-lg"
        aria-label="Previous news"
      >
        <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-14 md:mx-16">
        {visibleNews.map((news) => (
          <article
            key={news.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {/* News image */}
            {news.imageUrl ? (
              <div className="h-48 overflow-hidden">
                <img
                  src={getImageUrl(news.imageUrl)}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <FiAward className="w-16 h-16 text-white/50" />
              </div>
            )}
            <div className="p-6">
              <span className="inline-block bg-accent-100 text-accent-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                News
              </span>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                {news.title}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                {news.excerpt}
              </p>
              <Link
                to={`/news/${news.slug}`}
                className="inline-flex items-center gap-1 text-primary-600 font-medium text-sm hover:text-primary-700"
              >
                Learn More
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 bg-primary-600 text-white hover:bg-primary-700 shadow-lg"
        aria-label="Next news"
      >
        <FiChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
};

export default Home;
