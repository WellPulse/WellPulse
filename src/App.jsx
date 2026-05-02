import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, AreaChart, Area } from "recharts";

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
  { id:1, title:"Box Breathing", category:"Breathwork · Immediate", duration:"4 minutes", type:"breathing", desc:"A regulation technique used by Navy SEALs to calm the nervous system under pressure. Inhale, hold, exhale, hold — each for 4 counts.", steps:["Sit upright with feet flat on the floor.","Inhale slowly through your nose for 4 counts.","Hold your breath for 4 counts.","Exhale through your mouth for 4 counts.","Hold empty for 4 counts.","Repeat 4 to 6 cycles."], benefit:"Activates the parasympathetic nervous system within 90 seconds, lowering cortisol and heart rate." },
  { id:2, title:"Physiological Sigh", category:"Breathwork · Immediate", duration:"1 minute", type:"guide", desc:"A double inhale through the nose followed by a long exhale. The fastest known way to reduce acute stress in real time.", steps:["Take a full inhale through your nose.","At the top, take a second short sniff to fully expand the lungs.","Exhale slowly and completely through your mouth.","Repeat 3 to 5 times."], benefit:"Deflates stress-collapsed air sacs in the lungs and resets the autonomic nervous system instantly." },
  { id:3, title:"5-4-3-2-1 Grounding", category:"Mindfulness · Immediate", duration:"3 minutes", type:"guide", desc:"A sensory awareness technique that interrupts anxious thought loops by anchoring attention to the present moment.", steps:["Name 5 things you can see.","Name 4 things you can physically feel.","Name 3 things you can hear.","Name 2 things you can smell.","Name 1 thing you can taste."], benefit:"Interrupts the default mode network — the brain region responsible for rumination and worry." },
  { id:4, title:"Progressive Muscle Release", category:"Body · Immediate", duration:"5 minutes", type:"guide", desc:"Systematically tense and release muscle groups to discharge stored physical tension from stress.", steps:["Start with your feet — tense tightly for 5 seconds.","Release and notice the relaxation for 10 seconds.","Move up: calves, thighs, abdomen, hands, arms, shoulders, face.","End with a full-body release and 3 slow breaths."], benefit:"Reduces cortisol stored in muscle tissue and lowers resting heart rate." },
  { id:5, title:"Cold Water Reset", category:"Body · Immediate", duration:"2 minutes", type:"guide", desc:"Splashing cold water on your face triggers the mammalian dive reflex, instantly calming your heart rate and nervous system.", steps:["Go to a sink and run cold water.","Splash your face 5 to 10 times.","Hold a wet cloth over your eyes and forehead for 30 seconds.","Breathe slowly throughout."], benefit:"Activates the mammalian dive reflex, reducing heart rate by up to 25% within seconds." },
  { id:6, title:"Cognitive Defusion", category:"Mental Reframe · Immediate", duration:"3 minutes", type:"guide", desc:"A technique from Acceptance and Commitment Therapy. Create distance between yourself and your stressful thoughts.", steps:["Notice a stressful thought you are having.","Instead of 'I am overwhelmed', say 'I am having the thought that I am overwhelmed.'","Then say 'I notice I am having the thought that I am overwhelmed.'","Observe the thought without engaging with it.","Let it pass like a cloud."], benefit:"Reduces emotional reactivity by engaging the prefrontal cortex over the amygdala." },
  { id:7, title:"90-Minute Micro-Recovery", category:"Daily Practice · Preventative", duration:"5 minutes", type:"guide", desc:"Research shows that taking a 5-minute restorative break every 90 minutes prevents the accumulation of stress hormones and sustains cognitive performance across the full workday.", steps:["Set a repeating timer for every 90 minutes.","When it goes off, step fully away from your screen.","Choose one: walk, stretch, breathe, or simply sit in silence.","Do not check your phone during this time.","Return to work only after the 5 minutes are complete."], benefit:"Aligns with the brain's ultradian rhythm cycle — the 90-minute rest-activity pattern hardwired into human biology. Skipping recovery phases degrades focus by up to 40%." },
  { id:8, title:"End-of-Day Shutdown Ritual", category:"Daily Practice · Preventative", duration:"5 minutes", type:"guide", desc:"A structured transition from work mode to personal time. Without a clear closing ritual, the brain continues processing work stress for hours after you stop working.", steps:["At the end of your workday, write down your three most important tasks for tomorrow.","Review anything unfinished and note where it stands — not to solve it, but to release it.","Close all work tabs and applications.","Say aloud or write: 'My workday is complete.'","Do one physical action that signals the transition: change clothes, go outside, make tea."], benefit:"Activates cognitive closure — reducing the Zeigarnik effect, where incomplete tasks continue occupying mental bandwidth involuntarily." },
  { id:9, title:"Values Reconnection", category:"Mental Reframe · Preventative", duration:"10 minutes", type:"guide", desc:"When burnout sets in, the first casualty is a sense of meaning. This exercise reconnects you to your core values and why your work matters — not to the company, but to you.", steps:["Find a quiet moment and a piece of paper.","Write: What do I care about most in my life?","Write: What does my work allow me to do or provide that matters to me?","Write: What is one small thing I did this week that was aligned with my values?","Read it back slowly.","Keep it somewhere visible."], benefit:"Reactivates intrinsic motivation circuits in the brain. Research shows that meaning-based motivation is more burnout-resistant than achievement-based motivation." },
  { id:10, title:"Journaling for Overwhelm", category:"Daily Practice · Preventative", duration:"7 minutes", type:"guide", desc:"Structured journaling prompts specifically designed to externalize and process workplace overwhelm, preventing it from compounding silently over time.", steps:["Open a notebook or document — private, not shared.","Prompt 1: What is taking up the most mental space right now?","Prompt 2: What am I afraid will happen if I don't handle it?","Prompt 3: What is one thing within my control today?","Prompt 4: What do I need to let go of?","Write freely — no editing, no judgment. 2 minutes per prompt."], benefit:"Externalizing stress through writing activates the prefrontal cortex and reduces amygdala reactivity. Studies show expressive writing reduces anxiety symptoms by up to 28%." },
  { id:11, title:"Boundary-Setting Script", category:"Communication · Preventative", duration:"5 minutes", type:"guide", desc:"Chronic overload is often the result of unclear boundaries around capacity and availability. This tool gives you a concrete, professional framework for protecting your time without damaging relationships.", steps:["Identify one commitment or request that is beyond your current capacity.","Use this structure: 'I want to be upfront with you — I am currently at capacity with [X]. I can either [option A] or [option B]. What would be most helpful?'","Deliver it calmly and without over-explaining.","If pressed, repeat: 'I want to do this well, and right now I cannot give it what it deserves.'","Follow through on what you offered."], benefit:"Boundary-setting from a place of clarity rather than resentment activates collaborative brain states rather than defensive ones — in both you and the person receiving it." },
  { id:12, title:"Sleep Hygiene Protocol", category:"Recovery · Long-Term", duration:"Nightly", type:"guide", desc:"Sleep is the single most powerful recovery tool available. Chronic burnout is almost always accompanied by disrupted sleep. This protocol is designed to rebuild healthy sleep architecture.", steps:["Set a consistent sleep and wake time — even on weekends.","Stop screens 45 minutes before bed. Replace with reading, stretching, or conversation.","Keep your bedroom cool, dark, and quiet — temperature below 67F is optimal for sleep onset.","Avoid caffeine after 1pm and alcohol within 3 hours of bedtime.","If your mind races at night, do a 5-minute brain dump — write everything on your mind, then close the notebook.","If you wake at night, practice box breathing rather than checking your phone."], benefit:"Sleep is when the brain clears stress hormones and consolidates emotional regulation. Even one night of poor sleep increases amygdala reactivity by up to 60% the following day." },
];

const NEURO_TOOLS = [
  { id:1, title:"Meeting Opener: Name and Aim", category:"Meeting Practice · Opening", duration:"2 minutes", type:"guide", desc:"Begin each meeting by having each person state their name and one specific intention for the session. Primes the prefrontal cortex for focused engagement.", steps:["Open the meeting 2 minutes early.","Each person states: 'I am [name] and I am here to [specific intention].'","Keep it to one sentence each.","The facilitator closes with the shared goal of the meeting."], benefit:"Activates dopamine-driven goal circuitry, increasing focus and buy-in from the first minute." },
  { id:2, title:"The 60-Second Reset", category:"Meeting Practice · Opening", duration:"1 minute", type:"guide", desc:"A structured pause at the start of any meeting to transition from previous context. Reduces cognitive load and increases genuine presence.", steps:["Ask everyone to close laptops and put phones face down.","Lead one minute of silence or soft background sound.","Ask: 'What do you need to set aside to be fully here?'","Allow 15 seconds of silent acknowledgment.","Begin."], benefit:"Reduces cortisol carryover from prior tasks by up to 40%, significantly improving decision quality." },
  { id:3, title:"Affirmation Round", category:"Team Bonding · Weekly", duration:"5 minutes", type:"guide", desc:"Each team member briefly acknowledges one thing a colleague did well this week. Activates the brain's reward and social bonding circuitry.", steps:["Reserve 5 minutes at the end of a weekly meeting.","Go around — each person names one colleague and one specific action they appreciated.","No long speeches — one or two sentences only.","The named person simply says thank you."], benefit:"Releases oxytocin and serotonin, increasing psychological safety, trust, and team cohesion over time." },
  { id:4, title:"Energy Check-In", category:"Meeting Practice · Opening", duration:"2 minutes", type:"guide", desc:"A rapid, low-stakes check-in where team members rate their current energy on a 1 to 10 scale. Surfaces hidden burnout signals early and in real time.", steps:["At the start of the meeting, ask everyone to rate their energy: 1 (depleted) to 10 (energized).","Go around briefly — number only, no explanation required.","If the average is below 5, consider adjusting the meeting format or shortening it.","Leaders: log the average over time to track team energy trends."], benefit:"Creates psychological safety and gives managers real-time burnout signal data without requiring anyone to self-disclose vulnerably." },
  { id:5, title:"Two Truths and A Growth", category:"Team Bonding · Weekly", duration:"5 minutes", type:"guide", desc:"Each person shares two wins and one area of active growth. Builds authentic connection and normalizes a learning culture.", steps:["Each person shares two things that went well this week.","And one thing they are actively learning or improving.","No critique or commentary from others.","Rotate who goes first each week."], benefit:"Stimulates neuroplasticity-supporting reflection and normalizes growth mindset across the team." },
  { id:6, title:"Mindful Transition Ritual", category:"Meeting Practice · Closing", duration:"3 minutes", type:"guide", desc:"A short closing practice to help teams decompress before their next commitment. Prevents stress accumulation across back-to-back meetings.", steps:["In the final 3 minutes, stop the agenda.","Ask: 'What is one word that describes how you are leaving this meeting?'","Each person shares their word — no elaboration needed.","Close with: 'Thank you. Take a full breath before your next task.'"], benefit:"Reduces meeting-to-meeting stress accumulation and increases psychological closure, preventing emotional carryover." },
  { id:7, title:"Conflict De-Escalation Protocol", category:"Team Communication · As Needed", duration:"10 minutes", type:"guide", desc:"A structured framework for managers and team members to navigate interpersonal tension before it damages team trust or productivity. Based on Nonviolent Communication principles.", steps:["Pause the conversation if voices are raised or tension is high. Say: 'I want us to get this right. Can we take two minutes?'","Each person breathes and identifies what they are feeling — not what the other person did wrong.","Reopen with: 'What I need right now is...' rather than 'You always...'","The listener reflects back what they heard before responding: 'What I hear you saying is...'","Together agree on one concrete next step.","If unresolved, agree to revisit in 24 hours with a mediator if needed."], benefit:"Shifts communication from the reactive amygdala to the collaborative prefrontal cortex. Teams that use structured de-escalation protocols report 34% fewer recurring conflicts." },
  { id:8, title:"Psychological Safety Check", category:"Leadership · Quarterly", duration:"15 minutes", type:"guide", desc:"A self-assessment tool for leaders to evaluate the psychological safety level of their team — the single strongest predictor of team performance according to Google's Project Aristotle.", steps:["Rate your team honestly on each statement from 1 (never) to 5 (always):","'People on my team feel safe to speak up without fear of judgment.'","'Mistakes are treated as learning opportunities, not failures.'","'Every person's voice is heard equally in meetings.'","'People ask for help without hesitation.'","'Disagreement is welcomed and handled constructively.'","Score below 15: High priority. Score 15-20: Good foundation. Score 20-25: Strong culture.","Take one specific action this week based on your lowest-scoring statement."], benefit:"Psychological safety is the number one predictor of team performance, innovation, and retention. It is also the hardest to rebuild once lost — regular assessment prevents drift." },
  { id:9, title:"Appreciation Pause", category:"Team Bonding · Daily", duration:"1 minute", type:"guide", desc:"A micro-practice that takes 60 seconds and measurably improves team morale. One specific, sincere acknowledgment — delivered daily.", steps:["Before any meeting or at the start of the day, identify one person on your team.","Think of one specific thing they did recently that made a difference.","Tell them directly — in person, on a call, or in writing.","Be specific: not 'great job' but 'the way you handled that client call yesterday showed real composure.'","Do this every day for 30 days."], benefit:"Specific appreciation activates the brain's reward system more powerfully than general praise. Daily practice builds a culture of recognition that correlates with 31% lower voluntary turnover." },
  { id:10, title:"No-Meeting Recovery Block", category:"Workplace Design · Weekly", duration:"2 hours", type:"guide", desc:"A protected time block with no meetings, no Slack, no interruptions. Deep work and genuine cognitive recovery cannot happen in fragmented time.", steps:["Schedule a recurring 2-hour block on your calendar — ideally the same time each week.","Mark it as busy. Decline any meeting requests that overlap.","Use this time for your most cognitively demanding work, or for genuine rest if your energy is depleted.","Communicate to your team: 'This block is protected. I will respond to messages before and after.'","After 4 weeks, notice the difference in your output quality and stress levels."], benefit:"Fragmented attention is one of the primary drivers of workplace stress. Research shows it takes an average of 23 minutes to fully regain focus after an interruption. Protecting deep work time is one of the highest-leverage burnout prevention strategies available." },
  { id:11, title:"Feedback Framework: SBI", category:"Team Communication · Ongoing", duration:"5 minutes", type:"guide", desc:"Situation-Behavior-Impact. A simple, neuroscience-aligned feedback framework that makes difficult conversations less threatening and more effective.", steps:["Situation: Describe the specific situation factually. 'In yesterday's team meeting...'","Behavior: Describe the specific behavior you observed — not your interpretation of it. '...you interrupted three colleagues before they finished speaking.'","Impact: Describe the impact it had on you or the team. '...which made it harder for their ideas to be heard, and I noticed two people stopped contributing.'","Pause and invite a response: 'I wanted to share this because I value your contribution to this team. What are your thoughts?'","Listen fully before responding."], benefit:"SBI bypasses the brain's threat-detection system by removing blame and judgment from feedback. It activates collaborative rather than defensive neural responses in the receiver." },
  { id:12, title:"Team Resilience Retrospective", category:"Leadership · Monthly", duration:"20 minutes", type:"guide", desc:"A structured monthly team conversation that builds collective resilience by normalizing difficulty, celebrating adaptation, and identifying systemic stressors before they compound.", steps:["At the end of each month, hold a dedicated 20-minute retrospective.","Question 1: What was the hardest thing we navigated together this month?","Question 2: What did we do well under pressure?","Question 3: What would have made this month easier?","Question 4: What is one thing we want to do differently next month?","Document answers and revisit them the following month.","The leader goes first — modeling vulnerability creates permission for others."], benefit:"Collective resilience is built through shared meaning-making after difficulty. Teams that regularly debrief challenges show significantly higher cohesion, trust, and adaptive capacity over time." },
];

