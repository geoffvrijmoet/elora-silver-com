'use client';

import { useEffect, useState } from 'react';

interface AnalyticsData {
  today: { views: number; visitors: number };
  week: { views: number; visitors: number };
  month: { views: number; visitors: number };
  topReferrers: Array<{ referrer: string; count: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  dailyChart: Array<{ date: string; views: number; visitors: number }>;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function BarChart({ data, maxValue }: { data: Array<{ date: string; visitors: number }>; maxValue: number }) {
  if (data.length === 0) return <p className="text-sm text-gray-500">No data yet</p>;

  return (
    <div className="flex items-end gap-[2px] h-32">
      {data.map((d) => {
        const height = maxValue > 0 ? (d.visitors / maxValue) * 100 : 0;
        const dateObj = new Date(d.date + 'T12:00:00');
        const dayLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center group relative">
            <div
              className="w-full bg-gray-900 rounded-t min-h-[2px] transition-all"
              style={{ height: `${Math.max(height, 2)}%` }}
            />
            <div className="hidden group-hover:block absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {dayLabel}: {d.visitors} visitors
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!data) return <div className="text-center py-12 text-gray-500">Failed to load analytics.</div>;

  const maxVisitors = Math.max(...data.dailyChart.map(d => d.visitors), 1);

  return (
    <div>
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <StatCard label="Visitors Today" value={data.today.visitors} />
        <StatCard label="Views Today" value={data.today.views} />
        <StatCard label="Visitors This Week" value={data.week.visitors} />
        <StatCard label="Views This Week" value={data.week.views} />
        <StatCard label="Visitors This Month" value={data.month.visitors} />
        <StatCard label="Views This Month" value={data.month.views} />
      </div>

      {/* Daily chart */}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Daily Visitors (Last 30 Days)</h3>
        <BarChart data={data.dailyChart} maxValue={maxVisitors} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Device breakdown */}
        <div className="bg-white border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Devices</h3>
          {data.deviceBreakdown.length === 0 ? (
            <p className="text-sm text-gray-500">No data yet</p>
          ) : (
            <div className="space-y-2">
              {data.deviceBreakdown.map(d => {
                const total = data.deviceBreakdown.reduce((s, x) => s + x.count, 0);
                const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
                return (
                  <div key={d.device} className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 w-16 capitalize">{d.device}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="bg-gray-900 rounded-full h-2" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top referrers */}
        <div className="bg-white border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Referrers</h3>
          {data.topReferrers.length === 0 ? (
            <p className="text-sm text-gray-500">No referrer data yet</p>
          ) : (
            <div className="space-y-2">
              {data.topReferrers.map(r => (
                <div key={r.referrer} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                    {r.referrer.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </span>
                  <span className="text-xs text-gray-500">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
