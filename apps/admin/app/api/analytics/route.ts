import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = await getDb();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(todayStart);
  monthStart.setDate(monthStart.getDate() - 30);

  const [
    todayViews,
    weekViews,
    monthViews,
    todayVisitors,
    weekVisitors,
    monthVisitors,
    topReferrers,
    deviceBreakdown,
    dailyChart,
  ] = await Promise.all([
    // Page views counts
    db.collection('pageViews').countDocuments({ timestamp: { $gte: todayStart } }),
    db.collection('pageViews').countDocuments({ timestamp: { $gte: weekStart } }),
    db.collection('pageViews').countDocuments({ timestamp: { $gte: monthStart } }),

    // Unique visitors (distinct sessionIds)
    db.collection('pageViews').distinct('sessionId', { timestamp: { $gte: todayStart } }).then(r => r.length),
    db.collection('pageViews').distinct('sessionId', { timestamp: { $gte: weekStart } }).then(r => r.length),
    db.collection('pageViews').distinct('sessionId', { timestamp: { $gte: monthStart } }).then(r => r.length),

    // Top referrers (last 30 days, exclude empty)
    db.collection('pageViews').aggregate([
      { $match: { timestamp: { $gte: monthStart }, referrer: { $ne: '' } } },
      { $group: { _id: '$referrer', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]).toArray(),

    // Device breakdown (last 30 days)
    db.collection('pageViews').aggregate([
      { $match: { timestamp: { $gte: monthStart } } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray(),

    // Daily visitors for last 30 days
    db.collection('pageViews').aggregate([
      { $match: { timestamp: { $gte: monthStart } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          views: { $sum: 1 },
          visitors: { $addToSet: '$sessionId' },
        },
      },
      {
        $project: {
          date: '$_id',
          views: 1,
          visitors: { $size: '$visitors' },
        },
      },
      { $sort: { date: 1 } },
    ]).toArray(),
  ]);

  return NextResponse.json({
    today: { views: todayViews, visitors: todayVisitors },
    week: { views: weekViews, visitors: weekVisitors },
    month: { views: monthViews, visitors: monthVisitors },
    topReferrers: topReferrers.map(r => ({ referrer: r._id, count: r.count })),
    deviceBreakdown: deviceBreakdown.map(d => ({ device: d._id, count: d.count })),
    dailyChart: dailyChart.map(d => ({ date: d.date, views: d.views, visitors: d.visitors })),
  });
}
