import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FiUsers,
  FiCalendar,
  FiFileText,
  FiMessageSquare,
  FiBriefcase,
  FiBarChart2,
  FiTrendingUp,
  FiActivity,
  FiPieChart,
  FiMapPin,
  FiInbox,
  FiUserPlus,
  FiVideo,
  FiAward
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Fetch appointment stats
  const { data: stats } = useQuery({
    queryKey: ['appointmentStats'],
    queryFn: () => api.get('/appointments/stats').then(res => res.data).catch(() => ({}))
  });

  // Fetch all appointments
  const { data: allAppointments } = useQuery({
    queryKey: ['allAppointments'],
    queryFn: () => api.get('/appointments/all').then(res => res.data).catch(() => [])
  });

  // Fetch doctors
  const { data: doctors } = useQuery({
    queryKey: ['doctorsAnalytics'],
    queryFn: () => api.get('/doctors').then(res => res.data).catch(() => [])
  });

  // Fetch news
  const { data: newsData } = useQuery({
    queryKey: ['newsAnalytics'],
    queryFn: () => api.get('/news/admin/all').then(res => res.data).catch(() => [])
  });

  // Fetch jobs
  const { data: jobsData } = useQuery({
    queryKey: ['jobsAnalytics'],
    queryFn: () => api.get('/jobs/admin/all').then(res => res.data).catch(() => [])
  });

  // Fetch application stats
  const { data: appStats } = useQuery({
    queryKey: ['applicationStatsOverview'],
    queryFn: () => api.get('/applications/stats').then(res => res.data).catch(() => ({}))
  });

  // Calculate statistics
  const totalAppointments = allAppointments?.length || 0;
  const pendingAppointments = allAppointments?.filter(a => a.status === 'pending')?.length || 0;
  const approvedAppointments = allAppointments?.filter(a => a.status === 'approved')?.length || 0;
  const completedAppointments = allAppointments?.filter(a => a.status === 'completed')?.length || 0;
  const cancelledAppointments = allAppointments?.filter(a => a.status === 'cancelled' || a.status === 'rejected')?.length || 0;

  const totalDoctors = doctors?.length || 0;
  const availableDoctors = doctors?.filter(d => d.isAvailable)?.length || 0;

  const totalNews = newsData?.length || 0;
  const publishedNews = newsData?.filter(n => n.isPublished)?.length || 0;

  const totalJobs = jobsData?.length || 0;
  const activeJobs = jobsData?.filter(j => j.isActive)?.length || 0;

  // Appointment by status
  const appointmentsByStatus = [
    { label: 'Pending', value: pendingAppointments, color: 'bg-yellow-500' },
    { label: 'Approved', value: approvedAppointments, color: 'bg-blue-500' },
    { label: 'Completed', value: completedAppointments, color: 'bg-green-500' },
    { label: 'Cancelled', value: cancelledAppointments, color: 'bg-red-500' }
  ];

  // Appointments by doctor
  const appointmentsByDoctor = {};
  allAppointments?.forEach(apt => {
    const doctorName = apt.doctor?.fullName || 'Unknown';
    appointmentsByDoctor[doctorName] = (appointmentsByDoctor[doctorName] || 0) + 1;
  });
  const topDoctors = Object.entries(appointmentsByDoctor)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Appointments by day of week
  const appointmentsByDay = [0, 0, 0, 0, 0, 0, 0];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  allAppointments?.forEach(apt => {
    const day = new Date(apt.appointmentDate).getDay();
    appointmentsByDay[day]++;
  });

  // Recent activity
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const recentAppointments = allAppointments?.filter(apt =>
    new Date(apt.createdAt) >= last7Days
  )?.length || 0;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}. Here's your hospital overview.</p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Appointments</p>
                <p className="text-xl sm:text-3xl font-bold">{totalAppointments}</p>
                {recentAppointments > 0 && (
                  <p className="text-xs text-blue-200 flex items-center gap-1 mt-1">
                    <FiTrendingUp className="w-3 h-3" />
                    +{recentAppointments} this week
                  </p>
                )}
              </div>
              <FiCalendar className="text-2xl sm:text-4xl text-blue-300" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Doctors</p>
                <p className="text-xl sm:text-3xl font-bold">{availableDoctors}</p>
                <p className="text-xs text-green-200">of {totalDoctors} total</p>
              </div>
              <FiUsers className="text-2xl sm:text-4xl text-green-300" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Published News</p>
                <p className="text-xl sm:text-3xl font-bold">{publishedNews}</p>
                <p className="text-xs text-purple-200">of {totalNews} articles</p>
              </div>
              <FiFileText className="text-2xl sm:text-4xl text-purple-300" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Active Jobs</p>
                <p className="text-xl sm:text-3xl font-bold">{activeJobs}</p>
                <p className="text-xs text-orange-200">of {totalJobs} postings</p>
              </div>
              <FiBriefcase className="text-2xl sm:text-4xl text-orange-300" />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2 sm:gap-4 mb-8">
          <Link to="/admin/appointments" className="card text-center hover:shadow-lg transition p-4">
            <FiCalendar className="text-primary-600 text-2xl mx-auto mb-2" />
            <p className="text-sm font-medium">Appointments</p>
          </Link>
          <Link to="/admin/doctors" className="card text-center hover:shadow-lg transition p-4">
            <FiUsers className="text-primary-600 text-2xl mx-auto mb-2" />
            <p className="text-sm font-medium">Doctors</p>
          </Link>
          <Link to="/admin/services" className="card text-center hover:shadow-lg transition p-4">
            <FiActivity className="text-primary-600 text-2xl mx-auto mb-2" />
            <p className="text-sm font-medium">Services</p>
          </Link>
          <Link to="/admin/news" className="card text-center hover:shadow-lg transition p-4">
            <FiFileText className="text-primary-600 text-2xl mx-auto mb-2" />
            <p className="text-sm font-medium">News</p>
          </Link>
          <Link to="/admin/jobs" className="card text-center hover:shadow-lg transition p-4">
            <FiBriefcase className="text-primary-600 text-2xl mx-auto mb-2" />
            <p className="text-sm font-medium">Jobs</p>
          </Link>
          <Link to="/admin/applications" className="card text-center hover:shadow-lg transition p-4 relative">
            <FiInbox className="text-primary-600 text-2xl mx-auto mb-2" />
            <p className="text-sm font-medium">Applications</p>
            {appStats?.pending > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {appStats.pending}
              </span>
            )}
          </Link>
          <Link to="/admin/analytics" className="card text-center hover:shadow-lg transition p-4">
            <FiBarChart2 className="text-primary-600 text-2xl mx-auto mb-2" />
            <p className="text-sm font-medium">Analytics</p>
          </Link>
          <Link to="/admin/chat" className="card text-center hover:shadow-lg transition p-4">
            <FiMessageSquare className="text-primary-600 text-2xl mx-auto mb-2" />
            <p className="text-sm font-medium">Chat</p>
          </Link>
          <Link to="/admin/hr" className="card text-center hover:shadow-lg transition p-4">
            <FiUserPlus className="text-primary-600 text-2xl mx-auto mb-2" />
            <p className="text-sm font-medium">HR Management</p>
          </Link>
          <Link to="/admin/awards" className="card text-center hover:shadow-lg transition p-4">
            <FiAward className="text-primary-600 text-2xl mx-auto mb-2" />
            <p className="text-sm font-medium">Awards</p>
          </Link>
        </div>

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Appointment Status Distribution */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiPieChart className="text-primary-600" />
              Appointment Status
            </h2>
            <div className="space-y-3">
              {appointmentsByStatus.map((status) => (
                <div key={status.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">{status.label}</span>
                    <span className="text-sm font-medium">{status.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${status.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${totalAppointments > 0 ? (status.value / totalAppointments) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              <div className="bg-yellow-50 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-yellow-600">{pendingAppointments}</p>
                <p className="text-xs text-yellow-700">Pending</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-blue-600">{approvedAppointments}</p>
                <p className="text-xs text-blue-700">Approved</p>
              </div>
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-green-600">{completedAppointments}</p>
                <p className="text-xs text-green-700">Done</p>
              </div>
              <div className="bg-red-50 rounded-lg p-2 text-center">
                <p className="text-lg font-bold text-red-600">{cancelledAppointments}</p>
                <p className="text-xs text-red-700">Cancelled</p>
              </div>
            </div>
          </div>

          {/* Appointments by Day */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiBarChart2 className="text-primary-600" />
              Weekly Distribution
            </h2>
            <div className="flex items-end justify-between h-40 gap-2">
              {dayNames.map((day, index) => {
                const maxCount = Math.max(...appointmentsByDay, 1);
                const height = (appointmentsByDay[index] / maxCount) * 100;
                return (
                  <div key={day} className="flex flex-col items-center flex-1">
                    <span className="text-xs text-gray-500 mb-1">{appointmentsByDay[index]}</span>
                    <div className="w-full bg-gray-200 rounded-t flex-1 flex items-end" style={{ minHeight: '80px' }}>
                      <div
                        className="w-full bg-primary-500 rounded-t transition-all duration-500"
                        style={{ height: `${height}%`, minHeight: appointmentsByDay[index] > 0 ? '8px' : '0' }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 mt-1">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Doctors */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiUsers className="text-primary-600" />
              Top Doctors
            </h2>
            {topDoctors.length > 0 ? (
              <div className="space-y-3">
                {topDoctors.map(([name, count], index) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-primary-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{name}</p>
                      <p className="text-xs text-gray-500">{count} appointments</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">No data yet</p>
            )}
          </div>
        </div>

        {/* Recent Appointments & Quick Stats */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Appointments Table */}
          <div className="lg:col-span-2 card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FiActivity className="text-primary-600" />
                Recent Appointments
              </h2>
              <Link to="/admin/appointments" className="text-primary-600 text-sm hover:underline">
                View All
              </Link>
            </div>

            {allAppointments?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-semibold text-sm">Patient</th>
                      <th className="pb-3 font-semibold text-sm">Doctor</th>
                      <th className="pb-3 font-semibold text-sm">Date</th>
                      <th className="pb-3 font-semibold text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAppointments?.slice(0, 5).map((apt) => (
                      <tr key={apt.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 text-sm">{apt.patient?.fullName || 'N/A'}</td>
                        <td className="py-3 text-sm">{apt.doctor?.fullName || 'N/A'}</td>
                        <td className="py-3 text-sm">{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            apt.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                            apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No appointments found.</p>
            )}
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-4">
            {/* News Stats */}
            <div className="card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FiFileText className="text-primary-600" />
                News & Articles
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Published</span>
                  <span className="font-bold text-green-600">{publishedNews}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Drafts</span>
                  <span className="font-bold text-yellow-600">{totalNews - publishedNews}</span>
                </div>
              </div>
              <Link to="/admin/news" className="text-primary-600 text-sm hover:underline block mt-3">
                Manage News →
              </Link>
            </div>

            {/* Jobs Stats */}
            <div className="card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FiBriefcase className="text-primary-600" />
                Job Postings
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className="font-bold text-green-600">{activeJobs}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Inactive</span>
                  <span className="font-bold text-gray-500">{totalJobs - activeJobs}</span>
                </div>
              </div>
              <Link to="/admin/jobs" className="text-primary-600 text-sm hover:underline block mt-3">
                Manage Jobs →
              </Link>
            </div>

            {/* Applications Stats */}
            <div className="card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FiInbox className="text-primary-600" />
                Job Applications
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                  <span className="text-sm text-yellow-700">Pending</span>
                  <span className="font-bold text-yellow-600">{appStats?.pending || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm text-blue-700">Reviewing</span>
                  <span className="font-bold text-blue-600">{appStats?.reviewing || 0}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="font-bold text-gray-700">{appStats?.total || 0}</span>
                </div>
              </div>
              <Link to="/admin/applications" className="text-primary-600 text-sm hover:underline block mt-3">
                Manage Applications →
              </Link>
            </div>

            {/* Today's Summary */}
            <div className="card bg-primary-50 border border-primary-200">
              <h3 className="font-semibold mb-3 text-primary-800">Today's Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-600">Appointments</span>
                  <span className="font-bold text-primary-800">{stats?.today || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600">Pending</span>
                  <span className="font-bold text-primary-800">{stats?.pending || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-600">Approved</span>
                  <span className="font-bold text-primary-800">{stats?.approved || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
