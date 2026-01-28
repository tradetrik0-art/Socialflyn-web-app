"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ClientDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.clientId) {
      setClientId(user.clientId);
      fetchDashboard(user.clientId);
    }
  }, []);

  const fetchDashboard = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/client/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDashboard(response.data);
    } catch (error: any) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="p-8 text-center">No data available</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome back! Here's your growth overview.</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Posts This Month", value: dashboard.posts.published, subtext: `${dashboard.posts.remaining} remaining` },
            { label: "Total Engagement", value: dashboard.engagement.totalEngagement, subtext: "likes + comments + shares" },
            { label: "Ad Spend", value: `$${dashboard.ads.totalAdSpend}`, subtext: "across all campaigns" },
            { label: "Leads Contacted", value: dashboard.leads.contacted, subtext: `of ${dashboard.leads.total} total` },
          ].map((card, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{card.label}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{card.subtext}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Performance */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold mb-4">Content Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Posts Approved</span>
                  <span className="text-sm font-semibold">{dashboard.posts.approved}/22</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${(dashboard.posts.approved / 22) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Avg. Engagement per Post</span>
                  <span className="text-sm font-semibold">{dashboard.engagement.avgEngagementPerPost}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  📊 <strong>AI Recommendation:</strong> Increase posting frequency to 3x/week for better reach.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
                🤖 Generate New Posts
              </button>
              <button className="w-full px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700 font-semibold">
                📈 View Growth Plan
              </button>
              <button className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold">
                📊 Download Report
              </button>
            </div>
          </div>
        </div>

        {/* Leads Section */}
        <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold mb-4">Lead Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">New Leads</p>
              <p className="text-2xl font-bold">{dashboard.leads.new}</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">Contacted</p>
              <p className="text-2xl font-bold">{dashboard.leads.contacted}</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">Converted</p>
              <p className="text-2xl font-bold">{dashboard.leads.converted}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
