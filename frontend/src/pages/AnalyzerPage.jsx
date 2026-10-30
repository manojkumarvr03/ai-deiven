import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Spinner } from 'react-bootstrap';
import {
  BarChart3, Zap, Brain,
  Code2, FileCheck2, Flame, TrendingUp,
  CheckCircle, AlertTriangle, Activity, Star
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend, ArcElement, PointElement, LineElement,
  RadialLinearScale, Filler
} from 'chart.js';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend, ArcElement, PointElement, LineElement,
  RadialLinearScale, Filler
);

const AnalyzerPage = () => {
  const { user } = useAuth();
  const [taskStats, setTaskStats] = useState(null);
  const [assignmentStats, setAssignmentStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const studyRole = user?.studyRole || 'programming';
  const totalXP = user?.learningStats?.totalXP || 150;
  const streakDays = user?.learningStats?.streakDays || 1;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [tRes, aRes] = await Promise.allSettled([
          API.get(`/tasks?studyRole=${studyRole}`),
          API.get(`/assignments?studyRole=${studyRole}`)
        ]);
        if (tRes.status === 'fulfilled' && tRes.value.data.success) {
          setTaskStats(tRes.value.data.stats);
          setTasks(tRes.value.data.tasks || []);
        }
        if (aRes.status === 'fulfilled' && aRes.value.data.success) {
          setAssignmentStats(aRes.value.data.stats);
          setAssignments(aRes.value.data.assignments || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [studyRole]);

  const tasksByDifficulty = {
    Easy: tasks.filter(t => t.difficulty === 'Easy'),
    Medium: tasks.filter(t => t.difficulty === 'Medium'),
    Hard: tasks.filter(t => t.difficulty === 'Hard'),
  };
  const solvedByDifficulty = {
    Easy: tasksByDifficulty.Easy.filter(t => t.userStatus === 'solved').length,
    Medium: tasksByDifficulty.Medium.filter(t => t.userStatus === 'solved').length,
    Hard: tasksByDifficulty.Hard.filter(t => t.userStatus === 'solved').length,
  };

  const barData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Total Tasks',
        data: [tasksByDifficulty.Easy.length, tasksByDifficulty.Medium.length, tasksByDifficulty.Hard.length],
        backgroundColor: 'rgba(2,132,199,0.14)',
        borderColor: '#0284c7',
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
      },
      {
        label: 'Solved',
        data: [solvedByDifficulty.Easy, solvedByDifficulty.Medium, solvedByDifficulty.Hard],
        backgroundColor: 'rgba(5,150,105,0.85)',
        borderColor: '#059669',
        borderWidth: 0,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  const solvedCount = taskStats?.solvedTasks || 0;
  const totalCount  = taskStats?.totalTasks  || 0;
  const unsolvedCount = Math.max(0, totalCount - solvedCount);

  const doughnutData = {
    labels: ['Solved', 'Remaining'],
    datasets: [{
      data: solvedCount === 0 && totalCount === 0
        ? [1, 0]
        : [solvedCount, unsolvedCount],
      backgroundColor: solvedCount === 0 && totalCount === 0
        ? ['#e2e8f0', '#e2e8f0']
        : ['#0284c7', '#e2e8f0'],
      borderColor: ['transparent', 'transparent'],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  const xpPercent      = Math.min(100, Math.round((totalXP / 500) * 100));
  const assignCompl    = assignmentStats?.totalAssignments > 0
    ? Math.round((assignmentStats.submittedCount / assignmentStats.totalAssignments) * 100) : 0;
  const streakScore    = Math.min(100, streakDays * 10);
  const completionRate = taskStats?.completionRate || 0;

  const radarData = {
    labels: ['Task Solving', 'XP Earned', 'Assignment\nCompletion', 'Avg Score', 'Streak'],
    datasets: [{
      label: 'Your Performance',
      data: [completionRate, xpPercent, assignCompl, assignmentStats?.averageScore || 0, streakScore],
      backgroundColor: 'rgba(124,58,237,0.14)',
      borderColor: '#7c3aed',
      pointBackgroundColor: '#7c3aed',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      borderWidth: 2,
      pointRadius: 5,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: { boxWidth: 10, boxHeight: 10, borderRadius: 3, font: { size: 12, weight: '600' }, color: '#64748b', padding: 16, usePointStyle: true, pointStyle: 'rectRounded' },
      },
      tooltip: { backgroundColor: '#0f172a', titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 12, cornerRadius: 10 },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 11 }, padding: 8 }, border: { display: false } },
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 12, weight: '600' } }, border: { display: false } },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true, max: 100,
        grid: { color: 'rgba(0,0,0,0.06)' },
        angleLines: { color: 'rgba(0,0,0,0.06)' },
        pointLabels: { color: '#64748b', font: { size: 11, weight: '600' }, padding: 8 },
        ticks: { color: '#94a3b8', backdropColor: 'transparent', stepSize: 25, font: { size: 9 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0f172a', titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 10, cornerRadius: 8 },
    },
  };

  const categories = [...new Set(tasks.map(t => t.category).filter(Boolean))];
  const categoryPerf = categories.map(cat => {
    const catTasks = tasks.filter(t => t.category === cat);
    const solved = catTasks.filter(t => t.userStatus === 'solved').length;
    return { cat, total: catTasks.length, solved, rate: catTasks.length > 0 ? Math.round((solved / catTasks.length) * 100) : 0 };
  }).sort((a, b) => b.rate - a.rate);

  const overallScore = Math.round(completionRate * 0.4 + (assignmentStats?.averageScore || 0) * 0.4 + xpPercent * 0.2);

  const metrics = [
    { label: 'Tasks Solved', value: `${solvedCount}/${totalCount}`, icon: Code2, color: '#0284c7', bg: '#e0f2fe' },
    { label: 'XP Earned',    value: `${totalXP}`,                   icon: Zap,   color: '#059669', bg: '#dcfce7' },
    { label: 'Avg Grade',    value: `${assignmentStats?.averageScore || 0}%`, icon: FileCheck2, color: '#7c3aed', bg: '#f3e8ff' },
    { label: 'Streak',       value: `${streakDays}d`,               icon: Flame, color: '#d97706', bg: '#fef3c7' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px', gap: 16 }}>
        <Spinner animation="border" variant="primary" />
        <p style={{ color: '#64748b', margin: 0 }}>Loading your analytics…</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg,#ffffff 0%,#f0f7ff 100%)',
        border: '1px solid #dbeafe',
        borderRadius: 20,
        padding: '28px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: 'linear-gradient(135deg,#0284c7,#7c3aed)', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BarChart3 size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#e0f2fe', color: '#0284c7', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 999, marginBottom: 6 }}>
              <Brain size={12} />
              <span>AI PERFORMANCE ANALYTICS</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
              Learning Analyzer Dashboard 📊
            </h2>
          </div>
        </div>

        {/* Metrics bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {/* Score pill */}
          <div style={{ background: '#0f172a', borderRadius: 14, padding: '14px 22px', minWidth: 130 }}>
            <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: 2 }}>Overall Score</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#38bdf8', lineHeight: 1 }}>{overallScore}</div>
            <div style={{ fontSize: '0.68rem', color: '#475569' }}>out of 100</div>
          </div>

          {/* Metric chips */}
          {metrics.map(m => {
            const Icon = m.icon;
            return (
              <div key={m.label} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, minWidth: 130 }}>
                <div style={{ background: m.bg, borderRadius: 10, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} style={{ color: m.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{m.value}</div>
                  <div style={{ fontSize: '0.66rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{m.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ROW 1 : Bar Chart + Doughnut ────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>

        {/* Bar Chart */}
        <div style={{ background: '#ffffff', border: '1px solid #dbeafe', borderRadius: 18, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: '0.97rem', fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Task Performance by Difficulty</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total vs Solved challenge breakdown</div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#e0f2fe', color: '#0284c7', fontSize: '0.68rem', fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>
              <Activity size={11} />
              <span>Live Data</span>
            </div>
          </div>
          <div style={{ height: 250, marginTop: 16 }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Doughnut */}
        <div style={{ background: '#ffffff', border: '1px solid #dbeafe', borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.97rem', fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Task Completion</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 20 }}>Overall solve rate</div>

          {/* Doughnut + center label */}
          <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto' }}>
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                  legend: { display: false },
                  tooltip: { backgroundColor: '#0f172a', titleColor: '#f1f5f9', bodyColor: '#94a3b8', padding: 10, cornerRadius: 8 },
                },
              }}
            />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <span style={{ fontSize: '1.7rem', fontWeight: 900, color: '#0284c7', lineHeight: 1 }}>{completionRate}%</span>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, marginTop: 2 }}>Completion</span>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {[
              { label: 'Solved',    value: solvedCount,   color: '#0284c7' },
              { label: 'Remaining', value: unsolvedCount, color: '#e2e8f0' },
              { label: 'Total',     value: totalCount,    color: '#0f172a' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: r.color, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 500 }}>{r.label}</span>
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 2 : Radar + Category Breakdown ──────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20 }}>

        {/* Radar */}
        <div style={{ background: '#ffffff', border: '1px solid #dbeafe', borderRadius: 18, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: '0.97rem', fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Skills Radar</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Multi-dimensional learning performance</div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f3e8ff', color: '#7c3aed', fontSize: '0.68rem', fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>
              <Star size={11} />
              <span>5 Axes</span>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Category Breakdown */}
        <div style={{ background: '#ffffff', border: '1px solid #dbeafe', borderRadius: 18, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: '0.97rem', fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Performance by Topic Category</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 20 }}>Your strongest and weakest subject areas</div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#dcfce7', color: '#166534', fontSize: '0.68rem', fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>
              <TrendingUp size={11} />
              <span>{categoryPerf.length} Topics</span>
            </div>
          </div>

          {categoryPerf.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: 10 }}>
              <div style={{ background: '#f1f5f9', borderRadius: 12, padding: 16, color: '#94a3b8' }}>
                <BarChart3 size={32} />
              </div>
              <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>No data yet</div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center' }}>Solve some tasks to see your category analysis here.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {categoryPerf.slice(0, 6).map(item => {
                const isGood  = item.rate >= 80;
                const isMid   = item.rate >= 50 && item.rate < 80;
                const barClr  = isGood ? '#059669' : isMid ? '#f59e0b' : '#ef4444';
                const badgeBg = isGood ? '#dcfce7' : isMid ? '#fef3c7' : '#fee2e2';
                const badgeClr = isGood ? '#166534' : isMid ? '#92400e' : '#991b1b';
                const Icon    = isGood ? CheckCircle : AlertTriangle;
                return (
                  <div key={item.cat}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <Icon size={13} style={{ color: barClr, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}>{item.cat}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.solved}/{item.total} solved</span>
                        <span style={{ background: badgeBg, color: badgeClr, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>
                          {item.rate}%
                        </span>
                      </div>
                    </div>
                    <div style={{ height: 7, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${item.rate}%`, height: '100%', background: barClr, borderRadius: 99, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzerPage;
