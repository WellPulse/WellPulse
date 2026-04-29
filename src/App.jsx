import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const SUPABASE_URL = "https://fkvnjfvrbmomerrkqxge.supabase.co";
const SUPABASE_KEY = "sb_publishable_oM_JRsfb8PGe37SN--Yzmg_w0Qr8aIo";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const QUESTIONS = [
  { id: "stress", label: "How would you rate your stress level this week?", hint: "1 = Very stressed, 10 = Completely at ease" },
  { id: "workload", label: "How manageable is your workload feeling?", hint: "1 = Completely overwhelmed, 10 = Very manageable" },
  { id: "relationships", label: "How are your relationships with teammates?", hint: "1 = Very difficult, 10 = Excellent" },
  { id: "manager", label: "How supported do you feel by your manager?", hint: "1 = Not supported, 10 = Fully supported" },
  { id: "balance", label: "How is your work-life balance this week?", hint: "1 = No balance at all, 10 = Perfect balance" },
];

const DEPTS = ["Engineering","Marketing","Sales","HR","Finance","Operations","Product","Design","Customer Success","Legal"];
const COLORS = ["#2D6A4F","#E07B39","#4A90D9","#9B59B6","#E74C3C","#27AE60","#F39C12","#1ABC9C"];

function getWeekLabel() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
  return `Week ${week} ${now.getFullYear()}`;
}

