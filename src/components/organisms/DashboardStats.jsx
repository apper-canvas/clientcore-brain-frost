import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { activityService } from "@/services/api/activityService";
import Chart from "react-apexcharts";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import StatCard from "@/components/molecules/StatCard";
import { formatSafeDateLocale } from "@/utils/dateHelpers";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDeals: 0,
    totalValue: 0,
    winRate: 0,
    recentActivities: []
  });
  const [chartData, setChartData] = useState({
    series: [],
    options: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [contacts, deals, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);

      // Calculate stats
      const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
      const wonDeals = deals.filter(deal => deal.stage === 'closed-won').length;
      const lostDeals = deals.filter(deal => deal.stage === 'closed-lost').length;
      const totalClosed = wonDeals + lostDeals;
      const winRate = totalClosed > 0 ? Math.round((wonDeals / totalClosed) * 100) : 0;

      setStats({
        totalContacts: contacts.length,
        totalDeals: deals.length,
        totalValue,
        winRate,
        recentActivities: activities
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
      });

      // Prepare chart data - deals by stage
      const stageLabels = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
      const stageCounts = [
        deals.filter(d => d.stage === 'lead').length,
        deals.filter(d => d.stage === 'qualified').length,
        deals.filter(d => d.stage === 'proposal').length,
        deals.filter(d => d.stage === 'negotiation').length,
        deals.filter(d => d.stage === 'closed-won').length,
        deals.filter(d => d.stage === 'closed-lost').length
      ];

      setChartData({
        series: stageCounts,
        options: {
          chart: {
            type: 'donut',
            fontFamily: 'Inter, sans-serif'
          },
          labels: stageLabels,
          colors: ['#94a3b8', '#3b82f6', '#f59e0b', '#f97316', '#10b981', '#ef4444'],
          legend: {
            position: 'bottom',
            fontSize: '14px'
          },
          plotOptions: {
            pie: {
              donut: {
                size: '65%'
              }
            }
          },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '12px'
            }
          },
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 300
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        }
      });

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts.toLocaleString()}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Active Deals"
          value={stats.totalDeals.toLocaleString()}
          icon="Target"
          color="accent"
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(stats.totalValue)}
          icon="DollarSign"
          color="success"
          trend="up"
          trendValue="+23%"
        />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate}%`}
          icon="TrendingUp"
          color="warning"
          trend={stats.winRate > 50 ? "up" : "down"}
          trendValue={`${stats.winRate > 50 ? '+' : ''}${stats.winRate - 45}%`}
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Distribution Chart */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle>Pipeline Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.series.length > 0 ? (
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="donut"
                height={350}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.length > 0 ? (
stats.recentActivities.map((activity) => (
                  <div key={activity.Id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-medium">
                        {activity.type?.charAt(0)?.toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
{activity.description || 'No description'}
                      </p>
<p className="text-xs text-slate-600">
                        {formatSafeDateLocale(activity.date, 'en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-8">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;