function getWeekLabel() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
  return `Week ${week} · ${now.getFullYear()}`;
}

function getRisk(s) { return s >= 7 ? "low" : s >= 5 ? "medium" : "high"; }
function getRiskLabel(s) { return s >= 7 ? "Low Risk" : s >= 5 ? "Medium Risk" : "High Risk"; }
function getRiskColor(s) { return s >= 7 ? "#5C7A5C" : s >= 5 ? "#C4956A" : "#A0522D"; }

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#F5F0EA;--bg2:#EDE8E0;--surface:#FDFCF9;--surface2:#F7F3ED;
  --ink:#2C2416;--soft:#6B5D4F;--faint:#B0A090;
  --accent:#5C7A5C;--alight:#EEF3EE;
  --amber:#8B6F47;--amlight:#F5EEE4;
  --warn:#C4956A;--wlight:#FBF3EA;
  --danger:#A0522D;--dlight:#F9EDE6;
  --border:#E2D9CE;--borderS:#C8BAA8;
  --sh:0 1px 3px rgba(44,36,22,.07);--shm:0 2px 8px rgba(44,36,22,.09);--shl:0 8px 32px rgba(44,36,22,.12);
  --r:6px;--rl:10px;--rxl:16px;
}
body{background:var(--bg);font-family:'DM Sans',system-ui,sans-serif;color:var(--ink);font-size:14px;line-height:1.5;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:var(--bg2);}
::-webkit-scrollbar-thumb{background:var(--borderS);border-radius:3px;}
.app{min-height:100vh;display:flex;flex-direction:column;}

/* AUTH */
.auth{min-height:100vh;display:flex;}
.auth-l{flex:1;background:var(--ink);display:flex;align-items:center;justify-content:center;padding:64px;position:relative;overflow:hidden;}
.auth-l::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(92,122,92,.25) 0%,transparent 60%),radial-gradient(ellipse at 80% 80%,rgba(139,111,71,.15) 0%,transparent 50%);}
.auth-brand{color:#fff;position:relative;z-index:1;}
.auth-logo{font-family:'DM Serif Display',serif;font-size:48px;color:#fff;letter-spacing:-1px;margin-bottom:14px;}
.auth-tag{font-size:16px;color:rgba(255,255,255,.6);max-width:300px;line-height:1.7;font-weight:300;margin-bottom:52px;}
.auth-feats{display:flex;flex-direction:column;gap:18px;}
.auth-feat{display:flex;align-items:flex-start;gap:14px;}
.auth-feat-ic{width:30px;height:30px;border-radius:7px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.auth-feat-txt strong{display:block;color:rgba(255,255,255,.85);font-size:13px;font-weight:500;margin-bottom:2px;}
.auth-feat-txt span{color:rgba(255,255,255,.4);font-size:12px;}
.auth-r{width:480px;background:var(--surface);display:flex;align-items:center;justify-content:center;padding:56px 48px;}
.auth-card{width:100%;}
.auth-title{font-family:'DM Serif Display',serif;font-size:26px;margin-bottom:4px;}
.auth-sub{color:var(--faint);font-size:13px;margin-bottom:32px;font-weight:300;}
.auth-tabs{display:flex;background:var(--bg2);border-radius:var(--rl);padding:4px;gap:4px;margin-bottom:28px;}
.auth-tab{flex:1;padding:8px;border:none;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;background:transparent;color:var(--soft);transition:all .2s;}
.auth-tab.on{background:var(--surface);color:var(--ink);box-shadow:var(--sh);}
.field{margin-bottom:15px;}
.field label{display:block;font-size:11px;font-weight:600;color:var(--soft);margin-bottom:5px;text-transform:uppercase;letter-spacing:.05em;}
.field input,.field select{width:100%;padding:9px 12px;border:1.5px solid var(--border);border-radius:var(--r);font-family:'DM Sans',sans-serif;font-size:14px;color:var(--ink);background:var(--surface2);outline:none;transition:all .15s;}
.field input:focus,.field select:focus{border-color:var(--accent);background:var(--surface);box-shadow:0 0 0 3px rgba(92,122,92,.1);}
.btn{width:100%;padding:11px 20px;background:var(--accent);color:#fff;border:none;border-radius:var(--r);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:background .15s;margin-top:8px;}
.btn:hover{background:#4A6741;}.btn:disabled{opacity:.5;cursor:not-allowed;}
.btn-out{padding:8px 18px;background:transparent;color:var(--accent);border:1.5px solid var(--accent);border-radius:var(--r);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;}
.btn-out:hover{background:var(--alight);}
.btn-dk{padding:10px 20px;background:var(--ink);color:#fff;border:none;border-radius:var(--r);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;}
.btn-dk:hover{opacity:.88;}
.msg-err{background:var(--dlight);color:var(--danger);padding:9px 13px;border-radius:var(--r);font-size:13px;margin-bottom:14px;border-left:3px solid var(--danger);}
.msg-ok{background:var(--alight);color:var(--accent);padding:9px 13px;border-radius:var(--r);font-size:13px;margin-bottom:14px;border-left:3px solid var(--accent);}
.stabs{display:flex;gap:8px;margin-bottom:14px;}
.stab{flex:1;padding:8px;border:1.5px solid var(--border);border-radius:var(--r);background:transparent;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;text-align:center;color:var(--soft);transition:all .15s;}
.stab.on{background:var(--accent);color:#fff;border-color:var(--accent);font-weight:600;}

/* NAV */
.nav{background:var(--ink);height:50px;display:flex;align-items:center;padding:0 22px;gap:14px;position:sticky;top:0;z-index:200;}
.nav-logo{font-family:'DM Serif Display',serif;font-size:21px;color:#fff;letter-spacing:-.5px;}
.nav-sep{width:1px;height:17px;background:rgba(255,255,255,.15);}
.nav-ctx{font-size:12px;color:rgba(255,255,255,.45);font-weight:300;}
.nav-r{margin-left:auto;display:flex;align-items:center;gap:12px;}
.nav-code{font-size:11px;color:rgba(255,255,255,.35);letter-spacing:.06em;}
.nav-code strong{color:rgba(255,255,255,.65);letter-spacing:.1em;}
.nav-av{width:28px;height:28px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;}
.nav-nm{font-size:12px;color:rgba(255,255,255,.6);}
.btn-nav{padding:4px 12px;background:transparent;border:1px solid rgba(255,255,255,.2);border-radius:var(--r);color:rgba(255,255,255,.6);font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;}
.btn-nav:hover{border-color:rgba(255,255,255,.4);color:#fff;}

/* LAYOUT */
.layout{display:flex;flex:1;min-height:0;}
.sb{width:200px;background:var(--surface);border-right:1px solid var(--border);padding:16px 0;flex-shrink:0;}
.sb-sec{font-size:10px;font-weight:700;color:var(--faint);text-transform:uppercase;letter-spacing:.1em;padding:0 18px 6px;margin-top:10px;}
.sb-sec:first-child{margin-top:0;}
.sb-item{display:flex;align-items:center;gap:9px;padding:8px 18px;font-size:13px;color:var(--soft);cursor:pointer;transition:all .1s;border-left:2px solid transparent;}
.sb-item:hover{background:var(--bg);color:var(--ink);}
.sb-item.on{background:var(--alight);color:var(--accent);border-left-color:var(--accent);font-weight:500;}
.sb-ic{width:16px;height:16px;flex-shrink:0;opacity:.65;}
.sb-item.on .sb-ic{opacity:1;}
.content{flex:1;overflow-y:auto;background:var(--bg);}

/* MAIN */
.main{padding:28px 30px;max-width:1280px;}
.ph{margin-bottom:22px;padding-bottom:18px;border-bottom:1px solid var(--border);}
.ph-title{font-family:'DM Serif Display',serif;font-size:25px;margin-bottom:3px;}
.ph-sub{font-size:13px;color:var(--faint);font-weight:300;}
.crumb{font-size:11px;color:var(--faint);margin-bottom:5px;}

/* CARDS */
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--rl);padding:20px;box-shadow:var(--sh);}
.card+.card{margin-top:14px;}
.ct{font-size:10px;font-weight:700;color:var(--faint);text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px;display:flex;align-items:center;gap:10px;}
.ct-line{flex:1;height:1px;background:var(--border);}

/* KPI */
.kgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px;}
.kpi{background:var(--surface);border:1px solid var(--border);border-radius:var(--rl);padding:18px 20px;box-shadow:var(--sh);position:relative;overflow:hidden;}
.kpi::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
.kpi.c1::after{background:var(--accent);}
.kpi.c2::after{background:var(--danger);}
.kpi.c3::after{background:var(--amber);}
.kpi.c4::after{background:#7A8C6E;}
.kpi-lb{font-size:10px;font-weight:700;color:var(--faint);text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px;}
.kpi-v{font-family:'DM Serif Display',serif;font-size:36px;line-height:1;margin-bottom:4px;}
.kpi-v small{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:300;color:var(--soft);}
.kpi-d{font-size:11px;color:var(--faint);}
.kpi-tr{font-size:11px;font-weight:500;margin-top:5px;}
.kpi-tr.pos{color:var(--accent);}.kpi-tr.neg{color:var(--danger);}

/* GRIDS */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px;}

/* TABLE */
.tw{overflow-x:auto;}
.tbl{width:100%;border-collapse:collapse;font-size:13px;}
.tbl th{text-align:left;font-size:10px;font-weight:700;color:var(--faint);text-transform:uppercase;letter-spacing:.07em;padding:8px 12px;border-bottom:1.5px solid var(--border);background:var(--surface2);}
.tbl td{padding:10px 12px;border-bottom:1px solid var(--border);}
.tbl tr:last-child td{border-bottom:none;}
.tbl tr:hover td{background:var(--surface2);}
.badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;}
.badge-dot{width:5px;height:5px;border-radius:50%;background:currentColor;}
.badge.low{background:var(--alight);color:var(--accent);}
.badge.medium{background:var(--wlight);color:var(--warn);}
.badge.high{background:var(--dlight);color:var(--danger);}
.sbar-row{display:flex;align-items:center;gap:7px;}
.sbar{flex:1;height:5px;background:var(--border);border-radius:3px;overflow:hidden;}
.sbar-f{height:100%;border-radius:3px;}
.sbar-v{font-size:11px;font-weight:600;min-width:22px;text-align:right;}

/* CHECKIN */
.ci-wrap{max-width:560px;margin:0 auto;padding:36px 20px;}
.ci-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--rxl);padding:36px;box-shadow:var(--shm);}
.ci-wk{font-size:10px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;}
.ci-title{font-family:'DM Serif Display',serif;font-size:24px;margin-bottom:4px;}
.ci-sub{font-size:13px;color:var(--faint);font-weight:300;margin-bottom:28px;}
.ci-prog{display:flex;gap:4px;margin-bottom:28px;}
.ci-step{flex:1;height:3px;background:var(--border);border-radius:2px;transition:background .25s;}
.ci-step.done{background:var(--accent);}
.ci-step.cur{background:var(--accent);opacity:.4;}
.ci-qn{font-size:10px;font-weight:700;color:var(--faint);text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px;}
.ci-q{font-size:18px;font-weight:500;color:var(--ink);margin-bottom:6px;line-height:1.4;}
.ci-hint{font-size:13px;color:var(--faint);font-weight:300;margin-bottom:24px;}
.ci-sl{display:flex;align-items:center;gap:10px;margin-bottom:7px;}
.ci-sl input[type=range]{flex:1;-webkit-appearance:none;height:4px;background:var(--border);border-radius:2px;outline:none;cursor:pointer;}
.ci-sl input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--accent);cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.2);border:2px solid #fff;}
.ci-sc{font-family:'DM Serif Display',serif;font-size:38px;min-width:44px;text-align:center;line-height:1;}
.ci-scl{display:flex;justify-content:space-between;font-size:11px;color:var(--faint);margin-bottom:28px;}
.ci-nav{display:flex;justify-content:space-between;align-items:center;}
.ci-done{text-align:center;padding:36px 0;}
.ci-check{width:60px;height:60px;border-radius:50%;background:var(--alight);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;}
.ci-done h2{font-family:'DM Serif Display',serif;font-size:24px;margin-bottom:8px;}
.ci-done p{font-size:14px;color:var(--soft);line-height:1.65;font-weight:300;}
.ci-tip{margin-top:22px;padding:13px 16px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--rl);font-size:13px;color:var(--soft);text-align:left;line-height:1.5;}