function getRisk(score) { return score >= 7 ? "low" : score >= 5 ? "medium" : "high"; }
function getRiskLabel(score) { return score >= 7 ? "Low Risk" : score >= 5 ? "Medium Risk" : "High Risk"; }

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F7F5F0; --surface: #FFFFFF; --ink: #1A1A1A; --ink-soft: #6B6B6B;
    --ink-faint: #C4BFB6; --accent: #2D6A4F; --accent-light: #E8F4EE;
    --warn: #E07B39; --warn-light: #FDF0E8; --danger: #C1392B;
    --danger-light: #FDECEA; --border: #E8E4DD;
    --shadow: 0 2px 16px rgba(0,0,0,0.07); --radius: 14px;
  }
  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--ink); }
  h1,h2,h3,h4 { font-family: 'DM Serif Display', serif; }
  .wp-app { min-height: 100vh; }
  .auth-wrap { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
  .auth-card { background:var(--surface); border-radius:20px; padding:48px 40px; width:100%; max-width:420px; box-shadow:var(--shadow); }
  .auth-logo { font-family:'DM Serif Display',serif; font-size:28px; color:var(--accent); margin-bottom:8px; }
  .auth-sub { color:var(--ink-soft); font-size:14px; margin-bottom:36px; }
  .auth-tabs { display:flex; gap:4px; background:var(--bg); border-radius:10px; padding:4px; margin-bottom:28px; }
  .auth-tab { flex:1; padding:8px; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; background:transparent; color:var(--ink-soft); transition:all .2s; }
  .auth-tab.active { background:var(--surface); color:var(--ink); box-shadow:0 1px 6px rgba(0,0,0,0.1); }
  .field { margin-bottom:16px; }
  .field label { display:block; font-size:12px; font-weight:600; color:var(--ink-soft); margin-bottom:6px; letter-spacing:.05em; text-transform:uppercase; }
  .field input, .field select { width:100%; padding:12px 14px; border:1.5px solid var(--border); border-radius:10px; font-family:'DM Sans',sans-serif; font-size:15px; background:var(--bg); color:var(--ink); outline:none; transition:border .2s; }
  .field input:focus, .field select:focus { border-color:var(--accent); background:#fff; }
  .btn-primary { width:100%; padding:14px; background:var(--accent); color:#fff; border:none; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; cursor:pointer; transition:opacity .2s; margin-top:8px; }
  .btn-primary:hover { opacity:.88; } .btn-primary:disabled { opacity:.5; cursor:not-allowed; }
  .btn-secondary { padding:10px 20px; background:var(--accent-light); color:var(--accent); border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; }
  .auth-error { background:var(--danger-light); color:var(--danger); padding:10px 14px; border-radius:8px; font-size:13px; margin-bottom:16px; }
  .auth-success { background:var(--accent-light); color:var(--accent); padding:10px 14px; border-radius:8px; font-size:13px; margin-bottom:16px; }
  .nav { background:var(--surface); border-bottom:1px solid var(--border); padding:0 32px; display:flex; align-items:center; justify-content:space-between; height:64px; position:sticky; top:0; z-index:100; }
  .nav-logo { font-family:'DM Serif Display',serif; font-size:22px; color:var(--accent); }
  .nav-right { display:flex; align-items:center; gap:16px; }
  .nav-user { font-size:13px; color:var(--ink-soft); }
  .nav-role { font-size:11px; font-weight:600; padding:3px 8px; border-radius:20px; background:var(--accent-light); color:var(--accent); text-transform:uppercase; letter-spacing:.05em; }
  .btn-logout { padding:8px 16px; background:transparent; border:1.5px solid var(--border); border-radius:8px; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; color:var(--ink-soft); }
  .main { max-width:1100px; margin:0 auto; padding:40px 24px; }
  .page-title { font-size:32px; margin-bottom:6px; }
  .page-sub { color:var(--ink-soft); font-size:15px; margin-bottom:36px; }
  .checkin-card { background:var(--surface); border-radius:var(--radius); padding:36px; box-shadow:var(--shadow); max-width:640px; }
  .checkin-done { text-align:center; padding:48px 0; }
  .checkin-done h2 { font-size:28px; color:var(--accent); margin-bottom:8px; }
  .checkin-done p { color:var(--ink-soft); }
  .question-block { margin-bottom:32px; }
  .question-label { font-size:16px; font-weight:500; margin-bottom:6px; }
  .question-hint { font-size:13px; color:var(--ink-soft); margin-bottom:14px; }
  .slider-wrap { display:flex; align-items:center; gap:14px; }
  .slider-wrap input[type=range] { flex:1; accent-color:var(--accent); cursor:pointer; }
  .slider-val { font-size:22px; font-family:'DM Serif Display',serif; color:var(--accent); min-width:28px; text-align:center; }
  .slider-labels { display:flex; justify-content:space-between; font-size:11px; color:var(--ink-faint); margin-top:4px; }
  .progress-bar-wrap { height:5px; background:var(--border); border-radius:3px; margin-bottom:28px; }
  .progress-bar { height:100%; background:var(--accent); border-radius:3px; transition:width .3s; }
  .stats-row { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px; margin-bottom:32px; }
  .stat-card { background:var(--surface); border-radius:var(--radius); padding:24px; box-shadow:var(--shadow); }
  .stat-label { font-size:12px; font-weight:600; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.05em; margin-bottom:8px; }
  .stat-value { font-family:'DM Serif Display',serif; font-size:36px; }
  .stat-sub { font-size:12px; color:var(--ink-soft); margin-top:4px; }
  .risk-low { color:var(--accent); } .risk-medium { color:var(--warn); } .risk-high { color:var(--danger); }
  .section-title { font-size:22px; margin-bottom:20px; }
  .chart-card { background:var(--surface); border-radius:var(--radius); padding:28px; box-shadow:var(--shadow); margin-bottom:24px; }
  .chart-title { font-size:14px; color:var(--ink-soft); margin-bottom:20px; }
  .dept-table { width:100%; border-collapse:collapse; }
  .dept-table th { text-align:left; font-size:11px; font-weight:600; color:var(--ink-soft); text-transform:uppercase; letter-spacing:.05em; padding:10px 16px; border-bottom:2px solid var(--border); }
  .dept-table td { padding:14px 16px; border-bottom:1px solid var(--border); font-size:14px; }
  .dept-table tr:last-child td { border-bottom:none; }
  .risk-badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
  .risk-badge.low { background:var(--accent-light); color:var(--accent); }
  .risk-badge.medium { background:var(--warn-light); color:var(--warn); }
  .risk-badge.high { background:var(--danger-light); color:var(--danger); }
  .pdf-btn { display:flex; align-items:center; gap:8px; padding:12px 20px; background:var(--ink); color:#fff; border:none; border-radius:10px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; margin-bottom:24px; }
  .pdf-btn:hover { opacity:.85; }
  .loading { display:flex; align-items:center; justify-content:center; min-height:100vh; font-family:'DM Serif Display',serif; font-size:24px; color:var(--accent); }
  @media(max-width:600px) { .nav{padding:0 16px;} .main{padding:24px 16px;} .checkin-card{padding:24px 18px;} .auth-card{padding:32px 24px;} }
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

  if (loading) return <div className="loading">Loading WellPulse…</div>;
  if (!session) return <AuthScreen />;
  if (!profile) return <div className="loading">Setting up profile…</div>;
  if (profile.role === "leadership") return <Dashboard user={profile} onLogout={() => supabase.auth.signOut()} />;
  return <CheckIn user={profile} onLogout={() => supabase.auth.signOut()} />;
}

function AuthScreen() {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "Engineering", role: "employee" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(e) {
    e.preventDefault(); setError(""); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (error) setError(error.message);
    setBusy(false);
  }

  async function handleSignup(e) {
    e.preventDefault(); setError(""); setBusy(true);
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); setBusy(false); return; }
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (error) { setError(error.message); setBusy(false); return; }
    if (data.user) {
      await supabase.from("profiles").insert({ id: data.user.id, name: form.name, department: form.department, role: form.role });
      setMessage("Account created! Please sign in."); setTab("login");
    }
    setBusy(false);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">WellPulse</div>
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
            <button className="btn-primary" type="submit" disabled={busy}>{busy?"Signing in…":"Sign In"}</button>
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
            <div className="field"><label>Role</label>
              <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                <option value="employee">Employee</option>
                <option value="leadership">Leadership / Admin</option>
              </select>
            </div>
            <button className="btn-primary" type="submit" disabled={busy}>{busy?"Creating…":"Create Account"}</button>
          </form>
        )}
      </div>
    </div>
  );
}

