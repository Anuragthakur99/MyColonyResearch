import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Badge } from './ui/badge';
import axios from 'axios';
import { DASHBOARD_STATS_END_POINT } from '../utils/constant';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import {
  Star, TrendingUp, Award, Users, Zap, Shield, Home,
  ThumbsUp, AlertCircle, Lightbulb,
  DollarSign, BarChart2, Activity, MapPin, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Sparkles
} from 'lucide-react';

// ─── Color palette consistent with app theme ───────────────────────────────
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

const CATEGORY_ICONS = {
  'Food & Tiffin': '🍽️',
  'Laundry': '👕',
  'Cleaning': '🧹',
  'Grocery': '🛒',
  'Maintenance': '🔧',
  'Tutoring': '📚',
  'Pet Care': '🐕',
  'Other': '⚡',
};

// ─── Mock recommended facilities ────────────────────────────────────────────
const RECOMMENDED_FACILITIES = [
  { name: 'Doctor on Call', icon: '🏥', priority: 'High', demand: 89, category: 'Health', desc: '89% residents requested medical services' },
  { name: 'Yoga / Fitness Classes', icon: '🧘', priority: 'High', demand: 76, category: 'Wellness', desc: 'Growing demand for wellness services' },
  { name: 'Car Wash & Detailing', icon: '🚗', priority: 'Medium', demand: 68, category: 'Maintenance', desc: 'Popular in nearby colonies' },
  { name: 'Fresh Vegetables Delivery', icon: '🥦', priority: 'High', demand: 84, category: 'Grocery', desc: 'Highly requested organic delivery' },
  { name: 'Elder Care Assistance', icon: '👴', priority: 'Medium', demand: 55, category: 'Care', desc: 'Senior-friendly community needs' },
  { name: 'EV Charging Station', icon: '⚡', priority: 'High', demand: 72, category: 'Infrastructure', desc: 'Future-ready facility for EV owners' },
];

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'blue', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-elegant transition-all duration-300 group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${color}-500/10`}>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'}`}>
          {trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
    <div className="text-sm font-medium text-foreground">{title}</div>
    {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
  </motion.div>
);

// ─── Section Header ──────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle, accent }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className={`w-9 h-9 rounded-xl ${accent} flex items-center justify-center`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
    {subtitle && <p className="text-muted-foreground ml-12">{subtitle}</p>}
  </div>
);

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-elegant p-3 text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = ({ text }) => (
  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
    <BarChart2 className="h-8 w-8 opacity-30" />
    <p className="text-sm">{text}</p>
  </div>
);

