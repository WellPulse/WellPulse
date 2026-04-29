import React, { useState, useEffect, useRef } from "react";
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
  { id: "stress", label: "How would you rate your stress level this week?", hint: "1 = Very stressed · 10 = Completely at ease" },
  { id: "workload", label: "How manageable is your workload feeling?", hint: "1 = Overwhelmed · 10 = Very manageable" },
  { id: "relationships", label: "How are your relationships with your teammates?", hint: "1 = Strained · 10 = Excellent" },
  { id: "manager", label: "How supported do you feel by your manager?", hint: "1 = Unsupported · 10 = Fully supported" },
  { id: "balance", label: "How is your work-life balance this week?", hint: "1 = No balance · 10 = Well balanced" },
];

const DEPTS = ["Engineering","Marketing","Sales","HR","Finance","Operations","Product","Design","Customer Success","Legal"];

const COLORS = ["#5C7A5C","#8B6F47","#7A8C6E","#C4956A","#4A6741","#9B7E5A","#6B8F71","#B8845A"];

const STRESS_TOOLS = [
  {
    id: 1,
    title: "Box Breathing",
    category: "Breathwork",
    duration: "4 minutes",
    desc: "A regulation technique used by Navy SEALs to calm the nervous system. Inhale, hold, exhale, hold — each for 4 counts.",
    steps: ["Sit upright with feet flat on the floor.", "Inhale slowly through your nose for 4 counts.", "Hold your breath for 4 counts.", "Exhale through your mouth for 4 counts.", "Hold empty for 4 counts.", "Repeat 4–6 cycles."],
    benefit: "Activates the parasympathetic nervous system within 90 seconds."
  },
  {
    id: 2,
    title: "Physiological Sigh",
    category: "Breathwork",
    duration: "1 minute",
    desc: "A double inhale through the nose followed by a long exhale. The fastest known way to reduce acute stress.",
    steps: ["Take a full inhale through your nose.", "At the top, take a second short sniff to fully expand the lungs.", "Exhale slowly and completely through your mouth.", "Repeat 3–5 times."],
    benefit: "Deflates stress-collapsed air sacs in the lungs and resets the autonomic nervous system."
  },
  {
    id: 3,
    title: "5-4-3-2-1 Grounding",
    category: "Mindfulness",
    duration: "3 minutes",
    desc: "A sensory awareness technique that interrupts anxious thought loops by anchoring attention to the present moment.",
    steps: ["Name 5 things you can see.", "Name 4 things you can physically feel.", "Name 3 things you can hear.", "Name 2 things you can smell.", "Name 1 thing you can taste."],
    benefit: "Interrupts the default mode network — the brain region responsible for rumination and worry."
  },
  {
    id: 4,
    title: "Progressive Muscle Release",
    category: "Body",
    duration: "5 minutes",
    desc: "Systematically tense and release muscle groups to discharge stored physical tension from stress.",
    steps: ["Start with your feet — tense tightly for 5 seconds.", "Release and notice the relaxation for 10 seconds.", "Move up: calves, thighs, abdomen, hands, arms, shoulders, face.", "End with a full-body release and 3 slow breaths."],
    benefit: "Reduces cortisol stored in muscle tissue and lowers resting heart rate."
  },
  {
    id: 5,
    title: "Cold Water Reset",
    category: "Body",
    duration: "2 minutes",
    desc: "Splashing cold water on your face triggers the dive reflex, instantly calming your heart rate.",
    steps: ["Go to a sink and run cold water.", "Splash your face 5–10 times.", "Hold a wet cloth over your eyes and forehead for 30 seconds.", "Breathe slowly throughout."],
    benefit: "Activates the mammalian dive reflex, reducing heart rate by up to 25%."
  },
  {
    id: 6,
    title: "Cognitive Defusion",
    category: "Mental Reframe",
    duration: "3 minutes",
    desc: "A technique from Acceptance & Commitment Therapy. Create distance between yourself and your thoughts.",
    steps: ["Notice a stressful thought you're having.", "Instead of 'I am overwhelmed', say 'I am having the thought that I am overwhelmed.'", "Then say 'I notice I am having the thought that I am overwhelmed.'", "Observe the thought without engaging with it.", "Let it pass like a cloud."],
    benefit: "Reduces emotional reactivity by engaging the prefrontal cortex over the amygdala."
  },
];

const NEURO_TOOLS = [
  {
    id: 1,
    title: "Meeting Opener: Name & Aim",
    category: "Meeting Practice",
    duration: "2 minutes",
    desc: "Begin each meeting by having each person state their name and one specific intention for the session. Primes the prefrontal cortex for focused engagement.",
    steps: ["Open the meeting 2 minutes early.", "Each person states: 'I'm [name] and I'm here to [specific intention].'", "Keep it to one sentence each.", "The facilitator closes with the shared goal of the meeting."],
    benefit: "Activates dopamine-driven goal circuitry, increasing focus and buy-in."
  },
  {
    id: 2,
    title: "The 60-Second Reset",
    category: "Meeting Practice",
    duration: "1 minute",
    desc: "A structured pause at the start of any meeting to transition from previous context. Reduces cognitive load and increases presence.",
    steps: ["Ask everyone to close laptops and put phones face down.", "Lead one minute of silence or soft background sound.", "Ask: 'What do you need to set aside to be fully here?'", "Allow 15 seconds of silent acknowledgment.", "Begin."],
    benefit: "Reduces cortisol carryover from prior tasks by up to 40%."
  },
  {
    id: 3,
    title: "Affirmation Round",
    category: "Team Bonding",
    duration: "5 minutes",
    desc: "Each team member briefly acknowledges one thing a colleague did well this week. Activates the brain's reward and social bonding circuitry.",
    steps: ["Reserve 5 minutes at the end of a weekly meeting.", "Go around — each person names one colleague and one specific action they appreciated.", "No long speeches — one or two sentences only.", "The named person simply says 'thank you.'"],
    benefit: "Releases oxytocin and serotonin, increasing psychological safety and team cohesion."
  },
  {
    id: 4,
    title: "Energy Check-In",
    category: "Meeting Practice",
    duration: "2 minutes",
    desc: "A rapid, low-stakes check-in where team members rate their current energy on a 1–10 scale. Surfaces hidden burnout signals early.",
    steps: ["At the start of the meeting, ask everyone to rate their energy: 1 (depleted) to 10 (energized).", "Go around briefly — number only, no explanation required.", "If average is below 5, consider adjusting the meeting format.", "Log the average over time to track team trends."],
    benefit: "Creates psychological safety and gives managers real-time burnout signal data."
  },
  {
    id: 5,
    title: "Two Truths & A Growth",
    category: "Team Bonding",
    duration: "5 minutes",
    desc: "A variation of Two Truths & A Lie focused on growth rather than deception. Builds authentic connection and learning culture.",
    steps: ["Each person shares two things that went well this week.", "And one thing they're actively learning or improving.", "No critique or commentary from others.", "Rotate who goes first each week."],
    benefit: "Stimulates neuroplasticity-supporting reflection and normalizes growth mindset."
  },
  {
    id: 6,
    title: "Mindful Transition Ritual",
    category: "Meeting Practice",
    duration: "3 minutes",
    desc: "A short closing practice to help teams decompress before their next commitment.",
    steps: ["In the final 3 minutes, stop the agenda.", "Ask: 'What is one word that describes how you're leaving this meeting?'", "Each person shares their word.", "Close with: 'Thank you — take a full breath before your next task.'"],
    benefit: "Reduces meeting-to-meeting stress accumulation and increases psychological closure."
  },
];

