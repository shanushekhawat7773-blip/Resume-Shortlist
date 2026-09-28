import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Users,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';

export const AnalyticsDashboardView: React.FC = () => {
  const { candidates, jobs, selectedJob } = useRecruitment();

  // Match distribution data
  const matchDistributionData = [
    { range: '50-60%', count: 12, benchmark: 15 },
    { range: '60-70%', count: 28, benchmark: 35 },
    { range: '70-80%', count: 46, benchmark: 42 },
    { range: '80-90%', count: 32, benchmark: 25 },
    { range: '90-100%', count: 14, benchmark: 8 },
  ];

  // Skill Demand vs Supply Data
  const skillSupplyData = [
    { skill: 'SQL', demand: 95, supply: 88 },
    { skill: 'Python', demand: 90, supply: 82 },
    { skill: 'Power BI', demand: 75, supply: 62 },
    { skill: 'Tableau', demand: 60, supply: 48 },
    { skill: 'Machine Learning', demand: 65, supply: 40 },
    { skill: 'Docker / Cloud', demand: 55, supply: 35 },
    { skill: 'Excel (Adv)', demand: 70, supply: 78 },
  ];

  // Experience Distribution Data
  const experienceData = [
    { name: '1-2 Yrs (Junior)', value: 24, color: '#38bdf8' },
    { name: '3-4 Yrs (Mid-Level)', value: 48, color: '#0284c7' },
    { name: '5-7 Yrs (Senior)', value: 20, color: '#0369a1' },
    { name: '8+ Yrs (Principal)', value: 8, color: '#075985' },
  ];

  // Top Missing Skills in Talent Pool
  const missingSkillsData = [
    { skill: 'Financial Modeling', count: 42 },
    { skill: 'Tableau', count: 38 },
    { skill: 'MLOps Pipelines', count: 31 },
    { skill: 'Advanced DAX', count: 26 },
    { skill: 'Snowflake DW', count: 22 },
  ];

  // Screening Funnel Data
  const funnelData = [
    { stage: 'New Submissions', count: 1248, fill: '#0284c7' },
    { stage: 'NLP Screened', count: 864, fill: '#0ea5e9' },
    { stage: 'Reviewed', count: 412, fill: '#38bdf8' },
    { stage: 'Shortlisted', count: 186, fill: '#10b981' },
    { stage: 'Interview', count: 54, fill: '#059669' },
    { stage: 'Final Review', count: 18, fill: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-950 border border-brand-800 text-brand-300 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-brand-400" />
            Recruitment Intelligence Analytics
          </div>
          <h2 className="text-xl font-black text-white">
            Talent Pool & Screening Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Aggregated metrics across active candidate pools and historical screening benchmarks.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-750 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Live Data + Historical Benchmark Sync</span>
        </div>
      </div>

      {/* Top 5 KPI Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Screened</span>
          <span className="text-2xl font-black text-white mt-1 block">1,248</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">+18% vs last month</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Average Match</span>
          <span className="text-2xl font-black text-brand-400 mt-1 block">74%</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Normalized across 6 dims</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Strong Matches</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">186</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Score &ge; 80%</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Skill Gaps Detected</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">342</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Audit verification items</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-card col-span-2 lg:col-span-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Avg Screening Time</span>
          <span className="text-2xl font-black text-white mt-1 block">4.2 min</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Automated structured parser</span>
        </div>
      </div>

      {/* Row 1: Candidate Match Distribution + Skill Demand vs Supply */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Match Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Candidate Match Score Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Current pool score spread compared against historical role baseline.
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={matchDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="count" name="Current Pool" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                <Area type="monotone" dataKey="benchmark" name="Benchmark" stroke="#94a3b8" strokeDasharray="4 4" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Demand vs Supply */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Skill Demand vs Candidate Supply
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Required frequency in job descriptions vs verified candidate occurrence (%).
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillSupplyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="skill" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="demand" name="Role Demand %" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="supply" name="Candidate Supply %" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Experience Distribution + Top Missing Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Experience Donut */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Experience Tenure Spread
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Distribution of candidate commercial years.
            </p>
          </div>

          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={experienceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {experienceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {experienceData.map(e => (
              <div key={e.name} className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                  {e.name}
                </span>
                <span className="font-bold">{e.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Missing Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Top Undetected Skills
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Highest-frequency gap areas across applicants.
            </p>
          </div>

          <div className="space-y-3">
            {missingSkillsData.map(item => (
              <div key={item.skill} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>{item.skill}</span>
                  <span className="text-amber-400 font-mono">{item.count} resumes</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(item.count / 50) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recruitment Funnel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-card space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Screening Funnel
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Throughput from ingestion to interview stage.
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            {funnelData.map(step => (
              <div key={step.stage} className="p-2 rounded-xl bg-slate-850 border border-slate-750 flex items-center justify-between">
                <span className="font-semibold text-white">{step.stage}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-mono">{step.count}</span>
                  <span className="text-[10px] text-slate-400">
                    {Math.round((step.count / funnelData[0].count) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
