import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, AreaChart, Area
} from "recharts";

const SUPABASE_URL = "https://fkvnjfvrbmomerrkqxge.supabase.co";
const SUPABASE_KEY = "sb_publishable_oM_JRsfb8PGe37SN--Yzmg_w0Qr8aIo";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const QUESTIONS = [
  { id: "stress", label: "How would you rate your stress level this week?", hint: "1 = Very stressed, 10 = Completely at ease", },
  { id: "workload", label: "How manageable is your workload feeling?", hint: "1 = Completely overwhelmed, 10 = Very manageable",},
  { id: "relationships", label: "How are your relationships with teammates?", hint: "1 = Very difficult, 10 = Excellent" },
  { id: "manager", label: "How supported do you feel by your manager?", hint: "1 = Not supported, 10 = Fully supported"},
  { id: "balance", label: "How is your work-life balance this week?", hint: "1 = No balance at all, 10 = Perfect balance",},
];

const DEPTS = ["Engineering","Marketing","Sales","HR","Finance","Operations","Product","Design","Customer Success","Legal"];
const COLORS = ["#0078D4","#00B294","#FF8C00","#E74856","#8764B8","#00B7C3","#FFB900","#E3008C"];
const TOOLKIT_ITEMS = [
  { id: 1, title: "4-7-8 Breathing", desc: "Inhale 4s, hold 7s, exhale 8s. Reduces stress instantly.", duration: "2 min", type: "breathing" },
  { id: 2, title: "5-Minute Journal", desc: "Write 3 things you're grateful for today.", duration: "5 min", type: "journal" },
  { id: 3, title: "Desk Stretches", desc: "Simple stretches to release tension at your desk.", duration: "3 min", type: "stretch" },
  { id: 4, title: "Pomodoro Focus", desc: "Work 25 min, break 5 min. Boost productivity.", duration: "30 min", type: "focus" },
  { id: 5, title: "Gratitude Pause", desc: "Name 3 small wins from today.", duration: "1 min", type: "mindset" },
  { id: 6, title: "Walk Break", desc: "Step away from your screen for a quick walk.", duration: "10 min", type: "movement" },
];

function getWeekLabel() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
  return `Week ${week} ${now.getFullYear()}`;
}

