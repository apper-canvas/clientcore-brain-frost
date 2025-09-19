import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import StatCard from '@/components/molecules/StatCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { dealService } from '@/services/api/dealService';
import { contactService } from '@/services/api/contactService';
import { activityService } from '@/services/api/activityService';
import Chart from 'react-apexcharts';

const Reports = () => {
  const [reportData, setReportData] = useState({
    monthlyStats: {
      totalRevenue: 0,
      newDeals: 0,
      closedDeals: 0,
      conversionRate: 0
    },
    charts: {
      revenue: { series: [], options: {} },
      deals: { series: [], options: {} },
      activities: { series: [], options: {} }
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [deals, contacts, activities] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        activityService.getAll()
      ]);

      // Calculate monthly stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthDeals = deals.filter(deal => {
        const dealDate = new Date(deal.createdAt);
        return dealDate.getMonth() === currentMonth && dealDate.getFullYear() === currentYear;
      });
      
      const closedWonDeals = deals.filter(deal => deal.stage === 'closed-won');
      const totalRevenue = closedWonDeals.reduce((sum, deal) => sum + deal.value, 0);
      const conversionRate = deals.length > 0 ? Math.round((closedWonDeals.length / deals.length) * 100) : 0;

      // Prepare revenue chart data (last 6 months)
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const revenueData = [];
      const dealCountData = [];
      const months = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.getMonth();
        const year = date.getFullYear();
        
        const monthDeals = deals.filter(deal => {
          const dealDate = new Date(deal.createdAt);
          return dealDate.getMonth() === month && dealDate.getFullYear() === year && deal.stage === 'closed-won';
        });
        
        const monthRevenue = monthDeals.reduce((sum, deal) => sum + deal.value, 0);
        
        months.push(monthNames[month]);
        revenueData.push(monthRevenue);
        dealCountData.push(monthDeals.length);
      }

      // Activity types distribution
      const activityTypes = activities.reduce((acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
        return acc;
      }, {});

      setReportData({
        monthlyStats: {
          totalRevenue,
          newDeals: thisMonthDeals.length,
          closedDeals: closedWonDeals.length,
          conversionRate
        },
        charts: {
          revenue: {
            series: [{
              name: 'Revenue',
              data: revenueData
            }],
            options: {
              chart: {
                type: 'area',
                fontFamily: 'Inter, sans-serif',
                toolbar: { show: false }
              },
              colors: ['#1e3a8a'],
              stroke: {
                curve: 'smooth',
                width: 2
              },
              fill: {
                type: 'gradient',
                gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.4,
                  opacityTo: 0.1,
                  stops: [0, 90, 100]
                }
              },
              xaxis: {
                categories: months
              },
              yaxis: {
                labels: {
                  formatter: (value) => '$' + value.toLocaleString()
                }
              },
              tooltip: {
                y: {
                  formatter: (value) => '$' + value.toLocaleString()
                }
              }
            }
          },
          deals: {
            series: [{
              name: 'Deals Closed',
              data: dealCountData
            }],
            options: {
              chart: {
                type: 'column',
                fontFamily: 'Inter, sans-serif',
                toolbar: { show: false }
              },
              colors: ['#f59e0b'],
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  columnWidth: '60%'
                }
              },
              xaxis: {
                categories: months
              },
              yaxis: {
                labels: {
                  formatter: (value) => Math.round(value)
                }
              }
            }
          },
          activities: {
            series: Object.values(activityTypes),
            options: {
              chart: {
                type: 'pie',
                fontFamily: 'Inter, sans-serif'
              },
              labels: Object.keys(activityTypes),
              colors: ['#1e3a8a', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'],
              legend: {
                position: 'bottom'
              }
            }
          }
        }
      });

    } catch (err) {
      setError('Failed to load report data');
      console.error('Error loading report data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
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
  if (error) return <Error message={error} onRetry={loadReportData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Sales Reports</h2>
        <p className="text-slate-600">Analyze your sales performance and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(reportData.monthlyStats.totalRevenue)}
          icon="DollarSign"
          color="success"
          trend="up"
          trendValue="+15%"
        />
        <StatCard
          title="New Deals"
          value={reportData.monthlyStats.newDeals.toLocaleString()}
          icon="Plus"
          color="primary"
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Closed Deals"
          value={reportData.monthlyStats.closedDeals.toLocaleString()}
          icon="CheckCircle"
          color="accent"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Conversion Rate"
          value={`${reportData.monthlyStats.conversionRate}%`}
          icon="TrendingUp"
          color="warning"
          trend={reportData.monthlyStats.conversionRate > 25 ? "up" : "down"}
          trendValue={`${reportData.monthlyStats.conversionRate > 25 ? '+' : ''}${reportData.monthlyStats.conversionRate - 20}%`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={reportData.charts.revenue.options}
              series={reportData.charts.revenue.series}
              type="area"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Deals Closed */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle>Deals Closed (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={reportData.charts.deals.options}
              series={reportData.charts.deals.series}
              type="bar"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Activity Distribution */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              options={reportData.charts.activities.options}
              series={reportData.charts.activities.series}
              type="pie"
              height={300}
            />
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {reportData.monthlyStats.closedDeals}
                </div>
                <div className="text-sm text-green-700">Won Deals</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {Math.max(0, reportData.monthlyStats.newDeals - reportData.monthlyStats.closedDeals)}
                </div>
                <div className="text-sm text-red-700">Lost Deals</div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-slate-900 mb-1">
                  Average Deal Size
                </div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(
                    reportData.monthlyStats.closedDeals > 0
                      ? reportData.monthlyStats.totalRevenue / reportData.monthlyStats.closedDeals
                      : 0
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;