/* TOOLS */
.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px;}
.tc{background:var(--surface);border:1px solid var(--border);border-radius:var(--rl);padding:20px;cursor:pointer;transition:all .15s;}
.tc:hover{border-color:var(--accent);box-shadow:var(--shm);transform:translateY(-1px);}
.tc-cat{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--amber);margin-bottom:7px;}
.tc-title{font-size:15px;font-weight:600;margin-bottom:5px;}
.tc-desc{font-size:13px;color:var(--soft);line-height:1.55;margin-bottom:13px;font-weight:300;}
.tc-benefit{font-size:12px;color:var(--accent);background:var(--alight);border-radius:var(--r);padding:8px 11px;margin-top:10px;line-height:1.45;display:none;}
.tc.exp .tc-benefit{display:block;}
.tc-meta{display:flex;align-items:center;justify-content:space-between;}
.tc-dur{font-size:12px;color:var(--faint);}
.tc-btns{display:flex;gap:7px;}
.tc-btn{font-size:12px;font-weight:600;padding:4px 11px;border-radius:20px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;}
.tc-btn.why{background:var(--surface2);color:var(--soft);}
.tc-btn.open{background:var(--alight);color:var(--accent);}

/* MODAL */
.modal-bg{position:fixed;inset:0;background:rgba(44,36,22,.5);display:flex;align-items:center;justify-content:center;z-index:500;padding:20px;backdrop-filter:blur(2px);}
.modal{background:var(--surface);border-radius:var(--rxl);padding:34px;max-width:460px;width:100%;box-shadow:var(--shl);max-height:90vh;overflow-y:auto;}
.m-cat{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--amber);margin-bottom:7px;}
.m-title{font-family:'DM Serif Display',serif;font-size:22px;margin-bottom:8px;}
.m-desc{font-size:13px;color:var(--soft);line-height:1.6;margin-bottom:20px;font-weight:300;}
.m-steps{list-style:none;margin-bottom:18px;}
.m-step{display:flex;gap:11px;padding:9px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--soft);line-height:1.5;}
.m-step:last-child{border-bottom:none;}
.m-num{width:20px;height:20px;border-radius:50%;background:var(--accent);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;}
.m-benefit{background:var(--alight);border-radius:var(--r);padding:11px 13px;font-size:13px;color:var(--accent);line-height:1.45;margin-bottom:20px;}
.m-benefit strong{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;opacity:.6;}
.m-actions{display:flex;justify-content:flex-end;gap:9px;}

/* BREATH */
.br-circle{width:150px;height:150px;border-radius:50%;background:var(--alight);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;margin:22px auto;font-size:14px;font-weight:500;color:var(--accent);transition:transform 1s ease;}
.br-circle.in{transform:scale(1.28);}
.br-circle.out{transform:scale(1);}