function getRisk(score) { return score >= 7 ? "low" : score >= 5 ? "medium" : "high"; }
function getRiskLabel(score) { return score >= 7 ? "Low Risk" : score >= 5 ? "Medium Risk" : "High Risk"; }
function getRiskColor(score) { return score >= 7 ? "#00B294" : score >= 5 ? "#FF8C00" : "#E74856"; }

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F3F2F1; --surface: #FFFFFF; --surface2: #FAF9F8;
    --ink: #201F1E; --ink-soft: #605E5C; --ink-faint: #A19F9D;
    --accent: #0078D4; --accent-light: #EFF6FC;
    --success: #00B294; --success-light: #E8F7F4;
    --warn: #FF8C00; --warn-light: #FFF4E0;
    --danger: #E74856; --danger-light: #FDE7E9;
    --border: #EDEBE9;
    --shadow-sm: 0 1px 4px rgba(0,0,0,0.08);
    --shadow: 0 2px 8px rgba(0,0,0,0.1);
    --shadow-lg: 0 4px 20px rgba(0,0,0,0.12);
    --radius: 4px; --radius-lg: 8px;
  }
  body { background: var(--bg); font-family: 'Segoe UI', system-ui, sans-serif; color: var(--ink); font-size: 14px; }
  .wp-app { min-height: 100vh; display: flex; flex-direction: column; }

  .auth-wrap { min-height:100vh; display:flex; background: linear-gradient(135deg, #0078D4 0%, #004E8C 100%); }
  .auth-left { flex:1; display:flex; align-items:center; justify-content:center; padding:48px; }
  .auth-brand { color:#fff; }
  .auth-brand-logo { font-family:'DM Serif Display',serif; font-size:48px; margin-bottom:16px; }
  .auth-brand-tagline { font-size:18px; opacity:.85; max-width:340px; line-height:1.6; }
  .auth-brand-features { margin-top:48px; display:flex; flex-direction:column; gap:16px; }
  .auth-feature { display:flex; align-items:center; gap:12px; color:#fff; opacity:.9; font-size:15px; }
  .auth-right { width:480px; background:#fff; display:flex; align-items:center; justify-content:center; padding:48px; }
  .auth-card { width:100%; }
  .auth-title { font-size:24px; font-weight:600; margin-bottom:4px; }
  .auth-sub { color:var(--ink-soft); font-size:14px; margin-bottom:32px; }
  .auth-tabs { display:flex; border-bottom:2px solid var(--border); margin-bottom:28px; }
  .auth-tab { padding:10px 20px; border:none; background:transparent; font-family:inherit; font-size:14px; font-weight:500; cursor:pointer; color:var(--ink-soft); border-bottom:2px solid transparent; margin-bottom:-2px; transition:all .2s; }
  .auth-tab.active { color:var(--accent); border-bottom-color:var(--accent); }
  .field { margin-bottom:16px; }
  .field label { display:block; font-size:12px; font-weight:600; color:var(--ink-soft); margin-bottom:6px; text-transform:uppercase; letter-spacing:.04em; }
  .field input, .field select { width:100%; padding:8px 12px; border:1px solid var(--border); border-radius:var(--radius); font-family:inherit; font-size:14px; color:var(--ink); background:#fff; outline:none; transition:border .15s; height:36px; }
  .field input:focus, .field select:focus { border-color:var(--accent); box-shadow:0 0 0 1px var(--accent); }
  .btn-primary { width:100%; padding:8px 16px; background:var(--accent); color:#fff; border:none; border-radius:var(--radius); font-family:inherit; font-size:14px; font-weight:600; cursor:pointer; height:36px; transition:background .15s; margin-top:8px; }
  .btn-primary:hover { background:#106EBE; } .btn-primary:disabled { opacity:.6; cursor:not-allowed; }
  .btn-secondary { padding:6px 16px; background:#fff; color:var(--accent); border:1px solid var(--accent); border-radius:var(--radius); font-family:inherit; font-size:14px; font-weight:500; cursor:pointer; height:32px; }
  .btn-dark { padding:8px 20px; background:var(--ink); color:#fff; border:none; border-radius:var(--radius); font-family:inherit; font-size:14px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:8px; }
  .auth-error { background:var(--danger-light); color:var(--danger); padding:8px 12px; border-radius:var(--radius); font-size:13px; margin-bottom:16px; border-left:3px solid var(--danger); }
  .auth-success { background:var(--success-light); color:var(--success); padding:8px 12px; border-radius:var(--radius); font-size:13px; margin-bottom:16px; border-left:3px solid var(--success); }
  .setup-tabs { display:flex; gap:8px; margin-bottom:16px; }
  .setup-tab { flex:1; padding:8px; border:1px solid var(--border); border-radius:var(--radius); background:#fff; font-family:inherit; font-size:13px; cursor:pointer; text-align:center; transition:all .15s; }
  .setup-tab.active { background:var(--accent); color:#fff; border-color:var(--accent); font-weight:600; }

  .nav { background:#1B1A19; color:#fff; height:48px; display:flex; align-items:center; padding:0 20px; gap:16px; position:sticky; top:0; z-index:200; }
  .nav-logo { font-family:'DM Serif Display',serif; font-size:20px; color:#fff; margin-right:8px; }
  .nav-divider { width:1px; height:20px; background:rgba(255,255,255,0.2); }
  .nav-title { font-size:13px; color:rgba(255,255,255,0.7); }
  .nav-right { margin-left:auto; display:flex; align-items:center; gap:12px; }
  .nav-user { font-size:13px; color:rgba(255,255,255,0.8); }
  .nav-avatar { width:30px; height:30px; border-radius:50%; background:var(--accent); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#fff; }
  .btn-nav { padding:4px 12px; background:transparent; border:1px solid rgba(255,255,255,0.3); border-radius:var(--radius); color:#fff; font-family:inherit; font-size:13px; cursor:pointer; }
  .btn-nav:hover { background:rgba(255,255,255,0.1); }

  .app-layout { display:flex; flex:1; }
  .sidebar { width:200px; background:var(--surface); border-right:1px solid var(--border); padding:8px 0; flex-shrink:0; }
  .sidebar-item { display:flex; align-items:center; gap:10px; padding:8px 16px; font-size:13px; color:var(--ink-soft); cursor:pointer; transition:all .1s; border-left:3px solid transparent; }
  .sidebar-item:hover { background:var(--bg); color:var(--ink); }
  .sidebar-item.active { background:var(--accent-light); color:var(--accent); border-left-color:var(--accent); font-weight:500; }
  .sidebar-icon { font-size:15px; width:20px; text-align:center; }
  .sidebar-section { font-size:11px; font-weight:600; color:var(--ink-faint); text-transform:uppercase; letter-spacing:.06em; padding:12px 16px 4px; }
  .content { flex:1; overflow-y:auto; }

  .main { padding:24px; max-width:1400px; }
  .page-header { margin-bottom:20px; }
  .page-title { font-size:20px; font-weight:600; margin-bottom:2px; }
  .page-sub { font-size:13px; color:var(--ink-soft); }
  .breadcrumb { font-size:12px; color:var(--ink-faint); margin-bottom:6px; }

  .card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-sm); }
  .card-title { font-size:13px; font-weight:600; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.04em; margin-bottom:16px; display:flex; align-items:center; gap:8px; }

  .kpi-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin-bottom:20px; }
  .kpi-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-sm); position:relative; overflow:hidden; }
  .kpi-card::after { content:''; position:absolute; top:0; left:0; right:0; height:3px; }
  .kpi-card.blue::after { background:var(--accent); }
  .kpi-card.green::after { background:var(--success); }
  .kpi-card.orange::after { background:var(--warn); }
  .kpi-card.red::after { background:var(--danger); }
  .kpi-label { font-size:11px; font-weight:600; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.04em; margin-bottom:8px; }
  .kpi-value { font-size:32px; font-weight:300; color:var(--ink); line-height:1; margin-bottom:4px; }
  .kpi-value span { font-size:16px; }
  .kpi-sub { font-size:12px; color:var(--ink-faint); }
  .kpi-trend { font-size:12px; font-weight:500; margin-top:6px; }
  .kpi-trend.up { color:var(--success); } .kpi-trend.down { color:var(--danger); }

  .charts-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
  .charts-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:16px; }

  .table-wrap { overflow-x:auto; }
  .wp-table { width:100%; border-collapse:collapse; font-size:13px; }
  .wp-table th { text-align:left; font-size:11px; font-weight:600; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.04em; padding:8px 12px; border-bottom:2px solid var(--border); background:var(--bg); }
  .wp-table td { padding:10px 12px; border-bottom:1px solid var(--border); }
  .wp-table tr:hover td { background:var(--bg); }
  .wp-table tr:last-child td { border-bottom:none; }
  .risk-badge { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:600; }
  .risk-badge.low { background:var(--success-light); color:var(--success); }
  .risk-badge.medium { background:var(--warn-light); color:var(--warn); }
  .risk-badge.high { background:var(--danger-light); color:var(--danger); }
  .risk-dot { width:6px; height:6px; border-radius:50%; background:currentColor; }

  .score-bar-wrap { display:flex; align-items:center; gap:8px; }
  .score-bar { flex:1; height:6px; background:var(--border); border-radius:3px; overflow:hidden; }
  .score-bar-fill { height:100%; border-radius:3px; }
  .score-num { font-size:12px; font-weight:600; min-width:28px; text-align:right; }

  .checkin-wrap { max-width:640px; margin:0 auto; padding:32px 24px; }
  .checkin-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:32px; box-shadow:var(--shadow); }
  .checkin-week { font-size:11px; font-weight:600; color:var(--accent); text-transform:uppercase; letter-spacing:.06em; margin-bottom:4px; }
  .checkin-title { font-size:22px; font-weight:600; margin-bottom:4px; }
  .checkin-sub { font-size:13px; color:var(--ink-soft); margin-bottom:24px; }
  .progress-steps { display:flex; gap:4px; margin-bottom:24px; }
  .progress-step { flex:1; height:4px; background:var(--border); border-radius:2px; transition:background .3s; }
  .progress-step.done { background:var(--accent); }
  .progress-step.active { background:#90C3EA; }
  .question-num { font-size:11px; font-weight:600; color:var(--ink-faint); margin-bottom:4px; }
  .question-icon { font-size:28px; margin-bottom:8px; }
  .question-label { font-size:17px; font-weight:500; margin-bottom:6px; }
  .question-hint { font-size:13px; color:var(--ink-soft); margin-bottom:20px; }
  .slider-row { display:flex; align-items:center; gap:12px; margin-bottom:6px; }
  .slider-row input[type=range] { flex:1; accent-color:var(--accent); cursor:pointer; }
  .slider-score { font-size:32px; font-weight:300; min-width:40px; text-align:center; }
  .slider-labels { display:flex; justify-content:space-between; font-size:11px; color:var(--ink-faint); margin-bottom:24px; }
  .checkin-nav { display:flex; justify-content:space-between; align-items:center; }
  .checkin-done { text-align:center; padding:32px 0; }
  .checkin-done-icon { font-size:56px; margin-bottom:16px; }
  .checkin-done h2 { font-size:22px; font-weight:600; margin-bottom:8px; }
  .checkin-done p { color:var(--ink-soft); font-size:14px; }

  .toolkit-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }
  .toolkit-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; cursor:pointer; transition:all .15s; }
  .toolkit-card:hover { border-color:var(--accent); box-shadow:var(--shadow); transform:translateY(-2px); }
  .toolkit-icon { font-size:32px; margin-bottom:12px; }
  .toolkit-title { font-size:15px; font-weight:600; margin-bottom:4px; }
  .toolkit-desc { font-size:13px; color:var(--ink-soft); margin-bottom:12px; line-height:1.5; }
  .toolkit-duration { font-size:11px; font-weight:600; color:var(--accent); background:var(--accent-light); padding:2px 8px; border-radius:10px; display:inline-block; }

  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000; padding:24px; }
  .modal-card { background:#fff; border-radius:12px; padding:40px; text-align:center; max-width:380px; width:100%; }
  .breathing-circle { width:140px; height:140px; border-radius:50%; background:var(--accent-light); border:3px solid var(--accent); display:flex; align-items:center; justify-content:center; margin:20px auto; font-size:15px; font-weight:600; color:var(--accent); transition:transform 1s ease; }
  .breathing-circle.inhale { transform:scale(1.25); }
  .breathing-circle.exhale { transform:scale(1); }

  .loading { display:flex; align-items:center; justify-content:center; min-height:100vh; flex-direction:column; gap:12px; }
  .loading-spinner { width:28px; height:28px; border:3px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin .8s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .loading-text { font-size:13px; color:var(--ink-soft); }
  .empty-state { text-align:center; padding:60px 20px; color:var(--ink-soft); }
  .empty-icon { font-size:40px; margin-bottom:12px; }
  .empty-title { font-size:17px; font-weight:600; color:var(--ink); margin-bottom:8px; }

  @media(max-width:768px) {
    .auth-left { display:none; } .auth-right { width:100%; }
    .sidebar { display:none; }
    .charts-grid, .charts-grid-3 { grid-template-columns:1fr; }
    .kpi-grid { grid-template-columns:1fr 1fr; }
  }
`;

const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

export default function WellPulse() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
      if (session) loadProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(uid) {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    setProfile(data);
    setLoading(false);
  }

  if (loading) return <div className="loading"><div className="loading-spinner" /><div className="loading-text">Loading WellPulse...</div></div>;
  if (!session) return <AuthScreen />;
  if (!profile) return <div className="loading"><div className="loading-spinner" /><div className="loading-text">Setting up your workspace...</div></div>;
  if (profile.role === "leadership") return <LeadershipApp user={profile} onLogout={() => supabase.auth.signOut()} />;
  return <EmployeeApp user={profile} onLogout={() => supabase.auth.signOut()} />;
}

function AuthScreen() {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", department:"Engineering", role:"employee", companyCode:"", companyName:"" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [setupTab, setSetupTab] = useState("join");

  async function handleLogin(e) {
    e.preventDefault(); setError(""); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (error) setError(error.message);
    setBusy(false);
  }

  async function handleSignup(e) {
    e.preventDefault(); setError(""); setBusy(true);
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); setBusy(false); return; }
    let companyCode = form.companyCode?.toUpperCase();
    if (form.role === "leadership" && setupTab === "create") {
      companyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    const { data, error } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { name: form.name, department: form.department, role: form.role, company_code: companyCode } }
    });
    if (error) { setError(error.message); setBusy(false); return; }
    if (data.user) {
      await supabase.from("profiles").upsert({ id: data.user.id, name: form.name, department: form.department, role: form.role, company_code: companyCode });
      if (form.role === "leadership" && setupTab === "create") {
        await supabase.from("companies").insert({ name: form.companyName || "My Company", code: companyCode, admin_id: data.user.id });
      }
      setMessage("Account created! Please sign in."); setTab("login");
    }
    setBusy(false);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">WellPulse</div>
          <div className="auth-brand-tagline">Workplace wellness intelligence for modern teams.</div>
          <div className="auth-brand-features">
            <div className="auth-feature">📊 Real-time burnout risk tracking</div>
            <div className="auth-feature">🏢 Department-level insights</div>
            <div className="auth-feature">🛠️ Employee wellness toolkit</div>
            <div className="auth-feature">📈 Monthly trend reports</div>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-title">Welcome to WellPulse</div>
          <div className="auth-sub">Workplace wellness, measured with care.</div>
          <div className="auth-tabs">
            <button className={`auth-tab ${tab==="login"?"active":""}`} onClick={()=>{setTab("login");setError("");setMessage("");}}>Sign In</button>
            <button className={`auth-tab ${tab==="signup"?"active":""}`} onClick={()=>{setTab("signup");setError("");setMessage("");}}>Register</button>
          </div>
          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}
          {tab === "login" ? (
            <form onSubmit={handleLogin}>
              <div className="field"><label>Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com" required /></div>
              <div className="field"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••" required /></div>
              <button className="btn-primary" type="submit" disabled={busy}>{busy?"Signing in...":"Sign In"}</button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <div className="field"><label>Full Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Jane Smith" required /></div>
              <div className="field"><label>Work Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com" required /></div>
              <div className="field"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min 6 characters" required /></div>
              <div className="field"><label>Department</label>
                <select value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>
                  {DEPTS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="field"><label>I am a...</label>
                <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                  <option value="employee">Employee</option>
                  <option value="leadership">Leader / Admin</option>
                </select>
              </div>
              {form.role === "leadership" ? (
                <>
                  <div className="setup-tabs">
                    <button type="button" className={`setup-tab ${setupTab==="join"?"active":""}`} onClick={()=>setSetupTab("join")}>Join Company</button>
                    <button type="button" className={`setup-tab ${setupTab==="create"?"active":""}`} onClick={()=>setSetupTab("create")}>Create Company</button>
                  </div>
                  {setupTab === "join"
                    ? <div className="field"><label>Company Code</label><input value={form.companyCode} onChange={e=>setForm({...form,companyCode:e.target.value})} placeholder="e.g. ABC123" /></div>
                    : <div className="field"><label>Company Name</label><input value={form.companyName} onChange={e=>setForm({...form,companyName:e.target.value})} placeholder="Acme Corp" /></div>
                  }
                </>
              ) : (
                <div className="field"><label>Company Code</label><input value={form.companyCode} onChange={e=>setForm({...form,companyCode:e.target.value})} placeholder="Ask your admin for the code" /></div>
              )}
              <button className="btn-primary" type="submit" disabled={busy}>{busy?"Creating...":"Create Account"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function LeadershipApp({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("checkins").select("*").order("created_at", { ascending: true })
      .then(({ data }) => { setCheckins(data || []); setLoading(false); });
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "departments" label: "Departments" },
    { id: "trends", label: "Trends" },
    { id: "reports", label: "Reports" },
  ];

  return (
    <div className="wp-app">
      <nav className="nav">
        <div className="nav-logo">WellPulse</div>
        <div className="nav-divider" />
        <div className="nav-title">Leadership Portal</div>
        <div className="nav-right">
          {user.company_code && <span style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>Code: <strong style={{color:"#fff",letterSpacing:2}}>{user.company_code}</strong></span>}
          <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
          <span className="nav-user">{user.name}</span>
          <button className="btn-nav" onClick={onLogout}>Sign out</button>
        </div>
      </nav>
      <div className="app-layout">
        <div className="sidebar">
          <div className="sidebar-section">Analytics</div>
          {navItems.map(item => (
            <div key={item.id} className={`sidebar-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)}>
              <span className="sidebar-icon">{item.icon}</span>{item.label}
            </div>
          ))}
        </div>
        <div className="content">
          {loading ? <div className="loading"><div className="loading-spinner" /></div> : (
            <>
              {page==="dashboard" && <DashboardPage checkins={checkins} user={user} />}
              {page==="departments" && <DepartmentsPage checkins={checkins} />}
              {page==="trends" && <TrendsPage checkins={checkins} />}
              {page==="reports" && <ReportsPage checkins={checkins} user={user} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ checkins, user }) {
  const weeks = [...new Set(checkins.map(c => c.week))];
  const cw = weeks[weeks.length - 1];
  const depts = [...new Set(checkins.map(c => c.department))].filter(Boolean);
  const thisWeek = checkins.filter(c => c.week === cw);
  const lastWeek = checkins.filter(c => c.week === weeks[weeks.length - 2]);

  const deptSummary = depts.map(dept => {
    const items = thisWeek.filter(c => c.department === dept);
    if (!items.length) return null;
    const avg = k => Math.round(items.reduce((a, b) => a + (b[k]||0), 0) / items.length);
    const score = Math.round((avg("stress")+avg("workload")+avg("relationships")+avg("manager")+avg("balance"))/5);
    return { dept, score, stress:avg("stress"), workload:avg("workload"), relationships:avg("relationships"), manager:avg("manager"), balance:avg("balance"), count:items.length };
  }).filter(Boolean).sort((a,b)=>a.score-b.score);

  const overall = deptSummary.length ? Math.round(deptSummary.reduce((a,b)=>a+b.score,0)/deptSummary.length) : 0;
  const lastOverall = lastWeek.length ? Math.round(lastWeek.reduce((a,b)=>a+Math.round((b.stress+b.workload+b.relationships+b.manager+b.balance)/5),0)/lastWeek.length) : 0;
  const trend = overall - lastOverall;
  const highRisk = deptSummary.filter(d=>getRisk(d.score)==="high").length;

  const radarData = ["stress","workload","relationships","manager","balance"].map(k => ({
    subject: k.charAt(0).toUpperCase()+k.slice(1),
    value: deptSummary.length ? Math.round(deptSummary.reduce((a,b)=>a+b[k],0)/deptSummary.length) : 0
  }));

  const riskDist = [
    { name:"Low", value:deptSummary.filter(d=>getRisk(d.score)==="low").length, color:"#00B294" },
    { name:"Medium", value:deptSummary.filter(d=>getRisk(d.score)==="medium").length, color:"#FF8C00" },
    { name:"High", value:deptSummary.filter(d=>getRisk(d.score)==="high").length, color:"#E74856" },
  ].filter(d=>d.value>0);

  return (
    <div className="main">
      <div className="page-header">
        <div className="breadcrumb">WellPulse › Dashboard</div>
        <div className="page-title">Wellness Overview</div>
        <div className="page-sub">{cw || "No data yet"} · {depts.length} departments · {thisWeek.length} responses</div>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-label">Overall Score</div>
          <div className="kpi-value" style={{color:getRiskColor(overall)}}>{overall}<span>/10</span></div>
          <div className="kpi-sub">{getRiskLabel(overall)}</div>
          {trend!==0 && <div className={`kpi-trend ${trend>0?"up":"down"}`}>{trend>0?"▲":"▼"} {Math.abs(trend)} vs last week</div>}
        </div>
        <div className="kpi-card red">
          <div className="kpi-label">High Risk Depts</div>
          <div className="kpi-value" style={{color:highRisk>0?"#E74856":"#00B294"}}>{highRisk}</div>
          <div className="kpi-sub">Require attention</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">Responses</div>
          <div className="kpi-value">{thisWeek.length}</div>
          <div className="kpi-sub">This week</div>
        </div>
        <div className="kpi-card orange">
          <div className="kpi-label">Departments</div>
          <div className="kpi-value">{depts.length}</div>
          <div className="kpi-sub">Being tracked</div>
        </div>
      </div>

      {checkins.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <div className="empty-title">No data yet</div>
          <p>Share your company code <strong>{user.company_code}</strong> with employees so they can register and complete check-ins.</p>
        </div>
      ) : (
        <>
          <div className="charts-grid">
            <div className="card">
              <div className="card-title"> Wellness by Category</div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#EDEBE9" />
                  <PolarAngleAxis dataKey="subject" tick={{fontSize:11}} />
                  <Radar dataKey="value" stroke="#0078D4" fill="#0078D4" fillOpacity={0.15} strokeWidth={2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="card-title">🔴 Risk Distribution</div>
              {riskDist.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={riskDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                      {riskDist.map((e,i)=><Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="empty-state" style={{padding:"40px 0"}}><p>No data yet</p></div>}
            </div>
          </div>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-title"> Department Risk Overview</div>
            <div className="table-wrap">
              <table className="wp-table">
                <thead><tr><th>Department</th><th>Risk</th><th>Score</th><th>Stress</th><th>Workload</th><th>Relationships</th><th>Manager</th><th>Balance</th><th>Responses</th></tr></thead>
                <tbody>
                  {deptSummary.map(d=>(
                    <tr key={d.dept}>
                      <td><strong>{d.dept}</strong></td>
                      <td><span className={`risk-badge ${getRisk(d.score)}`}><span className="risk-dot"/>{getRiskLabel(d.score)}</span></td>
                      <td>
                        <div className="score-bar-wrap">
                          <div className="score-bar"><div className="score-bar-fill" style={{width:`${d.score*10}%`,background:getRiskColor(d.score)}} /></div>
                          <span className="score-num" style={{color:getRiskColor(d.score)}}>{d.score}</span>
                        </div>
                      </td>
                      <td>{d.stress}</td><td>{d.workload}</td><td>{d.relationships}</td><td>{d.manager}</td><td>{d.balance}</td><td>{d.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DepartmentsPage({ checkins }) {
  const depts = [...new Set(checkins.map(c=>c.department))].filter(Boolean);
  const weeks = [...new Set(checkins.map(c=>c.week))];
  const cw = weeks[weeks.length-1];
  const thisWeek = checkins.filter(c=>c.week===cw);

  const barData = depts.map(dept => {
    const items = thisWeek.filter(c=>c.department===dept);
    if (!items.length) return null;
    const avg = k => Math.round(items.reduce((a,b)=>a+(b[k]||0),0)/items.length);
    return { dept, Stress:avg("stress"), Workload:avg("workload"), Relationships:avg("relationships"), Manager:avg("manager"), Balance:avg("balance") };
  }).filter(Boolean);

  return (
    <div className="main">
      <div className="page-header">
        <div className="breadcrumb">WellPulse › Departments</div>
        <div className="page-title">Department Analysis</div>
        <div className="page-sub">Category breakdown by department</div>
      </div>
      {barData.length === 0 ? (
        <div className="empty-state"><div className="empty-icon"></div><div className="empty-title">No data yet</div></div>
      ) : (
        <>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-title"> All Categories by Department</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDEBE9" />
                <XAxis dataKey="dept" tick={{fontSize:11}} /><YAxis domain={[0,10]} tick={{fontSize:11}} />
                <Tooltip contentStyle={{borderRadius:4}} /><Legend />
                <Bar dataKey="Stress" fill="#0078D4" radius={[3,3,0,0]} />
                <Bar dataKey="Workload" fill="#00B294" radius={[3,3,0,0]} />
                <Bar dataKey="Relationships" fill="#FF8C00" radius={[3,3,0,0]} />
                <Bar dataKey="Manager" fill="#8764B8" radius={[3,3,0,0]} />
                <Bar dataKey="Balance" fill="#E74856" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="charts-grid">
            {barData.map((d,i)=>(
              <div key={d.dept} className="card">
                <div className="card-title">{d.dept}</div>
                {["Stress","Workload","Relationships","Manager","Balance"].map(cat=>(
                  <div key={cat} style={{marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                      <span style={{color:"var(--ink-soft)"}}>{cat}</span>
                      <span style={{fontWeight:600}}>{d[cat]}/10</span>
                    </div>
                    <div className="score-bar"><div className="score-bar-fill" style={{width:`${d[cat]*10}%`,background:COLORS[i%COLORS.length]}} /></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TrendsPage({ checkins }) {
  const depts = [...new Set(checkins.map(c=>c.department))].filter(Boolean);
  const weeks = [...new Set(checkins.map(c=>c.week))].slice(-8);

  const weeklyTrend = weeks.map(week => {
    const row = { week: week.replace(/\s\d{4}/,"") };
    const all = checkins.filter(c=>c.week===week);
    if (all.length) row["Overall"] = Math.round(all.reduce((a,b)=>a+Math.round((b.stress+b.workload+b.relationships+b.manager+b.balance)/5),0)/all.length);
    depts.forEach(dept => {
      const items = checkins.filter(c=>c.department===dept&&c.week===week);
      if (items.length) row[dept] = Math.round(items.reduce((a,b)=>a+Math.round((b.stress+b.workload+b.relationships+b.manager+b.balance)/5),0)/items.length);
    });
    return row;
  });

  const categoryTrend = weeks.map(week => {
    const items = checkins.filter(c=>c.week===week);
    if (!items.length) return { week: week.replace(/\s\d{4}/,"") };
    const avg = k => Math.round(items.reduce((a,b)=>a+(b[k]||0),0)/items.length);
    return { week:week.replace(/\s\d{4}/,""), Stress:avg("stress"), Workload:avg("workload"), Relationships:avg("relationships"), Manager:avg("manager"), Balance:avg("balance") };
  });

  const monthlyData = (() => {
    const months = {};
    checkins.forEach(c => {
      const m = c.created_at ? new Date(c.created_at).toLocaleString("default",{month:"short",year:"numeric"}) : "Unknown";
      if (!months[m]) months[m] = [];
      months[m].push(Math.round((c.stress+c.workload+c.relationships+c.manager+c.balance)/5));
    });
    return Object.entries(months).map(([month,scores])=>({ month, score:Math.round(scores.reduce((a,b)=>a+b,0)/scores.length), responses:scores.length }));
  })();

  return (
    <div className="main">
      <div className="page-header">
        <div className="breadcrumb">WellPulse › Trends</div>
        <div className="page-title">Wellness Trends</div>
        <div className="page-sub">Weekly and monthly performance over time</div>
      </div>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-title">📈 Overall Weekly Trend</div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={weeklyTrend}>
            <defs><linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0078D4" stopOpacity={0.15}/><stop offset="95%" stopColor="#0078D4" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDEBE9" />
            <XAxis dataKey="week" tick={{fontSize:11}}/><YAxis domain={[1,10]} tick={{fontSize:11}}/>
            <Tooltip contentStyle={{borderRadius:4}}/><Legend/>
            <Area type="monotone" dataKey="Overall" stroke="#0078D4" fill="url(#grad1)" strokeWidth={2} dot={{r:4}} connectNulls />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-title">📅 Monthly Wellness Score</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDEBE9" />
            <XAxis dataKey="month" tick={{fontSize:11}}/><YAxis domain={[0,10]} tick={{fontSize:11}}/>
            <Tooltip contentStyle={{borderRadius:4}}/>
            <Bar dataKey="score" fill="#0078D4" radius={[4,4,0,0]} name="Avg Score"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="charts-grid">
        <div className="card">
          <div className="card-title"> Department Trends</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDEBE9"/>
              <XAxis dataKey="week" tick={{fontSize:10}}/><YAxis domain={[1,10]} tick={{fontSize:10}}/>
              <Tooltip contentStyle={{borderRadius:4}}/><Legend/>
              {depts.map((d,i)=><Line key={d} type="monotone" dataKey={d} stroke={COLORS[i%COLORS.length]} strokeWidth={2} dot={{r:3}} connectNulls/>)}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title"> Category Trends</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={categoryTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDEBE9"/>
              <XAxis dataKey="week" tick={{fontSize:10}}/><YAxis domain={[1,10]} tick={{fontSize:10}}/>
              <Tooltip contentStyle={{borderRadius:4}}/><Legend/>
              <Line type="monotone" dataKey="Stress" stroke="#0078D4" strokeWidth={2} dot={false} connectNulls/>
              <Line type="monotone" dataKey="Workload" stroke="#00B294" strokeWidth={2} dot={false} connectNulls/>
              <Line type="monotone" dataKey="Relationships" stroke="#FF8C00" strokeWidth={2} dot={false} connectNulls/>
              <Line type="monotone" dataKey="Manager" stroke="#8764B8" strokeWidth={2} dot={false} connectNulls/>
              <Line type="monotone" dataKey="Balance" stroke="#E74856" strokeWidth={2} dot={false} connectNulls/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ReportsPage({ checkins, user }) {
  const weeks = [...new Set(checkins.map(c=>c.week))];
  const cw = weeks[weeks.length-1];
  const depts = [...new Set(checkins.map(c=>c.department))].filter(Boolean);
  const thisWeek = checkins.filter(c=>c.week===cw);

  const deptSummary = depts.map(dept => {
    const items = thisWeek.filter(c=>c.department===dept);
    if (!items.length) return null;
    const avg = k => Math.round(items.reduce((a,b)=>a+(b[k]||0),0)/items.length);
    const score = Math.round((avg("stress")+avg("workload")+avg("relationships")+avg("manager")+avg("balance"))/5);
    return { dept, score, stress:avg("stress"), workload:avg("workload"), relationships:avg("relationships"), manager:avg("manager"), balance:avg("balance"), count:items.length };
  }).filter(Boolean);

  const overall = deptSummary.length ? Math.round(deptSummary.reduce((a,b)=>a+b.score,0)/deptSummary.length) : 0;

  function exportReport() {
    const rows = deptSummary.map(d=>`${d.dept} | Score: ${d.score}/10 | Risk: ${getRiskLabel(d.score)} | Responses: ${d.count}\n  Stress: ${d.stress} | Workload: ${d.workload} | Relationships: ${d.relationships} | Manager: ${d.manager} | Balance: ${d.balance}`).join("\n\n");
    const recs = deptSummary.filter(d=>getRisk(d.score)==="high").map(d=>`• ${d.dept}: HIGH RISK - Score ${d.score}/10 - Immediate intervention recommended`).join("\n") || "• No high-risk departments. Keep up the great work!";
    const content = `WELLPULSE WELLNESS REPORT\nCompany Code: ${user.company_code||"N/A"}\nGenerated: ${new Date().toLocaleDateString()}\nPeriod: ${cw}\n\n${"═".repeat(60)}\n\nOVERALL: ${overall}/10 (${getRiskLabel(overall)})\nHIGH RISK DEPTS: ${deptSummary.filter(d=>getRisk(d.score)==="high").length}\nRESPONSES: ${thisWeek.length}\nDEPARTMENTS: ${depts.length}\n\n${"═".repeat(60)}\n\nDEPARTMENT BREAKDOWN\n\n${rows}\n\n${"═".repeat(60)}\n\nRECOMMENDATIONS\n${recs}\n\nGenerated by WellPulse`;
    const blob = new Blob([content],{type:"text/plain"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `WellPulse-Report-${new Date().toISOString().split("T")[0]}.txt`; a.click();
  }

  return (
    <div className="main">
      <div className="page-header">
        <div className="breadcrumb">WellPulse › Reports</div>
        <div className="page-title">Wellness Reports</div>
        <div className="page-sub">Export and review detailed reports</div>
      </div>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-title">📄 Weekly Report — {cw||"No data"}</div>
        <p style={{fontSize:13,color:"var(--ink-soft)",marginBottom:16}}>Export a complete wellness report including all department scores, risk levels and recommendations.</p>
        <button className="btn-dark" onClick={exportReport}>↓ Export Report</button>
      </div>
      <div className="card">
        <div className="card-title">📋 Report Preview</div>
        {deptSummary.length === 0 ? <div className="empty-state"><div className="empty-icon">📄</div><div className="empty-title">No data to report yet</div></div> : (
          <table className="wp-table">
            <thead><tr><th>Department</th><th>Score</th><th>Risk</th><th>Recommendation</th></tr></thead>
            <tbody>
              {deptSummary.map(d=>(
                <tr key={d.dept}>
                  <td><strong>{d.dept}</strong></td>
                  <td>{d.score}/10</td>
                  <td><span className={`risk-badge ${getRisk(d.score)}`}><span className="risk-dot"/>{getRiskLabel(d.score)}</span></td>
                  <td style={{fontSize:12,color:"var(--ink-soft)"}}>
                    {getRisk(d.score)==="high" ? "⚠️ Immediate intervention recommended" :
                     getRisk(d.score)==="medium" ? "👀 Monitor closely this week" : "✅ Continue current initiatives"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function EmployeeApp({ user, onLogout }) {
  const [page, setPage] = useState("checkin");
  const navItems = [
    { id:"checkin", label:"Check-In" },
    { id:"toolkit", label:"Wellness Toolkit" },
    { id:"history", label:"My History" },
  ];
  return (
    <div className="wp-app">
      <nav className="nav">
        <div className="nav-logo">WellPulse</div>
        <div className="nav-divider"/>
        <div className="nav-title">Employee Portal</div>
        <div className="nav-right">
          <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
          <span className="nav-user">{user.name} · {user.department}</span>
          <button className="btn-nav" onClick={onLogout}>Sign out</button>
        </div>
      </nav>
      <div className="app-layout">
        <div className="sidebar">
          <div className="sidebar-section">Employee</div>
          {navItems.map(item=>(
            <div key={item.id} className={`sidebar-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)}>
              <span className="sidebar-icon">{item.icon}</span>{item.label}
            </div>
          ))}
        </div>
        <div className="content">
          {page==="checkin" && <CheckInPage user={user}/>}
          {page==="toolkit" && <ToolkitPage/>}
          {page==="history" && <HistoryPage user={user}/>}
        </div>
      </div>
    </div>
  );
}

function CheckInPage({ user }) {
  const currentWeek = getWeekLabel();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ stress:5, workload:5, relationships:5, manager:5, balance:5 });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("checkins").select("id").eq("user_id",user.id).eq("week",currentWeek).maybeSingle()
      .then(({data})=>{ if(data) setSubmitted(true); setLoading(false); });
  }, []);

  async function handleSubmit() {
    setSaving(true);
    await supabase.from("checkins").insert({ user_id:user.id, week:currentWeek, department:user.department, company_code:user.company_code||"", ...answers });
    setSubmitted(true); setSaving(false);
  }

  if (loading) return <div className="loading"><div className="loading-spinner"/></div>;
  const q = QUESTIONS[step];

  return (
    <div className="checkin-wrap">
      <div className="checkin-card">
        {submitted ? (
          <div className="checkin-done">
            <div className="checkin-done-icon">✅</div>
            <h2>Check-in complete!</h2>
            <p>Your responses for {currentWeek} have been recorded.<br/>Thank you for taking a moment to reflect.</p>
            <div style={{marginTop:20,padding:"14px",background:"var(--accent-light)",borderRadius:"var(--radius-lg)",fontSize:13,color:"var(--accent)"}}>
               Visit the <strong>Wellness Toolkit</strong> for burnout prevention resources
            </div>
          </div>
        ) : (
          <>
            <div className="checkin-week">{currentWeek}</div>
            <div className="checkin-title">Weekly Wellness Check-In</div>
            <div className="checkin-sub">5 quick questions · Takes about 2 minutes</div>
            <div className="progress-steps">
              {QUESTIONS.map((_,i)=><div key={i} className={`progress-step ${i<step?"done":i===step?"active":""}`}/>)}
            </div>
            <div className="question-num">Question {step+1} of {QUESTIONS.length}</div>
            <div className="question-icon">{q.icon}</div>
            <div className="question-label">{q.label}</div>
            <div className="question-hint">{q.hint}</div>
            <div className="slider-row">
              <span style={{fontSize:12,color:"var(--ink-faint)"}}>1</span>
              <input type="range" min={1} max={10} value={answers[q.id]} onChange={e=>setAnswers({...answers,[q.id]:parseInt(e.target.value)})}/>
              <span style={{fontSize:12,color:"var(--ink-faint)"}}>10</span>
              <span className="slider-score" style={{color:getRiskColor(answers[q.id])}}>{answers[q.id]}</span>
            </div>
            <div className="slider-labels"><span>Low</span><span>High</span></div>
            <div className="checkin-nav">
              {step>0 ? <button className="btn-secondary" onClick={()=>setStep(step-1)}>← Back</button> : <div/>}
              {step<QUESTIONS.length-1
                ? <button className="btn-primary" style={{width:"auto",padding:"8px 24px"}} onClick={()=>setStep(step+1)}>Next →</button>
                : <button className="btn-primary" style={{width:"auto",padding:"8px 24px"}} onClick={handleSubmit} disabled={saving}>{saving?"Saving...":"Submit ✓"}</button>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ToolkitPage() {
  const [active, setActive] = useState(null);
  const [breathStep, setBreathStep] = useState("inhale");
  const [breathCount, setBreathCount] = useState(0);
  const timerRef = React.useRef(null);

  function startBreathing(item) {
    setActive(item); setBreathStep("inhale"); setBreathCount(0);
    const phases = [
      {phase:"inhale",label:"Breathe In",ms:4000},
      {phase:"hold",label:"Hold",ms:7000},
      {phase:"exhale",label:"Breathe Out",ms:8000},
    ];
    let i = 0;
    function next() {
      setBreathStep(phases[i].phase);
      if(i===0) setBreathCount(c=>c+1);
      timerRef.current = setTimeout(()=>{ i=(i+1)%phases.length; next(); }, phases[i].ms);
    }
    next();
  }

  function closeModal() { setActive(null); if(timerRef.current) clearTimeout(timerRef.current); }

  return (
    <div className="main">
      <div className="page-header">
        <div className="breadcrumb">WellPulse › Wellness Toolkit</div>
        <div className="page-title">Burnout Prevention Toolkit</div>
        <div className="page-sub">Quick tools and exercises to support your wellbeing</div>
      </div>
      <div className="toolkit-grid">
        {TOOLKIT_ITEMS.map(item=>(
          <div key={item.id} className="toolkit-card" onClick={()=>item.type==="breathing"?startBreathing(item):setActive(item)}>
            <div className="toolkit-icon">{item.icon}</div>
            <div className="toolkit-title">{item.title}</div>
            <div className="toolkit-desc">{item.desc}</div>
            <span className="toolkit-duration">⏱ {item.duration}</span>
          </div>
        ))}
      </div>
      {active && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={e=>e.stopPropagation()}>
            {active.type==="breathing" ? (
              <>
                <h2 style={{fontSize:20,fontWeight:600,marginBottom:4}}>4-7-8 Breathing</h2>
                <p style={{color:"var(--ink-soft)",fontSize:13}}>Cycle {breathCount}</p>
                <div className={`breathing-circle ${breathStep}`}>
                  {breathStep==="inhale"?"Breathe In":breathStep==="hold"?"Hold":"Breathe Out"}
                </div>
                <button className="btn-primary" onClick={closeModal}>Close</button>
              </>
            ) : (
              <>
                <div style={{fontSize:48,marginBottom:16}}>{active.icon}</div>
                <h2 style={{fontSize:20,fontWeight:600,marginBottom:8}}>{active.title}</h2>
                <p style={{color:"var(--ink-soft)",marginBottom:16,fontSize:14}}>{active.desc}</p>
                <span className="toolkit-duration">⏱ {active.duration}</span>
                <button className="btn-primary" style={{marginTop:20}} onClick={closeModal}>Done ✓</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryPage({ user }) {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("checkins").select("*").eq("user_id",user.id).order("created_at",{ascending:false})
      .then(({data})=>{ setCheckins(data||[]); setLoading(false); });
  }, []);

  if (loading) return <div className="loading"><div className="loading-spinner"/></div>;

  const chartData = [...checkins].reverse().map(c=>({
    week: c.week?.replace(/\s\d{4}/,"")||"",
    score: Math.round((c.stress+c.workload+c.relationships+c.manager+c.balance)/5)
  }));

  return (
    <div className="main">
      <div className="page-header">
        <div className="breadcrumb">WellPulse › My History</div>
        <div className="page-title">My Wellness History</div>
        <div className="page-sub">Your personal check-in history over time</div>
      </div>
      {checkins.length===0 ? (
        <div className="empty-state"><div className="empty-icon"></div><div className="empty-title">No check-ins yet</div><p>Complete your first weekly check-in to see your history.</p></div>
      ) : (
        <>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-title">📈 My Wellness Score Over Time</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs><linearGradient id="myGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0078D4" stopOpacity={0.15}/><stop offset="95%" stopColor="#0078D4" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDEBE9"/>
                <XAxis dataKey="week" tick={{fontSize:11}}/><YAxis domain={[1,10]} tick={{fontSize:11}}/>
                <Tooltip contentStyle={{borderRadius:4}}/>
                <Area type="monotone" dataKey="score" stroke="#0078D4" fill="url(#myGrad)" strokeWidth={2} dot={{r:4}} name="Score"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="card-title"> Check-In History</div>
            <table className="wp-table">
              <thead><tr><th>Week</th><th>Overall</th><th>Risk</th><th>Stress</th><th>Workload</th><th>Relationships</th><th>Manager</th><th>Balance</th></tr></thead>
              <tbody>
                {checkins.map(c=>{
                  const score = Math.round((c.stress+c.workload+c.relationships+c.manager+c.balance)/5);
                  return (
                    <tr key={c.id}>
                      <td>{c.week}</td>
                      <td><strong style={{color:getRiskColor(score)}}>{score}/10</strong></td>
                      <td><span className={`risk-badge ${getRisk(score)}`}><span className="risk-dot"/>{getRiskLabel(score)}</span></td>
                      <td>{c.stress}</td><td>{c.workload}</td><td>{c.relationships}</td><td>{c.manager}</td><td>{c.balance}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
