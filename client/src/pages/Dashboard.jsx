import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import Topbar from "../components/Topbar";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Calendar, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity,
  UserPlus,
  UserMinus,
  AlertTriangle
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    onLeaveToday: 0,
    activeUsers: 0,
    totalLeavesThisMonth: 0,
    activeDutiesToday: 0,
    pendingApprovals: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel for better performance
      const [
        usersResponse,
        availabilityResponse,
        leavesResponse,
        dutiesResponse,
        adminUsersResponse
      ] = await Promise.all([
        api.get('/users'),
        api.get('/availability'),
        api.get('/leaves'),
        api.get('/duties'),
        api.get('/admin/users').catch(() => ({ data: [] })) // Fallback if admin route not accessible
      ]);

      const totalEmployees = usersResponse.data.length;
      const activeUsers = adminUsersResponse.data.length;
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // Calculate present today from availability
      const presentToday = availabilityResponse.data.filter(a => 
        a.date === today && a.status === 'Present'
      ).length;

      // Calculate on leave today
      const onLeaveToday = leavesResponse.data.filter(leave => {
        const leaveDate = new Date(leave.date);
        return leaveDate.toISOString().split('T')[0] === today && leave.status === 'Approved';
      }).length;

      // Calculate total leaves this month
      const totalLeavesThisMonth = leavesResponse.data.filter(leave => {
        const leaveDate = new Date(leave.date);
        return leaveDate.getMonth() === currentMonth && 
               leaveDate.getFullYear() === currentYear && 
               leave.status === 'Approved';
      }).length;

      // Calculate active duties today
      const activeDutiesToday = dutiesResponse.data.filter(duty => 
        duty.dutyDate === today
      ).length;

      // Calculate pending approvals (leaves with pending status)
      const pendingApprovals = leavesResponse.data.filter(leave => 
        leave.status === 'Pending'
      ).length;

      // Generate recent activities based on real data
      const recentActivities = [];
      
      // Add recent leaves
      const recentLeaves = leavesResponse.data
        .filter(leave => leave.status === 'Pending')
        .slice(0, 2)
        .map(leave => ({
          id: `leave-${leave._id}`,
          type: 'leave',
          message: `${leave.user?.name || 'Employee'} requested leave for ${new Date(leave.date).toLocaleDateString()}`,
          time: 'Recently',
          status: 'pending'
        }));

      // Add recent duties
      const recentDuties = dutiesResponse.data
        .slice(0, 1)
        .map(duty => ({
          id: `duty-${duty._id}`,
          type: 'duty',
          message: `Duty assigned to ${duty.user?.name || 'Employee'} for ${duty.dutyType}`,
          time: 'Recently',
          status: 'completed'
        }));

      // Add recent user additions
      if (adminUsersResponse.data.length > 0) {
        const recentUser = adminUsersResponse.data[adminUsersResponse.data.length - 1];
        recentActivities.push({
          id: `user-${recentUser._id}`,
          type: 'user',
          message: `New user account created for ${recentUser.name}`,
          time: 'Recently',
          status: 'completed'
        });
      }

      // Combine all activities
      recentActivities.push(...recentLeaves, ...recentDuties);

      setStats({
        totalEmployees,
        presentToday,
        onLeaveToday,
        activeUsers,
        totalLeavesThisMonth,
        activeDutiesToday,
        pendingApprovals,
        recentActivities: recentActivities.slice(0, 3) // Show max 3 activities
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle, loading: cardLoading }) => (
    <div className={`bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          {cardLoading ? (
            <div className="animate-pulse bg-gray-100 h-8 w-20 rounded mt-2"></div>
          ) : (
            <p className="text-gray-900 text-3xl font-semibold mt-2">{value}</p>
          )}
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-md bg-gray-50 border border-gray-200`}>
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getStatusIcon = (status) => {
      switch (status) {
        case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
        case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
        default: return <Activity className="w-4 h-4 text-blue-500" />;
      }
    };

    const getTypeColor = (type) => {
      switch (type) {
        case 'leave': return 'bg-blue-100 text-blue-800';
        case 'duty': return 'bg-purple-100 text-purple-800';
        case 'user': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex-shrink-0 mt-1">
          {getStatusIcon(activity.status)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
          <div className="flex items-center mt-2 space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
              {activity.type}
            </span>
            <span className="text-xs text-gray-500">{activity.time}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 bg-gray-50 min-h-screen">
      {/* Header with Topbar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.name || 'Commander'}!
        </h1>
          <p className="text-gray-600 mt-1">Here’s what’s happening with your team today</p>
        </div>
        <Topbar />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={Users}
          color="from-blue-500 to-blue-600"
          subtitle="Active workforce"
        />
        {/* <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={UserCheck}
          color="from-green-500 to-green-600"
          subtitle={`${stats.totalEmployees > 0 ? ((stats.presentToday / stats.totalEmployees) * 100).toFixed(1) : 0}% attendance`}
        /> */}
        <StatCard
          title="On Leave"
          value={stats.onLeaveToday}
          icon={UserX}
          color="from-orange-500 to-orange-600"
          subtitle="Today's absences"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={Activity}
          color="from-purple-500 to-purple-600"
          subtitle="System users"
        />
      </div>

      {/* Charts and Additional Info */}
      <div className="w-full mb-8">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
            <div className="flex space-x-2">
              {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                {stats.presentToday} Present
              </span> */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                {stats.onLeaveToday} On Leave
              </span>
            </div>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {/* <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Present</span>
              <span>{stats.presentToday}</span>
            </div> */}
            <div className="w-full bg-gray-100 rounded-full h-3 border border-gray-200">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.totalEmployees > 0 ? (stats.presentToday / stats.totalEmployees) * 100 : 0}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
              <span>On Leave</span>
              <span>{stats.onLeaveToday}</span>http://localhost:5173/writer
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 border border-gray-200">
              <div 
                className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.totalEmployees > 0 ? (stats.onLeaveToday / stats.totalEmployees) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-gray-900 text-white py-3 px-4 rounded-md font-medium hover:bg-black/90 transition-colors">
              View All Employees
            </button>
            <button className="w-full bg-gray-800 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-900 transition-colors">
              Check Availability
            </button>
            <button className="w-full bg-gray-700 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors">
              Manage Leaves
            </button>
          </div>
        </div> */}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          <button className="text-cyan-600 hover:text-cyan-700 font-medium text-sm">View All</button>
        </div>
        
        <div className="space-y-4">
          {stats.recentActivities.length > 0 ? (
            stats.recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No recent activities</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-gray-700" />
            <div>
              <p className="text-gray-500 text-sm">This Month</p>
              <p className="text-xl font-semibold text-gray-900">Leave Requests</p>
            </div>
          </div>
          <div className="mt-4 text-2xl font-semibold text-gray-900">{stats.totalLeavesThisMonth}</div>
        </div>
        
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-gray-700" />
            <div>
              <p className="text-gray-500 text-sm">Duty Assignments</p>
              <p className="text-xl font-semibold text-gray-900">Active Today</p>
            </div>
          </div>
          <div className="mt-4 text-2xl font-semibold text-gray-900">{stats.activeDutiesToday}</div>
        </div>
        
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-gray-700" />
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-xl font-semibold text-gray-900">Approvals</p>
            </div>
          </div>
          <div className="mt-4 text-2xl font-semibold text-gray-900">{stats.pendingApprovals}</div>
        </div>
      </div>
    </div>
  );
}