function CheckIn({ user, onLogout }) {
  const currentWeek = getWeekLabel();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ stress:5, workload:5, relationships:5, manager:5, balance:5 });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("checkins").select("id").eq("user_id", user.id).eq("week", currentWeek).maybeSingle()
      .then(({ data }) => { if (data) setSubmitted(true); setLoading(false); });
  }, []);

  async function handleSubmit() {
    setSaving(true);
    await supabase.from("checkins").insert({ user_id: user.id, week: currentWeek, department: user.department, ...answers });
    setSubmitted(true); setSaving(false);
  }

  if (loading) return <div className="loading">Loading…</div>;
  const q = QUESTIONS[step];

  return (
    <div className="wp-app">
      <nav className="nav">
        <div className="nav-logo">WellPulse</div>
        <div className="nav-right">
          <span className="nav-user">{user.name}</span>
          <span className="nav-role">{user.department}</span>
          <button className="btn-logout" onClick={onLogout}>Sign out</button>
        </div>
      </nav>
      <div className="main">
        <div className="page-title">Weekly Check-In</div>
        <div className="page-sub">{currentWeek} · Takes about 2 minutes</div>
        <div className="checkin-card">
          {submitted ? (
            <div className="checkin-done">
              <div style={{fontSize:52,marginBottom:16}}>✓</div>
              <h2>All done!</h2>
              <p>Your check-in for {currentWeek} has been recorded.<br />See you next week!</p>
            </div>
          ) : (
            <>
              <div className="progress-bar-wrap"><div className="progress-bar" style={{width:`${(step/QUESTIONS.length)*100}%`}} /></div>
              <div style={{fontSize:12,color:"var(--ink-soft)",marginBottom:24}}>Question {step+1} of {QUESTIONS.length}</div>
              <div className="question-block">
                <div className="question-label">{q.label}</div>
                <div className="question-hint">{q.hint}</div>
                <div className="slider-wrap">
                  <span style={{fontSize:13,color:"var(--ink-soft)"}}>1</span>
                  <input type="range" min={1} max={10} value={answers[q.id]} onChange={e=>setAnswers({...answers,[q.id]:parseInt(e.target.value)})} />
                  <span style={{fontSize:13,color:"var(--ink-soft)"}}>10</span>
                  <span className="slider-val">{answers[q.id]}</span>
                </div>
                <div className="slider-labels"><span>Low</span><span>High</span></div>
              </div>
              <div style={{display:"flex",gap:12,justifyContent:"flex-end"}}>
                {step > 0 && <button className="btn-secondary" onClick={()=>setStep(step-1)}>Back</button>}
                {step < QUESTIONS.length-1
                  ? <button className="btn-primary" style={{width:"auto",padding:"12px 32px"}} onClick={()=>setStep(step+1)}>Next</button>
                  : <button className="btn-primary" style={{width:"auto",padding:"12px 32px"}} onClick={handleSubmit} disabled={saving}>{saving?"Saving…":"Submit"}</button>
                }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("checkins").select("*").order("created_at",{ascending:true})
      .then(({data})=>{ setCheckins(data||[]); setLoading(false); });
  }, []);

  if (loading) return <div className="loading">Loading dashboard…</div>;

  const depts = [...new Set(checkins.map(c=>c.department))];
  const weeks = [...new Set(checkins.map(c=>c.week))].slice(-6);
  const currentWeek = weeks[weeks.length-1];

  const deptSummary = depts.map(dept => {
    const latest = checkins.filter(c=>c.department===dept && c.week===currentWeek);
    if (!latest.length) return null;
    const avg = key => Math.round(latest.reduce((a,b)=>a+b[key],0)/latest.length);
    const score = Math.round((avg("stress")+avg("workload")+avg("relationships")+avg("manager")+avg("balance"))/5);
    return { dept, score, stress:avg("stress"), workload:avg("workload"), relationships:avg("relationships"), manager:avg("manager"), balance:avg("balance"), responses:latest.length };
  }).filter(Boolean).sort((a,b)=>a.score-b.score);

  const trendData = weeks.map(week => {
    const row = { week: week.replace(/\s\d{4}/,"") };
    depts.forEach(dept => {
      const items = checkins.filter(c=>c.department===dept && c.week===week);
      if (items.length) row[dept] = Math.round(items.reduce((a,b)=>a+Math.round((b.stress+b.workload+b.relationships+b.manager+b.balance)/5),0)/items.length);
    });
    return row;
  });

  const barData = deptSummary.map(d=>({ dept:d.dept, Stress:d.stress, Workload:d.workload, Relationships:d.relationships, Manager:d.manager, Balance:d.balance }));
  const overallScore = deptSummary.length ? Math.round(deptSummary.reduce((a,b)=>a+b.score,0)/deptSummary.length) : 0;
  const highRisk = deptSummary.filter(d=>getRisk(d.score)==="high").length;
  const totalResponses = checkins.filter(c=>c.week===currentWeek).length;

  function exportReport() {
    const rows = deptSummary.map(d=>`${d.dept} | Score: ${d.score}/10 | Risk: ${getRiskLabel(d.score)} | Responses: ${d.responses}\n  Stress: ${d.stress} | Workload: ${d.workload} | Relationships: ${d.relationships} | Manager: ${d.manager} | Balance: ${d.balance}`).join("\n\n");
    const content = `WELLPULSE WELLNESS REPORT\nGenerated: ${new Date().toLocaleDateString()}\nPeriod: ${currentWeek}\n\n${"─".repeat(50)}\n\nOVERALL SCORE: ${overallScore}/10 (${getRiskLabel(overallScore)})\nHIGH RISK DEPARTMENTS: ${highRisk}\nTOTAL RESPONSES: ${totalResponses}\nDEPARTMENTS: ${depts.length}\n\n${"─".repeat(50)}\n\n${rows}`;
    const blob = new Blob([content],{type:"text/plain"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `WellPulse-Report-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
  }

  return (
    <div className="wp-app">
      <nav className="nav">
        <div className="nav-logo">WellPulse</div>
        <div className="nav-right">
          <span className="nav-user">{user.name}</span>
          <span className="nav-role" style={{background:"#1A1A1A",color:"#fff"}}>Leadership</span>
          <button className="btn-logout" onClick={onLogout}>Sign out</button>
        </div>
      </nav>
      <div className="main">
        <div className="page-title">Wellness Dashboard</div>
        <div className="page-sub">{currentWeek||"No data yet"} · {depts.length} departments · {totalResponses} responses</div>
        {checkins.length===0 ? (
          <div style={{textAlign:"center",padding:"80px 20px",color:"var(--ink-soft)"}}>
            <div style={{fontSize:48,marginBottom:16}}>📊</div>
            <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:24,marginBottom:8,color:"var(--ink)"}}>No data yet</h3>
            <p>Once employees complete their weekly check-ins, data will appear here.</p>
          </div>
        ) : (
          <>
            <div className="stats-row">
              <div className="stat-card"><div className="stat-label">Overall Score</div><div className={`stat-value risk-${getRisk(overallScore)}`}>{overallScore}<span style={{fontSize:18}}>/10</span></div><div className="stat-sub">{getRiskLabel(overallScore)}</div></div>
              <div className="stat-card"><div className="stat-label">High Risk Depts</div><div className={`stat-value ${highRisk>0?"risk-high":"risk-low"}`}>{highRisk}</div><div className="stat-sub">Need attention</div></div>
              <div className="stat-card"><div className="stat-label">Responses</div><div className="stat-value">{totalResponses}</div><div className="stat-sub">This week</div></div>
              <div className="stat-card"><div className="stat-label">Departments</div><div className="stat-value">{depts.length}</div><div className="stat-sub">Being tracked</div></div>
            </div>
            <button className="pdf-btn" onClick={exportReport}>↓ Export Report</button>
            <h2 className="section-title">Department Risk Overview</h2>
            <div className="chart-card" style={{overflowX:"auto"}}>
              <table className="dept-table">
                <thead><tr><th>Department</th><th>Score</th><th>Risk</th><th>Stress</th><th>Workload</th><th>Relationships</th><th>Manager</th><th>Balance</th><th>Responses</th></tr></thead>
                <tbody>
                  {deptSummary.map(d=>(
                    <tr key={d.dept}>
                      <td><strong>{d.dept}</strong></td>
                      <td><strong>{d.score}/10</strong></td>
                      <td><span className={`risk-badge ${getRisk(d.score)}`}>{getRiskLabel(d.score)}</span></td>
                      <td>{d.stress}</td><td>{d.workload}</td><td>{d.relationships}</td><td>{d.manager}</td><td>{d.balance}</td><td>{d.responses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {weeks.length > 1 && (
              <>
                <h2 className="section-title">Wellness Trends</h2>
                <div className="chart-card">
                  <div className="chart-title">Overall wellness score by department over time</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DD" />
                      <XAxis dataKey="week" tick={{fontSize:11}} /><YAxis domain={[1,10]} tick={{fontSize:11}} />
                      <Tooltip /><Legend />
                      {depts.map((d,i)=><Line key={d} type="monotone" dataKey={d} stroke={COLORS[i%COLORS.length]} strokeWidth={2} dot={{r:3}} connectNulls />)}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
            <h2 className="section-title">Category Breakdown</h2>
            <div className="chart-card">
              <div className="chart-title">Scores across all 5 wellness categories by department</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DD" />
                  <XAxis dataKey="dept" tick={{fontSize:11}} /><YAxis domain={[0,10]} tick={{fontSize:11}} />
                  <Tooltip /><Legend />
                  <Bar dataKey="Stress" fill="#2D6A4F" radius={[4,4,0,0]} />
                  <Bar dataKey="Workload" fill="#E07B39" radius={[4,4,0,0]} />
                  <Bar dataKey="Relationships" fill="#4A90D9" radius={[4,4,0,0]} />
                  <Bar dataKey="Manager" fill="#9B59B6" radius={[4,4,0,0]} />
                  <Bar dataKey="Balance" fill="#27AE60" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
