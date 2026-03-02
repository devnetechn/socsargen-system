import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiCalendar, FiArrowRight, FiAward, FiBriefcase, FiMapPin, FiClock, FiPlay, FiChevronLeft, FiChevronRight, FiHeart } from 'react-icons/fi';
import api from '../utils/api';
import { getBaseURL } from '../utils/url';

const API_URL = getBaseURL();

// Helper to get full image URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_URL}${imageUrl}`;
};

// Grid pattern: repeats every 6 articles
// Grid pattern: repeats every 8 articles, fills 4-col grid perfectly
// Row 1-2: [large 2x2] [small] [small]  (fills 4 cols x 2 rows = 8 cells)
//                       [small] [small]
// Row 3-4: [small] [small] [large 2x2]
//          [small] [small]
const CARD_PATTERNS = [
  { colSpan: 2, rowSpan: 2, size: 'large' },
  { colSpan: 1, rowSpan: 1, size: 'small' },
  { colSpan: 1, rowSpan: 1, size: 'small' },
  { colSpan: 1, rowSpan: 1, size: 'small' },
  { colSpan: 1, rowSpan: 1, size: 'small' },
  { colSpan: 1, rowSpan: 1, size: 'small' },
  { colSpan: 1, rowSpan: 1, size: 'small' },
  { colSpan: 2, rowSpan: 2, size: 'large' },
];

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// --- Magazine Masthead ---
const MagazineMasthead = () => {
  const today = new Date().toLocaleDateString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-6xl mx-auto text-center mb-12 animate-fade-in">
      {/* Top decorative line */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-400 dark:text-gray-500">
          Socsargen County Hospital
        </span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
      </div>

      <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-3"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
        News & Updates
      </h1>

      {/* Bottom decorative line with date */}
      <div className="flex items-center gap-4 mt-4">
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
        <span className="text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase">
          {today}
        </span>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
      </div>
    </div>
  );
};

