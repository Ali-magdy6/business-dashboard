import React from 'react';
import { 
  DollarSign, 
  Users, 
  TrendingUp,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import KPICard from '../components/dashboard/KPICard';
import ChartCard from '../components/dashboard/ChartCard';
import { DashboardSkeleton } from '../components/dashboard/LoadingSkeleton';
import { useKPIData } from '../hooks/useApi';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const { data: kpiData, isLoading, error } = useKPIData();
  const { t } = useLanguage();

  // Mock data for charts
  const salesData = [
    { name: 'Jan', sales: 4000, revenue: 2400 },
    { name: 'Feb', sales: 3000, revenue: 1398 },
    { name: 'Mar', sales: 2000, revenue: 9800 },
    { name: 'Apr', sales: 2780, revenue: 3908 },
    { name: 'May', sales: 1890, revenue: 4800 },
    { name: 'Jun', sales: 2390, revenue: 3800 },
  ];

  const userData = [
    { name: 'Desktop', value: 400, color: '#3b82f6' },
    { name: 'Mobile', value: 300, color: '#10b981' },
    { name: 'Tablet', value: 200, color: '#f59e0b' },
    { name: 'Other', value: 100, color: '#ef4444' },
  ];

  const recentActivity = [
    { id: 1, action: 'New user registered', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'Product updated', time: '5 minutes ago', type: 'product' },
    { id: 3, action: 'Order completed', time: '10 minutes ago', type: 'order' },
    { id: 4, action: 'Report generated', time: '15 minutes ago', type: 'report' },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            Failed to load dashboard data
          </h3>
          <p className="text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section container animate-fade-in">
      {/* KPI Cards */}
      <div className="grid-responsive">
        <KPICard
          title={t('totalSales')}
          value={formatNumber(kpiData?.totalSales || 0)}
          change={12.5}
          icon={DollarSign}
          color="bg-success-500"
        />
        <KPICard
          title={t('activeUsers')}
          value={formatNumber(kpiData?.totalUsers || 0)}
          change={8.2}
          icon={Users}
          color="bg-brand-primary"
        />
        <KPICard
          title={t('totalRevenue')}
          value={formatCurrency(kpiData?.totalRevenue || 0)}
          change={15.3}
          icon={TrendingUp}
          color="bg-brand-secondary"
        />
        <KPICard
          title={t('growthRate')}
          value={formatPercentage(kpiData?.growthRate || 0)}
          change={-2.1}
          icon={Activity}
          color="bg-warning-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in-up">
        <ChartCard title={t('salesOverview')}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('revenueByMonth')}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in-up">
        <ChartCard title={t('userDevices')} className="lg:col-span-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={userData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {userData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="lg:col-span-2">
          <ChartCard title={t('recentActivity')}>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    activity.type === 'user' ? 'bg-brand-primary' :
                    activity.type === 'product' ? 'bg-success-500' :
                    activity.type === 'order' ? 'bg-brand-secondary' : 'bg-warning-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
