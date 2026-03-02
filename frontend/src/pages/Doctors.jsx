import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiUser, FiCalendar, FiFilter, FiX, FiChevronRight, FiClock } from 'react-icons/fi';
import api from '../utils/api';
import { getBaseURL } from '../utils/url';

const API_URL = getBaseURL();

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
];

// Department descriptions
const departmentInfo = {
  'Department of Anesthesiology': {
    description: 'Our anesthesiology team ensures patient safety and comfort during surgical procedures through expert pain management and sedation techniques.'
  },
  'Department of Cardiology': {
    description: 'Specializing in heart health, our cardiologists diagnose and treat cardiovascular diseases using advanced diagnostic tools and treatments.'
  },
  'Department of Dental Medicine': {
    description: 'Comprehensive dental care services including preventive, restorative, and cosmetic dentistry for patients of all ages.'
  },
  'Department of Family Medicine': {
    description: 'Providing holistic healthcare for the entire family, from newborns to seniors, focusing on preventive care and chronic disease management.'
  },
  'Department of Gastroenterology': {
    description: 'Expert care for digestive system disorders including the stomach, intestines, liver, and pancreas.'
  },
  'Department of Internal Medicine': {
    description: 'Comprehensive diagnosis and treatment of adult diseases, serving as your primary care physicians for complex medical conditions.'
  },
  'Department of Neurology': {
    description: 'Specialized care for disorders of the brain, spine, and nervous system including stroke, epilepsy, and neurological conditions.'
  },
  'Department of OB-GYN': {
    description: 'Complete women\'s health services including prenatal care, childbirth, reproductive health, and gynecological treatments.'
  },
  'Department of Oncology': {
    description: 'Compassionate cancer care with advanced treatment options including chemotherapy, immunotherapy, and supportive services.'
  },
  'Department of Orthopedics': {
    description: 'Expert treatment for bone, joint, and muscle conditions including sports injuries, arthritis, and orthopedic surgery.'
  },
  'Department of Pathology': {
    description: 'Accurate laboratory diagnosis through tissue analysis, helping guide treatment decisions for various medical conditions.'
  },
  'Department of Pediatrics': {
    description: 'Dedicated healthcare for infants, children, and adolescents, focusing on growth, development, and childhood diseases.'
  },
  'Department of Radiology': {
    description: 'Advanced medical imaging services including X-ray, CT scan, MRI, and ultrasound for accurate diagnosis.'
  },
  'Department of Surgery': {
    description: 'Skilled surgical team performing a wide range of procedures using modern techniques for optimal patient outcomes.'
  },
  'Other': {
    description: 'Additional specialized medical services to meet your healthcare needs.'
  }
};

// Get short department name for display
const getShortDeptName = (fullName) => {
  return fullName?.replace('Department of ', '') || fullName;
};

// --- Day Availability Dots on Card ---
const ScheduleDots = ({ scheduleDays }) => {
  if (!scheduleDays || scheduleDays.length === 0) return null;

  return (
    <div className="flex items-center gap-1 mb-3">
      {DAYS_OF_WEEK.map((day) => {
        const isAvailable = scheduleDays.includes(day.value);
        return (
          <span
            key={day.value}
            title={`${day.label}: ${isAvailable ? 'Available' : 'Not available'}`}
            className={`w-7 h-6 flex items-center justify-center rounded text-[10px] font-bold ${
              isAvailable
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-300'
            }`}
          >
            {day.short.charAt(0)}
          </span>
        );
      })}
    </div>
  );
};