// ─── Main Dashboard ──────────────────────────────────────────────────────────
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(DASHBOARD_STATS_END_POINT, { withCredentials: true });
        if (res.data.success) setStats(res.data.stats);
      } catch (err) {
        console.error('Dashboard fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Derive display values from stats
  const categoryData = (stats?.categoryData || []).map(c => ({ ...c, icon: CATEGORY_ICONS[c.name] || '📦' }));
  const approvedCount = stats?.approvedServices ?? 0;
  const avgRating = stats?.avgRating ?? 0;
  const totalReviews = stats?.totalReviews ?? 0;
  const ratingDist = stats?.ratingDist || [];
  const avgPriceData = stats?.avgPriceData || [];
  const monthlyTrend = stats?.monthlyTrend || [];
  const topServices = stats?.topServices || [];
  const missingCats = stats?.missingCategories || [];
  const colonies = stats?.usersPerColony?.map((c, i) => ({ _id: String(i), name: c.name, amenities: Array(c.amenities).fill('') })) || [];
  const priceSegments = stats?.priceSegments || { budget: 0, mid: 0, premium: 0 };
  const totalServices = stats?.totalServices ?? 0;
  const trustScore = stats?.trustScore ?? 0;
  const colonyEngagement = stats?.colonyEngagement || [];
  const servicesPerColony = stats?.servicesPerColony || [];
  const providerDiversity = stats?.providerDiversity || [];
  const pendingServices = stats?.pendingServices ?? 0;
  const verificationRate = stats?.verificationRate ?? 0;
  const approvalRate = stats?.approvalRate ?? 0;
  const totalResidents = stats?.totalResidents ?? 0;

  // Radar data from categoryData + stats
  const radarData = categoryData.slice(0, 6).map(c => {
    const colEngagement = stats?.colonyEngagement?.find(e => e.name === c.name);
    return { subject: c.name.split(' ')[0], quality: colEngagement?.approvalRate ?? Math.round(Math.random() * 80 + 20), volume: Math.min(c.value * 10, 100) };
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-muted-foreground font-medium">Loading Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero Header ── */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-primary/8 via-background to-secondary/5 border-b border-border">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wider">Analytics Dashboard</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1">Colony Intelligence Hub</h1>
                <p className="text-muted-foreground">Recommendations • Quality Analysis • Cost Insights</p>
              </div>

              {/* Colony info */}
              {stats?.colonyName && (
                <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{stats.colonyName}</span>
                </div>
              )}
            </div>

            {/* Tab nav */}
            <div className="flex gap-1 mt-6 border-b border-border">
              {['overview', 'recommendations', 'quality', 'costs', 'trust'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 text-sm font-semibold capitalize rounded-t-lg transition-all duration-200 border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8 max-w-5xl">

        {/* ══════════════════════════════════════════════════════ OVERVIEW ══ */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Total Services" value={totalServices} subtitle="across all categories" icon={Zap} color="blue" delay={0} />
              <StatCard title="Avg Rating" value={avgRating > 0 ? `${avgRating}★` : 'N/A'} subtitle={`${totalReviews} reviews`} icon={Star} color="amber" delay={0.05} />
              <StatCard title="Active Colonies" value={stats?.totalColonies ?? 0} subtitle="residential societies" icon={Home} color="emerald" delay={0.1} />
              <StatCard title="Trust Score" value={`${trustScore}%`} subtitle="verification + approval + rating" icon={Shield} color="violet" delay={0.15} />
            </div>

            {/* Second KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Approved" value={approvedCount} subtitle="verified services" icon={CheckCircle2} color="emerald" delay={0.05} />
              <StatCard title="Pending" value={pendingServices} subtitle="awaiting approval" icon={AlertCircle} color="amber" delay={0.1} />
              <StatCard title="Residents" value={totalResidents} subtitle="registered members" icon={Users} color="blue" delay={0.15} />
              <StatCard title="Verified Users" value={`${verificationRate}%`} subtitle="identity verified" icon={Award} color="violet" delay={0.2} />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category pie */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                <h3 className="font-bold mb-4 text-base">Services by Category</h3>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                        {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v, n, p) => [v, p.payload.name]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <EmptyState text="No service data yet" />}
              </motion.div>

              {/* Monthly trend */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                <h3 className="font-bold mb-4 text-base">Growth Trend</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={monthlyTrend}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="services" name="Services" stroke="#3b82f6" fill="url(#areaGrad)" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Top rated */}
            {topServices.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                <h3 className="font-bold mb-4 text-base">🏆 Top Rated Services</h3>
                <div className="space-y-3">
                  {topServices.map((s, i) => (
                    <div key={s._id} className="flex items-center justify-between p-3 bg-muted/40 rounded-xl hover:bg-muted/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-slate-100 text-slate-500' : 'bg-orange-100 text-orange-500'}`}>
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{s.title}</div>
                          <div className="text-xs text-muted-foreground">{s.category} · {s.reviewCount || 0} reviews</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold">{s.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════ RECOMMENDATIONS ══ */}
        {activeTab === 'recommendations' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <SectionHeader icon={Lightbulb} title="Society Facility Recommendations" subtitle="AI-driven suggestions based on community needs and demand analysis" accent="bg-amber-500" />

            {/* Demand bar chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-soft">
              <h3 className="font-bold mb-4 text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Facility Demand Analysis
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={RECOMMENDED_FACILITIES} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={150} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Demand']} />
                  <Bar dataKey="demand" radius={[0, 6, 6, 0]}>
                    {RECOMMENDED_FACILITIES.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Recommendation cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RECOMMENDED_FACILITIES.map((fac, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border rounded-2xl p-5 shadow-soft hover:shadow-elegant hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      {fac.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm">{fac.name}</h4>
                        <Badge variant={fac.priority === 'High' ? 'default' : 'secondary'} className="text-xs">
                          {fac.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{fac.desc}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-muted rounded-full h-1.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${fac.demand}%` }}
                            transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ background: COLORS[i % COLORS.length] }}
                          />
                        </div>
                        <span className="text-xs font-bold" style={{ color: COLORS[i % COLORS.length] }}>{fac.demand}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Missing services alert */}
            {missingCats.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">Missing Service Categories</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">Your colony currently lacks these important services. Consider inviting providers:</p>
                    <div className="flex flex-wrap gap-2">
                      {missingCats.map(c => (
                        <Badge key={c} variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-300">
                          {CATEGORY_ICONS[c]} {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {colonyEngagement.length > 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                <h3 className="font-bold mb-4 text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" /> Colony Comparison — Services & Engagement
                </h3>
                <div className="space-y-4">
                  {colonyEngagement.map((col, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-36 text-sm font-medium truncate">{col.name}</div>
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${col.engagement}%` }}
                          transition={{ delay: 0.2 + i * 0.1, duration: 0.7 }}
                          className="h-full rounded-full"
                          style={{ background: COLORS[i % COLORS.length] }}
                        />
                      </div>
                      <div className="text-sm font-bold w-10 text-right" style={{ color: COLORS[i % COLORS.length] }}>{col.engagement}%</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">* Engagement = services offered per resident × 100</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════ SERVICE QUALITY TAB ══ */}
        {activeTab === 'quality' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <SectionHeader icon={Star} title="Review & Service Quality Analysis" subtitle="Comprehensive analysis of service ratings, reviews, and quality metrics" accent="bg-violet-500" />

            {/* Rating KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Avg Rating" value={`${avgRating}★`} subtitle="overall score" icon={Star} color="amber" delay={0} />
              <StatCard title="Total Reviews" value={totalReviews} subtitle="community feedback" icon={Users} color="violet" delay={0.05} />
              <StatCard title="5-Star Services" value={ratingDist.find(r => r.rating === '5★')?.count ?? 0} subtitle="premium quality" icon={Award} color="emerald" delay={0.1} />
              <StatCard title="Needs Improvement" value={(ratingDist.find(r => r.rating === '1★')?.count ?? 0) + (ratingDist.find(r => r.rating === '2★')?.count ?? 0)} subtitle="below average" icon={AlertCircle} color="red" delay={0.15} />
            </div>

            {/* Rating distribution + radar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                <h3 className="font-bold mb-4 text-base">Rating Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ratingDist}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="rating" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Services" radius={[6, 6, 0, 0]}>
                      {ratingDist.map((_, i) => <Cell key={i} fill={['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981'][i]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                <h3 className="font-bold mb-4 text-base">Quality Radar by Category</h3>
                {radarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} />
                      <Radar name="Quality" dataKey="quality" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                      <Radar name="Volume" dataKey="volume" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : <EmptyState text="Need more rated services" />}
              </motion.div>
            </div>

            {/* Rating trend line */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-soft">
              <h3 className="font-bold mb-4 text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Rating Trend Over Time
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} tickFormatter={v => `${v}★`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="rating" name="Avg Rating" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: '#f59e0b' }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Category quality breakdown table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-soft overflow-x-auto">
              <h3 className="font-bold mb-4 text-base">Category Quality Breakdown</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 pr-4 font-semibold">Category</th>
                    <th className="text-right py-2 px-4 font-semibold">Services</th>
                    <th className="text-right py-2 px-4 font-semibold">Providers</th>
                    <th className="text-right py-2 pl-4 font-semibold">Avg Price</th>
                    <th className="text-right py-2 pl-4 font-semibold">Coverage</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData.map((cat, i) => {
                    const diversity = providerDiversity.find(d => d.category === cat.name);
                    const catAvgPrice = avgPriceData.find(d => d.full === cat.name)?.avg || 0;
                    const status = cat.value >= 3 ? 'Good Coverage' : cat.value >= 1 ? 'Limited' : 'No data';
                    const statusColor = cat.value >= 3 ? 'text-emerald-600' : cat.value >= 1 ? 'text-amber-600' : 'text-red-500';
                    return (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 pr-4 font-medium">{cat.icon} {cat.name}</td>
                        <td className="text-right py-3 px-4 text-muted-foreground">{cat.value}</td>
                        <td className="text-right py-3 px-4">
                          {diversity?.providers > 0 ? (
                            <span className="font-semibold">{diversity.providers} providers</span>
                          ) : <span className="text-muted-foreground">–</span>}
                        </td>
                        <td className="text-right py-3 pl-4 text-muted-foreground">{catAvgPrice > 0 ? `₹${catAvgPrice}` : '–'}</td>
                        <td className={`text-right py-3 pl-4 font-semibold text-xs ${statusColor}`}>{status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {categoryData.length === 0 && <EmptyState text="No services to analyze yet" />}
            </motion.div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════ COSTS TAB ══ */}
        {activeTab === 'costs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <SectionHeader icon={DollarSign} title="Society Costing Based Analysis" subtitle="Pricing insights, cost comparisons and affordability metrics across services" accent="bg-emerald-500" />

            {/* Cost KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(() => {
                const allAvgPrices = avgPriceData.map(d => d.avg).filter(p => p > 0);
                const avg = allAvgPrices.length ? Math.round(allAvgPrices.reduce((a, b) => a + b, 0) / allAvgPrices.length) : 0;
                const min = allAvgPrices.length ? Math.min(...allAvgPrices) : 0;
                const max = allAvgPrices.length ? Math.max(...allAvgPrices) : 0;
                return (
                  <>
                    <StatCard title="Avg Service Price" value={`₹${avg}`} subtitle="per service" icon={DollarSign} color="emerald" delay={0} />
                    <StatCard title="Lowest Avg Price" value={`₹${min}`} subtitle="most affordable" icon={TrendingUp} color="blue" delay={0.05} />
                    <StatCard title="Highest Avg Price" value={`₹${max}`} subtitle="premium service" icon={BarChart2} color="violet" delay={0.1} />
                    <StatCard title="Budget Options" value={priceSegments.budget} subtitle="under ₹200" icon={CheckCircle2} color="amber" delay={0.15} />
                  </>
                );
              })()}
            </div>

            {/* Avg price by category */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-soft">
              <h3 className="font-bold mb-4 text-base flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" /> Average Price by Category (₹)
              </h3>
              {avgPriceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={avgPriceData} margin={{ bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
                    <Tooltip formatter={(v, _, p) => [`₹${v}`, p.payload.full]} />
                    <Bar dataKey="avg" name="Avg Price" radius={[6, 6, 0, 0]}>
                      {avgPriceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="bg-muted/30 rounded-xl p-6">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[
                      { category: 'Food', avg: 150 }, { category: 'Laundry', avg: 200 },
                      { category: 'Cleaning', avg: 500 }, { category: 'Grocery', avg: 100 },
                      { category: 'Maintenance', avg: 800 }, { category: 'Tutoring', avg: 600 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
                      <Tooltip formatter={(v) => [`₹${v}`, 'Avg Price']} />
                      <Bar dataKey="avg" name="Market Avg" radius={[6, 6, 0, 0]}>
                        {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-center text-muted-foreground mt-2">* Market benchmark data (no local services yet)</p>
                </div>
              )}
            </motion.div>

            {/* Price range breakdown + Value for money */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                <h3 className="font-bold mb-4 text-base">Price Range Segments</h3>
                {(() => {
                  const segments = [
                    { label: 'Budget (< ₹200)', count: priceSegments.budget, color: '#10b981' },
                    { label: 'Mid (₹200–₹500)', count: priceSegments.mid, color: '#3b82f6' },
                    { label: 'Premium (₹500+)', count: priceSegments.premium, color: '#8b5cf6' },
                  ];
                  const total = segments.reduce((s, c) => s + c.count, 0) || 1;
                  return (
                    <div className="space-y-4 mt-2">
                      {segments.map((seg, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-medium">{seg.label}</span>
                            <span className="font-bold">{seg.count} services</span>
                          </div>
                          <div className="bg-muted rounded-full h-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(seg.count / total) * 100}%` }}
                              transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                              className="h-full rounded-full"
                              style={{ background: seg.color }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{((seg.count / total) * 100).toFixed(0)}% of services</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                <h3 className="font-bold mb-4 text-base">Value for Money Index</h3>
                <div className="space-y-3">
                  {categoryData.slice(0, 5).map((cat, i) => {
                    const avgR = avgRating || 3;
                    const avgP = avgPriceData.find(d => d.full === cat.name)?.avg || 300;
                    // VFM = rating / normalized price * 100
                    const vfm = Math.min(100, Math.round((avgR / 5) * (500 / Math.max(avgP, 50)) * 60));
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="text-base w-8 text-center">{cat.icon}</div>
                        <div className="w-28 text-xs font-medium truncate">{cat.name}</div>
                        <div className="flex-1 bg-muted rounded-full h-2.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${vfm}%` }}
                            transition={{ delay: 0.4 + i * 0.08, duration: 0.7 }}
                            className="h-full rounded-full"
                            style={{ background: vfm >= 70 ? '#10b981' : vfm >= 40 ? '#f59e0b' : '#ef4444' }}
                          />
                        </div>
                        <div className={`text-xs font-bold w-8 text-right ${vfm >= 70 ? 'text-emerald-600' : vfm >= 40 ? 'text-amber-600' : 'text-red-500'}`}>{vfm}</div>
                      </div>
                    );
                  })}
                  <p className="text-xs text-muted-foreground mt-2">* VFM score: higher = better value relative to price</p>
                </div>
              </motion.div>
            </div>

            {/* Cost saving tips */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <ThumbsUp className="h-4 w-4" /> Cost Optimization Suggestions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { tip: 'Bundle laundry + cleaning services for up to 20% savings', savings: '20%' },
                  { tip: 'Opt for weekly tiffin subscriptions instead of daily orders', savings: '15%' },
                  { tip: 'Group maintenance requests with neighbors to share costs', savings: '30%' },
                  { tip: 'Book tutoring for multiple children to get group discounts', savings: '25%' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white dark:bg-emerald-950/30 rounded-xl p-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-emerald-800 dark:text-emerald-200">{item.tip}</p>
                      <Badge variant="secondary" className="mt-1 bg-emerald-100 text-emerald-700 text-xs">Save {item.savings}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════ TRUST TAB ══ */}
        {activeTab === 'trust' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <SectionHeader icon={Shield} title="Community Trust & Verification" subtitle="Trust score, verification rates and approval metrics per colony" accent="bg-violet-500" />

            {/* Trust KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard title="Trust Score" value={`${trustScore}%`} subtitle="composite index" icon={Shield} color="violet" delay={0} />
              <StatCard title="Verification Rate" value={`${verificationRate}%`} subtitle="verified residents" icon={CheckCircle2} color="emerald" delay={0.05} />
              <StatCard title="Approval Rate" value={`${approvalRate}%`} subtitle="approved services" icon={Award} color="blue" delay={0.1} />
              <StatCard title="Avg Rating" value={avgRating > 0 ? `${avgRating}★` : 'N/A'} subtitle={`${totalReviews} reviews`} icon={Star} color="amber" delay={0.15} />
            </div>

            {/* Trust score formula */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-5">
              <h4 className="font-bold text-violet-800 dark:text-violet-300 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Trust Score Formula
              </h4>
              <p className="text-sm text-violet-700 dark:text-violet-400 mb-3">
                Trust Score = (Verification Rate × 0.4) + (Approval Rate × 0.3) + (Avg Rating / 5 × 100 × 0.3)
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-violet-950/40 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-violet-600">{verificationRate}%</div>
                  <div className="text-xs text-muted-foreground">Verification (40%)</div>
                </div>
                <div className="bg-white dark:bg-violet-950/40 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-blue-600">{approvalRate}%</div>
                  <div className="text-xs text-muted-foreground">Approval (30%)</div>
                </div>
                <div className="bg-white dark:bg-violet-950/40 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-amber-600">{avgRating > 0 ? avgRating : 0}</div>
                  <div className="text-xs text-muted-foreground">Avg Rating (30%)</div>
                </div>
              </div>
            </motion.div>

            {/* Per-colony trust table */}
            {colonyEngagement.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-soft overflow-x-auto">
                <h3 className="font-bold mb-4 text-base">Per-Colony Trust Breakdown</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-left py-2 pr-4 font-semibold">Colony</th>
                      <th className="text-right py-2 px-3 font-semibold">Residents</th>
                      <th className="text-right py-2 px-3 font-semibold">Services</th>
                      <th className="text-right py-2 px-3 font-semibold">Verified%</th>
                      <th className="text-right py-2 px-3 font-semibold">Approved%</th>
                      <th className="text-right py-2 pl-3 font-semibold">Engagement%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colonyEngagement.map((col, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 pr-4 font-medium">{col.name}</td>
                        <td className="text-right py-3 px-3 text-muted-foreground">{col.residents}</td>
                        <td className="text-right py-3 px-3 text-muted-foreground">{col.services}</td>
                        <td className="text-right py-3 px-3 font-semibold">
                          <span className={col.verificationRate >= 50 ? 'text-emerald-600' : 'text-amber-600'}>{col.verificationRate}%</span>
                        </td>
                        <td className="text-right py-3 px-3 font-semibold">
                          <span className={col.approvalRate >= 50 ? 'text-emerald-600' : 'text-amber-600'}>{col.approvalRate}%</span>
                        </td>
                        <td className="text-right py-3 pl-3 font-semibold">
                          <span className={col.engagement >= 30 ? 'text-emerald-600' : 'text-red-500'}>{col.engagement}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Approved vs Pending per colony bar chart */}
            {servicesPerColony.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                <h3 className="font-bold mb-4 text-base flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-primary" /> Approved vs Pending per Colony
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={servicesPerColony} margin={{ bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