function getWeekLabel() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
  return `Week ${week} · ${now.getFullYear()}`;
}

function getRisk(score) { return score >= 7 ? "low" : score >= 5 ? "medium" : "high"; }
function getRiskLabel(score) { return score >= 7 ? "Low Risk" : score >= 5 ? "Medium Risk" : "High Risk"; }
function getRiskColor(score) { return score >= 7 ? "#5C7A5C" : score >= 5 ? "#C4956A" : "#A0522D"; }

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F5F0EA;
    --bg2: #EDE8E0;
    --surface: #FDFCF9;
    --surface2: #F7F3ED;
    --ink: #2C2416;
    --ink-soft: #6B5D4F;
    --ink-faint: #B0A090;
    --accent: #5C7A5C;
    --accent-light: #EEF3EE;
    --accent2: #8B6F47;
    --accent2-light: #F5EEE4;
    --warn: #C4956A;
    --warn-light: #FBF3EA;
    --danger: #A0522D;
    --danger-light: #F9EDE6;
    --border: #E2D9CE;
    --border-strong: #C8BAA8;
    --shadow-sm: 0 1px 3px rgba(44,36,22,0.07);
    --shadow: 0 2px 8px rgba(44,36,22,0.09);
    --shadow-lg: 0 8px 32px rgba(44,36,22,0.12);
    --radius: 6px;
    --radius-lg: 10px;
    --radius-xl: 16px;
  }
  body { background: var(--bg); font-family: 'DM Sans', system-ui, sans-serif; color: var(--ink); font-size: 14px; line-height: 1.5; }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 3px; }

  .wp-app { min-height: 100vh; display: flex; flex-direction: column; }

  /* AUTH */
  .auth-wrap { min-height: 100vh; display: flex; }
  .auth-left { flex: 1; background: var(--ink); display: flex; align-items: center; justify-content: center; padding: 64px; position: relative; overflow: hidden; }
  .auth-left::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 50%, rgba(92,122,92,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(139,111,71,0.2) 0%, transparent 50%); }
  .auth-brand { color: #fff; position: relative; z-index: 1; }
  .auth-brand-logo { font-family: 'DM Serif Display', serif; font-size: 52px; color: #fff; margin-bottom: 12px; letter-spacing: -1px; }
  .auth-brand-tagline { font-size: 17px; color: rgba(255,255,255,0.65); max-width: 320px; line-height: 1.7; font-weight: 300; margin-bottom: 56px; }
  .auth-features { display: flex; flex-direction: column; gap: 20px; }
  .auth-feature { display: flex; align-items: flex-start; gap: 14px; }
  .auth-feature-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .auth-feature-text strong { display: block; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500; margin-bottom: 2px; }
  .auth-feature-text span { color: rgba(255,255,255,0.45); font-size: 13px; }
  .auth-right { width: 500px; background: var(--surface); display: flex; align-items: center; justify-content: center; padding: 64px 56px; }
  .auth-card { width: 100%; }
  .auth-title { font-family: 'DM Serif Display', serif; font-size: 28px; color: var(--ink); margin-bottom: 4px; }
  .auth-sub { color: var(--ink-faint); font-size: 14px; margin-bottom: 36px; }
  .auth-tabs { display: flex; background: var(--bg2); border-radius: var(--radius-lg); padding: 4px; gap: 4px; margin-bottom: 28px; }
  .auth-tab { flex: 1; padding: 8px; border: none; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; background: transparent; color: var(--ink-soft); transition: all .2s; }
  .auth-tab.active { background: var(--surface); color: var(--ink); box-shadow: var(--shadow-sm); }
  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 12px; font-weight: 600; color: var(--ink-soft); margin-bottom: 6px; text-transform: uppercase; letter-spacing: .05em; }
  .field input, .field select { width: 100%; padding: 10px 14px; border: 1.5px solid var(--border); border-radius: var(--radius); font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink); background: var(--surface2); outline: none; transition: all .15s; }
  .field input:focus, .field select:focus { border-color: var(--accent); background: var(--surface); box-shadow: 0 0 0 3px rgba(92,122,92,0.1); }
  .btn-primary { width: 100%; padding: 11px 20px; background: var(--accent); color: #fff; border: none; border-radius: var(--radius); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .15s; margin-top: 8px; letter-spacing: .01em; }
  .btn-primary:hover { background: #4A6741; } .btn-primary:disabled { opacity: .5; cursor: not-allowed; }
  .btn-outline { padding: 8px 18px; background: transparent; color: var(--accent); border: 1.5px solid var(--accent); border-radius: var(--radius); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; }
  .btn-outline:hover { background: var(--accent-light); }
  .btn-dark { padding: 10px 20px; background: var(--ink); color: #fff; border: none; border-radius: var(--radius); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; letter-spacing: .01em; }
  .btn-dark:hover { opacity: .88; }
  .auth-error { background: var(--danger-light); color: var(--danger); padding: 10px 14px; border-radius: var(--radius); font-size: 13px; margin-bottom: 16px; border-left: 3px solid var(--danger); }
  .auth-success { background: var(--accent-light); color: var(--accent); padding: 10px 14px; border-radius: var(--radius); font-size: 13px; margin-bottom: 16px; border-left: 3px solid var(--accent); }
  .setup-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
  .setup-tab { flex: 1; padding: 9px; border: 1.5px solid var(--border); border-radius: var(--radius); background: transparent; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; text-align: center; transition: all .15s; color: var(--ink-soft); }
  .setup-tab.active { background: var(--accent); color: #fff; border-color: var(--accent); font-weight: 600; }

  /* NAV */
  .nav { background: var(--ink); height: 52px; display: flex; align-items: center; padding: 0 24px; gap: 16px; position: sticky; top: 0; z-index: 200; }
  .nav-logo { font-family: 'DM Serif Display', serif; font-size: 22px; color: #fff; letter-spacing: -.5px; }
  .nav-sep { width: 1px; height: 18px; background: rgba(255,255,255,0.15); }
  .nav-context { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 300; }
  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 14px; }
  .nav-code { font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: .08em; }
  .nav-code strong { color: rgba(255,255,255,0.7); letter-spacing: .12em; }
  .nav-avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; }
  .nav-name { font-size: 13px; color: rgba(255,255,255,0.7); }
  .btn-nav { padding: 5px 14px; background: transparent; border: 1px solid rgba(255,255,255,0.2); border-radius: var(--radius); color: rgba(255,255,255,0.65); font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; transition: all .15s; }
  .btn-nav:hover { border-color: rgba(255,255,255,0.4); color: #fff; }

  /* LAYOUT */
  .app-layout { display: flex; flex: 1; min-height: 0; }
  .sidebar { width: 210px; background: var(--surface); border-right: 1px solid var(--border); padding: 20px 0; flex-shrink: 0; }
  .sidebar-section { font-size: 10px; font-weight: 700; color: var(--ink-faint); text-transform: uppercase; letter-spacing: .1em; padding: 0 20px 8px; margin-top: 8px; }
  .sidebar-section:first-child { margin-top: 0; }
  .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 9px 20px; font-size: 13.5px; color: var(--ink-soft); cursor: pointer; transition: all .12s; border-left: 2px solid transparent; }
  .sidebar-item:hover { background: var(--bg); color: var(--ink); }
  .sidebar-item.active { background: var(--accent-light); color: var(--accent); border-left-color: var(--accent); font-weight: 500; }
  .sidebar-icon { width: 18px; height: 18px; flex-shrink: 0; opacity: .7; }
  .sidebar-item.active .sidebar-icon { opacity: 1; }
  .content { flex: 1; overflow-y: auto; background: var(--bg); }

  /* MAIN */
  .main { padding: 28px 32px; max-width: 1300px; }
  .page-header { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 26px; color: var(--ink); margin-bottom: 3px; }
  .page-sub { font-size: 13px; color: var(--ink-faint); font-weight: 300; }
  .crumb { font-size: 11px; color: var(--ink-faint); margin-bottom: 6px; letter-spacing: .03em; }

  /* CARDS */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 22px; box-shadow: var(--shadow-sm); }
  .card + .card { margin-top: 16px; }
  .card-title { font-size: 11px; font-weight: 700; color: var(--ink-faint); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .card-title-line { flex: 1; height: 1px; background: var(--border); }

  /* KPI */
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
  .kpi { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 22px; box-shadow: var(--shadow-sm); position: relative; overflow: hidden; }
  .kpi-accent { position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .kpi-label { font-size: 11px; font-weight: 600; color: var(--ink-faint); text-transform: uppercase; letter-spacing: .07em; margin-bottom: 10px; }
  .kpi-val { font-family: 'DM Serif Display', serif; font-size: 38px; line-height: 1; color: var(--ink); margin-bottom: 4px; }
  .kpi-val small { font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 300; color: var(--ink-soft); }
  .kpi-desc { font-size: 12px; color: var(--ink-faint); }
  .kpi-trend { font-size: 12px; font-weight: 500; margin-top: 6px; }
  .kpi-trend.pos { color: var(--accent); } .kpi-trend.neg { color: var(--danger); }

  /* CHARTS */
  .charts-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .charts-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }

  /* TABLE */
  .tbl-wrap { overflow-x: auto; }
  .tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
  .tbl th { text-align: left; font-size: 10px; font-weight: 700; color: var(--ink-faint); text-transform: uppercase; letter-spacing: .07em; padding: 9px 14px; border-bottom: 1.5px solid var(--border); background: var(--surface2); }
  .tbl td { padding: 11px 14px; border-bottom: 1px solid var(--border); }
  .tbl tr:last-child td { border-bottom: none; }
  .tbl tr:hover td { background: var(--surface2); }
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  .badge.low { background: var(--accent-light); color: var(--accent); }
  .badge.medium { background: var(--warn-light); color: var(--warn); }
  .badge.high { background: var(--danger-light); color: var(--danger); }

  .sbar-row { display: flex; align-items: center; gap: 8px; }
  .sbar { flex: 1; height: 5px; background: var(--border); border-radius: 3px; overflow: hidden; }
  .sbar-fill { height: 100%; border-radius: 3px; }
  .sbar-val { font-size: 12px; font-weight: 600; min-width: 24px; text-align: right; }

  /* CHECKIN */
  .ci-wrap { max-width: 580px; margin: 0 auto; padding: 40px 24px; }
  .ci-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow); }
  .ci-week { font-size: 11px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 6px; }
  .ci-title { font-family: 'DM Serif Display', serif; font-size: 26px; color: var(--ink); margin-bottom: 4px; }
  .ci-sub { font-size: 13px; color: var(--ink-faint); margin-bottom: 32px; font-weight: 300; }
  .ci-steps { display: flex; gap: 5px; margin-bottom: 32px; }
  .ci-step { flex: 1; height: 3px; background: var(--border); border-radius: 2px; transition: background .3s; }
  .ci-step.done { background: var(--accent); }
  .ci-step.active { background: var(--accent); opacity: .4; }
  .ci-qnum { font-size: 11px; font-weight: 600; color: var(--ink-faint); text-transform: uppercase; letter-spacing: .07em; margin-bottom: 10px; }
  .ci-q { font-size: 18px; font-weight: 500; color: var(--ink); margin-bottom: 6px; line-height: 1.4; }
  .ci-hint { font-size: 13px; color: var(--ink-faint); margin-bottom: 28px; font-weight: 300; }
  .ci-slider { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .ci-slider input[type=range] { flex: 1; -webkit-appearance: none; height: 4px; background: var(--border); border-radius: 2px; outline: none; cursor: pointer; }
  .ci-slider input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: var(--accent); cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.2); border: 2px solid #fff; }
  .ci-score { font-family: 'DM Serif Display', serif; font-size: 40px; min-width: 48px; text-align: center; line-height: 1; }
  .ci-scale { display: flex; justify-content: space-between; font-size: 11px; color: var(--ink-faint); margin-bottom: 32px; }
  .ci-nav { display: flex; justify-content: space-between; align-items: center; }
  .ci-done { text-align: center; padding: 40px 0; }
  .ci-done-check { width: 64px; height: 64px; border-radius: 50%; background: var(--accent-light); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
  .ci-done h2 { font-family: 'DM Serif Display', serif; font-size: 26px; margin-bottom: 8px; }
  .ci-done p { font-size: 14px; color: var(--ink-soft); line-height: 1.6; font-weight: 300; }
  .ci-tip { margin-top: 24px; padding: 14px 18px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-lg); font-size: 13px; color: var(--ink-soft); text-align: left; line-height: 1.5; }

  /* TOOL CARDS */
  .tool-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
  .tool-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 22px; cursor: pointer; transition: all .18s; position: relative; }
  .tool-card:hover { border-color: var(--accent); box-shadow: var(--shadow); transform: translateY(-2px); }
  .tool-cat { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--accent2); margin-bottom: 8px; }
  .tool-title { font-size: 16px; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
  .tool-desc { font-size: 13px; color: var(--ink-soft); line-height: 1.55; margin-bottom: 14px; font-weight: 300; }
  .tool-meta { display: flex; align-items: center; justify-content: space-between; }
  .tool-dur { font-size: 12px; color: var(--ink-faint); }
  .tool-btn { font-size: 12px; font-weight: 600; color: var(--accent); background: var(--accent-light); padding: 4px 12px; border-radius: 20px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .tool-benefit { font-size: 12px; color: var(--accent); background: var(--accent-light); border-radius: var(--radius); padding: 8px 12px; margin-top: 12px; line-height: 1.4; display: none; }
  .tool-card.expanded .tool-benefit { display: block; }

  /* MODAL */
  .modal-bg { position: fixed; inset: 0; background: rgba(44,36,22,0.5); display: flex; align-items: center; justify-content: center; z-index: 500; padding: 24px; backdrop-filter: blur(2px); }
  .modal { background: var(--surface); border-radius: var(--radius-xl); padding: 36px; max-width: 480px; width: 100%; box-shadow: var(--shadow-lg); }
  .modal-cat { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--accent2); margin-bottom: 8px; }
  .modal-title { font-family: 'DM Serif Display', serif; font-size: 24px; color: var(--ink); margin-bottom: 8px; }
  .modal-desc { font-size: 14px; color: var(--ink-soft); line-height: 1.6; margin-bottom: 22px; font-weight: 300; }
  .modal-steps { list-style: none; margin-bottom: 20px; }
  .modal-steps li { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13.5px; color: var(--ink-soft); line-height: 1.5; }
  .modal-steps li:last-child { border-bottom: none; }
  .step-num { width: 22px; height: 22px; border-radius: 50%; background: var(--accent); color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .modal-benefit { background: var(--accent-light); border-radius: var(--radius); padding: 12px 14px; font-size: 13px; color: var(--accent); line-height: 1.5; margin-bottom: 22px; }
  .modal-benefit strong { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 4px; opacity: .7; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; }

  /* BREATHING */
  .breath-circle { width: 160px; height: 160px; border-radius: 50%; background: var(--accent-light); border: 2px solid var(--accent); display: flex; align-items: center; justify-content: center; margin: 24px auto; font-size: 14px; font-weight: 500; color: var(--accent); transition: transform 1s ease, background 1s ease; }
  .breath-circle.in { transform: scale(1.3); background: var(--accent-light); }
  .breath-circle.hold { transform: scale(1.3); background: #EEF3EE; }
  .breath-circle.out { transform: scale(1); }

  /* LOADING */
  .loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; flex-direction: column; gap: 14px; background: var(--bg); }
  .spinner { width: 28px; height: 28px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin .9s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-label { font-size: 13px; color: var(--ink-faint); font-weight: 300; letter-spacing: .03em; }

  .empty { text-align: center; padding: 64px 20px; }
  .empty-title { font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--ink); margin-bottom: 8px; }
  .empty-sub { font-size: 14px; color: var(--ink-faint); font-weight: 300; line-height: 1.6; }

  .section-tabs { display: flex; gap: 4px; margin-bottom: 24px; background: var(--bg2); padding: 4px; border-radius: var(--radius-lg); width: fit-content; }
  .section-tab { padding: 7px 18px; border: none; background: transparent; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--ink-soft); transition: all .15s; }
  .section-tab.active { background: var(--surface); color: var(--ink); box-shadow: var(--shadow-sm); }

  @media (max-width: 900px) {
    .auth-left { display: none; }
    .auth-right { width: 100%; padding: 40px 32px; }
    .kpi-grid { grid-template-columns: 1fr 1fr; }
    .charts-2, .charts-3 { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .main { padding: 20px; }
  }
`;

const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

// SVG Icon components
const Icon = {
  Grid: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Building: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M6 21V7a1 1 0 011-1h10a1 1 0 011 1v14M9 21v-4a1 1 0 011-1h4a1 1 0 011 1v4"/></svg>,
  TrendUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Tool: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  History: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 106 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>,
  Brain: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 10-5.997.125 4 4 0 00-2.526 5.77 4 4 0 00.556 6.588A4 4 0 1012 18"/><path d="M12 5a3 3 0 115.997.125 4 4 0 012.526 5.77 4 4 0 01-.556 6.588A4 4 0 1112 18"/><path d="M15 13a4.5 4.5 0 01-3-4 4.5 4.5 0 01-3 4"/><path d="M17.599 6.5a3 3 0 00.399-1.375M6.003 5.125A3 3 0 006.401 6.5"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  BarChart2: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Leaf: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.34c-.2.3.1.66.44.55C5.77 19.26 8.15 18.31 10 17c2-1.4 3.5-3.33 4-5.5 1.5 2.67 3 4 5 4"/></svg>,
};

function getRisk(score) { return score >= 7 ? "low" : score >= 5 ? "medium" : "high"; }
function getRiskLabel(score) { return score >= 7 ? "Low Risk" : score >= 5 ? "Medium Risk" : "High Risk"; }
function getRiskColor(score) { return score >= 7 ? "#5C7A5C" : score >= 5 ? "#C4956A" : "#A0522D"; }

  const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
  return `Week ${week} · ${now.getFullYear()}`;
}

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

  if (loading) return <div className="loading"><div className="spinner" /><div className="loading-label">Loading WellPulse</div></div>;
  if (!session) return <AuthScreen />;
  if (!profile) return <div className="loading"><div className="spinner" /><div className="loading-label">Setting up your workspace</div></div>;
  if (profile.role === "leadership") return <LeadershipApp user={profile} onLogout={() => supabase.auth.signOut()} />;
  return <EmployeeApp user={profile} onLogout={() => supabase.auth.signOut()} />;
}

function AuthScreen() {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "Engineering", role: "employee", companyCode: "", companyName: "" });
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
    if (form.role === "leadership" && setupTab === "create") companyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { name: form.name, department: form.department, role: form.role, company_code: companyCode } } });
    if (error) { setError(error.message); setBusy(false); return; }
    if (data.user) {
      await supabase.from("profiles").upsert({ id: data.user.id, name: form.name, department: form.department, role: form.role, company_code: companyCode });
      if (form.role === "leadership" && setupTab === "create") await supabase.from("companies").insert({ name: form.companyName || "My Company", code: companyCode, admin_id: data.user.id });
      setMessage("Account created. You can now sign in."); setTab("login");
    }
    setBusy(false);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">WellPulse</div>
          <div className="auth-brand-tagline">Workplace wellness intelligence for teams that care about their people.</div>
          <div className="auth-features">
            {[["Burnout Risk Tracking","Real-time department-level monitoring"],["Wellness Check-Ins","Weekly pulse surveys that take 2 minutes"],["Prevention Toolkit","Practical tools for stress and mental clarity"],["Trend Reporting","Weekly and monthly wellness analytics"]].map(([t,s])=>(
              <div className="auth-feature" key={t}>
                <div className="auth-feature-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg></div>
                <div className="auth-feature-text"><strong>{t}</strong><span>{s}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-title">Welcome back</div>
          <div className="auth-sub">Sign in to your WellPulse workspace</div>
          <div className="auth-tabs">
            <button className={`auth-tab ${tab==="login"?"active":""}`} onClick={()=>{setTab("login");setError("");setMessage("");}}>Sign In</button>
            <button className={`auth-tab ${tab==="signup"?"active":""}`} onClick={()=>{setTab("signup");setError("");setMessage("");}}>Register</button>
          </div>
          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}
          {tab === "login" ? (
            <form onSubmit={handleLogin}>
              <div className="field"><label>Email address</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com" required /></div>
              <div className="field"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter your password" required /></div>
              <button className="btn-primary" type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign In"}</button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <div className="field"><label>Full Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Jane Smith" required /></div>
              <div className="field"><label>Work Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com" required /></div>
              <div className="field"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Minimum 6 characters" required /></div>
              <div className="field"><label>Department</label>
                <select value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>
                  {DEPTS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="field"><label>I am a</label>
                <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                  <option value="employee">Employee</option>
                  <option value="leadership">Leader / Administrator</option>
                </select>
              </div>
              {form.role === "leadership" ? (
                <>
                  <div className="setup-tabs">
                    <button type="button" className={`setup-tab ${setupTab==="join"?"active":""}`} onClick={()=>setSetupTab("join")}>Join a Company</button>
                    <button type="button" className={`setup-tab ${setupTab==="create"?"active":""}`} onClick={()=>setSetupTab("create")}>Create a Company</button>
                  </div>
                  {setupTab === "join"
                    ? <div className="field"><label>Company Code</label><input value={form.companyCode} onChange={e=>setForm({...form,companyCode:e.target.value})} placeholder="e.g. ABC123" /></div>
                    : <div className="field"><label>Company Name</label><input value={form.companyName} onChange={e=>setForm({...form,companyName:e.target.value})} placeholder="Acme Corporation" /></div>
                  }
                </>
              ) : (
                <div className="field"><label>Company Code</label><input value={form.companyCode} onChange={e=>setForm({...form,companyCode:e.target.value})} placeholder="Provided by your administrator" /></div>
              )}
              <button className="btn-primary" type="submit" disabled={busy}>{busy ? "Creating account..." : "Create Account"}</button>
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

  const nav = [
    { id: "dashboard", label: "Overview", Icon: Icon.Grid },
    { id: "departments", label: "Departments", Icon: Icon.Building },
    { id: "trends", label: "Trends", Icon: Icon.TrendUp },
    { id: "reports", label: "Reports", Icon: Icon.FileText },
  ];

  return (
    <div className="wp-app">
      <nav className="nav">
        <div className="nav-logo">WellPulse</div>
        <div className="nav-sep" />
        <div className="nav-context">Leadership Portal</div>
        <div className="nav-right">
          {user.company_code && <div className="nav-code">Company Code <strong>{user.company_code}</strong></div>}
          <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
          <div className="nav-name">{user.name}</div>
          <button className="btn-nav" onClick={onLogout}>Sign out</button>
        </div>
      </nav>
      <div className="app-layout">
        <div className="sidebar">
          <div className="sidebar-section">Analytics</div>
          {nav.map(item => (
            <div key={item.id} className={`sidebar-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)}>
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {item.id==="dashboard" && <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>}
                {item.id==="departments" && <><path d="M3 21h18M6 21V7a1 1 0 011-1h10a1 1 0 011 1v14M9 21v-4a1 1 0 011-1h4a1 1 0 011 1v4"/></>}
                {item.id==="trends" && <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>}
                {item.id==="reports" && <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>}
              </svg>
              {item.label}
            </div>
          ))}
        </div>
        <div className="content">
          {loading ? <div className="loading"><div className="spinner" /></div> : (
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
  const weeks = [...new Set(checkins.map(c=>c.week))];
  const cw = weeks[weeks.length-1];
  const depts = [...new Set(checkins.map(c=>c.department))].filter(Boolean);
  const thisWeek = checkins.filter(c=>c.week===cw);
  const lastWeek = checkins.filter(c=>c.week===weeks[weeks.length-2]);

  const deptSummary = depts.map(dept => {
    const items = thisWeek.filter(c=>c.department===dept);
    if (!items.length) return null;
    const avg = k => Math.round(items.reduce((a,b)=>a+(b[k]||0),0)/items.length);
    const score = Math.round((avg("stress")+avg("workload")+avg("relationships")+avg("manager")+avg("balance"))/5);
    return { dept, score, stress:avg("stress"), workload:avg("workload"), relationships:avg("relationships"), manager:avg("manager"), balance:avg("balance"), count:items.length };
  }).filter(Boolean).sort((a,b)=>a.score-b.score);

  const overall = deptSummary.length ? Math.round(deptSummary.reduce((a,b)=>a+b.score,0)/deptSummary.length) : 0;
  const lastOverall = lastWeek.length ? Math.round(lastWeek.reduce((a,b)=>a+Math.round((b.stress+b.workload+b.relationships+b.manager+b.balance)/5),0)/lastWeek.length) : 0;
  const trend = overall - lastOverall;
  const highRisk = deptSummary.filter(d=>getRisk(d.score)==="high").length;

  const radarData = ["stress","workload","relationships","manager","balance"].map(k=>({
    subject: k.charAt(0).toUpperCase()+k.slice(1),
    value: deptSummary.length ? Math.round(deptSummary.reduce((a,b)=>a+b[k],0)/deptSummary.length) : 0
  }));

  const riskDist = [
    { name:"Low Risk", value:deptSummary.filter(d=>getRisk(d.score)==="low").length, color:"#5C7A5C" },
    { name:"Medium Risk", value:deptSummary.filter(d=>getRisk(d.score)==="medium").length, color:"#C4956A" },
    { name:"High Risk", value:deptSummary.filter(d=>getRisk(d.score)==="high").length, color:"#A0522D" },
  ].filter(d=>d.value>0);

  return (
    <div className="main">
      <div className="page-header">
        <div className="crumb">WellPulse · Overview</div>
        <div className="page-title">Wellness Overview</div>
        <div className="page-sub">{cw || "No data yet"} &nbsp;·&nbsp; {depts.length} departments &nbsp;·&nbsp; {thisWeek.length} responses this week</div>
      </div>

      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-accent" style={{background:getRiskColor(overall)}} />
          <div className="kpi-label">Overall Score</div>
          <div className="kpi-val" style={{color:getRiskColor(overall)}}>{overall}<small>/10</small></div>
          <div className="kpi-desc">{getRiskLabel(overall)}</div>
          {trend!==0 && <div className={`kpi-trend ${trend>0?"pos":"neg"}`}>{trend>0?"↑":"↓"} {Math.abs(trend)} vs last week</div>}
        </div>
        <div className="kpi">
          <div className="kpi-accent" style={{background:"#A0522D"}} />
          <div className="kpi-label">High Risk Depts</div>
          <div className="kpi-val" style={{color:highRisk>0?"#A0522D":"#5C7A5C"}}>{highRisk}</div>
          <div className="kpi-desc">Require attention</div>
        </div>
        <div className="kpi">
          <div className="kpi-accent" style={{background:"#8B6F47"}} />
          <div className="kpi-label">Responses</div>
          <div className="kpi-val">{thisWeek.length}</div>
          <div className="kpi-desc">This week</div>
        </div>
        <div className="kpi">
          <div className="kpi-accent" style={{background:"#7A8C6E"}} />
          <div className="kpi-label">Departments</div>
          <div className="kpi-val">{depts.length}</div>
          <div className="kpi-desc">Being tracked</div>
        </div>
      </div>

      {checkins.length === 0 ? (
        <div className="card"><div className="empty"><div className="empty-title">No data yet</div><div className="empty-sub">Share your company code <strong>{user.company_code}</strong> with employees so they can register and complete their weekly check-ins. Data will appear here automatically.</div></div></div>
      ) : (
        <>
          <div className="charts-2">
            <div className="card">
              <div className="card-title">Wellness by Category <div className="card-title-line"/></div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E2D9CE" />
                  <PolarAngleAxis dataKey="subject" tick={{fontSize:11,fill:"#6B5D4F"}} />
                  <Radar dataKey="value" stroke="#5C7A5C" fill="#5C7A5C" fillOpacity={0.12} strokeWidth={2} />
                  <Tooltip contentStyle={{borderRadius:6,border:"1px solid #E2D9CE",background:"#FDFCF9",fontSize:12}} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="card-title">Risk Distribution <div className="card-title-line"/></div>
              {riskDist.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={riskDist} cx="50%" cy="50%" innerRadius={58} outerRadius={88} paddingAngle={3} dataKey="value">
                      {riskDist.map((e,i)=><Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius:6,border:"1px solid #E2D9CE",background:"#FDFCF9",fontSize:12}} />
                    <Legend iconType="circle" iconSize={8} formatter={v=><span style={{fontSize:12,color:"#6B5D4F"}}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="empty" style={{padding:"40px 0"}}><div className="empty-sub">Insufficient data</div></div>}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Department Risk Overview <div className="card-title-line"/></div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>Department</th><th>Risk Level</th><th>Overall Score</th><th>Stress</th><th>Workload</th><th>Relationships</th><th>Manager</th><th>Balance</th><th>Responses</th></tr></thead>
                <tbody>
                  {deptSummary.map(d=>(
                    <tr key={d.dept}>
                      <td style={{fontWeight:500}}>{d.dept}</td>
                      <td><span className={`badge ${getRisk(d.score)}`}><span className="badge-dot"/>{getRiskLabel(d.score)}</span></td>
                      <td>
                        <div className="sbar-row">
                          <div className="sbar"><div className="sbar-fill" style={{width:`${d.score*10}%`,background:getRiskColor(d.score)}} /></div>
                          <span className="sbar-val" style={{color:getRiskColor(d.score)}}>{d.score}</span>
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

  const tt = { contentStyle:{borderRadius:6,border:"1px solid #E2D9CE",background:"#FDFCF9",fontSize:12} };

  return (
    <div className="main">
      <div className="page-header">
        <div className="crumb">WellPulse · Departments</div>
        <div className="page-title">Department Analysis</div>
        <div className="page-sub">Wellness category scores by department — {cw}</div>
      </div>
      {barData.length === 0 ? (
        <div className="card"><div className="empty"><div className="empty-title">No department data yet</div></div></div>
      ) : (
        <>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-title">All Categories by Department <div className="card-title-line"/></div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{top:5,right:20,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" vertical={false} />
                <XAxis dataKey="dept" tick={{fontSize:11,fill:"#6B5D4F"}} />
                <YAxis domain={[0,10]} tick={{fontSize:11,fill:"#6B5D4F"}} />
                <Tooltip {...tt} /><Legend iconType="circle" iconSize={7} formatter={v=><span style={{fontSize:11,color:"#6B5D4F"}}>{v}</span>} />
                <Bar dataKey="Stress" fill="#5C7A5C" radius={[3,3,0,0]} />
                <Bar dataKey="Workload" fill="#8B6F47" radius={[3,3,0,0]} />
                <Bar dataKey="Relationships" fill="#7A8C6E" radius={[3,3,0,0]} />
                <Bar dataKey="Manager" fill="#C4956A" radius={[3,3,0,0]} />
                <Bar dataKey="Balance" fill="#4A6741" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="charts-2">
            {barData.slice(0,4).map((d,i)=>(
              <div key={d.dept} className="card">
                <div className="card-title">{d.dept} <div className="card-title-line"/></div>
                {["Stress","Workload","Relationships","Manager","Balance"].map(cat=>(
                  <div key={cat} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                      <span style={{color:"var(--ink-soft)"}}>{cat}</span>
                      <span style={{fontWeight:600,color:"var(--ink)"}}>{d[cat]}/10</span>
                    </div>
                    <div className="sbar" style={{height:6}}>
                      <div className="sbar-fill" style={{width:`${d[cat]*10}%`,background:COLORS[i%COLORS.length]}} />
                    </div>
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
    const row = { week: week.replace(/\s·\s\d{4}|Week\s\d+\s·\s/g,"").replace(/Week /,"W") };
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
    const w = week.replace(/\s·\s\d{4}|Week\s\d+\s·\s/g,"").replace(/Week /,"W");
    if (!items.length) return { week: w };
    const avg = k => Math.round(items.reduce((a,b)=>a+(b[k]||0),0)/items.length);
    return { week:w, Stress:avg("stress"), Workload:avg("workload"), Relationships:avg("relationships"), Manager:avg("manager"), Balance:avg("balance") };
  });

  const monthlyData = (() => {
    const months = {};
    checkins.forEach(c => {
      const m = c.created_at ? new Date(c.created_at).toLocaleString("default",{month:"short",year:"2-digit"}) : "N/A";
      if (!months[m]) months[m] = [];
      months[m].push(Math.round((c.stress+c.workload+c.relationships+c.manager+c.balance)/5));
    });
    return Object.entries(months).map(([month,scores])=>({ month, score:Math.round(scores.reduce((a,b)=>a+b,0)/scores.length), responses:scores.length }));
  })();

  const tt = { contentStyle:{borderRadius:6,border:"1px solid #E2D9CE",background:"#FDFCF9",fontSize:12} };

  return (
    <div className="main">
      <div className="page-header">
        <div className="crumb">WellPulse · Trends</div>
        <div className="page-title">Wellness Trends</div>
        <div className="page-sub">Weekly and monthly performance over time</div>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <div className="card-title">Overall Weekly Trend <div className="card-title-line"/></div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={weeklyTrend}>
            <defs><linearGradient id="og" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#5C7A5C" stopOpacity={0.12}/><stop offset="95%" stopColor="#5C7A5C" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" vertical={false} />
            <XAxis dataKey="week" tick={{fontSize:11,fill:"#6B5D4F"}} /><YAxis domain={[1,10]} tick={{fontSize:11,fill:"#6B5D4F"}} />
            <Tooltip {...tt} />
            <Area type="monotone" dataKey="Overall" stroke="#5C7A5C" fill="url(#og)" strokeWidth={2} dot={{r:4,fill:"#5C7A5C",strokeWidth:0}} connectNulls name="Overall Score" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <div className="card-title">Monthly Wellness Score <div className="card-title-line"/></div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} margin={{top:5,right:20,left:0,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" vertical={false} />
            <XAxis dataKey="month" tick={{fontSize:11,fill:"#6B5D4F"}} /><YAxis domain={[0,10]} tick={{fontSize:11,fill:"#6B5D4F"}} />
            <Tooltip {...tt} />
            <Bar dataKey="score" fill="#8B6F47" radius={[4,4,0,0]} name="Avg Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="charts-2">
        <div className="card">
          <div className="card-title">Department Trends <div className="card-title-line"/></div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" vertical={false} />
              <XAxis dataKey="week" tick={{fontSize:10,fill:"#6B5D4F"}} /><YAxis domain={[1,10]} tick={{fontSize:10,fill:"#6B5D4F"}} />
              <Tooltip {...tt} /><Legend iconType="circle" iconSize={6} formatter={v=><span style={{fontSize:11,color:"#6B5D4F"}}>{v}</span>} />
              {depts.map((d,i)=><Line key={d} type="monotone" dataKey={d} stroke={COLORS[i%COLORS.length]} strokeWidth={2} dot={false} connectNulls />)}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title">Category Trends <div className="card-title-line"/></div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={categoryTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" vertical={false} />
              <XAxis dataKey="week" tick={{fontSize:10,fill:"#6B5D4F"}} /><YAxis domain={[1,10]} tick={{fontSize:10,fill:"#6B5D4F"}} />
              <Tooltip {...tt} /><Legend iconType="circle" iconSize={6} formatter={v=><span style={{fontSize:11,color:"#6B5D4F"}}>{v}</span>} />
              {[["Stress","#5C7A5C"],["Workload","#8B6F47"],["Relationships","#7A8C6E"],["Manager","#C4956A"],["Balance","#4A6741"]].map(([k,c])=>(
                <Line key={k} type="monotone" dataKey={k} stroke={c} strokeWidth={1.5} dot={false} connectNulls />
              ))}
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
    const rows = deptSummary.map(d=>`${d.dept}\n  Score: ${d.score}/10  Risk: ${getRiskLabel(d.score)}  Responses: ${d.count}\n  Stress: ${d.stress}  Workload: ${d.workload}  Relationships: ${d.relationships}  Manager: ${d.manager}  Balance: ${d.balance}`).join("\n\n");
    const recs = deptSummary.filter(d=>getRisk(d.score)==="high").map(d=>`  - ${d.dept}: Score ${d.score}/10 — Immediate attention recommended`).join("\n") || "  All departments within acceptable range.";
    const content = `WELLPULSE WELLNESS REPORT\n${"─".repeat(48)}\nCompany Code : ${user.company_code||"N/A"}\nGenerated    : ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}\nReporting Period : ${cw}\n\n${"─".repeat(48)}\nSUMMARY\n\n  Overall Score     : ${overall}/10 (${getRiskLabel(overall)})\n  High Risk Depts   : ${deptSummary.filter(d=>getRisk(d.score)==="high").length}\n  Total Responses   : ${thisWeek.length}\n  Departments       : ${depts.length}\n\n${"─".repeat(48)}\nDEPARTMENT BREAKDOWN\n\n${rows}\n\n${"─".repeat(48)}\nRECOMMENDATIONS\n\n${recs}\n\n${"─".repeat(48)}\nGenerated by WellPulse`;
    const blob = new Blob([content],{type:"text/plain"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `WellPulse-${new Date().toISOString().split("T")[0]}.txt`; a.click();
  }

  return (
    <div className="main">
      <div className="page-header">
        <div className="crumb">WellPulse · Reports</div>
        <div className="page-title">Wellness Reports</div>
        <div className="page-sub">Export and review detailed reports for leadership review</div>
      </div>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-title">Export Report <div className="card-title-line"/></div>
        <p style={{fontSize:13,color:"var(--ink-soft)",fontWeight:300,lineHeight:1.6,marginBottom:18}}>Export a complete wellness report for <strong>{cw}</strong> including department scores, risk classification, and recommendations.</p>
        <button className="btn-dark" onClick={exportReport}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Report
        </button>
      </div>
      <div className="card">
        <div className="card-title">Report Preview — {cw||"No data"} <div className="card-title-line"/></div>
        {deptSummary.length === 0 ? (
          <div className="empty"><div className="empty-title">No data to report</div><div className="empty-sub">Check-in data will appear once employees complete their weekly surveys.</div></div>
        ) : (
          <table className="tbl">
            <thead><tr><th>Department</th><th>Score</th><th>Risk</th><th>Recommendation</th></tr></thead>
            <tbody>
              {deptSummary.map(d=>(
                <tr key={d.dept}>
                  <td style={{fontWeight:500}}>{d.dept}</td>
                  <td style={{fontWeight:600,color:getRiskColor(d.score)}}>{d.score}/10</td>
                  <td><span className={`badge ${getRisk(d.score)}`}><span className="badge-dot"/>{getRiskLabel(d.score)}</span></td>
                  <td style={{fontSize:12,color:"var(--ink-soft)",fontWeight:300}}>
                    {getRisk(d.score)==="high" ? "Immediate leadership intervention recommended." : getRisk(d.score)==="medium" ? "Monitor closely. Consider targeted support." : "Maintain current team practices."}
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
  const nav = [
    { id:"checkin", label:"Weekly Check-In" },
    { id:"stress", label:"Stress Management" },
    { id:"neuro", label:"Team Practices" },
    { id:"history", label:"My History" },
  ];
  const icons = {
    checkin: <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>,
    stress: <><path d="M17 8C8 10 5.9 16.17 3.82 19.34c-.2.3.1.66.44.55C5.77 19.26 8.15 18.31 10 17c2-1.4 3.5-3.33 4-5.5"/><path d="M14 2s1 2 1 4-2 4-2 4"/></>,
    neuro: <><path d="M12 5a3 3 0 10-5.997.125 4 4 0 00-2.526 5.77 4 4 0 00.556 6.588A4 4 0 1012 18"/><path d="M12 5a3 3 0 115.997.125 4 4 0 012.526 5.77 4 4 0 01-.556 6.588A4 4 0 1112 18"/></>,
    history: <><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 106 5.3L3 8"/><path d="M12 7v5l4 2"/></>,
  };

  return (
    <div className="wp-app">
      <nav className="nav">
        <div className="nav-logo">WellPulse</div>
        <div className="nav-sep" />
        <div className="nav-context">Employee Portal</div>
        <div className="nav-right">
          <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
          <div className="nav-name">{user.name} · {user.department}</div>
          <button className="btn-nav" onClick={onLogout}>Sign out</button>
        </div>
      </nav>
      <div className="app-layout">
        <div className="sidebar">
          <div className="sidebar-section">Wellness</div>
          {nav.map(item=>(
            <div key={item.id} className={`sidebar-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)}>
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {icons[item.id]}
              </svg>
              {item.label}
            </div>
          ))}
        </div>
        <div className="content">
          {page==="checkin" && <CheckInPage user={user} />}
          {page==="stress" && <ToolkitPage tools={STRESS_TOOLS} title="Stress Management" subtitle="Evidence-based techniques to regulate your nervous system" />}
          {page==="neuro" && <ToolkitPage tools={NEURO_TOOLS} title="Team Practices" subtitle="Neurological practices to implement in meetings and team settings" />}
          {page==="history" && <HistoryPage user={user} />}
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

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  const q = QUESTIONS[step];
  const val = answers[q?.id];

  return (
    <div className="ci-wrap">
      <div className="ci-card">
        {submitted ? (
          <div className="ci-done">
            <div className="ci-done-check">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5C7A5C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2>Check-in complete</h2>
            <p>Your responses for {currentWeek} have been recorded.<br/>Thank you for taking the time to reflect.</p>
            <div className="ci-tip">
              Visit <strong>Stress Management</strong> or <strong>Team Practices</strong> in the sidebar for tools to support your wellbeing this week.
            </div>
          </div>
        ) : (
          <>
            <div className="ci-week">{currentWeek}</div>
            <div className="ci-title">Weekly Check-In</div>
            <div className="ci-sub">Five questions · approximately 2 minutes</div>
            <div className="ci-steps">
              {QUESTIONS.map((_,i)=><div key={i} className={`ci-step ${i<step?"done":i===step?"active":""}`}/>)}
            </div>
            <div className="ci-qnum">Question {step+1} of {QUESTIONS.length}</div>
            <div style={{fontSize:20,fontWeight:500,color:"var(--ink)",marginBottom:6,lineHeight:1.4}}>{q.label}</div>
            <div style={{fontSize:13,color:"var(--ink-faint)",fontWeight:300,marginBottom:28}}>{q.hint}</div>
            <div className="ci-slider">
              <span style={{fontSize:12,color:"var(--ink-faint)",width:12,textAlign:"center"}}>1</span>
              <input type="range" min={1} max={10} value={val} onChange={e=>setAnswers({...answers,[q.id]:parseInt(e.target.value)})} />
              <span style={{fontSize:12,color:"var(--ink-faint)",width:12,textAlign:"center"}}>10</span>
              <span className="ci-score" style={{color:getRiskColor(val)}}>{val}</span>
            </div>
            <div className="ci-scale"><span>Low</span><span>High</span></div>
            <div className="ci-nav">
              {step>0 ? <button className="btn-outline" onClick={()=>setStep(step-1)}>Back</button> : <div/>}
              {step<QUESTIONS.length-1
                ? <button className="btn-primary" style={{width:"auto",padding:"10px 28px"}} onClick={()=>setStep(step+1)}>Continue</button>
                : <button className="btn-primary" style={{width:"auto",padding:"10px 28px"}} onClick={handleSubmit} disabled={saving}>{saving?"Saving...":"Submit"}</button>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ToolkitPage({ tools, title, subtitle }) {
  const [active, setActive] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [breathPhase, setBreathPhase] = useState("in");
  const [breathCycle, setBreathCycle] = useState(0);
  const timerRef = useRef(null);

  function startBreathing() {
    setActive({ type:"breathing" });
    setBreathPhase("in");
    setBreathCycle(0);
    let phase = "in";
    const phases = [{p:"in",label:"Breathe In",ms:4000},{p:"hold",label:"Hold",ms:4000},{p:"out",label:"Breathe Out",ms:4000},{p:"hold2",label:"Hold",ms:4000}];
    let i = 0;
    function next() {
      phase = phases[i].p;
      setBreathPhase(phase);
      if(i===0) setBreathCycle(c=>c+1);
      i=(i+1)%phases.length;
      timerRef.current = setTimeout(next, phases[(i+phases.length-1)%phases.length].ms);
    }
    timerRef.current = setTimeout(next, 0);
  }

  function closeModal() {
    setActive(null);
    if(timerRef.current) clearTimeout(timerRef.current);
  }

  function handleToolClick(tool) {
    if(tool.id===1 && tools===STRESS_TOOLS) startBreathing();
    else setActive(tool);
  }

  return (
    <div className="main">
      <div className="page-header">
        <div className="crumb">WellPulse · {title}</div>
        <div className="page-title">{title}</div>
        <div className="page-sub">{subtitle}</div>
      </div>
      <div className="tool-grid">
        {tools.map(tool=>(
          <div key={tool.id} className={`tool-card ${expanded===tool.id?"expanded":""}`}>
            <div className="tool-cat">{tool.category}</div>
            <div className="tool-title">{tool.title}</div>
            <div className="tool-desc">{tool.desc}</div>
            <div className="tool-benefit">{tool.benefit}</div>
            <div className="tool-meta">
              <div className="tool-dur">{tool.duration}</div>
              <div style={{display:"flex",gap:8}}>
                <button className="tool-btn" style={{background:"var(--surface2)",color:"var(--ink-soft)"}} onClick={()=>setExpanded(expanded===tool.id?null:tool.id)}>
                  {expanded===tool.id?"Less":"Why it works"}
                </button>
                <button className="tool-btn" onClick={()=>handleToolClick(tool)}>Open</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {active && active.type==="breathing" && (
        <div className="modal-bg" onClick={closeModal}>
          <div className="modal" style={{textAlign:"center"}} onClick={e=>e.stopPropagation()}>
            <div className="modal-cat">Breathwork</div>
            <div className="modal-title">Box Breathing</div>
            <p style={{fontSize:13,color:"var(--ink-soft)",fontWeight:300,marginBottom:8}}>Cycle {breathCycle} · Click outside to close</p>
            <div className={`breath-circle ${breathPhase==="in"?"in":breathPhase==="out"?"out":"hold"}`}>
              {breathPhase==="in"?"Breathe In":breathPhase==="out"?"Breathe Out":"Hold"}
            </div>
            <button className="btn-primary" onClick={closeModal}>End Session</button>
          </div>
        </div>
      )}

      {active && active.type!=="breathing" && (
        <div className="modal-bg" onClick={closeModal}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-cat">{active.category}</div>
            <div className="modal-title">{active.title}</div>
            <div className="modal-desc">{active.desc}</div>
            <ol className="modal-steps">
              {active.steps.map((s,i)=>(
                <li key={i}><span className="step-num">{i+1}</span><span>{s}</span></li>
              ))}
            </ol>
            <div className="modal-benefit"><strong>Why it works</strong>{active.benefit}</div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={closeModal}>Close</button>
              <button className="btn-primary" style={{width:"auto",padding:"10px 24px"}} onClick={closeModal}>Done</button>
            </div>
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

  if (loading) return <div className="loading"><div className="spinner"/></div>;

  const chartData = [...checkins].reverse().map(c=>({
    week: c.week?.replace(/\s·\s\d{4}/,"").replace("Week ","W")||"",
    score: Math.round((c.stress+c.workload+c.relationships+c.manager+c.balance)/5)
  }));

  const tt = { contentStyle:{borderRadius:6,border:"1px solid #E2D9CE",background:"#FDFCF9",fontSize:12} };

  return (
    <div className="main">
      <div className="page-header">
        <div className="crumb">WellPulse · My History</div>
        <div className="page-title">My Wellness History</div>
        <div className="page-sub">Your personal check-in record over time</div>
      </div>
      {checkins.length === 0 ? (
        <div className="card"><div className="empty"><div className="empty-title">No check-ins yet</div><div className="empty-sub">Complete your first weekly check-in. Your personal wellness trend will appear here over time.</div></div></div>
      ) : (
        <>
          <div className="card" style={{marginBottom:16}}>
            <div className="card-title">Wellness Score Over Time <div className="card-title-line"/></div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#5C7A5C" stopOpacity={0.12}/><stop offset="95%" stopColor="#5C7A5C" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" vertical={false} />
                <XAxis dataKey="week" tick={{fontSize:11,fill:"#6B5D4F"}} /><YAxis domain={[1,10]} tick={{fontSize:11,fill:"#6B5D4F"}} />
                <Tooltip {...tt} />
                <Area type="monotone" dataKey="score" stroke="#5C7A5C" fill="url(#pg)" strokeWidth={2} dot={{r:4,fill:"#5C7A5C",strokeWidth:0}} name="Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="card-title">Check-In History <div className="card-title-line"/></div>
            <table className="tbl">
              <thead><tr><th>Period</th><th>Overall</th><th>Status</th><th>Stress</th><th>Workload</th><th>Relationships</th><th>Manager</th><th>Balance</th></tr></thead>
              <tbody>
                {checkins.map(c=>{
                  const score = Math.round((c.stress+c.workload+c.relationships+c.manager+c.balance)/5);
                  return (
                    <tr key={c.id}>
                      <td style={{color:"var(--ink-soft)",fontSize:12}}>{c.week}</td>
                      <td style={{fontWeight:600,color:getRiskColor(score)}}>{score}/10</td>
                      <td><span className={`badge ${getRisk(score)}`}><span className="badge-dot"/>{getRiskLabel(score)}</span></td>
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