// --- Doctor Card Component ---
const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Photo / Avatar area */}
      <div className="relative h-48 sm:h-52 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
        {doctor.photoUrl ? (
          <img
            src={`${API_URL}${doctor.photoUrl}`}
            alt={doctor.fullName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white/80 flex items-center justify-center shadow-inner">
              <FiUser className="text-green-400 text-4xl" />
            </div>
          </div>
        )}
        {/* Department badge overlay */}
        {doctor.department && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-green-700 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {getShortDeptName(doctor.department)}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1 group-hover:text-green-700 transition-colors">
          {doctor.fullName}
        </h3>
        <p className="text-green-600 text-sm font-medium mb-2">{doctor.specialization}</p>

        {/* Schedule Day Dots */}
        <ScheduleDots scheduleDays={doctor.scheduleDays} />

        {/* Consultation Fee */}
        {doctor.consultationFee && (
          <p className="text-gray-500 text-xs mb-2">
            Consultation: <span className="font-semibold text-gray-700">₱{doctor.consultationFee}</span>
          </p>
        )}

        {/* Bio Preview */}
        {doctor.bio && (
          <p className="text-gray-400 text-xs line-clamp-2 mb-3">{doctor.bio}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Link
            to={`/doctors/${doctor.id}`}
            className="flex-1 text-center py-2 px-3 border-2 border-green-500 text-green-600 rounded-lg font-medium text-xs hover:bg-green-50 transition-colors"
          >
            View Profile
          </Link>
          <Link
            to={`/patient/book?doctor=${doctor.id}`}
            className="flex items-center justify-center gap-1 py-2 px-3 bg-green-600 text-white rounded-lg font-medium text-xs hover:bg-green-700 transition-colors"
          >
            <FiCalendar className="w-3.5 h-3.5" />
            Book
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- Sidebar Category Item ---
const CategoryItem = ({ dept, count, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
        isActive
          ? 'bg-green-600 text-white shadow-md shadow-green-200'
          : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
      }`}
    >
      <span className="font-medium text-sm truncate">{dept === '' ? 'All Departments' : getShortDeptName(dept)}</span>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {count !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isActive ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
          }`}>
            {count}
          </span>
        )}
        <FiChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-green-600'}`} />
      </div>
    </button>
  );
};