/* LOADING */
.loading{display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:12px;background:var(--bg);}
.spin{width:26px;height:26px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .85s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.spin-lb{font-size:13px;color:var(--faint);font-weight:300;}
.empty{text-align:center;padding:60px 20px;}
.empty-t{font-family:'DM Serif Display',serif;font-size:20px;margin-bottom:7px;}
.empty-s{font-size:13px;color:var(--faint);font-weight:300;line-height:1.6;}

@media(max-width:880px){
  .auth-l{display:none;}.auth-r{width:100%;padding:40px 28px;}
  .kgrid{grid-template-columns:1fr 1fr;}
  .g2,.g3{grid-template-columns:1fr;}
  .sb{display:none;}
  .main{padding:18px;}
}
`;

const el = document.createElement("style");
el.textContent = CSS;
document.head.appendChild(el);

export default function App() {
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
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
      if (error) console.error("Profile error:", error);
      if (data) {
        setProfile(data);
      } else {
        // Profile missing — sign out so user can re-register cleanly
        await supabase.auth.signOut();
      }
    } catch(e) {
      console.error("loadProfile failed:", e);
      await supabase.auth.signOut();
    }
    setLoading(false);
  }

  if (loading) return <div className="loading"><div className="spin"/><div className="spin-lb">Loading WellPulse</div></div>;
  if (!session) return <AuthScreen />;
  if (!profile) return <div className="loading"><div className="spin"/><div className="spin-lb">Setting up your workspace</div></div>;
  if (profile.is_super_admin) return <SuperAdminApp user={profile} onLogout={() => supabase.auth.signOut()} />;
  if (profile.role === "leadership") return <AccessGate user={profile}><LeadershipApp user={profile} onLogout={() => supabase.auth.signOut()} /></AccessGate>;
  return <AccessGate user={profile}><EmployeeApp user={profile} onLogout={() => supabase.auth.signOut()} /></AccessGate>;
}

const TierContext = React.createContext("insights");

function AccessGate({ user, children }) {
  const [status, setStatus] = useState("loading");
  const [trialDays, setTrialDays] = useState(null);
  const [plan, setPlan] = useState(null);
  const [tier, setTier] = useState("insights");

  useEffect(() => {
    async function checkAccess() {
      if (!user.company_code) { setStatus("active"); return; }
      const { data } = await supabase.from("companies").select("status, plan, tier, trial_ends_at").eq("code", user.company_code).maybeSingle();
      if (!data) { setStatus("active"); return; }
      setPlan(data.plan);
      setTier(data.tier || "insights");
      if (data.status === "trial" && data.trial_ends_at) {
        const days = Math.ceil((new Date(data.trial_ends_at) - new Date()) / 86400000);
        if (days <= 0) { setStatus("expired"); return; }
        setTrialDays(days);
      }
      setStatus(data.status || "active");
    }
    checkAccess();
  }, []);

  if (status === "loading") return <div className="loading"><div className="spin"/><div className="spin-lb">Verifying access</div></div>;

  if (status === "paused") return (
    <div className="loading" style={{flexDirection:"column",gap:16,textAlign:"center",padding:40}}>
      <div style={{width:56,height:56,borderRadius:"50%",background:"var(--wlight)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto"}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4956A" strokeWidth="2" strokeLinecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
      </div>
      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:24,color:"var(--ink)"}}>Account Paused</div>
      <div style={{fontSize:14,color:"var(--soft)",maxWidth:380,lineHeight:1.7,fontWeight:300}}>Your WellPulse account has been temporarily paused. Please contact your administrator or reach out to <strong>Miranda@wildbloomwellnesshouse.com</strong> to restore access.</div>
      <button style={{marginTop:8,padding:"10px 24px",background:"transparent",border:"1.5px solid var(--border)",borderRadius:6,fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer",color:"var(--soft)"}} onClick={() => supabase.auth.signOut()}>Sign Out</button>
      <div style={{marginTop:40,fontSize:11,color:"var(--faint)"}}>Powered by Wild Bloom Wellness House</div>
    </div>
  );

  if (status === "cancelled" || status === "expired") return (
    <div className="loading" style={{flexDirection:"column",gap:16,textAlign:"center",padding:40}}>
      <div style={{width:56,height:56,borderRadius:"50%",background:"var(--dlight)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto"}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A0522D" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:24,color:"var(--ink)"}}>{status === "expired" ? "Trial Expired" : "Subscription Ended"}</div>
      <div style={{fontSize:14,color:"var(--soft)",maxWidth:380,lineHeight:1.7,fontWeight:300}}>{status === "expired" ? "Your free trial has ended." : "Your WellPulse subscription is no longer active."} To continue supporting your team's wellness, please contact <strong>Miranda@wildbloomwellnesshouse.com</strong> to renew.</div>
      <button style={{marginTop:8,padding:"10px 24px",background:"transparent",border:"1.5px solid var(--border)",borderRadius:6,fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer",color:"var(--soft)"}} onClick={() => supabase.auth.signOut()}>Sign Out</button>
      <div style={{marginTop:40,fontSize:11,color:"var(--faint)"}}>Powered by Wild Bloom Wellness House</div>
    </div>
  );

  return (
    <TierContext.Provider value={tier}>
      {status === "trial" && trialDays !== null && (
        <div style={{background:"#FBF3EA",borderBottom:"1px solid #E8D5B7",padding:"8px 24px",fontSize:12,color:"#8B6F47",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span>Free trial — <strong>{trialDays} day{trialDays !== 1 ? "s" : ""} remaining</strong>. Contact Miranda@wildbloomwellnesshouse.com to subscribe.</span>
        </div>
      )}
      {children}
    </TierContext.Provider>
  );
}

function SuperAdminApp({ user, onLogout }) {
  const [page, setPage] = useState("companies");
  const [companies, setCompanies] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data } = await supabase.from("company_stats").select("*").order("created_at", { ascending: false });
    const { data: reqs } = await supabase.from("support_requests").select("*").order("created_at", { ascending: false });
    setCompanies(data || []);
    setSupportRequests(reqs || []);
    setLoading(false);
  }

  async function updateStatus(code, status, plan) {
    await supabase.from("companies").update({ status, plan }).eq("code", code);
    loadData();
  }

  async function updateTier(code, tier) {
    await supabase.from("companies").update({ tier }).eq("code", code);
    loadData();
  }

  const nav = [
    { id:"companies", label:"All Companies", d:<><path d="M3 21h18M6 21V7a1 1 0 011-1h10a1 1 0 011 1v14M9 21v-4a1 1 0 011-1h4a1 1 0 011 1v4"/></> },
    { id:"activity", label:"Platform Activity", d:<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></> },
    { id:"support", label:"Support Requests", d:<><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></> },
    { id:"pricing", label:"Pricing Tiers", d:<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></> },
  ];

  const totalCompanies = companies.length;
  const totalEmployees = companies.reduce((a,b) => a + (b.employee_count||0), 0);
  const totalCheckins = companies.reduce((a,b) => a + (b.total_checkins||0), 0);
  const avgWellness = companies.length ? (companies.reduce((a,b) => a + (parseFloat(b.avg_wellness_score)||0), 0) / companies.length).toFixed(1) : 0;

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo">WellPulse</div>
        <div className="nav-sep"/>
        <div className="nav-ctx">Owner Dashboard</div>
        <div style={{marginLeft:8,background:"#5C7A5C",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,letterSpacing:".06em",textTransform:"uppercase"}}>Super Admin</div>
        <div className="nav-r">
          <div className="nav-av">{user.name?.[0]?.toUpperCase()}</div>
          <div className="nav-nm">{user.name}</div>
          <button className="btn-nav" onClick={onLogout}>Sign out</button>
        </div>
      </nav>
      <div className="layout">
        <div className="sb">
          <div className="sb-sec">Owner</div>
          {nav.map(item=>(
            <div key={item.id} className={"sb-item "+(page===item.id?"on":"")} onClick={()=>setPage(item.id)}>
              <svg className="sb-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.d}</svg>
              {item.label}
            </div>
          ))}
        </div>
        <div className="content">
          {loading ? <div className="loading"><div className="spin"/></div> : (
            <>
              {page==="companies" && (
                <div className="main">
                  <div className="ph">
                    <div className="crumb">WellPulse · Owner Dashboard</div>
                    <div className="ph-title">All Companies</div>
                    <div className="ph-sub">Every company currently using the WellPulse platform</div>
                  </div>

                  <div className="kgrid">
                    <div className="kpi c1">
                      <div className="kpi-lb">Companies</div>
                      <div className="kpi-v">{totalCompanies}</div>
                      <div className="kpi-d">Active on platform</div>
                    </div>
                    <div className="kpi c3">
                      <div className="kpi-lb">Total Employees</div>
                      <div className="kpi-v">{totalEmployees}</div>
                      <div className="kpi-d">Registered users</div>
                    </div>
                    <div className="kpi c4">
                      <div className="kpi-lb">Total Check-Ins</div>
                      <div className="kpi-v">{totalCheckins}</div>
                      <div className="kpi-d">Across all companies</div>
                    </div>
                    <div className="kpi c1">
                      <div className="kpi-lb">Avg Wellness Score</div>
                      <div className="kpi-v" style={{color:getRiskColor(parseFloat(avgWellness))}}>{avgWellness}<small>/10</small></div>
                      <div className="kpi-d">Platform-wide</div>
                    </div>
                  </div>

                  {companies.length === 0 ? (
                    <div className="card">
                      <div className="empty">
                        <div className="empty-t">No companies yet</div>
                        <div className="empty-s">Companies will appear here once they register and create their workspace on WellPulse.</div>
                      </div>
                    </div>
                  ) : (
                    <div className="card">
                      <div className="ct">Company Overview <div className="ct-line"/></div>
                      <div className="tw">
                        <table className="tbl">
                          <thead>
                            <tr>
                              <th>Company Name</th>
                              <th>Code</th>
                              <th>Plan</th>
                              <th>Tier</th>
                              <th>Status</th>
                              <th>Employees</th>
                              <th>Check-Ins</th>
                              <th>Wellness</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {companies.map(c => {
                              const score = parseFloat(c.avg_wellness_score) || 0;
                              const statusColor = c.status==="active"?"#5C7A5C":c.status==="trial"?"#C4956A":c.status==="paused"?"#8B6F47":"#A0522D";
                              const statusBg = c.status==="active"?"var(--alight)":c.status==="trial"?"var(--wlight)":c.status==="paused"?"var(--amlight)":"var(--dlight)";
                              return (
                                <tr key={c.id}>
                                  <td style={{fontWeight:600}}>{c.name}</td>
                                  <td><span style={{fontFamily:"monospace",background:"var(--bg2)",padding:"2px 8px",borderRadius:4,fontSize:11,letterSpacing:2,fontWeight:700,color:"var(--accent)"}}>{c.code}</span></td>
                                  <td><span style={{fontSize:11,fontWeight:600,color:"var(--soft)",textTransform:"capitalize"}}>{c.plan||"trial"}</span></td>
                                  <td>
                                    <span style={{fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:20,background:c.tier==="support"?"var(--ink)":"var(--surface2)",color:c.tier==="support"?"#fff":"var(--soft)"}}>
                                      {c.tier==="support"?"Insights + Support":"Insights"}
                                    </span>
                                  </td>
                                  <td><span style={{fontSize:11,fontWeight:700,background:statusBg,color:statusColor,padding:"2px 9px",borderRadius:20,textTransform:"capitalize"}}>{c.status||"active"}</span></td>
                                  <td>{c.employee_count||0}</td>
                                  <td>{c.total_checkins||0}</td>
                                  <td>{score>0?<span style={{fontWeight:600,color:getRiskColor(score)}}>{score}/10</span>:<span style={{color:"var(--faint)",fontSize:11}}>—</span>}</td>
                                  <td>
                                    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                                      {c.status!=="active" && <button onClick={()=>updateStatus(c.code,"active","paid")} style={{fontSize:11,padding:"3px 8px",background:"var(--alight)",color:"var(--accent)",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Activate</button>}
                                      {c.status!=="trial" && <button onClick={()=>updateStatus(c.code,"trial","trial")} style={{fontSize:11,padding:"3px 8px",background:"var(--wlight)",color:"var(--warn)",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Trial</button>}
                                      {c.status!=="paused" && <button onClick={()=>updateStatus(c.code,"paused",c.plan)} style={{fontSize:11,padding:"3px 8px",background:"var(--amlight)",color:"var(--amber)",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Pause</button>}
                                      {c.status!=="cancelled" && <button onClick={()=>{ if(window.confirm("Cancel "+c.name+"? They will lose all access.")) updateStatus(c.code,"cancelled",c.plan); }} style={{fontSize:11,padding:"3px 8px",background:"var(--dlight)",color:"var(--danger)",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>}
                                      <div style={{width:"100%",height:4}}/>
                                      {c.tier!=="support" && <button onClick={()=>updateTier(c.code,"support")} style={{fontSize:11,padding:"3px 8px",background:"var(--ink)",color:"#fff",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>↑ Upgrade</button>}
                                      {c.tier==="support" && <button onClick={()=>updateTier(c.code,"insights")} style={{fontSize:11,padding:"3px 8px",background:"var(--surface2)",color:"var(--soft)",border:"1px solid var(--border)",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>↓ Downgrade</button>}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {page==="support" && (
                <div className="main">
                  <div className="ph">
                    <div className="crumb">WellPulse · Support Requests</div>
                    <div className="ph-title">Support Requests</div>
                    <div className="ph-sub">Anonymous requests from employees who need coaching support</div>
                  </div>

                  <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
                    <div className="kpi c1">
                      <div className="kpi-lb">Total Requests</div>
                      <div className="kpi-v">{supportRequests.length}</div>
                      <div className="kpi-d">All time</div>
                    </div>
                    <div className="kpi c2">
                      <div className="kpi-lb">Pending</div>
                      <div className="kpi-v" style={{color:"#C4956A"}}>{supportRequests.filter(r=>r.status==="pending").length}</div>
                      <div className="kpi-d">Need follow-up</div>
                    </div>
                    <div className="kpi c4">
                      <div className="kpi-lb">Resolved</div>
                      <div className="kpi-v" style={{color:"#5C7A5C"}}>{supportRequests.filter(r=>r.status==="resolved").length}</div>
                      <div className="kpi-d">Completed</div>
                    </div>
                  </div>

                  {supportRequests.length === 0 ? (
                    <div className="card">
                      <div className="empty">
                        <div className="empty-t">No support requests yet</div>
                        <div className="empty-s">When employees with low wellness scores request support, they will appear here anonymously. You can then follow up with their company's HR team to arrange confidential coaching.</div>
                      </div>
                    </div>
                  ) : (
                    <div className="card">
                      <div className="ct">Anonymous Support Requests <div className="ct-line"/></div>
                      <div style={{background:"var(--alight)",border:"1px solid var(--accent)",borderRadius:"var(--r)",padding:"10px 14px",marginBottom:16,fontSize:13,color:"var(--accent)",fontWeight:300,lineHeight:1.5}}>
                        <strong>Privacy notice:</strong> All requests are anonymous. No employee names are stored. Follow up by contacting the company's HR administrator using their company code.
                      </div>
                      <table className="tbl">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Company Code</th>
                            <th>Department</th>
                            <th>Week</th>
                            <th>Wellness Score</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {supportRequests.map(r=>(
                            <tr key={r.id}>
                              <td style={{fontSize:12,color:"var(--soft)"}}>{new Date(r.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</td>
                              <td><span style={{fontFamily:"monospace",background:"var(--bg2)",padding:"2px 8px",borderRadius:4,fontSize:11,letterSpacing:2,fontWeight:700,color:"var(--accent)"}}>{r.company_code}</span></td>
                              <td>{r.department||"—"}</td>
                              <td style={{fontSize:12,color:"var(--soft)"}}>{r.week}</td>
                              <td><span style={{fontWeight:700,color:getRiskColor(r.wellness_score||0)}}>{r.wellness_score}/10</span></td>
                              <td>
                                <span style={{fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:20,background:r.status==="resolved"?"var(--alight)":"var(--wlight)",color:r.status==="resolved"?"var(--accent)":"var(--warn)"}}>
                                  {r.status==="resolved"?"Resolved":"Pending"}
                                </span>
                              </td>
                              <td>
                                {r.status==="pending" && (
                                  <button onClick={async()=>{ await supabase.from("support_requests").update({status:"resolved"}).eq("id",r.id); loadData(); }} style={{fontSize:11,padding:"3px 10px",background:"var(--alight)",color:"var(--accent)",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>
                                    Mark Resolved
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              {page==="pricing" && (
                <div className="main">
                  <div className="ph">
                    <div className="crumb">WellPulse · Pricing Tiers</div>
                    <div className="ph-title">Pricing Tiers</div>
                    <div className="ph-sub">Two tiers — manage which companies have access to each</div>
                  </div>
                  <div className="g2" style={{marginBottom:16}}>
                    <div className="card" style={{border:"2px solid var(--border)"}}>
                      <div style={{marginBottom:16}}>
                        <div style={{fontSize:10,fontWeight:700,color:"var(--faint)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Tier 1</div>
                        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:"var(--ink)",marginBottom:4}}>Insights</div>
                        <div style={{fontSize:13,color:"var(--soft)",fontWeight:300,marginBottom:3}}>Analytics, wellness tracking, and group coaching</div>
                        <div style={{fontSize:11,color:"var(--faint)",fontWeight:300}}>Powered by Wild Bloom Wellness House</div>
                      </div>
                      <div style={{height:1,background:"var(--border)",marginBottom:14}}/>
                      <div style={{fontSize:10,fontWeight:700,color:"var(--faint)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Platform</div>
                      {["Weekly 5-question check-ins","Leadership dashboard","Department risk scores","Weekly and monthly trends","Burnout risk classification","Wellness toolkit for employees","Export reports","Company access code"].map(f=>(
                        <div key={f} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5C7A5C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          <span style={{fontSize:13,color:"var(--soft)",fontWeight:300}}>{f}</span>
                        </div>
                      ))}
                      <div style={{height:1,background:"var(--border)",margin:"12px 0"}}/>
                      <div style={{fontSize:10,fontWeight:700,color:"var(--faint)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Coaching Services Included</div>
                      {["Wild Bloom coaching connection","Manager coaching support","Team workshop facilitation","Nervous system training for teams"].map(f=>(
                        <div key={f} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8B6F47" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          <span style={{fontSize:13,color:"var(--ink)",fontWeight:500}}>{f}</span>
                        </div>
                      ))}
                      <div style={{height:1,background:"var(--border)",margin:"12px 0"}}/>
                      <div style={{fontSize:10,fontWeight:700,color:"var(--faint)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Not Included</div>
                      {["1-on-1 confidential employee coaching","Anonymous employee support requests"].map(f=>(
                        <div key={f} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C8BAA8" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          <span style={{fontSize:13,color:"var(--faint)",fontWeight:300}}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="card" style={{border:"2px solid var(--ink)"}}>
                      <div style={{marginBottom:16}}>
                        <div style={{fontSize:10,fontWeight:700,color:"var(--accent)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Tier 2</div>
                        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:"var(--ink)",marginBottom:4}}>Insights + Support</div>
                        <div style={{fontSize:13,color:"var(--soft)",fontWeight:300}}>Full platform with coaching connection</div>
                      </div>
                      <div style={{height:1,background:"var(--border)",marginBottom:16}}/>
                      {["Everything in Insights","Employee support request button","Anonymous support tracking","Low score auto-prompt","Wild Bloom coaching connection","1-on-1 confidential coaching access","Manager coaching support","Team workshop facilitation"].map((f,i)=>(
                        <div key={f} style={{display:"flex",gap:10,alignItems:"center",marginBottom:9}}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={i<4?"#5C7A5C":"#8B6F47"} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          <span style={{fontSize:13,color:i<4?"var(--soft)":"var(--ink)",fontWeight:i<4?300:500}}>{f}</span>
                        </div>
                      ))}
                      <div style={{marginTop:16,padding:"10px 14px",background:"var(--alight)",borderRadius:"var(--r)",fontSize:12,color:"var(--accent)",fontWeight:400}}>Includes Wild Bloom Wellness House coaching services.</div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="ct">Current Company Tiers <div className="ct-line"/></div>
                    <table className="tbl">
                      <thead><tr><th>Company</th><th>Code</th><th>Current Tier</th><th>Change Tier</th></tr></thead>
                      <tbody>
                        {companies.map(c=>(
                          <tr key={c.id}>
                            <td style={{fontWeight:500}}>{c.name}</td>
                            <td><span style={{fontFamily:"monospace",background:"var(--bg2)",padding:"2px 8px",borderRadius:4,fontSize:11,letterSpacing:2,fontWeight:700,color:"var(--accent)"}}>{c.code}</span></td>
                            <td><span style={{fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:20,background:c.tier==="support"?"var(--ink)":"var(--surface2)",color:c.tier==="support"?"#fff":"var(--soft)"}}>{c.tier==="support"?"Insights + Support":"Insights"}</span></td>
                            <td>
                              <div style={{display:"flex",gap:8}}>
                                {c.tier!=="support" && <button onClick={()=>updateTier(c.code,"support")} style={{fontSize:12,padding:"5px 14px",background:"var(--ink)",color:"#fff",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>↑ Upgrade to Support</button>}
                                {c.tier==="support" && <button onClick={()=>updateTier(c.code,"insights")} style={{fontSize:12,padding:"5px 14px",background:"var(--surface2)",color:"var(--soft)",border:"1px solid var(--border)",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>↓ Downgrade to Insights</button>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {page==="activity" && (
                <div className="main">
                  <div className="ph">
                    <div className="crumb">WellPulse · Platform Activity</div>
                    <div className="ph-title">Platform Activity</div>
                    <div className="ph-sub">Usage and engagement across all companies</div>
                  </div>
                  <div className="card">
                    <div className="ct">Company Wellness Comparison <div className="ct-line"/></div>
                    {companies.length === 0 ? (
                      <div className="empty"><div className="empty-t">No data yet</div></div>
                    ) : (
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={companies.map(c=>({ name:c.name, Score:parseFloat(c.avg_wellness_score)||0, Employees:c.employee_count||0, CheckIns:c.total_checkins||0 }))} margin={{top:5,right:16,left:0,bottom:5}}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" vertical={false}/>
                          <XAxis dataKey="name" tick={{fontSize:11,fill:"#6B5D4F"}}/>
                          <YAxis tick={{fontSize:11,fill:"#6B5D4F"}}/>
                          <Tooltip contentStyle={{borderRadius:6,border:"1px solid #E2D9CE",background:"#FDFCF9",fontSize:12}}/>
                          <Legend iconType="circle" iconSize={7} formatter={v=><span style={{fontSize:11,color:"#6B5D4F"}}>{v}</span>}/>
                          <Bar dataKey="Score" fill="#5C7A5C" radius={[3,3,0,0]} name="Wellness Score"/>
                          <Bar dataKey="Employees" fill="#8B6F47" radius={[3,3,0,0]} name="Employees"/>
                          <Bar dataKey="CheckIns" fill="#7A8C6E" radius={[3,3,0,0]} name="Check-Ins"/>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="card" style={{marginTop:14}}>
                    <div className="ct">Platform Summary <div className="ct-line"/></div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,padding:"8px 0"}}>
                      {[
                        ["Total Companies", totalCompanies, "Organizations using WellPulse"],
                        ["Total Employees", totalEmployees, "Registered across all companies"],
                        ["Total Check-Ins", totalCheckins, "Wellness surveys completed"],
                        ["Platform Avg Score", avgWellness+"/10", "Overall wellness across platform"],
                      ].map(([label,val,desc])=>(
                        <div key={label} style={{padding:"16px 0",borderBottom:"1px solid var(--border)"}}>
                          <div style={{fontSize:10,fontWeight:700,color:"var(--faint)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:6}}>{label}</div>
                          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:28,color:"var(--ink)",marginBottom:3}}>{val}</div>
                          <div style={{fontSize:12,color:"var(--faint)",fontWeight:300}}>{desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AuthScreen() {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", department:"Engineering", role:"employee", companyCode:"", companyName:"" });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [st, setSt] = useState("join");

  async function login(e) {
    e.preventDefault(); setError(""); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (error) setError(error.message);
    setBusy(false);
  }

  async function register(e) {
    e.preventDefault(); setError(""); setBusy(true);
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); setBusy(false); return; }
    let code = form.companyCode?.toUpperCase();
    if (form.role === "leadership" && st === "create") code = Math.random().toString(36).substring(2,8).toUpperCase();
    const { data, error } = await supabase.auth.signUp({ email:form.email, password:form.password, options:{ data:{ name:form.name, department:form.department, role:form.role, company_code:code } } });
    if (error) { setError(error.message); setBusy(false); return; }
    if (data.user) {
      await supabase.from("profiles").upsert({ id:data.user.id, name:form.name, department:form.department, role:form.role, company_code:code });
      if (form.role === "leadership" && st === "create") await supabase.from("companies").insert({ name:form.companyName||"My Company", code, admin_id:data.user.id });
      setMsg("Account created. You can now sign in."); setTab("login");
    }
    setBusy(false);
  }

  return (
    <div className="auth">
      <div className="auth-l">
        <div className="auth-brand">
          <div className="auth-logo">WellPulse</div>
          <div className="auth-tag">Workplace wellness intelligence for teams that care about their people.</div>
          <div className="auth-feats">
            {[["Burnout Risk Tracking","Real-time department-level monitoring"],["Weekly Check-Ins","Five-question pulse surveys. Two minutes."],["Prevention Toolkit","Evidence-based stress and clarity tools"],["Trend Reporting","Weekly and monthly wellness analytics"]].map(([t,s])=>(
              <div className="auth-feat" key={t}>
                <div className="auth-feat-ic"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
                <div className="auth-feat-txt"><strong>{t}</strong><span>{s}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="auth-r">
        <div className="auth-card">
          <div className="auth-title">Welcome back</div>
          <div className="auth-sub">Sign in to your WellPulse workspace</div>
          <div className="auth-tabs">
            <button className={`auth-tab ${tab==="login"?"on":""}`} onClick={()=>{setTab("login");setError("");setMsg("");}}>Sign In</button>
            <button className={`auth-tab ${tab==="reg"?"on":""}`} onClick={()=>{setTab("reg");setError("");setMsg("");}}>Register</button>
          </div>
          {error && <div className="msg-err">{error}</div>}
          {msg && <div className="msg-ok">{msg}</div>}
          {tab === "login" ? (
            <form onSubmit={login}>
              <div className="field"><label>Email address</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com" required/></div>
              <div className="field"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter your password" required/></div>
              <button className="btn" type="submit" disabled={busy}>{busy?"Signing in...":"Sign In"}</button>
            </form>
          ) : (
            <form onSubmit={register}>
              <div className="field"><label>Full Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Jane Smith" required/></div>
              <div className="field"><label>Work Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com" required/></div>
              <div className="field"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Minimum 6 characters" required/></div>
              <div className="field"><label>Department</label><select value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>{DEPTS.map(d=><option key={d}>{d}</option>)}</select></div>
              <div className="field"><label>I am a</label><select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="employee">Employee</option><option value="leadership">Leader / Administrator</option></select></div>
              {form.role === "leadership" ? (
                <>
                  <div className="stabs">
                    <button type="button" className={`stab ${st==="join"?"on":""}`} onClick={()=>setSt("join")}>Join a Company</button>
                    <button type="button" className={`stab ${st==="create"?"on":""}`} onClick={()=>setSt("create")}>Create a Company</button>
                  </div>
                  {st==="join" ? <div className="field"><label>Company Code</label><input value={form.companyCode} onChange={e=>setForm({...form,companyCode:e.target.value})} placeholder="e.g. ABC123"/></div>
                  : <div className="field"><label>Company Name</label><input value={form.companyName} onChange={e=>setForm({...form,companyName:e.target.value})} placeholder="Acme Corporation"/></div>}
                </>
              ) : (
                <div className="field"><label>Company Code</label><input value={form.companyCode} onChange={e=>setForm({...form,companyCode:e.target.value})} placeholder="Provided by your administrator"/></div>
              )}
              <button className="btn" type="submit" disabled={busy}>{busy?"Creating account...":"Create Account"}</button>
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
    supabase.from("checkins").select("*").eq("company_code", user.company_code || "").order("created_at",{ascending:true})
      .then(({data})=>{ setCheckins(data||[]); setLoading(false); });
  }, []);

  const analyticsNav = [
    { id:"dashboard", label:"Overview", d:<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></> },
    { id:"departments", label:"Departments", d:<><path d="M3 21h18M6 21V7a1 1 0 011-1h10a1 1 0 011 1v14M9 21v-4a1 1 0 011-1h4a1 1 0 011 1v4"/></> },
    { id:"trends", label:"Trends", d:<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></> },
    { id:"reports", label:"Reports", d:<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></> },
  ];
  const toolsNav = [
    { id:"stress", label:"Stress Management", d:<><path d="M17 8C8 10 5.9 16.17 3.82 19.34c-.2.3.1.66.44.55C5.77 19.26 8.15 18.31 10 17"/><path d="M14 2s1 2 1 4-2 4-2 4"/></> },
    { id:"neuro", label:"Team Practices", d:<><path d="M12 5a3 3 0 10-5.997.125 4 4 0 00-2.526 5.77 4 4 0 00.556 6.588A4 4 0 1012 18"/><path d="M12 5a3 3 0 115.997.125 4 4 0 012.526 5.77 4 4 0 01-.556 6.588A4 4 0 1112 18"/></> },
  ];
  const companyNav = [
    { id:"company", label:"Company Settings", d:<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></> },
  ];

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo">WellPulse</div>
        <div className="nav-sep"/>
        <div className="nav-ctx">Leadership Portal</div>
        <div className="nav-r">
          {user.company_code && <div className="nav-code">Company Code <strong>{user.company_code}</strong></div>}
          <div className="nav-av">{user.name?.[0]?.toUpperCase()}</div>
          <div className="nav-nm">{user.name}</div>
          <button className="btn-nav" onClick={onLogout}>Sign out</button>
        </div>
      </nav>
      <div className="layout">
        <div className="sb" style={{display:"flex",flexDirection:"column"}}>
          <div style={{flex:1}}>
          <div className="sb-sec">Analytics</div>
          {analyticsNav.map(item=>(
            <div key={item.id} className={"sb-item "+(page===item.id?"on":"")} onClick={()=>setPage(item.id)}>
              <svg className="sb-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.d}</svg>
              {item.label}
            </div>
          ))}
          <div className="sb-sec">Wellness Tools</div>
          {toolsNav.map(item=>(
            <div key={item.id} className={"sb-item "+(page===item.id?"on":"")} onClick={()=>setPage(item.id)}>
              <svg className="sb-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.d}</svg>
              {item.label}
            </div>
          ))}
          <div className="sb-sec">Workspace</div>
          {companyNav.map(item=>(
            <div key={item.id} className={"sb-item "+(page===item.id?"on":"")} onClick={()=>setPage(item.id)}>
              <svg className="sb-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.d}</svg>
              {item.label}
            </div>
          ))}
          </div>
          <div style={{padding:"16px 18px",borderTop:"1px solid var(--border)"}}>
            <div style={{fontSize:10,color:"var(--faint)",fontWeight:300,lineHeight:1.5}}>Powered by</div>
            <div style={{fontSize:11,color:"var(--soft)",fontWeight:500,marginTop:1}}>Wild Bloom Wellness House</div>
          </div>
        </div>
        <div className="content">
          {loading ? <div className="loading"><div className="spin"/></div> : (
            <>
              {page==="dashboard" && <DashPage checkins={checkins} user={user}/>}
              {page==="departments" && <DeptsPage checkins={checkins}/>}
              {page==="trends" && <TrendsPage checkins={checkins}/>}
              {page==="reports" && <ReportsPage checkins={checkins} user={user}/>}
              {page==="stress" && <ToolkitPage tools={STRESS_TOOLS} title="Stress Management" subtitle="Evidence-based techniques to share with your team"/>}
              {page==="neuro" && <ToolkitPage tools={NEURO_TOOLS} title="Team Practices" subtitle="Neurological practices to implement in meetings and team settings"/>}
              {page==="company" && <CompanyPage user={user}/>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}


const TT = { contentStyle:{borderRadius:6,border:"1px solid #E2D9CE",background:"#FDFCF9",fontSize:12} };

function DashPage({ checkins, user }) {
  const weeks = [...new Set(checkins.map(c=>c.week))];
  const cw = weeks[weeks.length-1];
  const depts = [...new Set(checkins.map(c=>c.department))].filter(Boolean);
  const tw = checkins.filter(c=>c.week===cw);
  const lw = checkins.filter(c=>c.week===weeks[weeks.length-2]);

  const ds = depts.map(dept=>{
    const items = tw.filter(c=>c.department===dept);
    if (!items.length) return null;
    const avg = k=>Math.round(items.reduce((a,b)=>a+(b[k]||0),0)/items.length);
    const score = Math.round((avg("stress")+avg("workload")+avg("relationships")+avg("manager")+avg("balance"))/5);
    return { dept, score, stress:avg("stress"), workload:avg("workload"), relationships:avg("relationships"), manager:avg("manager"), balance:avg("balance"), count:items.length };
  }).filter(Boolean).sort((a,b)=>a.score-b.score);

  const overall = ds.length ? Math.round(ds.reduce((a,b)=>a+b.score,0)/ds.length) : 0;
  const lastOverall = lw.length ? Math.round(lw.reduce((a,b)=>a+Math.round((b.stress+b.workload+b.relationships+b.manager+b.balance)/5),0)/lw.length) : 0;
  const trend = overall - lastOverall;
  const high = ds.filter(d=>getRisk(d.score)==="high").length;

  const radar = ["stress","workload","relationships","manager","balance"].map(k=>({
    subject: k.charAt(0).toUpperCase()+k.slice(1),
    value: ds.length ? Math.round(ds.reduce((a,b)=>a+b[k],0)/ds.length) : 0
  }));

  const pie = [
    { name:"Low Risk", value:ds.filter(d=>getRisk(d.score)==="low").length, color:"#5C7A5C" },
    { name:"Medium Risk", value:ds.filter(d=>getRisk(d.score)==="medium").length, color:"#C4956A" },
    { name:"High Risk", value:ds.filter(d=>getRisk(d.score)==="high").length, color:"#A0522D" },
  ].filter(d=>d.value>0);

  return (
    <div className="main">
      <div className="ph">
        <div className="crumb">WellPulse · Overview</div>
        <div className="ph-title">Wellness Overview</div>
        <div className="ph-sub">{cw||"No data yet"} &nbsp;·&nbsp; {depts.length} departments &nbsp;·&nbsp; {tw.length} responses this week</div>
      </div>
      <div className="kgrid">
        <div className="kpi c1">
          <div className="kpi-lb">Overall Score</div>
          <div className="kpi-v" style={{color:getRiskColor(overall)}}>{overall}<small>/10</small></div>
          <div className="kpi-d">{getRiskLabel(overall)}</div>
          {trend!==0 && <div className={`kpi-tr ${trend>0?"pos":"neg"}`}>{trend>0?"↑":"↓"} {Math.abs(trend)} vs last week</div>}
        </div>
        <div className="kpi c2">
          <div className="kpi-lb">High Risk Depts</div>
          <div className="kpi-v" style={{color:high>0?"#A0522D":"#5C7A5C"}}>{high}</div>
          <div className="kpi-d">Require attention</div>
        </div>
        <div className="kpi c3">
          <div className="kpi-lb">Responses</div>
          <div className="kpi-v">{tw.length}</div>
          <div className="kpi-d">This week</div>
        </div>
        <div className="kpi c4">
          <div className="kpi-lb">Departments</div>
          <div className="kpi-v">{depts.length}</div>
          <div className="kpi-d">Being tracked</div>
        </div>
      </div>
      {checkins.length===0 ? (
        <div className="card"><div className="empty"><div className="empty-t">No data yet</div><div className="empty-s">Share your company code <strong>{user.company_code}</strong> with employees so they can register and complete their weekly check-ins.</div></div></div>
      ) : (
        <>
          <div className="g2">
            <div className="card">
              <div className="ct">Wellness by Category <div className="ct-line"/></div>
              <ResponsiveContainer width="100%" height={210}>
                <RadarChart data={radar}>
                  <PolarGrid stroke="#E2D9CE"/>
                  <PolarAngleAxis dataKey="subject" tick={{fontSize:11,fill:"#6B5D4F"}}/>
                  <Radar dataKey="value" stroke="#5C7A5C" fill="#5C7A5C" fillOpacity={0.12} strokeWidth={2}/>
                  <Tooltip {...TT}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="ct">Risk Distribution <div className="ct-line"/></div>
              {pie.length>0 ? (
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie data={pie} cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={3} dataKey="value">
                      {pie.map((e,i)=><Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip {...TT}/><Legend iconType="circle" iconSize={7} formatter={v=><span style={{fontSize:11,color:"#6B5D4F"}}>{v}</span>}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="empty" style={{padding:"30px 0"}}><div className="empty-s">Insufficient data</div></div>}
            </div>
          </div>
          <div className="card">
            <div className="ct">Department Risk Overview <div className="ct-line"/></div>
            <div className="tw">
              <table className="tbl">
                <thead><tr><th>Department</th><th>Risk</th><th>Score</th><th>Stress</th><th>Workload</th><th>Relationships</th><th>Manager</th><th>Balance</th><th>Responses</th></tr></thead>
                <tbody>
                  {ds.map(d=>(
                    <tr key={d.dept}>
                      <td style={{fontWeight:500}}>{d.dept}</td>
                      <td><span className={`badge ${getRisk(d.score)}`}><span className="badge-dot"/>{getRiskLabel(d.score)}</span></td>
                      <td><div className="sbar-row"><div className="sbar"><div className="sbar-f" style={{width:`${d.score*10}%`,background:getRiskColor(d.score)}}/></div><span className="sbar-v" style={{color:getRiskColor(d.score)}}>{d.score}</span></div></td>
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

function DeptsPage({ checkins }) {
  const depts = [...new Set(checkins.map(c=>c.department))].filter(Boolean);
  const weeks = [...new Set(checkins.map(c=>c.week))];
  const cw = weeks[weeks.length-1];
  const tw = checkins.filter(c=>c.week===cw);
  const bar = depts.map(dept=>{
    const items = tw.filter(c=>c.department===dept);
    if (!items.length) return null;
    const avg = k=>Math.round(items.reduce((a,b)=>a+(b[k]||0),0)/items.length);
    return { dept, Stress:avg("stress"), Workload:avg("workload"), Relationships:avg("relationships"), Manager:avg("manager"), Balance:avg("balance") };
  }).filter(Boolean);

  return (
    <div className="main">
      <div className="ph"><div className="crumb">WellPulse · Departments</div><div className="ph-title">Department Analysis</div><div className="ph-sub">Wellness category scores by department — {cw}</div></div>
      {bar.length===0 ? <div className="card"><div className="empty"><div className="empty-t">No department data yet</div></div></div> : (
        <>
          <div className="card" style={{marginBottom:14}}>
            <div className="ct">All Categories by Department <div className="ct-line"/></div>
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={bar} margin={{top:5,right:16,left:0,bottom:5}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" vertical={false}/>
                <XAxis dataKey="dept" tick={{fontSize:11,fill:"#6B5D4F"}}/><YAxis domain={[0,10]} tick={{fontSize:11,fill:"#6B5D4F"}}/>
                <Tooltip {...TT}/><Legend iconType="circle" iconSize={7} formatter={v=><span style={{fontSize:11,color:"#6B5D4F"}}>{v}</span>}/>
                <Bar dataKey="Stress" fill="#5C7A5C" radius={[3,3,0,0]}/><Bar dataKey="Workload" fill="#8B6F47" radius={[3,3,0,0]}/>
                <Bar dataKey="Relationships" fill="#7A8C6E" radius={[3,3,0,0]}/><Bar dataKey="Manager" fill="#C4956A" radius={[3,3,0,0]}/>
                <Bar dataKey="Balance" fill="#4A6741" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="g2">
            {bar.slice(0,4).map((d,i)=>(
              <div key={d.dept} className="card">
                <div className="ct">{d.dept} <div className="ct-line"/></div>
                {["Stress","Workload","Relationships","Manager","Balance"].map(cat=>(
                  <div key={cat} style={{marginBottom:9}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span style={{color:"var(--soft)"}}>{cat}</span><span style={{fontWeight:600}}>{d[cat]}/10</span></div>
                    <div className="sbar" style={{height:5}}><div className="sbar-f" style={{width:`${d[cat]*10}%`,background:COLORS[i%COLORS.length]}}/></div>
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

  const wt = weeks.map(week=>{
    const row = { week: week.replace(/\s·\s\d{4}/,"").replace("Week ","W") };
    const all = checkins.filter(c=>c.week===week);
    if (all.length) row["Overall"] = Math.round(all.reduce((a,b)=>a+Math.round((b.stress+b.workload+b.relationships+b.manager+b.balance)/5),0)/all.length);
    depts.forEach(dept=>{
      const items = checkins.filter(c=>c.department===dept&&c.week===week);
      if (items.length) row[dept] = Math.round(items.reduce((a,b)=>a+Math.round((b.stress+b.workload+b.relationships+b.manager+b.balance)/5),0)/items.length);
    });
    return row;
  });

  const ct = weeks.map(week=>{
    const items = checkins.filter(c=>c.week===week);
    const w = week.replace(/\s·\s\d{4}/,"").replace("Week ","W");
    if (!items.length) return {week:w};
    const avg = k=>Math.round(items.reduce((a,b)=>a+(b[k]||0),0)/items.length);
    return {week:w, Stress:avg("stress"), Workload:avg("workload"), Relationships:avg("relationships"), Manager:avg("manager"), Balance:avg("balance")};
  });

  const monthly = (()=>{
    const m = {};
    checkins.forEach(c=>{
      const key = c.created_at ? new Date(c.created_at).toLocaleString("default",{month:"short",year:"2-digit"}) : "N/A";
      if (!m[key]) m[key]=[];
      m[key].push(Math.round((c.stress+c.workload+c.relationships+c.manager+c.balance)/5));
    });
    return Object.entries(m).map(([month,scores])=>({ month, score:Math.round(scores.reduce((a,b)=>a+b,0)/scores.length), responses:scores.length }));
  })();

  return (
    <div className="main">
      <div className="ph"><div className="crumb">WellPulse · Trends</div><div className="ph-title">Wellness Trends</div><div className="ph-sub">Weekly and monthly performance over time</div></div>
      <div className="card" style={{marginBottom:14}}>
        <div className="ct">Overall Weekly Trend <div className="ct-line"/></div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={wt}>
            <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#5C7A5C" stopOpacity={0.12}/><stop offset="95%" stopColor="#5C7A5C" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" vertical={false}/>
            <XAxis dataKey="week" tick={{fontSize:11,fill:"#6B5D4F"}}/><YAxis domain={[1,10]} tick={{fontSize:11,fill:"#6B5D4F"}}/>
            <Tooltip {...TT}/>
            <Area type="monotone" dataKey="Overall" stroke="#5C7A5C" fill="url(#g1)" strokeWidth={2} dot={{r:4,fill:"#5C7A5C",strokeWidth:0}} connectNulls name="Overall Score"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card" style={{marginBottom:14}}>
        <div className="ct">Monthly Wellness Score <div className="ct-line"/></div>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={monthly} margin={{top:5,right:16,left:0,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" vertical={false}/>
            <XAxis dataKey="month" tick={{fontSize:11,fill:"#6B5D4F"}}/><YAxis domain={[0,10]} tick={{fontSize:11,fill:"#6B5D4F"}}/>
            <Tooltip {...TT}/>
            <Bar dataKey="score" fill="#8B6F47" radius={[4,4,0,0]} name="Avg Score"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="g2">
        <div className="card">
          <div className="ct">Department Trends <div className="ct-line"/></div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={wt}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" vertical={false}/>
              <XAxis dataKey="week" tick={{fontSize:10,fill:"#6B5D4F"}}/><YAxis domain={[1,10]} tick={{fontSize:10,fill:"#6B5D4F"}}/>
              <Tooltip {...TT}/><Legend iconType="circle" iconSize={6} formatter={v=><span style={{fontSize:10,color:"#6B5D4F"}}>{v}</span>}/>
              {depts.map((d,i)=><Line key={d} type="monotone" dataKey={d} stroke={COLORS[i%COLORS.length]} strokeWidth={2} dot={false} connectNulls/>)}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="ct">Category Trends <div className="ct-line"/></div>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={ct}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" vertical={false}/>
              <XAxis dataKey="week" tick={{fontSize:10,fill:"#6B5D4F"}}/><YAxis domain={[1,10]} tick={{fontSize:10,fill:"#6B5D4F"}}/>
              <Tooltip {...TT}/><Legend iconType="circle" iconSize={6} formatter={v=><span style={{fontSize:10,color:"#6B5D4F"}}>{v}</span>}/>
              {[["Stress","#5C7A5C"],["Workload","#8B6F47"],["Relationships","#7A8C6E"],["Manager","#C4956A"],["Balance","#4A6741"]].map(([k,c])=>(
                <Line key={k} type="monotone" dataKey={k} stroke={c} strokeWidth={1.5} dot={false} connectNulls/>
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
  const tw = checkins.filter(c=>c.week===cw);
  const ds = depts.map(dept=>{
    const items = tw.filter(c=>c.department===dept);
    if (!items.length) return null;
    const avg = k=>Math.round(items.reduce((a,b)=>a+(b[k]||0),0)/items.length);
    const score = Math.round((avg("stress")+avg("workload")+avg("relationships")+avg("manager")+avg("balance"))/5);
    return { dept, score, stress:avg("stress"), workload:avg("workload"), relationships:avg("relationships"), manager:avg("manager"), balance:avg("balance"), count:items.length };
  }).filter(Boolean);
  const overall = ds.length ? Math.round(ds.reduce((a,b)=>a+b.score,0)/ds.length) : 0;

  function exportReport() {
    const rows = ds.map(d=>`${d.dept}\n  Score: ${d.score}/10  Risk: ${getRiskLabel(d.score)}  Responses: ${d.count}\n  Stress: ${d.stress}  Workload: ${d.workload}  Relationships: ${d.relationships}  Manager: ${d.manager}  Balance: ${d.balance}`).join("\n\n");
    const recs = ds.filter(d=>getRisk(d.score)==="high").map(d=>`  - ${d.dept}: Score ${d.score}/10 — Immediate attention recommended`).join("\n") || "  All departments within acceptable range.";
    const content = `WELLPULSE WELLNESS REPORT\n${"─".repeat(48)}\nCompany Code : ${user.company_code||"N/A"}\nGenerated    : ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}\nPeriod       : ${cw}\n\n${"─".repeat(48)}\nSUMMARY\n\n  Overall Score   : ${overall}/10 (${getRiskLabel(overall)})\n  High Risk Depts : ${ds.filter(d=>getRisk(d.score)==="high").length}\n  Total Responses : ${tw.length}\n  Departments     : ${depts.length}\n\n${"─".repeat(48)}\nDEPARTMENT BREAKDOWN\n\n${rows}\n\n${"─".repeat(48)}\nRECOMMENDATIONS\n\n${recs}\n\n${"─".repeat(48)}\nGenerated by WellPulse`;
    const blob = new Blob([content],{type:"text/plain"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `WellPulse-${new Date().toISOString().split("T")[0]}.txt`; a.click();
  }

  return (
    <div className="main">
      <div className="ph"><div className="crumb">WellPulse · Reports</div><div className="ph-title">Wellness Reports</div><div className="ph-sub">Export and review detailed reports for leadership review</div></div>
      <div className="card" style={{marginBottom:14}}>
        <div className="ct">Export Report <div className="ct-line"/></div>
        <p style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.6,marginBottom:16}}>Export a complete wellness report for <strong>{cw||"the current period"}</strong> including department scores, risk classification, and recommendations.</p>
        <button className="btn-dk" onClick={exportReport}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Report
        </button>
      </div>
      <div className="card">
        <div className="ct">Report Preview — {cw||"No data"} <div className="ct-line"/></div>
        {ds.length===0 ? <div className="empty"><div className="empty-t">No data to report</div><div className="empty-s">Check-in data will appear once employees complete their weekly surveys.</div></div> : (
          <table className="tbl">
            <thead><tr><th>Department</th><th>Score</th><th>Risk</th><th>Recommendation</th></tr></thead>
            <tbody>
              {ds.map(d=>(
                <tr key={d.dept}>
                  <td style={{fontWeight:500}}>{d.dept}</td>
                  <td style={{fontWeight:600,color:getRiskColor(d.score)}}>{d.score}/10</td>
                  <td><span className={`badge ${getRisk(d.score)}`}><span className="badge-dot"/>{getRiskLabel(d.score)}</span></td>
                  <td style={{fontSize:12,color:"var(--soft)",fontWeight:300}}>
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

function CompanyPage({ user }) {
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(user.company_code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="main">
      <div className="ph">
        <div className="crumb">WellPulse · Company Settings</div>
        <div className="ph-title">Company Settings</div>
        <div className="ph-sub">Manage your workspace and employee access</div>
      </div>

      <div className="card" style={{marginBottom:14}}>
        <div className="ct">Your Company Access Code <div className="ct-line"/></div>
        <p style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.7,marginBottom:20}}>
          This is your unique company code. Share it with every employee when they register on WellPulse.
          Their check-in data will automatically appear in your leadership dashboard once they sign up using this code.
        </p>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
          <div style={{background:"var(--bg2)",border:"1.5px solid var(--border)",borderRadius:"var(--rl)",padding:"20px 32px",textAlign:"center",minWidth:200}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--faint)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Company Code</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:42,color:"var(--accent)",letterSpacing:6,lineHeight:1}}>{user.company_code || "N/A"}</div>
          </div>
          <div>
            <button className="btn" style={{width:"auto",padding:"10px 24px",marginTop:0,marginBottom:10}} onClick={copyCode}>
              {copied ? "Copied!" : "Copy Code"}
            </button>
            <p style={{fontSize:12,color:"var(--faint)",fontWeight:300,lineHeight:1.6,maxWidth:280}}>
              Paste this code into an email, Slack message, or onboarding document for your employees.
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{marginBottom:14}}>
        <div className="ct">How Employee Access Works <div className="ct-line"/></div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {[
            ["1","Share the code","Send your company code to all employees via email, Slack, or your onboarding process."],
            ["2","Employees register","Each employee visits WellPulse, clicks Register, enters the company code along with their name, email, department, and password."],
            ["3","They complete check-ins","Every week employees log in and complete the 5-question wellness check-in. It takes about 2 minutes."],
            ["4","You see the data","Their responses feed directly into your leadership dashboard — grouped by department, tracked over time, and never individually identified."],
          ].map(([n,t,s])=>(
            <div key={n} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:"var(--accent)",color:"#fff",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{n}</div>
              <div>
                <div style={{fontWeight:600,fontSize:14,marginBottom:3}}>{t}</div>
                <div style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.55}}>{s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="ct">Employee Privacy <div className="ct-line"/></div>
        <p style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.7}}>
          WellPulse is designed to surface <strong>organizational health</strong> — not to surveil individuals.
          Leadership sees aggregated department scores only. No individual employee is ever identified by name in the dashboard or reports.
          Employees can complete their check-in knowing their response contributes to team-level data, not personal performance tracking.
        </p>
      </div>
    </div>
  );
}

function EmployeeApp({ user, onLogout }) {
  const [page, setPage] = useState("checkin");
  const tier = React.useContext(TierContext);
  const nav = [
    { id:"checkin", label:"Weekly Check-In", d:<><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></> },
    { id:"stress", label:"Stress Management", d:<><path d="M17 8C8 10 5.9 16.17 3.82 19.34c-.2.3.1.66.44.55C5.77 19.26 8.15 18.31 10 17"/><path d="M14 2s1 2 1 4-2 4-2 4"/></> },
    { id:"neuro", label:"Team Practices", d:<><path d="M12 5a3 3 0 10-5.997.125 4 4 0 00-2.526 5.77 4 4 0 00.556 6.588A4 4 0 1012 18"/><path d="M12 5a3 3 0 115.997.125 4 4 0 012.526 5.77 4 4 0 01-.556 6.588A4 4 0 1112 18"/></> },
    { id:"history", label:"My History", d:<><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 106 5.3L3 8"/><path d="M12 7v5l4 2"/></> },
    ...(tier === "support" ? [{ id:"getsupport", label:"Get Support", d:<><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></> }] : []),
  ];
  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo">WellPulse</div>
        <div className="nav-sep"/>
        <div className="nav-ctx">Employee Portal</div>
        <div className="nav-r">
          <div className="nav-av">{user.name?.[0]?.toUpperCase()}</div>
          <div className="nav-nm">{user.name} · {user.department}</div>
          <button className="btn-nav" onClick={onLogout}>Sign out</button>
        </div>
      </nav>
      <div className="layout">
        <div className="sb">
          <div className="sb-sec">Wellness</div>
          {nav.map(item=>(
            <div key={item.id} className={`sb-item ${page===item.id?"on":""}`} onClick={()=>setPage(item.id)}>
              <svg className="sb-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.d}</svg>
              {item.label}
            </div>
          ))}
        </div>
        <div className="content">
          {page==="checkin" && <CheckInPage user={user}/>}
          {page==="stress" && <ToolkitPage tools={STRESS_TOOLS} title="Stress Management" subtitle="Evidence-based techniques to regulate your nervous system"/>}
          {page==="neuro" && <ToolkitPage tools={NEURO_TOOLS} title="Team Practices" subtitle="Neurological practices to implement in meetings and team settings"/>}
          {page==="history" && <HistoryPage user={user}/>}
          {page==="getsupport" && <SupportPage user={user}/>}
        </div>
      </div>
    </div>
  );
}

function CheckInPage({ user }) {
  const cw = getWeekLabel();
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({ stress:5, workload:5, relationships:5, manager:5, balance:5 });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [score, setScore] = useState(null);
  const [supportRequested, setSupportRequested] = useState(false);

  useEffect(()=>{
    supabase.from("checkins").select("id").eq("user_id",user.id).eq("week",cw).maybeSingle()
      .then(({data})=>{ if(data) setDone(true); setLoading(false); });
  },[]);

  async function submit() {
    setSaving(true);
    const score = Math.round((ans.stress + ans.workload + ans.relationships + ans.manager + ans.balance) / 5);
    await supabase.from("checkins").insert({ user_id:user.id, week:cw, department:user.department, company_code:user.company_code||"", ...ans });
    setScore(score);
    setDone(true); setSaving(false);
  }

  async function requestSupport() {
    await supabase.from("support_requests").insert({
      company_code: user.company_code || "",
      department: user.department,
      week: cw,
      wellness_score: score,
      status: "pending"
    });
    setSupportRequested(true);
  }

  if (loading) return <div className="loading"><div className="spin"/></div>;
  const q = QUESTIONS[step];
  const val = ans[q?.id];

  return (
    <div className="ci-wrap">
      <div className="ci-card">
        {done ? (
          <div className="ci-done">
            <div className="ci-check"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5C7A5C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
            <h2>Check-in complete</h2>
            <p>Your responses for {cw} have been recorded.<br/>Thank you for taking the time to reflect.</p>

            {score !== null && score <= 4 && !supportRequested && (
              <div style={{marginTop:24,background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--rl)",padding:"20px 22px",textAlign:"left"}}>
                <div style={{fontSize:13,fontWeight:600,color:"var(--ink)",marginBottom:6}}>It looks like this has been a difficult week.</div>
                <div style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.65,marginBottom:16}}>You don't have to navigate this alone. If you'd like to be connected with a certified wellness coach — completely confidentially — we're here to help. Your name is never shared.</div>
                <button onClick={requestSupport} style={{width:"100%",padding:"11px",background:"var(--accent)",color:"#fff",border:"none",borderRadius:"var(--r)",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:600,cursor:"pointer",marginBottom:8}}>Yes, I'd like support</button>
                <button onClick={()=>setSupportRequested(true)} style={{width:"100%",padding:"11px",background:"transparent",color:"var(--faint)",border:"none",borderRadius:"var(--r)",fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer"}}>No thank you</button>
              </div>
            )}

            {supportRequested && score !== null && score <= 4 && (
              <div style={{marginTop:24,background:"var(--alight)",border:"1px solid var(--accent)",borderRadius:"var(--rl)",padding:"18px 22px",textAlign:"left"}}>
                <div style={{fontSize:13,fontWeight:600,color:"var(--accent)",marginBottom:4}}>Your request has been received.</div>
                <div style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.65}}>A wellness coach from Wild Bloom Wellness House will be in touch with your company's HR team to arrange confidential support. You remain completely anonymous.</div>
              </div>
            )}

            {(score === null || score > 4) && (
              <div className="ci-tip">Visit <strong>Stress Management</strong> or <strong>Team Practices</strong> in the sidebar for tools to support your wellbeing this week.</div>
            )}
          </div>
        ) : (
          <>
            <div className="ci-wk">{cw}</div>
            <div className="ci-title">Weekly Check-In</div>
            <div className="ci-sub">Five questions · approximately two minutes</div>
            <div className="ci-prog">{QUESTIONS.map((_,i)=><div key={i} className={`ci-step ${i<step?"done":i===step?"cur":""}`}/>)}</div>
            <div className="ci-qn">Question {step+1} of {QUESTIONS.length}</div>
            <div className="ci-q">{q.label}</div>
            <div className="ci-hint">{q.hint}</div>
            <div className="ci-sl">
              <span style={{fontSize:12,color:"var(--faint)",width:12,textAlign:"center"}}>1</span>
              <input type="range" min={1} max={10} value={val} onChange={e=>setAns({...ans,[q.id]:parseInt(e.target.value)})}/>
              <span style={{fontSize:12,color:"var(--faint)",width:12,textAlign:"center"}}>10</span>
              <span className="ci-sc" style={{color:getRiskColor(val)}}>{val}</span>
            </div>
            <div className="ci-scl"><span>Low</span><span>High</span></div>
            <div className="ci-nav">
              {step>0 ? <button className="btn-out" onClick={()=>setStep(step-1)}>Back</button> : <div/>}
              {step<QUESTIONS.length-1
                ? <button className="btn" style={{width:"auto",padding:"10px 26px"}} onClick={()=>setStep(step+1)}>Continue</button>
                : <button className="btn" style={{width:"auto",padding:"10px 26px"}} onClick={submit} disabled={saving}>{saving?"Saving...":"Submit"}</button>
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
  const [exp, setExp] = useState(null);
  const [phase, setPhase] = useState("in");
  const [cycle, setCycle] = useState(0);
  const timer = useRef(null);

  function startBreath() {
    setActive({type:"breathing"}); setPhase("in"); setCycle(0);
    const phases = [{p:"in",ms:4000},{p:"hold",ms:4000},{p:"out",ms:4000},{p:"hold2",ms:4000}];
    let i=0;
    function next() { setPhase(phases[i].p); if(i===0) setCycle(c=>c+1); i=(i+1)%phases.length; timer.current=setTimeout(next,phases[(i+phases.length-1)%phases.length].ms); }
    timer.current=setTimeout(next,0);
  }

  function closeModal() { setActive(null); if(timer.current) clearTimeout(timer.current); }

  function open(tool) { tool.id===1&&title==="Stress Management" ? startBreath() : setActive(tool); }

  return (
    <div className="main">
      <div className="ph"><div className="crumb">WellPulse · {title}</div><div className="ph-title">{title}</div><div className="ph-sub">{subtitle}</div></div>
      <div className="tgrid">
        {tools.map(tool=>(
          <div key={tool.id} className={`tc ${exp===tool.id?"exp":""}`}>
            <div className="tc-cat">{tool.category}</div>
            <div className="tc-title">{tool.title}</div>
            <div className="tc-desc">{tool.desc}</div>
            <div className="tc-benefit">{tool.benefit}</div>
            <div className="tc-meta">
              <div className="tc-dur">{tool.duration}</div>
              <div className="tc-btns">
                <button className="tc-btn why" onClick={()=>setExp(exp===tool.id?null:tool.id)}>{exp===tool.id?"Less":"Why it works"}</button>
                <button className="tc-btn open" onClick={()=>open(tool)}>Open</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {active && active.type==="breathing" && (
        <div className="modal-bg" onClick={closeModal}>
          <div className="modal" style={{textAlign:"center"}} onClick={e=>e.stopPropagation()}>
            <div className="m-cat">Breathwork</div>
            <div className="m-title">Box Breathing</div>
            <p style={{fontSize:13,color:"var(--soft)",fontWeight:300,marginBottom:6}}>Cycle {cycle} · Tap outside to close</p>
            <div className={`br-circle ${phase==="in"?"in":phase==="out"?"out":"hold"}`}>
              {phase==="in"?"Breathe In":phase==="out"?"Breathe Out":"Hold"}
            </div>
            <button className="btn" onClick={closeModal}>End Session</button>
          </div>
        </div>
      )}
      {active && active.type!=="breathing" && (
        <div className="modal-bg" onClick={closeModal}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="m-cat">{active.category}</div>
            <div className="m-title">{active.title}</div>
            <div className="m-desc">{active.desc}</div>
            <ol className="m-steps">
              {active.steps.map((s,i)=>(
                <li key={i} className="m-step"><span className="m-num">{i+1}</span><span>{s}</span></li>
              ))}
            </ol>
            <div className="m-benefit"><strong>Why it works</strong>{active.benefit}</div>
            <div className="m-actions"><button className="btn-out" onClick={closeModal}>Close</button><button className="btn" style={{width:"auto",padding:"10px 22px"}} onClick={closeModal}>Done</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function SupportPage({ user }) {
  const [submitted, setSubmitted] = useState(false);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function requestSupport() {
    setSubmitting(true);
    await supabase.from("support_requests").insert({
      company_code: user.company_code || "",
      department: user.department,
      week: getWeekLabel(),
      wellness_score: null,
      status: "pending",
      notes: note || null
    });
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <div className="ci-wrap" style={{maxWidth:600}}>
      <div className="ci-card">
        {submitted ? (
          <div className="ci-done">
            <div className="ci-check">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5C7A5C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2>Request received</h2>
            <p style={{marginBottom:20}}>A certified wellness coach from Wild Bloom Wellness House will follow up through your company's HR team to arrange confidential support.<br/><br/>You remain completely anonymous throughout this process.</p>
            <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--rl)",padding:"16px 18px",textAlign:"left"}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--faint)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Need immediate support?</div>
              <div style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.6}}>You can also reach Wild Bloom Wellness House directly at <strong style={{color:"var(--ink)"}}>Miranda@wildbloomwellnesshouse.com</strong></div>
            </div>
          </div>
        ) : (
          <>
            <div className="ci-wk">Confidential Support</div>
            <div className="ci-title">Request Wellness Support</div>
            <div className="ci-sub" style={{marginBottom:28}}>Sometimes work feels overwhelming. You don't have to navigate it alone.</div>

            <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--rl)",padding:"18px 20px",marginBottom:24}}>
              <div style={{fontSize:13,fontWeight:500,color:"var(--ink)",marginBottom:8}}>How this works</div>
              {[
                "Your request is completely anonymous — your name is never shared",
                "A certified coach from Wild Bloom Wellness House will be notified",
                "They will work with your HR team to arrange confidential 1-on-1 support",
                "You control whether and how much you share in any coaching session"
              ].map((s,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:"var(--accent)",color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
                  <div style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.5}}>{s}</div>
                </div>
              ))}
            </div>

            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontSize:11,fontWeight:600,color:"var(--soft)",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Optional — share a little context (anonymous)</label>
              <textarea
                value={note}
                onChange={e=>setNote(e.target.value)}
                placeholder="e.g. I have been feeling overwhelmed with workload lately and would like some strategies to help manage stress..."
                style={{width:"100%",padding:"10px 12px",border:"1.5px solid var(--border)",borderRadius:"var(--r)",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"var(--ink)",background:"var(--surface2)",outline:"none",resize:"vertical",minHeight:90,lineHeight:1.6}}
              />
              <div style={{fontSize:11,color:"var(--faint)",marginTop:4,fontWeight:300}}>This note is optional and remains anonymous. It helps the coach prepare to support you.</div>
            </div>

            <button className="btn" onClick={requestSupport} disabled={submitting} style={{marginTop:0}}>
              {submitting ? "Submitting..." : "Request Confidential Support"}
            </button>

            <div style={{marginTop:16,textAlign:"center",fontSize:12,color:"var(--faint)",fontWeight:300}}>
              Or contact Wild Bloom directly at <strong style={{color:"var(--soft)"}}>Miranda@wildbloomwellnesshouse.com</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function HistoryPage({ user }) {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    supabase.from("checkins").select("*").eq("user_id",user.id).order("created_at",{ascending:false})
      .then(({data})=>{ setCheckins(data||[]); setLoading(false); });
  },[]);

  if (loading) return <div className="loading"><div className="spin"/></div>;
  const chart = [...checkins].reverse().map(c=>({ week:c.week?.replace(/\s·\s\d{4}/,"").replace("Week ","W")||"", score:Math.round((c.stress+c.workload+c.relationships+c.manager+c.balance)/5) }));

  return (
    <div className="main">
      <div className="ph"><div className="crumb">WellPulse · My History</div><div className="ph-title">My Wellness History</div><div className="ph-sub">Your personal check-in record over time</div></div>
      {checkins.length===0 ? (
        <div className="card"><div className="empty"><div className="empty-t">No check-ins yet</div><div className="empty-s">Complete your first weekly check-in. Your personal wellness trend will appear here over time.</div></div></div>
      ) : (
        <>
          <div className="card" style={{marginBottom:14}}>
            <div className="ct">Wellness Score Over Time <div className="ct-line"/></div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={chart}>
                <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#5C7A5C" stopOpacity={0.12}/><stop offset="95%" stopColor="#5C7A5C" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" vertical={false}/>
                <XAxis dataKey="week" tick={{fontSize:11,fill:"#6B5D4F"}}/><YAxis domain={[1,10]} tick={{fontSize:11,fill:"#6B5D4F"}}/>
                <Tooltip {...TT}/>
                <Area type="monotone" dataKey="score" stroke="#5C7A5C" fill="url(#pg)" strokeWidth={2} dot={{r:4,fill:"#5C7A5C",strokeWidth:0}} name="Score"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="ct">Check-In History <div className="ct-line"/></div>
            <table className="tbl">
              <thead><tr><th>Period</th><th>Overall</th><th>Status</th><th>Stress</th><th>Workload</th><th>Relationships</th><th>Manager</th><th>Balance</th></tr></thead>
              <tbody>
                {checkins.map(c=>{
                  const score = Math.round((c.stress+c.workload+c.relationships+c.manager+c.balance)/5);
                  return (
                    <tr key={c.id}>
                      <td style={{fontSize:12,color:"var(--soft)"}}>{c.week}</td>
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
