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
  { id: "ba
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