// --- Day Filter Checkboxes ---
const DayFilter = ({ selectedDays, onToggleDay, onClearDays }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
          <FiClock className="w-4 h-4 text-green-600" />
          Available Days
        </h4>
        {selectedDays.length > 0 && (
          <button
            onClick={onClearDays}
            className="text-[11px] text-red-500 hover:text-red-600 font-medium"
          >
            Clear
          </button>
        )}
      </div>
      <div className="space-y-1">
        {DAYS_OF_WEEK.map((day) => {
          const isChecked = selectedDays.includes(day.value);
          return (
            <label
              key={day.value}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
                isChecked
                  ? 'bg-green-50 border border-green-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggleDay(day.value)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className={`text-sm font-medium ${isChecked ? 'text-green-700' : 'text-gray-600'}`}>
                {day.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

// --- Mobile Category Drawer ---
const MobileCategoryDrawer = ({
  isOpen, onClose, departments, deptCounts, selectedDepartment, onSelect, totalDoctors,
  selectedDays, onToggleDay, onClearDays
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl animate-slide-in-left overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Departments */}
        <div className="p-3">
          <h4 className="font-bold text-sm text-gray-800 mb-2 px-1">Departments</h4>
          <div className="space-y-1">
            <CategoryItem
              dept=""
              count={totalDoctors}
              isActive={selectedDepartment === ''}
              onClick={() => { onSelect(''); }}
            />
            {departments?.map((dept) => (
              <CategoryItem
                key={dept}
                dept={dept}
                count={deptCounts?.[dept] || 0}
                isActive={selectedDepartment === dept}
                onClick={() => { onSelect(dept); }}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-gray-200" />

        {/* Day Filter */}
        <div className="p-4">
          <DayFilter
            selectedDays={selectedDays}
            onToggleDay={onToggleDay}
            onClearDays={onClearDays}
          />
        </div>

        {/* Apply Button */}
        <div className="p-4 pt-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Doctors Component ---
const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('dept') || '');
  const [selectedDays, setSelectedDays] = useState([]);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Update selected department when URL changes
  useEffect(() => {
    const dept = searchParams.get('dept');
    if (dept) {
      setSelectedDepartment(dept);
    }
  }, [searchParams]);

  // Handle department selection - update URL
  const handleDepartmentSelect = (dept) => {
    setSelectedDepartment(dept);
    if (dept) {
      setSearchParams({ dept });
    } else {
      setSearchParams({});
    }
  };

  // Toggle day selection
  const handleToggleDay = (dayValue) => {
    setSelectedDays(prev =>
      prev.includes(dayValue)
        ? prev.filter(d => d !== dayValue)
        : [...prev, dayValue]
    );
  };

  const handleClearDays = () => setSelectedDays([]);

  // Fetch departments for sidebar
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get('/doctors/departments').then(res => res.data)
  });

  // Fetch doctors with optional department filter
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors', selectedDepartment],
    queryFn: () => api.get(`/doctors${selectedDepartment ? `?department=${encodeURIComponent(selectedDepartment)}` : ''}`).then(res => res.data)
  });

  // Fetch all doctors for counts
  const { data: allDoctors } = useQuery({
    queryKey: ['doctors', ''],
    queryFn: () => api.get('/doctors').then(res => res.data)
  });

  // Count doctors per department
  const deptCounts = allDoctors?.reduce((acc, doc) => {
    const dept = doc.department || 'Other';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  // Filter doctors by search term + selected days
  const filteredDoctors = doctors?.filter(doc => {
    // Text search filter
    const matchesSearch = !searchTerm ||
      doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.department && doc.department.toLowerCase().includes(searchTerm.toLowerCase()));

    // Day filter: doctor must be available on ALL selected days
    const matchesDays = selectedDays.length === 0 ||
      selectedDays.every(day => doc.scheduleDays?.includes(day));

    return matchesSearch && matchesDays;
  });

  const hasActiveFilters = searchTerm || selectedDepartment || selectedDays.length > 0;

  const clearAllFilters = () => {
    setSearchTerm('');
    handleDepartmentSelect('');
    setSelectedDays([]);
  };

  return (
    <div className="py-6 sm:py-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-green-800">Our Medical Team</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Meet our team of experienced and dedicated healthcare professionals across specialized departments.
          </p>
        </div>

        {/* Main Layout: Sidebar + Content */}
        <div className="flex gap-6">
          {/* --- Sidebar (Desktop) --- */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Departments Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Sidebar Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 py-4">
                  <h3 className="text-white font-bold text-base">Departments</h3>
                  <p className="text-green-100 text-xs mt-0.5">{allDoctors?.length || 0} doctors total</p>
                </div>

                {/* Category List */}
                <div className="p-3 space-y-1 max-h-[40vh] overflow-y-auto">
                  <CategoryItem
                    dept=""
                    count={allDoctors?.length || 0}
                    isActive={selectedDepartment === ''}
                    onClick={() => handleDepartmentSelect('')}
                  />
                  {departments?.map((dept) => (
                    <CategoryItem
                      key={dept}
                      dept={dept}
                      count={deptCounts?.[dept] || 0}
                      isActive={selectedDepartment === dept}
                      onClick={() => handleDepartmentSelect(dept)}
                    />
                  ))}
                </div>
              </div>

              {/* Day Filter Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <DayFilter
                  selectedDays={selectedDays}
                  onToggleDay={handleToggleDay}
                  onClearDays={handleClearDays}
                />
              </div>
            </div>
          </aside>

          {/* --- Main Content --- */}
          <div className="flex-1 min-w-0">
            {/* Search Bar + Mobile Filter Button */}
            <div className="flex gap-3 mb-6">
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border-2 border-green-200 rounded-xl text-green-700 font-medium text-sm hover:border-green-400 transition-colors flex-shrink-0 relative"
              >
                <FiFilter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {(selectedDepartment || selectedDays.length > 0) && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {(selectedDepartment ? 1 : 0) + selectedDays.length}
                  </span>
                )}
              </button>

              {/* Search */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-sm text-gray-700"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">Filters:</span>
                {selectedDepartment && (
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium">
                    {getShortDeptName(selectedDepartment)}
                    <button onClick={() => handleDepartmentSelect('')} className="hover:text-green-900">
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {selectedDays.map(day => {
                  const dayInfo = DAYS_OF_WEEK.find(d => d.value === day);
                  return (
                    <span key={day} className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
                      {dayInfo?.label}
                      <button onClick={() => handleToggleDay(day)} className="hover:text-blue-900">
                        <FiX className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  );
                })}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-red-500 hover:text-red-600 font-medium ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {isLoading ? 'Loading...' : `${filteredDoctors?.length || 0} doctor${filteredDoctors?.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                      <div className="flex gap-2 mt-3">
                        <div className="h-9 bg-gray-200 rounded-lg flex-1" />
                        <div className="h-9 bg-gray-200 rounded-lg flex-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDoctors?.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-xl p-8 shadow-sm max-w-md mx-auto">
                  <FiUser className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-1">No doctors found</p>
                  <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
                  <button
                    onClick={clearAllFilters}
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            ) : (
              /* Doctor Cards Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredDoctors?.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Category Drawer */}
      <MobileCategoryDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        departments={departments}
        deptCounts={deptCounts}
        selectedDepartment={selectedDepartment}
        onSelect={handleDepartmentSelect}
        totalDoctors={allDoctors?.length || 0}
        selectedDays={selectedDays}
        onToggleDay={handleToggleDay}
        onClearDays={handleClearDays}
      />
    </div>
  );
};

export default Doctors;