// --- Hero Slider (3 images + video, auto-slides) ---
const HeroSlider = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef({});
  const [videoPlaying, setVideoPlaying] = useState({});

  const goTo = useCallback((i) => setCurrent(i), []);
  const goPrev = useCallback(() => setCurrent(p => (p - 1 + slides.length) % slides.length), [slides.length]);
  const goNext = useCallback(() => setCurrent(p => (p + 1) % slides.length), [slides.length]);

  // Auto-rotate: 5s images, 15s video
  useEffect(() => {
    if (slides.length <= 1) return;
    const isVideo = !!slides[current]?.videoUrl;
    const ms = isVideo ? 15000 : 5000;
    const t = setTimeout(goNext, ms);
    return () => clearTimeout(t);
  }, [current, slides, goNext]);

  // Pause/play videos on slide change
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([idx, vid]) => {
      if (!vid) return;
      if (parseInt(idx) === current) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
        setVideoPlaying(p => ({ ...p, [idx]: true }));
      } else {
        vid.pause();
        setVideoPlaying(p => ({ ...p, [idx]: false }));
      }
    });
  }, [current]);

  const handlePlayVideo = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const vid = videoRefs.current[index];
    if (vid) {
      vid.play().catch(() => {});
      setVideoPlaying(p => ({ ...p, [index]: true }));
    }
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto mb-14 animate-fade-in-up">
      <div className="relative h-[380px] md:h-[520px] rounded-2xl overflow-hidden shadow-2xl">
        {/* Slides */}
        {slides.map((article, index) => {
          const hasVideo = !!article.videoUrl;
          const isActive = index === current;

          return (
            <div
              key={article.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Link to={`/news/${article.slug}`} className="group block h-full">
                {/* Background media */}
                {hasVideo ? (
                  <>
                    <video
                      ref={(el) => { videoRefs.current[index] = el; }}
                      src={getImageUrl(article.videoUrl)}
                      poster={article.imageUrl ? getImageUrl(article.imageUrl) : undefined}
                      className="absolute inset-0 w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                    {!videoPlaying[index] && (
                      <button
                        onClick={(e) => handlePlayVideo(e, index)}
                        className="absolute inset-0 z-20 flex items-center justify-center"
                        aria-label="Play video"
                      >
                        <div className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110">
                          <FiPlay className="w-8 h-8 text-gray-900 ml-1" />
                        </div>
                      </button>
                    )}
                    <span className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      <FiPlay size={12} /> Video
                    </span>
                  </>
                ) : article.imageUrl ? (
                  <img
                    src={getImageUrl(article.imageUrl)}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-10">
                  <div className="max-w-2xl">
                    <span className="inline-block bg-primary-600 text-white text-xs font-bold tracking-wider uppercase px-3 py-1 rounded mb-4">
                      Featured
                    </span>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-3 leading-tight group-hover:underline decoration-2 underline-offset-4">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-gray-200 text-sm md:text-base line-clamp-2 mb-4 max-w-xl hidden md:block">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-gray-300 text-sm">
                      <FiCalendar className="w-4 h-4" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}

        {/* Arrows */}
        <button
          onClick={goPrev}
          className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
          aria-label="Previous slide"
        >
          <FiChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
          aria-label="Next slide"
        >
          <FiChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === current ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75 w-2.5'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Editorial Card ---
const EditorialCard = ({ article, pattern, delay = 0 }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasVideo = !!article.videoUrl;
  const isLarge = pattern.size === 'large' || pattern.size === 'medium';

  const handlePlayVideo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const colSpanClass = pattern.colSpan === 2 ? 'md:col-span-2' : 'md:col-span-1';
  const rowSpanClass = pattern.rowSpan === 2 ? 'md:row-span-2' : 'md:row-span-1';

  return (
    <div
      className={`${colSpanClass} ${rowSpanClass} animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link to={`/news/${article.slug}`} className="group block h-full">
        <div className="relative h-full min-h-[240px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
          {/* Background media */}
          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                src={getImageUrl(article.videoUrl)}
                poster={article.imageUrl ? getImageUrl(article.imageUrl) : undefined}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
              />
              {!isPlaying && (
                <button
                  onClick={handlePlayVideo}
                  className="absolute inset-0 z-20 flex items-center justify-center"
                  aria-label="Play video"
                >
                  <div className="w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
                    <FiPlay className="w-6 h-6 text-gray-900 ml-0.5" />
                  </div>
                </button>
              )}
              <span className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                <FiPlay size={10} /> Video
              </span>
            </>
          ) : article.imageUrl ? (
            <img
              src={getImageUrl(article.imageUrl)}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700" />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5 z-10">
            <div className="flex items-center gap-2 text-gray-300 text-xs mb-2">
              <FiCalendar className="w-3 h-3" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <h3
              className={`font-bold text-white leading-snug group-hover:underline decoration-1 underline-offset-2 ${
                isLarge ? 'text-lg md:text-2xl line-clamp-3' : 'text-sm md:text-base line-clamp-2'
              }`}
            >
              {article.title}
            </h3>
            {isLarge && article.excerpt && (
              <p className="text-gray-300 text-sm mt-2 line-clamp-2 hidden md:block">
                {article.excerpt}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

// --- Editorial Grid ---
const EditorialGrid = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto mb-16">
      <div className="flex items-center gap-4 mb-8">
        <h2
          className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white whitespace-nowrap"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          Latest Stories
        </h2>
        <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[280px] grid-flow-row-dense gap-4">
        {articles.map((article, index) => {
          const pattern = CARD_PATTERNS[index % CARD_PATTERNS.length];
          const delay = (index % 6) * 100 + 100;
          return (
            <EditorialCard
              key={article.id}
              article={article}
              pattern={pattern}
              delay={delay}
            />
          );
        })}
      </div>
    </div>
  );
};

// --- Main News Component ---
const News = () => {
  const { data: newsData, isLoading } = useQuery({
    queryKey: ['news', 'magazine'],
    queryFn: () => api.get('/news?limit=100').then(res => res.data)
  });

  // Sort by date (newest first)
  const allNews = (newsData?.data || []).slice().sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  // Dynamically pick slider slides: latest video + 3 newest image articles
  const heroSlides = [];
  const usedIds = new Set();

  // Find latest video article
  const latestVideo = allNews.find(n => n.videoUrl);
  if (latestVideo) {
    heroSlides.push(latestVideo);
    usedIds.add(latestVideo.id);
  }

  // Fill with up to 3 image-only articles (newest first)
  for (const n of allNews) {
    if (heroSlides.length >= 4) break;
    if (!usedIds.has(n.id) && !n.videoUrl) {
      heroSlides.push(n);
      usedIds.add(n.id);
    }
  }

  // Everything not in the slider goes to the grid
  const gridArticles = allNews.filter(n => !usedIds.has(n.id));

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4">
        <MagazineMasthead />

        {isLoading ? (
          <>
            {/* Hero skeleton */}
            <div className="max-w-6xl mx-auto mb-14">
              <div className="h-[400px] md:h-[520px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-2xl" />
            </div>
            {/* Grid skeleton */}
            <div className="max-w-6xl mx-auto mb-16">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={`bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse ${
                      i === 1 || i === 5 ? 'md:col-span-2 h-[280px] md:h-[576px]' : 'h-[240px] md:h-[280px]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        ) : allNews.length > 0 ? (
          <>
            {heroSlides.length > 0 && <HeroSlider slides={heroSlides} />}
            {gridArticles.length > 0 && <EditorialGrid articles={gridArticles} />}
          </>
        ) : (
          <div className="text-center py-20 max-w-6xl mx-auto">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No News Yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Check back later for updates and announcements.</p>
          </div>
        )}

        {/* Patient's Choice Award */}
        <PatientChoiceAward />

        {/* Hiring Section */}
        <HiringSection />
      </div>
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

// --- Patient's Choice Award Section (News page - all awards with month filter) ---
const PatientChoiceAward = () => {
  const [selectedMonth, setSelectedMonth] = useState('');

  // Fetch available months for filter
  const { data: months } = useQuery({
    queryKey: ['awardMonths'],
    queryFn: () => api.get('/awards/months').then(res => res.data)
  });

  // Fetch awards, optionally filtered by month
  const { data: awards, isLoading } = useQuery({
    queryKey: ['awards', 'news', selectedMonth],
    queryFn: () => api.get(`/awards${selectedMonth ? `?month=${selectedMonth}` : ''}`).then(res => res.data)
  });

  const formatMonthLabel = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long' });
  };

  const formatMonthValue = (dateStr) => {
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto mb-16">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-3 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
              <div className="h-64 bg-gray-200 dark:bg-gray-700" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mb-16">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
          <FiAward className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
          Patient's Choice Award
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Celebrating the departments and healthcare professionals who have been recognized by our patients for their exceptional care and service.
        </p>
      </div>

      {/* Month Filter */}
      {months && months.length > 0 && (
        <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setSelectedMonth('')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              selectedMonth === ''
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-200'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-amber-400'
            }`}
          >
            All Months
          </button>
          {months.map((m) => {
            const val = formatMonthValue(m);
            return (
              <button
                key={val}
                onClick={() => setSelectedMonth(val)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedMonth === val
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-200'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-amber-400'
                }`}
              >
                {formatMonthLabel(m)}
              </button>
            );
          })}
        </div>
      )}

      {/* Award Cards */}
      {(!awards || awards.length === 0) ? (
        <div className="text-center py-12">
          <FiAward className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No awards found for this month.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {awards.map((award) => {
            const theme = AWARD_THEMES[award.colorTheme] || AWARD_THEMES.amber;
            return (
              <div
                key={award.id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border ${theme.border} group`}
              >
                {/* Photo */}
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                  {award.photoUrl ? (
                    <img
                      src={getImageUrl(award.photoUrl)}
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

                  {/* Month badge */}
                  {award.awardMonth && (
                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                      {new Date(award.awardMonth).toLocaleDateString('en-PH', { year: 'numeric', month: 'short' })}
                    </div>
                  )}

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
                      {award.title}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <p className={`font-semibold ${theme.text} text-sm mb-2`}>
                    {award.recipient}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {award.description}
                  </p>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <FiHeart className={`w-4 h-4 ${theme.text}`} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-bold text-gray-800 dark:text-gray-200">{award.votes?.toLocaleString()}</span> patient votes
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Hiring Section Component
const HiringSection = () => {
  // Fetch jobs from API
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['jobs', 'public'],
    queryFn: () => api.get('/jobs?limit=4').then(res => res.data)
  });

  const jobOpenings = jobsData?.data || [];

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-48 animate-pulse shadow" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <FiBriefcase className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Join Our Team
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Be part of Socsargen County Hospital's mission to provide excellent healthcare services. Explore our current job openings below.
        </p>
      </div>

      {/* Job Listings */}
      {jobOpenings.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {jobOpenings.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition">
                    {job.title}
                  </h3>
                  <p className="text-primary-600 font-medium">{job.department}</p>
                </div>
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {job.type}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {job.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <FiMapPin className="text-primary-600" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock className="text-primary-600" />
                  {job.type}
                </span>
              </div>

              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 mb-8">
          <p className="text-gray-500">No job openings at the moment. Check back later!</p>
        </div>
      )}

      {/* Contact for Careers */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-3">
          Don't see a position that fits?
        </h3>
        <p className="text-primary-100 mb-6 max-w-xl mx-auto">
          We're always looking for talented individuals to join our team. Send your resume and we'll keep you in mind for future opportunities.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:careers@socsargenhospital.com"
            className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            <FiBriefcase className="w-5 h-5" />
            Send Your Resume
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            Contact HR Department
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default News;
