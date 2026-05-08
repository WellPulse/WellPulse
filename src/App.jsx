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
  { id:21, title:"Your Brain Under Chronic Stress", category:"Neuroscience · Awareness", duration:"5 minutes", type:"guide", desc:"The science you need to understand why stress regulation is not optional — it is neurological maintenance.", steps:["Understand what is at stake: The prefrontal cortex is the brain region responsible for your best qualities at work — sound judgment, emotional regulation, clear thinking, and empathy. Chronic stress measurably shrinks the grey matter in this region.","Recognize the signs of prefrontal cortex impairment: You make decisions you later regret. Small things feel overwhelming. You react instead of respond. Your creativity disappears. Your patience shortens. These are not personality failings — they are neurological symptoms.","Understand the timeline: Research shows that even moderate chronic stress impairs prefrontal cortex function within weeks. Sustained high stress leads to measurable structural changes. The amygdala simultaneously becomes more reactive, amplifying fear and reactivity.","The good news — neuroplasticity: The brain can recover. With consistent stress regulation, social connection, adequate sleep, and reduced threat load, grey matter is restored. This is measurable on an MRI.","Your action: Every regulation practice in this library is, at the neurological level, a maintenance practice for your prefrontal cortex.","Your WellPulse check-in score is a signal of where your brain is on this spectrum. A score below 5 is a warning that prefrontal cortex function may already be compromised. Act on it."], benefit:"Research by neuroscientist Amy Arnsten at Yale confirms that chronic stress causes structural changes to the prefrontal cortex — reduced grey matter, impaired function, and increased amygdala reactivity. The same research confirms these changes are reversible with consistent regulation practices." },
  { id:6, title:"Cognitive Defusion", category:"Mental Reframe · Immediate", duration:"3 minutes", type:"guide", desc:"A technique from Acceptance and Commitment Therapy. Create distance between yourself and your stressful thoughts.", steps:["Notice a stressful thought you are having.","Instead of 'I am overwhelmed', say 'I am having the thought that I am overwhelmed.'","Then say 'I notice I am having the thought that I am overwhelmed.'","Observe the thought without engaging with it.","Let it pass like a cloud."], benefit:"Reduces emotional reactivity by engaging the prefrontal cortex over the amygdala." },
  { id:7, title:"90-Minute Micro-Recovery", category:"Daily Practice · Preventative", duration:"5 minutes", type:"guide", desc:"Research shows that taking a 5-minute restorative break every 90 minutes prevents the accumulation of stress hormones and sustains cognitive performance across the full workday.", steps:["Set a repeating timer for every 90 minutes.","When it goes off, step fully away from your screen.","Choose one: walk, stretch, breathe, or simply sit in silence.","Do not check your phone during this time.","Return to work only after the 5 minutes are complete."], benefit:"Aligns with the brain's ultradian rhythm cycle. Skipping recovery phases degrades focus by up to 40%." },
  { id:8, title:"End-of-Day Shutdown Ritual", category:"Daily Practice · Preventative", duration:"5 minutes", type:"guide", desc:"A structured transition from work mode to personal time.", steps:["At the end of your workday, write down your three most important tasks for tomorrow.","Review anything unfinished and note where it stands.","Close all work tabs and applications.","Say aloud or write: 'My workday is complete.'","Do one physical action that signals the transition: change clothes, go outside, make tea."], benefit:"Activates cognitive closure — reducing the Zeigarnik effect, where incomplete tasks continue occupying mental bandwidth involuntarily." },
  { id:9, title:"Values Reconnection", category:"Mental Reframe · Preventative", duration:"10 minutes", type:"guide", desc:"When burnout sets in, the first casualty is a sense of meaning. This exercise reconnects you to your core values and why your work matters.", steps:["Find a quiet moment and a piece of paper.","Write: What do I care about most in my life?","Write: What does my work allow me to do or provide that matters to me?","Write: What is one small thing I did this week that was aligned with my values?","Read it back slowly.","Keep it somewhere visible."], benefit:"Reactivates intrinsic motivation circuits in the brain." },
  { id:10, title:"Journaling for Overwhelm", category:"Daily Practice · Preventative", duration:"7 minutes", type:"guide", desc:"Structured journaling prompts specifically designed to externalize and process workplace overwhelm.", steps:["Open a notebook or document — private, not shared.","Prompt 1: What is taking up the most mental space right now?","Prompt 2: What am I afraid will happen if I don't handle it?","Prompt 3: What is one thing within my control today?","Prompt 4: What do I need to let go of?","Write freely — no editing, no judgment. 2 minutes per prompt."], benefit:"Externalizing stress through writing activates the prefrontal cortex and reduces amygdala reactivity. Studies show expressive writing reduces anxiety symptoms by up to 28%." },
  { id:11, title:"Boundary-Setting Script", category:"Communication · Preventative", duration:"5 minutes", type:"guide", desc:"A concrete, professional framework for protecting your time without damaging relationships.", steps:["Identify one commitment or request that is beyond your current capacity.","Use this structure: 'I want to be upfront with you — I am currently at capacity with [X]. I can either [option A] or [option B]. What would be most helpful?'","Deliver it calmly and without over-explaining.","If pressed, repeat: 'I want to do this well, and right now I cannot give it what it deserves.'","Follow through on what you offered."], benefit:"Boundary-setting from a place of clarity rather than resentment activates collaborative brain states rather than defensive ones." },
  { id:12, title:"Sleep Hygiene Protocol", category:"Recovery · Long-Term", duration:"Nightly", type:"guide", desc:"Sleep is the single most powerful recovery tool available.", steps:["Set a consistent sleep and wake time — even on weekends.","Stop screens 45 minutes before bed.","Keep your bedroom cool, dark, and quiet — temperature below 67F is optimal for sleep onset.","Avoid caffeine after 1pm and alcohol within 3 hours of bedtime.","If your mind races at night, do a 5-minute brain dump.","If you wake at night, practice box breathing rather than checking your phone."], benefit:"Sleep is when the brain clears stress hormones and consolidates emotional regulation. Even one night of poor sleep increases amygdala reactivity by up to 60% the following day." },
  { id:13, title:"Stop · Breathe · Reflect · Choose", category:"Daily Practice · Anytime", duration:"2 minutes", type:"guide", desc:"A four-step micro-practice for any moment of stress or reactivity.", steps:["STOP — Pause. Put down your phone. Still yourself for 5 seconds.","BREATHE — One slow breath. Inhale 4 counts, hold 2, exhale 6.","REFLECT — Ask: Is this a healthy or unhealthy stress response?","CHOOSE — From this clearer state, choose your response intentionally.","Return to the moment with intention."], benefit:"The gap between stimulus and response is where your freedom lives. This practice widens that gap." },
  { id:14, title:"Healthy vs Unhealthy Stress Awareness", category:"Awareness · Foundation", duration:"5 minutes", type:"guide", desc:"Before you can manage stress, you need to recognize it.", steps:["HEALTHY STRESS signals: You feel challenged but capable. Energy is elevated. Focus narrows.","UNHEALTHY STRESS signals: You feel overwhelmed and helpless. Energy is depleted.","Check in right now: Which category are you in today?","If healthy — use it. Channel the energy.","If unhealthy — name it without judgment.","Then choose one regulation tool from this library.","Track your pattern over time using WellPulse check-ins."], benefit:"Awareness is the first stage of the WellPulse wellness framework. Simply labeling a stress response reduces its intensity by activating the prefrontal cortex." },
  { id:15, title:"Social Connection as Medicine", category:"Resilience · Daily", duration:"3 minutes", type:"guide", desc:"One of the most underutilized stress regulation tools is also the most human — genuine connection.", steps:["Identify one person at work you feel genuinely connected to.","This week, reach out with no agenda.","Ask one real question: 'How are you actually doing?' And mean it.","Share something honest about your own experience in return.","Do this once a week minimum."], benefit:"Oxytocin released during genuine social connection directly counteracts cortisol. People with strong workplace relationships are 50% less likely to experience clinical burnout." },
  { id:17, title:"The Three Good Things Practice", category:"Positive Psychology · Daily", duration:"3 minutes", type:"guide", desc:"Writing down three good things that happened each day measurably increases happiness within two weeks.", steps:["At the end of each workday, write down three things that went well.","For each one, write one sentence about why it happened.","Read all three back slowly.","Close the notebook. That's it.","Do this every day for 14 days and notice what shifts."], benefit:"Developed by Dr. Martin Seligman. In clinical trials it produced lasting increases in happiness and reductions in depressive symptoms." },
  { id:18, title:"Strengths Awareness at Work", category:"Positive Psychology · Weekly", duration:"10 minutes", type:"guide", desc:"People who use their signature strengths at work are more engaged, less burned out, and more productive.", steps:["Ask yourself: When at work do I feel most energized, most natural, most like myself?","Write down three to five activities or moments that consistently produce that feeling.","This week, look for one opportunity each day to use one of these strengths.","At the end of the week, notice: did the days where you used your strengths feel different?","Share one of your strengths with a colleague and ask them what they think your strengths are."], benefit:"People who use their top strengths at work experience 23% higher engagement and 72% lower burnout rates according to Gallup research." },
  { id:19, title:"Gratitude as a Nervous System Tool", category:"Positive Psychology · Daily", duration:"2 minutes", type:"guide", desc:"Gratitude is a measurable nervous system intervention that directly counteracts the physiological effects of chronic stress.", steps:["Once a day — morning or evening — pause for two minutes.","Bring to mind one person, one experience, or one thing at work you are genuinely grateful for.","Feel the gratitude physically. Where do you notice it in your body?","If you want to deepen the practice: write it down, or tell the person directly.","The key word is genuine. Forced gratitude has little effect."], benefit:"Gratitude activates the hypothalamus, which regulates sleep, metabolism, and stress. MRI studies show that gratitude literally changes brain structure over time." },
  { id:20, title:"Meaning-Making at Work", category:"Positive Psychology · Weekly", duration:"8 minutes", type:"guide", desc:"Viktor Frankl's research showed that meaning is the most powerful human motivator.", steps:["Set aside 8 minutes at the end of your week.","Ask: Who did my work serve this week?","Ask: What did I contribute that I am proud of?","Ask: What does this work allow me to do or provide outside of work?","Write the answers down. Read them slowly.","If this exercise feels empty — that is important information."], benefit:"Research by Adam Grant shows that people who understand the impact of their work are significantly more motivated and resilient." },
  { id:16, title:"Building Your Resilience Foundation", category:"Resilience · Long-Term", duration:"10 minutes", type:"guide", desc:"Resilience is not a personality trait. It is a skill — built through consistent practice over time.", steps:["STAGE 1 — AWARENESS: Learn to recognize your stress patterns. Use WellPulse check-ins to track your data.","STAGE 2 — REGULATION: Learn to evoke the relaxation response on demand. Pick two or three tools and practice them daily.","STAGE 3 — RESILIENCE: Once you can regulate, begin building capacity. Resilience means you recover faster.","STAGE 4 — MAINTENANCE: Sustain what works. Build non-negotiable daily practices.","Review where you are in this framework today. Which stage are you in?"], benefit:"The research on resilience is clear — it is built, not born. Companies that support employees through all four stages see measurably lower turnover, lower absenteeism, and higher sustained performance." },
];

const NEURO_TOOLS = [
  { id:1, title:"Meeting Opener: Name and Aim", category:"Meeting Practice · Opening", duration:"2 minutes", type:"guide", desc:"Begin each meeting by having each person state their name and one specific intention for the session.", steps:["Open the meeting 2 minutes early.","Each person states: 'I am [name] and I am here to [specific intention].'","Keep it to one sentence each.","The facilitator closes with the shared goal of the meeting."], benefit:"Activates dopamine-driven goal circuitry, increasing focus and buy-in from the first minute." },
  { id:2, title:"The 60-Second Reset", category:"Meeting Practice · Opening", duration:"1 minute", type:"guide", desc:"A structured pause at the start of any meeting to transition from previous context.", steps:["Ask everyone to close laptops and put phones face down.","Lead one minute of silence or soft background sound.","Ask: 'What do you need to set aside to be fully here?'","Allow 15 seconds of silent acknowledgment.","Begin."], benefit:"Reduces cortisol carryover from prior tasks by up to 40%, significantly improving decision quality." },
  { id:3, title:"Affirmation Round", category:"Team Bonding · Weekly", duration:"5 minutes", type:"guide", desc:"Each team member briefly acknowledges one thing a colleague did well this week.", steps:["Reserve 5 minutes at the end of a weekly meeting.","Go around — each person names one colleague and one specific action they appreciated.","No long speeches — one or two sentences only.","The named person simply says thank you."], benefit:"Releases oxytocin and serotonin, increasing psychological safety, trust, and team cohesion over time." },
  { id:4, title:"Energy Check-In", category:"Meeting Practice · Opening", duration:"2 minutes", type:"guide", desc:"A rapid, low-stakes check-in where team members rate their current energy on a 1 to 10 scale.", steps:["At the start of the meeting, ask everyone to rate their energy: 1 (depleted) to 10 (energized).","Go around briefly — number only, no explanation required.","If the average is below 5, consider adjusting the meeting format or shortening it.","Leaders: log the average over time to track team energy trends."], benefit:"Creates psychological safety and gives managers real-time burnout signal data without requiring anyone to self-disclose vulnerably." },
  { id:5, title:"Two Truths and A Growth", category:"Team Bonding · Weekly", duration:"5 minutes", type:"guide", desc:"Each person shares two wins and one area of active growth.", steps:["Each person shares two things that went well this week.","And one thing they are actively learning or improving.","No critique or commentary from others.","Rotate who goes first each week."], benefit:"Stimulates neuroplasticity-supporting reflection and normalizes growth mindset across the team." },
  { id:6, title:"Mindful Transition Ritual", category:"Meeting Practice · Closing", duration:"3 minutes", type:"guide", desc:"A short closing practice to help teams decompress before their next commitment.", steps:["In the final 3 minutes, stop the agenda.","Ask: 'What is one word that describes how you are leaving this meeting?'","Each person shares their word — no elaboration needed.","Close with: 'Thank you. Take a full breath before your next task.'"], benefit:"Reduces meeting-to-meeting stress accumulation and increases psychological closure, preventing emotional carryover." },
  { id:7, title:"Conflict De-Escalation Protocol", category:"Team Communication · As Needed", duration:"10 minutes", type:"guide", desc:"A structured framework for managers and team members to navigate interpersonal tension.", steps:["Pause the conversation if voices are raised or tension is high.","Each person breathes and identifies what they are feeling.","Reopen with: 'What I need right now is...' rather than 'You always...'","The listener reflects back what they heard before responding.","Together agree on one concrete next step.","If unresolved, agree to revisit in 24 hours with a mediator if needed."], benefit:"Shifts communication from the reactive amygdala to the collaborative prefrontal cortex. Teams using structured de-escalation protocols report 34% fewer recurring conflicts." },
  { id:8, title:"Psychological Safety Check", category:"Leadership · Quarterly", duration:"15 minutes", type:"guide", desc:"A self-assessment tool for leaders to evaluate the psychological safety level of their team.", steps:["Rate your team honestly on each statement from 1 (never) to 5 (always):","'People on my team feel safe to speak up without fear of judgment.'","'Mistakes are treated as learning opportunities, not failures.'","'Every person's voice is heard equally in meetings.'","'People ask for help without hesitation.'","'Disagreement is welcomed and handled constructively.'","Score below 15: High priority. Score 15-20: Good foundation. Score 20-25: Strong culture.","Take one specific action this week based on your lowest-scoring statement."], benefit:"Psychological safety is the number one predictor of team performance, innovation, and retention according to Google's Project Aristotle." },
  { id:9, title:"Appreciation Pause", category:"Team Bonding · Daily", duration:"1 minute", type:"guide", desc:"A micro-practice that takes 60 seconds and measurably improves team morale.", steps:["Before any meeting or at the start of the day, identify one person on your team.","Think of one specific thing they did recently that made a difference.","Tell them directly — in person, on a call, or in writing.","Be specific: not 'great job' but 'the way you handled that client call yesterday showed real composure.'","Do this every day for 30 days."], benefit:"Specific appreciation activates the brain's reward system more powerfully than general praise. Daily practice correlates with 31% lower voluntary turnover." },
  { id:10, title:"No-Meeting Recovery Block", category:"Workplace Design · Weekly", duration:"2 hours", type:"guide", desc:"A protected time block with no meetings, no Slack, no interruptions.", steps:["Schedule a recurring 2-hour block on your calendar.","Mark it as busy. Decline any meeting requests that overlap.","Use this time for your most cognitively demanding work, or for genuine rest.","Communicate to your team: 'This block is protected.'","After 4 weeks, notice the difference in your output quality and stress levels."], benefit:"Research shows it takes an average of 23 minutes to fully regain focus after an interruption. Protecting deep work time is one of the highest-leverage burnout prevention strategies available." },
  { id:11, title:"Feedback Framework: SBI", category:"Team Communication · Ongoing", duration:"5 minutes", type:"guide", desc:"Situation-Behavior-Impact. A simple, neuroscience-aligned feedback framework.", steps:["Situation: Describe the specific situation factually. 'In yesterday's team meeting...'","Behavior: Describe the specific behavior you observed. '...you interrupted three colleagues before they finished speaking.'","Impact: Describe the impact it had. '...which made it harder for their ideas to be heard.'","Pause and invite a response: 'What are your thoughts?'","Listen fully before responding."], benefit:"SBI bypasses the brain's threat-detection system by removing blame and judgment from feedback." },
  { id:12, title:"Team Resilience Retrospective", category:"Leadership · Monthly", duration:"20 minutes", type:"guide", desc:"A structured monthly team conversation that builds collective resilience.", steps:["At the end of each month, hold a dedicated 20-minute retrospective.","Question 1: What was the hardest thing we navigated together this month?","Question 2: What did we do well under pressure?","Question 3: What would have made this month easier?","Question 4: What is one thing we want to do differently next month?","Document answers and revisit them the following month."], benefit:"Collective resilience is built through shared meaning-making after difficulty." },
  { id:13, title:"Stop · Breathe · Reflect · Choose — Team Version", category:"Leadership Practice · Anytime", duration:"2 minutes", type:"guide", desc:"Teach your team this four-step practice and use it together.", steps:["STOP — Call a pause. Say: 'Before we continue, let's take two minutes.'","BREATHE — Lead one breath together. Inhale 4 counts, hold 2, exhale 6.","REFLECT — Ask the room: 'Are we in a healthy or unhealthy stress response right now?'","CHOOSE — From this awareness, invite the team to choose how to proceed intentionally.","Use before difficult conversations, performance reviews, or high-stakes decisions."], benefit:"A leader who models regulation gives the whole room permission to regulate. This is called co-regulation — one of the most powerful leadership tools available." },
  { id:14, title:"The Wellness Framework — For Leaders", category:"Leadership · Foundation", duration:"15 minutes", type:"guide", desc:"Understanding the four-stage wellness framework helps leaders support their teams at every level.", steps:["STAGE 1 — AWARENESS: Your team's WellPulse data is stage one. Review it weekly.","STAGE 2 — REGULATION: Make regulation tools accessible and normalized. Model them yourself.","STAGE 3 — RESILIENCE BUILDING: Schedule group coaching sessions. Celebrate teams that recover well from difficulty.","STAGE 4 — MAINTENANCE: Sustain what works. Protect recovery time. Use WellPulse data to confirm what's working.","Ask yourself: Which stage is my team in right now?"], benefit:"Leaders who understand and actively support all four stages see the highest retention rates, the lowest burnout incidence, and the strongest team performance over time." },
  { id:16, title:"Positive Psychology for Team Leaders", category:"Leadership · Foundation", duration:"10 minutes", type:"guide", desc:"Positive psychology shifts the question from 'what is wrong?' to 'what enables this team to thrive?'", steps:["The PERMA model: Positive Emotions, Engagement, Relationships, Meaning, Accomplishment.","POSITIVE EMOTIONS — Create small moments of warmth, humor, and celebration in team culture.","ENGAGEMENT — Give people work that uses their strengths.","RELATIONSHIPS — Invest in social connection deliberately.","MEANING — Help your team connect their work to its impact.","ACCOMPLISHMENT — Celebrate progress, not just outcomes.","Review your team: Which PERMA element is strongest? Which needs attention?"], benefit:"Teams led with a positive psychology framework show 31% higher productivity and 3x more creativity according to research by Shawn Achor." },
  { id:18, title:"The Grey Matter Conversation — For Leaders", category:"Neuroscience · Leadership", duration:"10 minutes", type:"guide", desc:"The single most compelling scientific argument for why workplace wellness is a business imperative.", steps:["Start with the science: Chronic stress physically shrinks the grey matter in the prefrontal cortex.","Connect it to performance: When the prefrontal cortex is compromised, employees become less capable of sound judgment, emotional regulation, creative problem-solving, and effective communication.","Connect it to your data: Departments scoring below 5 are operating in the chronic stress zone where prefrontal cortex impairment is likely already occurring.","Present the business case: Compromised prefrontal cortex function costs organizations in poor decisions, increased conflict, higher turnover, and reduced innovation.","Present the recovery case: The brain is neuroplastic. With consistent regulation practices, grey matter recovers.","Your role as a leader: The prefrontal cortex of every person on your team is either being protected or eroded by the environment you create."], benefit:"This framework, grounded in the research of Dr. Amy Arnsten at Yale, reframes workplace wellness from a discretionary benefit into a core business and human responsibility." },
  { id:17, title:"Strengths-Based Team Culture", category:"Leadership · Ongoing", duration:"Ongoing", type:"guide", desc:"The highest-performing teams have one thing in common — every member knows their strengths and uses them daily.", steps:["Start with yourself: What are your top three leadership strengths?","In your next 1-on-1 with each team member, ask: 'When do you feel most energized at work?'","Listen for patterns. These are their strengths.","Look for opportunities to assign work that activates those strengths.","In team meetings, explicitly acknowledge when someone used a strength well.","Over time, build a team map of who brings what strengths."], benefit:"People who use their strengths daily are 6x more likely to be engaged at work and 3x less likely to experience burnout according to Gallup." },
  { id:15, title:"Social Ties as a Team Health Strategy", category:"Team Culture · Ongoing", duration:"Ongoing", type:"guide", desc:"Strong social ties are one of the most powerful buffers against burnout.", steps:["Audit your current team culture: Do people know each other as humans, or only as colleagues?","Build micro-moments of genuine connection into every week.","In every 1-on-1, ask one question that isn't about work: 'How are you doing outside of work?'","Recognize and celebrate relationships, not just output.","When scores drop in the Relationships category on WellPulse, treat it as a signal.","Facilitate one connection practice per week from the Team Practices library."], benefit:"Employees with strong workplace relationships are 50% less likely to experience clinical burnout. Social ties are not a perk — they are a physiological necessity for sustainable performance." },
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
.main{padding:28px 30px;max-width:1280px;}
.ph{margin-bottom:22px;padding-bottom:18px;border-bottom:1px solid var(--border);}
.ph-title{font-family:'DM Serif Display',serif;font-size:25px;margin-bottom:3px;}
.ph-sub{font-size:13px;color:var(--faint);font-weight:300;}
.crumb{font-size:11px;color:var(--faint);margin-bottom:5px;}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--rl);padding:20px;box-shadow:var(--sh);}
.card+.card{margin-top:14px;}
.ct{font-size:10px;font-weight:700;color:var(--faint);text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px;display:flex;align-items:center;gap:10px;}
.ct-line{flex:1;height:1px;background:var(--border);}
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
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px;}
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
.br-circle{width:150px;height:150px;border-radius:50%;background:var(--alight);border:2px solid var(--accent);display:flex;align-items:center;justify-content:center;margin:22px auto;font-size:14px;font-weight:500;color:var(--accent);transition:transform 1s ease;}
.br-circle.in{transform:scale(1.28);}
.br-circle.out{transform:scale(1);}
.loading{display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:12px;background:var(--bg);}
.spin{width:26px;height:26px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .85s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.spin-lb{font-size:13px;color:var(--faint);font-weight:300;}
.empty{text-align:center;padding:60px 20px;}
.empty-t{font-family:'DM Serif Display',serif;font-size:20px;margin-bottom:7px;}
.empty-s{font-size:13px;color:var(--faint);font-weight:300;line-height:1.6;}
@media(max-width:880px){
  .auth-l{display:none;}
  .auth-r{width:100%;padding:32px 24px;}
  .auth-card{width:100%;}
  .auth-title{font-size:22px;}
  .nav{padding:0 16px;height:48px;}
  .nav-logo{font-size:18px;}
  .nav-ctx{display:none;}
  .nav-code{display:none;}
  .nav-nm{display:none;}
  .nav-sep{display:none;}
  .layout{flex-direction:column;}
  .sb{display:none;}
  .content{width:100%;overflow-x:hidden;}
  .main{padding:16px 14px;}
  .ph{margin-bottom:16px;padding-bottom:14px;}
  .ph-title{font-size:20px;}
  .ph-sub{font-size:12px;}
  .kgrid{grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
  .kpi{padding:14px;}
  .kpi-v{font-size:28px;}
  .g2,.g3{grid-template-columns:1fr;}
  .tw{overflow-x:auto;-webkit-overflow-scrolling:touch;}
  .tbl{min-width:500px;}
  .tbl th,.tbl td{padding:8px 10px;font-size:12px;}
  .ci-wrap{padding:16px 12px;}
  .ci-card{padding:24px 20px;border-radius:12px;}
  .ci-title{font-size:20px;}
  .ci-q{font-size:16px;}
  .ci-sc{font-size:32px;}
  .tgrid{grid-template-columns:1fr;}
  .tc{padding:16px;}
  .modal-bg{padding:12px;}
  .modal{padding:24px 20px;max-height:85vh;}
  .m-title{font-size:18px;}
  .card{padding:16px;}
  .mobile-nav{display:flex !important;}
}
.mobile-nav{
  display:none;position:fixed;bottom:0;left:0;right:0;
  background:var(--surface);border-top:1px solid var(--border);
  z-index:200;padding:0;box-shadow:0 -2px 12px rgba(44,36,22,.08);
}
.mobile-nav-item{
  flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:8px 4px 10px;cursor:pointer;border:none;background:transparent;color:var(--faint);
  font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;gap:4px;transition:color .15s;
}
.mobile-nav-item.on{color:var(--accent);}
.mobile-nav-item svg{width:20px;height:20px;}
.mobile-content-pad{padding-bottom:70px;}
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
      if (data) setProfile(data);
      else await supabase.auth.signOut();
    } catch(e) {
      console.error("loadProfile failed:", e);
      await supabase.auth.signOut();
    }
    setLoading(false);
  }

  if (loading) return <div className="loading"><div className="spin"/><div className="spin-lb">Loading WellPulse</div></div>;
  if (!session) return <LandingOrAuth />;
  if (!profile) return <div className="loading"><div className="spin"/><div className="spin-lb">Setting up your workspace</div></div>;
  if (profile.is_super_admin) return <SuperAdminApp user={profile} onLogout={() => supabase.auth.signOut()} />;
  if (profile.role === "leadership") return <AccessGate user={profile}><LeadershipApp user={profile} onLogout={() => supabase.auth.signOut()} /></AccessGate>;
  return <AccessGate user={profile}><EmployeeApp user={profile} onLogout={() => supabase.auth.signOut()} /></AccessGate>;
}

function LandingOrAuth() {
  const [showAuth, setShowAuth] = useState(false);
  if (showAuth) return <AuthScreen onBack={() => setShowAuth(false)} />;
  return <LandingPage onSignIn={() => setShowAuth(true)} />;
}

const TierContext = React.createContext("insights");

function AccessGate({ user, children }) {
  const [status, setStatus] = useState("loading");
  const [trialDays, setTrialDays] = useState(null);
  const [tier, setTier] = useState("insights");

  useEffect(() => {
    async function checkAccess() {
      if (!user.company_code) { setStatus("active"); return; }
      const { data } = await supabase.from("companies").select("status,plan,tier,trial_ends_at").eq("code", user.company_code).maybeSingle();
      if (!data) { setStatus("active"); return; }
      const companyTier = data.tier || "insights";
      setTier(companyTier === "transform" ? "support" : companyTier);
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
      <div style={{fontSize:14,color:"var(--soft)",maxWidth:380,lineHeight:1.7,fontWeight:300}}>Your WellPulse account has been temporarily paused. Please contact <strong>Miranda@wildbloomwellnesshouse.com</strong> to restore access.</div>
      <button style={{marginTop:8,padding:"10px 24px",background:"transparent",border:"1.5px solid var(--border)",borderRadius:6,fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer",color:"var(--soft)"}} onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </div>
  );

  if (status === "cancelled" || status === "expired") return (
    <div className="loading" style={{flexDirection:"column",gap:16,textAlign:"center",padding:40}}>
      <div style={{width:56,height:56,borderRadius:"50%",background:"var(--dlight)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto"}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A0522D" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:24,color:"var(--ink)"}}>{status === "expired" ? "Trial Expired" : "Subscription Ended"}</div>
      <div style={{fontSize:14,color:"var(--soft)",maxWidth:380,lineHeight:1.7,fontWeight:300}}>Contact <strong>Miranda@wildbloomwellnesshouse.com</strong> to renew.</div>
      <button style={{marginTop:8,padding:"10px 24px",background:"transparent",border:"1.5px solid var(--border)",borderRadius:6,fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer",color:"var(--soft)"}} onClick={() => supabase.auth.signOut()}>Sign Out</button>
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

// ─── SUPER ADMIN ──────────────────────────────────────────────────────────────

function SuperAdminApp({ user, onLogout }) {
  const [page, setPage] = useState("companies");
  const [companies, setCompanies] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const { data: cos } = await supabase.from("company_stats").select("*").order("created_at", { ascending: false });
    const { data: reqs } = await supabase.from("support_requests").select("*").order("created_at", { ascending: false });
    const { data: cis } = await supabase.from("checkins").select("*").order("created_at", { ascending: false });
    setCompanies(cos || []);
    setSupportRequests(reqs || []);
    setCheckins(cis || []);
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
    { id:"highrisk", label:"High Risk Alerts", d:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></> },
    { id:"support", label:"Support Requests", d:<><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></> },
    { id:"billing", label:"Billing", d:<><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></> },
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
              {page==="companies" && <SACompaniesPage companies={companies} totalCompanies={totalCompanies} totalEmployees={totalEmployees} totalCheckins={totalCheckins} avgWellness={avgWellness} updateStatus={updateStatus} updateTier={updateTier}/>}
              {page==="activity" && <SAActivityPage companies={companies} totalCompanies={totalCompanies} totalEmployees={totalEmployees} totalCheckins={totalCheckins} avgWellness={avgWellness}/>}
              {page==="highrisk" && <SAHighRiskPage companies={companies} checkins={checkins} supportRequests={supportRequests}/>}
              {page==="support" && <SASupportPage supportRequests={supportRequests} loadData={loadData}/>}
              {page==="billing" && <SABillingPage companies={companies} updateStatus={updateStatus}/>}
              {page==="pricing" && <SAPricingPage companies={companies} updateTier={updateTier}/>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SACompaniesPage({ companies, totalCompanies, totalEmployees, totalCheckins, avgWellness, updateStatus, updateTier }) {
  return (
    <div className="main">
      <div className="ph">
        <div className="crumb">WellPulse · Owner Dashboard</div>
        <div className="ph-title">All Companies</div>
        <div className="ph-sub">Every company currently using the WellPulse platform</div>
      </div>
      <div className="kgrid">
        <div className="kpi c1"><div className="kpi-lb">Companies</div><div className="kpi-v">{totalCompanies}</div><div className="kpi-d">Active on platform</div></div>
        <div className="kpi c3"><div className="kpi-lb">Total Employees</div><div className="kpi-v">{totalEmployees}</div><div className="kpi-d">Registered users</div></div>
        <div className="kpi c4"><div className="kpi-lb">Total Check-Ins</div><div className="kpi-v">{totalCheckins}</div><div className="kpi-d">Across all companies</div></div>
        <div className="kpi c1"><div className="kpi-lb">Avg Wellness Score</div><div className="kpi-v" style={{color:getRiskColor(parseFloat(avgWellness))}}>{avgWellness}<small>/10</small></div><div className="kpi-d">Platform-wide</div></div>
      </div>
      {companies.length === 0 ? (
        <div className="card"><div className="empty"><div className="empty-t">No companies yet</div><div className="empty-s">Companies will appear here once they register.</div></div></div>
      ) : (
        <div className="card">
          <div className="ct">Company Overview <div className="ct-line"/></div>
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Company Name</th><th>Code</th><th>Plan</th><th>Tier</th><th>Status</th><th>Employees</th><th>Check-Ins</th><th>Wellness</th><th>Actions</th></tr></thead>
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
                      <td><span style={{fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:20,background:c.tier==="transform"?"var(--ink)":c.tier==="optimize"?"var(--wlight)":"var(--surface2)",color:c.tier==="transform"?"#fff":c.tier==="optimize"?"var(--amber)":"var(--soft)"}}>{c.tier==="transform"?"Transform":c.tier==="optimize"?"Optimize":"Insight"}</span></td>
                      <td><span style={{fontSize:11,fontWeight:700,background:statusBg,color:statusColor,padding:"2px 9px",borderRadius:20,textTransform:"capitalize"}}>{c.status||"active"}</span></td>
                      <td>{c.employee_count||0}</td>
                      <td>{c.total_checkins||0}</td>
                      <td>{score>0?<span style={{fontWeight:600,color:getRiskColor(score)}}>{score}/10</span>:<span style={{color:"var(--faint)",fontSize:11}}>—</span>}</td>
                      <td>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                          {c.status!=="active" && <button onClick={()=>updateStatus(c.code,"active","paid")} style={{fontSize:11,padding:"3px 8px",background:"var(--alight)",color:"var(--accent)",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Activate</button>}
                          {c.status!=="trial" && <button onClick={()=>updateStatus(c.code,"trial","trial")} style={{fontSize:11,padding:"3px 8px",background:"var(--wlight)",color:"var(--warn)",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Trial</button>}
                          {c.status!=="paused" && <button onClick={()=>updateStatus(c.code,"paused",c.plan)} style={{fontSize:11,padding:"3px 8px",background:"var(--amlight)",color:"var(--amber)",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Pause</button>}
                          {c.status!=="cancelled" && <button onClick={()=>{ if(window.confirm("Cancel "+c.name+"?")) updateStatus(c.code,"cancelled",c.plan); }} style={{fontSize:11,padding:"3px 8px",background:"var(--dlight)",color:"var(--danger)",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>}
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
  );
}

function SAActivityPage({ companies, totalCompanies, totalEmployees, totalCheckins, avgWellness }) {
  return (
    <div className="main">
      <div className="ph"><div className="crumb">WellPulse · Platform Activity</div><div className="ph-title">Platform Activity</div><div className="ph-sub">Usage and engagement across all companies</div></div>
      <div className="card">
        <div className="ct">Company Wellness Comparison <div className="ct-line"/></div>
        {companies.length === 0 ? <div className="empty"><div className="empty-t">No data yet</div></div> : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={companies.map(c=>({ name:c.name, Score:parseFloat(c.avg_wellness_score)||0, Employees:c.employee_count||0, CheckIns:c.total_checkins||0 }))} margin={{top:5,right:16,left:0,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2D9CE" vertical={false}/>
              <XAxis dataKey="name" tick={{fontSize:11,fill:"#6B5D4F"}}/><YAxis tick={{fontSize:11,fill:"#6B5D4F"}}/>
              <Tooltip contentStyle={{borderRadius:6,border:"1px solid #E2D9CE",background:"#FDFCF9",fontSize:12}}/><Legend iconType="circle" iconSize={7} formatter={v=><span style={{fontSize:11,color:"#6B5D4F"}}>{v}</span>}/>
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
          {[["Total Companies",totalCompanies,"Organizations using WellPulse"],["Total Employees",totalEmployees,"Registered across all companies"],["Total Check-Ins",totalCheckins,"Wellness surveys completed"],["Platform Avg Score",avgWellness+"/10","Overall wellness across platform"]].map(([label,val,desc])=>(
            <div key={label} style={{padding:"16px 0",borderBottom:"1px solid var(--border)"}}>
              <div style={{fontSize:10,fontWeight:700,color:"var(--faint)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:6}}>{label}</div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:28,color:"var(--ink)",marginBottom:3}}>{val}</div>
              <div style={{fontSize:12,color:"var(--faint)",fontWeight:300}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SAHighRiskPage({ companies, checkins, supportRequests }) {
  const highRisk = companies.filter(c => (parseFloat(c.avg_wellness_score)||0) < 5 && (parseFloat(c.avg_wellness_score)||0) > 0).sort((a,b) => (parseFloat(a.avg_wellness_score)||0) - (parseFloat(b.avg_wellness_score)||0));

  return (
    <div className="main">
      <div className="ph">
        <div className="crumb">WellPulse · High Risk Alerts</div>
        <div className="ph-title">High Risk Alerts</div>
        <div className="ph-sub">Companies scoring below 5/10 — your priority view before monthly calls</div>
      </div>

      <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        <div className="kpi c2">
          <div className="kpi-lb">High Risk Companies</div>
          <div className="kpi-v" style={{color:"#A0522D"}}>{highRisk.length}</div>
          <div className="kpi-d">Scoring below 5/10</div>
        </div>
        <div className="kpi c3">
          <div className="kpi-lb">Pending Support Requests</div>
          <div className="kpi-v" style={{color:"#C4956A"}}>{supportRequests.filter(r=>r.status==="pending").length}</div>
          <div className="kpi-d">Need follow-up</div>
        </div>
        <div className="kpi c1">
          <div className="kpi-lb">Total Companies</div>
          <div className="kpi-v">{companies.length}</div>
          <div className="kpi-d">On platform</div>
        </div>
      </div>

      {/* HIGH RISK FLAGS */}
      {highRisk.length === 0 ? (
        <div className="card" style={{marginBottom:14}}>
          <div className="empty">
            <div style={{width:52,height:52,borderRadius:"50%",background:"var(--alight)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5C7A5C" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div className="empty-t">No high risk companies</div>
            <div className="empty-s">All companies with check-in data are scoring 5/10 or above. Keep monitoring.</div>
          </div>
        </div>
      ) : (
        <div className="card" style={{marginBottom:14,borderLeft:"4px solid var(--danger)"}}>
          <div className="ct">Companies Requiring Immediate Attention <div className="ct-line"/></div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {highRisk.map(c => {
              const score = parseFloat(c.avg_wellness_score)||0;
              const pendingReqs = supportRequests.filter(r => r.company_code === c.code && r.status === "pending").length;
              return (
                <div key={c.id} style={{background:"var(--dlight)",border:"1px solid #E8B4A0",borderRadius:"var(--r)",padding:"14px 16px",display:"flex",alignItems:"center",gap:16}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                      <span style={{fontWeight:700,fontSize:15,color:"var(--ink)"}}>{c.name}</span>
                      <span style={{fontFamily:"monospace",background:"var(--surface)",padding:"1px 7px",borderRadius:4,fontSize:10,letterSpacing:2,fontWeight:700,color:"var(--accent)"}}>{c.code}</span>
                    </div>
                    <div style={{display:"flex",gap:16,fontSize:12,color:"var(--soft)"}}>
                      <span>Score: <strong style={{color:getRiskColor(score)}}>{score}/10</strong></span>
                      <span>Employees: {c.employee_count||0}</span>
                      <span>Tier: {c.tier==="transform"?"Transform":c.tier==="optimize"?"Optimize":"Insight"}</span>
                      {pendingReqs > 0 && <span style={{color:"var(--danger)",fontWeight:600}}>{pendingReqs} pending support request{pendingReqs>1?"s":""}</span>}
                    </div>
                  </div>
                  <a href={`mailto:Miranda@wildbloomwellnesshouse.com?subject=High Risk Alert — ${c.name}&body=Hi Miranda, ${c.name} (code: ${c.code}) is scoring ${score}/10. They may need a priority coaching call this month.`}
                    style={{fontSize:12,padding:"7px 14px",background:"var(--danger)",color:"#fff",borderRadius:"var(--r)",textDecoration:"none",fontWeight:600,fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>
                    Flag for Call
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MONTHLY CALL PREP */}
      <div className="card">
        <div className="ct">Monthly Call Prep — All Companies <div className="ct-line"/></div>
        <div style={{fontSize:12,color:"var(--soft)",fontWeight:300,marginBottom:14,lineHeight:1.5}}>Compact overview of every company for your monthly coaching call preparation.</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
          {companies.map(c => {
            const score = parseFloat(c.avg_wellness_score)||0;
            const pending = supportRequests.filter(r => r.company_code === c.code && r.status === "pending").length;
            const risk = score > 0 ? getRisk(score) : null;
            return (
              <div key={c.id} style={{background:"var(--surface2)",border:`1px solid ${risk==="high"?"#E8B4A0":risk==="medium"?"#E8D5B7":"var(--border)"}`,borderRadius:"var(--r)",padding:"12px 14px",borderLeft:`3px solid ${score>0?getRiskColor(score):"var(--border)"}`}}>
                <div style={{fontWeight:600,fontSize:13,color:"var(--ink)",marginBottom:3}}>{c.name}</div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:6}}>
                  <span style={{fontSize:11,color:"var(--soft)"}}>Score: <strong style={{color:score>0?getRiskColor(score):"var(--faint)"}}>{score>0?score+"/10":"—"}</strong></span>
                  <span style={{fontSize:11,color:"var(--soft)"}}>Tier: {c.tier==="transform"?"Transform":c.tier==="optimize"?"Optimize":"Insight"}</span>
                  <span style={{fontSize:11,color:"var(--soft)",textTransform:"capitalize"}}>Status: {c.status||"active"}</span>
                </div>
                {pending > 0 && (
                  <div style={{fontSize:11,fontWeight:600,color:"var(--danger)",background:"var(--dlight)",padding:"3px 8px",borderRadius:20,display:"inline-block"}}>{pending} pending request{pending>1?"s":""}</div>
                )}
                {pending === 0 && <div style={{fontSize:11,color:"var(--faint)"}}>No pending requests</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SASupportPage({ supportRequests, loadData }) {
  return (
    <div className="main">
      <div className="ph">
        <div className="crumb">WellPulse · Support Requests</div>
        <div className="ph-title">Support Requests</div>
        <div className="ph-sub">Anonymous requests from employees who need coaching support</div>
      </div>
      <div className="kgrid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        <div className="kpi c1"><div className="kpi-lb">Total Requests</div><div className="kpi-v">{supportRequests.length}</div><div className="kpi-d">All time</div></div>
        <div className="kpi c2"><div className="kpi-lb">Pending</div><div className="kpi-v" style={{color:"#C4956A"}}>{supportRequests.filter(r=>r.status==="pending").length}</div><div className="kpi-d">Need follow-up</div></div>
        <div className="kpi c4"><div className="kpi-lb">Resolved</div><div className="kpi-v" style={{color:"#5C7A5C"}}>{supportRequests.filter(r=>r.status==="resolved").length}</div><div className="kpi-d">Completed</div></div>
      </div>
      {supportRequests.length === 0 ? (
        <div className="card"><div className="empty"><div className="empty-t">No support requests yet</div><div className="empty-s">When employees request support, they will appear here anonymously.</div></div></div>
      ) : (
        <div className="card">
          <div className="ct">Anonymous Support Requests <div className="ct-line"/></div>
          <div style={{background:"var(--alight)",border:"1px solid var(--accent)",borderRadius:"var(--r)",padding:"10px 14px",marginBottom:16,fontSize:13,color:"var(--accent)",fontWeight:300,lineHeight:1.5}}>
            <strong>Privacy notice:</strong> All requests are anonymous. No employee names are stored.
          </div>
          <table className="tbl">
            <thead><tr><th>Date</th><th>Company Code</th><th>Department</th><th>Week</th><th>Wellness Score</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {supportRequests.map(r=>(
                <tr key={r.id}>
                  <td style={{fontSize:12,color:"var(--soft)"}}>{new Date(r.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</td>
                  <td><span style={{fontFamily:"monospace",background:"var(--bg2)",padding:"2px 8px",borderRadius:4,fontSize:11,letterSpacing:2,fontWeight:700,color:"var(--accent)"}}>{r.company_code}</span></td>
                  <td>{r.department||"—"}</td>
                  <td style={{fontSize:12,color:"var(--soft)"}}>{r.week}</td>
                  <td><span style={{fontWeight:700,color:getRiskColor(r.wellness_score||0)}}>{r.wellness_score?r.wellness_score+"/10":"—"}</span></td>
                  <td><span style={{fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:20,background:r.status==="resolved"?"var(--alight)":"var(--wlight)",color:r.status==="resolved"?"var(--accent)":"var(--warn)"}}>{r.status==="resolved"?"Resolved":"Pending"}</span></td>
                  <td>
                    {r.status==="pending" && (
                      <button onClick={async()=>{ await supabase.from("support_requests").update({status:"resolved"}).eq("id",r.id); loadData(); }} style={{fontSize:11,padding:"3px 10px",background:"var(--alight)",color:"var(--accent)",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Mark Resolved</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SABillingPage({ companies, updateStatus }) {
  const active = companies.filter(c => c.status === "active");
  const trial = companies.filter(c => c.status === "trial");
  const paused = companies.filter(c => c.status === "paused" || c.status === "cancelled");

  const tierPrice = { transform: 44, optimize: 22, insights: 8 };

  function estRevenue(c) {
    const price = tierPrice[c.tier] || 8;
    return (c.employee_count || 0) * price;
  }

  const totalMRR = active.reduce((sum, c) => sum + estRevenue(c), 0);

  return (
    <div className="main">
      <div className="ph">
        <div className="crumb">WellPulse · Billing</div>
        <div className="ph-title">Billing</div>
        <div className="ph-sub">Payment management and subscription overview</div>
      </div>

      <div className="kgrid">
        <div className="kpi c1">
          <div className="kpi-lb">Est. Monthly Revenue</div>
          <div className="kpi-v" style={{fontSize:28}}>${totalMRR.toLocaleString()}</div>
          <div className="kpi-d">Active companies only</div>
        </div>
        <div className="kpi c1">
          <div className="kpi-lb">Active</div>
          <div className="kpi-v" style={{color:"var(--accent)"}}>{active.length}</div>
          <div className="kpi-d">Paying companies</div>
        </div>
        <div className="kpi c3">
          <div className="kpi-lb">Trial</div>
          <div className="kpi-v" style={{color:"var(--warn)"}}>{trial.length}</div>
          <div className="kpi-d">Free trial</div>
        </div>
        <div className="kpi c2">
          <div className="kpi-lb">Paused / Cancelled</div>
          <div className="kpi-v" style={{color:"var(--danger)"}}>{paused.length}</div>
          <div className="kpi-d">Inactive</div>
        </div>
      </div>

      <div className="card" style={{marginBottom:14}}>
        <div className="ct">Stripe Dashboard Links <div className="ct-line"/></div>
        <div style={{display:"flex",gap:10}}>
          {[["Subscriptions","https://dashboard.stripe.com/subscriptions"],["Customers","https://dashboard.stripe.com/customers"],["Payments","https://dashboard.stripe.com/payments"]].map(([label,url])=>(
            <a key={label} href={url} target="_blank" rel="noreferrer" style={{padding:"8px 16px",background:"var(--ink)",color:"#fff",borderRadius:"var(--r)",textDecoration:"none",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:6}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="ct">Company Billing Table <div className="ct-line"/></div>
        {companies.length === 0 ? (
          <div className="empty"><div className="empty-t">No companies yet</div></div>
        ) : (
          <div className="tw">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Code</th>
                  <th>Tier</th>
                  <th>Employees</th>
                  <th>Est. MRR</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(c => {
                  const mrr = estRevenue(c);
                  const statusColor = c.status==="active"?"var(--accent)":c.status==="trial"?"var(--warn)":c.status==="paused"?"var(--amber)":"var(--danger)";
                  const statusBg = c.status==="active"?"var(--alight)":c.status==="trial"?"var(--wlight)":c.status==="paused"?"var(--amlight)":"var(--dlight)";
                  return (
                    <tr key={c.id}>
                      <td style={{fontWeight:600}}>{c.name}</td>
                      <td><span style={{fontFamily:"monospace",background:"var(--bg2)",padding:"2px 8px",borderRadius:4,fontSize:11,letterSpacing:2,fontWeight:700,color:"var(--accent)"}}>{c.code}</span></td>
                      <td><span style={{fontSize:11,fontWeight:700,padding:"2px 9px",borderRadius:20,background:c.tier==="transform"?"var(--ink)":c.tier==="optimize"?"var(--wlight)":"var(--surface2)",color:c.tier==="transform"?"#fff":c.tier==="optimize"?"var(--amber)":"var(--soft)"}}>{c.tier==="transform"?"Transform":c.tier==="optimize"?"Optimize":"Insight"}</span></td>
                      <td>{c.employee_count||0}</td>
                      <td style={{fontWeight:600,color:mrr>0?"var(--ink)":"var(--faint)"}}>{mrr>0?"$"+mrr.toLocaleString():c.status==="trial"?"Trial":"—"}</td>
                      <td><span style={{fontSize:11,fontWeight:700,background:statusBg,color:statusColor,padding:"2px 9px",borderRadius:20,textTransform:"capitalize"}}>{c.status||"active"}</span></td>
                      <td>
                        <div style={{display:"flex",gap:5}}>
                          {c.status!=="active" && <button onClick={()=>updateStatus(c.code,"active","paid")} style={{fontSize:11,padding:"3px 9px",background:"var(--alight)",color:"var(--accent)",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Activate</button>}
                          {c.status!=="paused" && c.status!=="cancelled" && <button onClick={()=>updateStatus(c.code,"paused",c.plan)} style={{fontSize:11,padding:"3px 9px",background:"var(--amlight)",color:"var(--amber)",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Pause</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SAPricingPage({ companies, updateTier }) {
  return (
    <div className="main">
      <div className="ph">
        <div className="crumb">WellPulse · Pricing Tiers</div>
        <div className="ph-title">Pricing Tiers</div>
        <div className="ph-sub">Three tiers + add-ons — manage company access and communicate your value</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:16}}>
        <div className="card" style={{border:"1.5px solid var(--border)"}}>
          <div style={{fontSize:10,fontWeight:700,color:"var(--faint)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:6}}>Tier 1</div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:24,marginBottom:2}}>Insight</div>
          <div style={{fontSize:12,color:"var(--accent)",fontWeight:600,marginBottom:6}}>$8 / employee / month</div>
          <div style={{fontSize:12,color:"var(--soft)",fontWeight:300,lineHeight:1.5,marginBottom:14,fontStyle:"italic"}}>Understand Burnout Before It Shows Up</div>
          <div style={{height:1,background:"var(--border)",marginBottom:14}}/>
          {["Real-time burnout risk analytics","Anonymous employee check-ins","Team and department dashboards","Monthly executive summary reports","Trend tracking — energy, stress, engagement"].map(f=>(
            <div key={f} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:8}}>
              <svg style={{flexShrink:0,marginTop:2}} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5C7A5C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{fontSize:12,color:"var(--soft)",fontWeight:300,lineHeight:1.4}}>{f}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{border:"2px solid var(--amber)",position:"relative"}}>
          <div style={{position:"absolute",top:-1,right:16,background:"var(--amber)",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:"0 0 6px 6px",letterSpacing:".06em",textTransform:"uppercase"}}>Popular</div>
          <div style={{fontSize:10,fontWeight:700,color:"var(--amber)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:6}}>Tier 2</div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:24,marginBottom:2}}>Optimize</div>
          <div style={{fontSize:12,color:"var(--amber)",fontWeight:600,marginBottom:6}}>$22 / employee / month</div>
          <div style={{fontSize:12,color:"var(--soft)",fontWeight:300,lineHeight:1.5,marginBottom:14,fontStyle:"italic"}}>Turn Insight Into Performance</div>
          <div style={{height:1,background:"var(--border)",marginBottom:14}}/>
          <div style={{fontSize:10,fontWeight:600,color:"var(--faint)",marginBottom:8}}>Everything in Insight, plus:</div>
          {["Monthly group coaching sessions","Nervous system and stress regulation training","Burnout education workshops","Team-based performance insights"].map(f=>(
            <div key={f} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:8}}>
              <svg style={{flexShrink:0,marginTop:2}} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B6F47" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{fontSize:12,color:"var(--ink)",fontWeight:400,lineHeight:1.4}}>{f}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{border:"2px solid var(--ink)",position:"relative"}}>
          <div style={{position:"absolute",top:-1,right:16,background:"var(--ink)",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:"0 0 6px 6px",letterSpacing:".06em",textTransform:"uppercase"}}>Premium</div>
          <div style={{fontSize:10,fontWeight:700,color:"var(--accent)",textTransform:"uppercase",letterSpacing:".12em",marginBottom:6}}>Tier 3</div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:24,marginBottom:2}}>Transform</div>
          <div style={{fontSize:12,color:"var(--accent)",fontWeight:600,marginBottom:6}}>$44 / employee / month</div>
          <div style={{fontSize:12,color:"var(--soft)",fontWeight:300,lineHeight:1.5,marginBottom:14,fontStyle:"italic"}}>Full Workforce Transformation</div>
          <div style={{height:1,background:"var(--border)",marginBottom:14}}/>
          <div style={{fontSize:10,fontWeight:600,color:"var(--faint)",marginBottom:8}}>Everything in Optimize, plus:</div>
          {["Leadership consulting and strategy calls","1-on-1 confidential coaching","Employees can request support anonymously","Custom burnout recovery plans","Priority support and implementation guidance"].map(f=>(
            <div key={f} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:8}}>
              <svg style={{flexShrink:0,marginTop:2}} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5C7A5C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{fontSize:12,color:"var(--accent)",fontWeight:600,lineHeight:1.4}}>{f}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="ct">Current Company Tiers <div className="ct-line"/></div>
        <table className="tbl">
          <thead><tr><th>Company</th><th>Code</th><th>Current Tier</th><th>Set Tier</th></tr></thead>
          <tbody>
            {companies.map(c=>{
              const tierColor = c.tier==="transform"?"var(--ink)":c.tier==="optimize"?"var(--amber)":"var(--accent)";
              return (
                <tr key={c.id}>
                  <td style={{fontWeight:500}}>{c.name}</td>
                  <td><span style={{fontFamily:"monospace",background:"var(--bg2)",padding:"2px 8px",borderRadius:4,fontSize:11,letterSpacing:2,fontWeight:700,color:"var(--accent)"}}>{c.code}</span></td>
                  <td><span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"var(--surface2)",color:tierColor,border:`1px solid ${tierColor}`}}>{c.tier==="transform"?"Transform":c.tier==="optimize"?"Optimize":"Insight"}</span></td>
                  <td>
                    <div style={{display:"flex",gap:6}}>
                      {[["insights","Insight","var(--accent)"],["optimize","Optimize","var(--amber)"],["transform","Transform","var(--ink)"]].map(([t,label,col])=>(
                        <button key={t} onClick={()=>updateTier(c.code,t)} style={{fontSize:11,padding:"3px 10px",background:c.tier===t?col:"var(--surface2)",color:c.tier===t?"#fff":"var(--soft)",border:`1px solid ${c.tier===t?col:"var(--border)"}`,borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>{label}</button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────

function LandingPage({ onSignIn }) {
  const [formData, setFormData] = useState({ firstName:"", lastName:"", email:"", company:"", teamSize:"", role:"", challenge:"" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleDemo(e) {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.company) { alert("Please fill in your name, email, and company."); return; }
    setSending(true);
    try {
      await fetch("https://formspree.io/f/mpqbrppl", { method:"POST", headers:{"Accept":"application/json","Content-Type":"application/json"}, body:JSON.stringify({ first_name:formData.firstName, last_name:formData.lastName, email:formData.email, company:formData.company, team_size:formData.teamSize, role:formData.role, challenge:formData.challenge, _subject:`Demo Request — ${formData.company}` }) });
    } catch(e) {}
    setSending(false); setSubmitted(true);
  }

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:"#F5F0EA",minHeight:"100vh",color:"#1E1A14"}}>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"16px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(245,240,234,0.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid #E2D9CE"}}>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#1E1A14"}}>WellPulse<span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:"#4A6741",marginLeft:3,verticalAlign:"middle",marginBottom:4}}/></div>
        <div style={{display:"flex",gap:28,alignItems:"center"}}>
          <a href="#how" style={{fontSize:14,color:"#6B5D4F",textDecoration:"none"}}>How It Works</a>
          <a href="#coaching" style={{fontSize:14,color:"#6B5D4F",textDecoration:"none"}}>Coaching</a>
          <a href="#who" style={{fontSize:14,color:"#6B5D4F",textDecoration:"none"}}>Who It's For</a>
          <button onClick={onSignIn} style={{padding:"8px 20px",background:"#1E1A14",color:"#fff",border:"none",borderRadius:4,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer"}}>Sign In</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{minHeight:"100vh",background:"#1E1A14",display:"flex",alignItems:"center",padding:"140px 48px 80px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-200,right:-200,width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(74,103,65,0.2) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center",position:"relative",zIndex:1}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".12em",color:"rgba(253,252,249,0.8)",marginBottom:24,padding:"6px 14px",background:"rgba(255,255,255,0.08)",borderRadius:20,border:"1px solid rgba(255,255,255,0.15)"}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#7A9E6E",flexShrink:0}}/>
              Powered by Wild Bloom Wellness House
            </div>
            <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(40px,5vw,66px)",lineHeight:1.08,color:"#FDFCF9",marginBottom:24}}>Your people are not <em style={{fontStyle:"italic",color:"#7A9E6E"}}>productivity metrics.</em></h1>
            <p style={{fontSize:17,color:"rgba(253,252,249,0.6)",fontWeight:300,lineHeight:1.75,marginBottom:40,maxWidth:480}}>WellPulse gives leadership teams real-time visibility into workforce wellness — and connects them with certified coaching to act on what the data shows.</p>
            <div style={{display:"flex",gap:14,alignItems:"center"}}>
              <a href="#demo" style={{padding:"14px 32px",background:"#FDFCF9",color:"#1E1A14",borderRadius:4,fontSize:15,fontWeight:600,textDecoration:"none"}}>Request a Demo</a>
              <a href="#how" style={{padding:"14px 28px",background:"transparent",color:"rgba(253,252,249,0.8)",border:"1.5px solid rgba(253,252,249,0.25)",borderRadius:4,fontSize:15,fontWeight:500,textDecoration:"none"}}>How It Works</a>
            </div>
            <div style={{marginTop:40,display:"flex",alignItems:"center",gap:18,fontSize:13,color:"rgba(253,252,249,0.35)",flexWrap:"wrap"}}>
              <span>Anonymous check-ins</span><span style={{width:3,height:3,borderRadius:"50%",background:"rgba(253,252,249,0.2)"}}/>
              <span>Department-level data</span><span style={{width:3,height:3,borderRadius:"50%",background:"rgba(253,252,249,0.2)"}}/>
              <span>Wild Bloom coaching</span>
            </div>
          </div>
          {/* Dashboard mockup */}
          <div style={{background:"#FDFCF9",border:"1px solid #E2D9CE",borderRadius:12,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
            <div style={{background:"#1E1A14",padding:"12px 18px",display:"flex",alignItems:"center",gap:8}}>
              <div style={{display:"flex",gap:5}}>{[1,2,3].map(i=><div key={i} style={{width:9,height:9,borderRadius:"50%",background:"rgba(255,255,255,0.15)"}}/>)}</div>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginLeft:6}}>WellPulse · Leadership Portal</span>
            </div>
            <div style={{padding:20}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
                {[["Overall Score","7.2/10","Low Risk ↑0.4","#4A6741"],["High Risk Depts","1","Needs attention","#A0522D"],["Participation","84%","168 of 200","#C4956A"]].map(([lb,v,s,c])=>(
                  <div key={lb} style={{background:"#F5F0EA",border:"1px solid #E2D9CE",borderRadius:6,padding:12,borderTop:`2px solid ${c}`}}>
                    <div style={{fontSize:8,fontWeight:700,color:"#B0A090",textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>{lb}</div>
                    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:c,marginBottom:2}}>{v}</div>
                    <div style={{fontSize:9,color:"#B0A090"}}>{s}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:9,fontWeight:700,color:"#B0A090",textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>Department Ranking</div>
              {[["Marketing","84%","#4A6741","8.4"],["Engineering","51%","#C4956A","5.1"],["Operations","34%","#A0522D","3.4"]].map(([d,w,c,s])=>(
                <div key={d} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{fontSize:10,color:"#6B5D4F",minWidth:72}}>{d}</span>
                  <div style={{flex:1,height:5,background:"#E2D9CE",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:w,background:c,borderRadius:3}}/></div>
                  <span style={{fontSize:10,fontWeight:700,color:c,minWidth:24}}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{background:"#1E1A14",padding:"60px 48px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
          {[["$1T","Lost annually to workplace stress globally"],["77%","Of employees have experienced burnout at their current job"],["2.6×","More likely to leave when burned out — Gallup"],["2min","To complete a WellPulse check-in"]].map(([n,l])=>(
            <div key={n} style={{textAlign:"center",padding:20,borderRight:"1px solid rgba(255,255,255,0.07)"}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:44,color:"#C4956A",lineHeight:1,marginBottom:8}}>{n}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",fontWeight:300,lineHeight:1.5}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{background:"#F5F0EA",padding:"100px 48px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".12em",color:"#C4956A",marginBottom:14}}>How It Works</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(30px,4vw,50px)",color:"#1E1A14",marginBottom:18,maxWidth:640}}>Simple for employees. <em style={{fontStyle:"italic",color:"#4A6741"}}>Powerful</em> for leaders.</h2>
          <p style={{fontSize:16,color:"#6B5D4F",fontWeight:300,lineHeight:1.75,maxWidth:560,marginBottom:52}}>WellPulse runs quietly in the background — surfacing the signals your leadership team needs to act before problems escalate.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center"}}>
            <div>
              {[["Employees check in weekly","A 5-question anonymous survey. Stress, workload, relationships, manager support, balance. 2 minutes. No names. No pressure."],
                ["Leadership sees the data","Real-time department scores, burnout risk levels, week-over-week trends, and participation rates. Aggregated — never individual."],
                ["Wild Bloom coaches act on it","Certified coaches use your data to guide sessions, workshops, and leadership calls. Targeted, relevant, and measurable."],
                ["Wellness improves — measurably","Monthly trend reports show your leadership team exactly how wellness moves over time. Not feelings — data."]
              ].map(([t,d],i)=>(
                <div key={t} style={{display:"flex",gap:22,padding:"26px 0",borderBottom:i<3?"1px solid #E2D9CE":"none"}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:"#1E1A14",color:"#fff",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{i+1}</div>
                  <div>
                    <div style={{fontSize:16,fontWeight:600,color:"#1E1A14",marginBottom:5}}>{t}</div>
                    <div style={{fontSize:14,color:"#6B5D4F",fontWeight:300,lineHeight:1.65}}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Check-in mockup */}
            <div style={{background:"#FDFCF9",border:"1px solid #E2D9CE",borderRadius:12,padding:32,boxShadow:"0 4px 24px rgba(30,26,20,0.08)"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#4A6741",textTransform:"uppercase",letterSpacing:".1em",marginBottom:5}}>Week 19 · 2026</div>
              <div style={{fontSize:15,fontWeight:500,color:"#1E1A14",marginBottom:14,lineHeight:1.4}}>How manageable is your workload feeling this week?</div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:5}}>
                <span style={{fontSize:12,color:"#B0A090"}}>1</span>
                <div style={{flex:1,height:4,background:"#E2D9CE",borderRadius:2,position:"relative"}}>
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:"60%",background:"#4A6741",borderRadius:2}}/>
                  <div style={{position:"absolute",left:"60%",top:"50%",transform:"translate(-50%,-50%)",width:16,height:16,borderRadius:"50%",background:"#4A6741",border:"2px solid #fff",boxShadow:"0 2px 6px rgba(0,0,0,0.15)"}}/>
                </div>
                <span style={{fontSize:12,color:"#B0A090"}}>10</span>
                <span style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:"#4A6741"}}>6</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#B0A090",marginBottom:18}}><span>Overwhelmed</span><span>Very manageable</span></div>
              <div style={{height:1,background:"#E2D9CE",margin:"16px 0"}}/>
              <div style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"#4A6741",fontWeight:500}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:"#EEF3EE",display:"flex",alignItems:"center",justifyContent:"center"}}>✓</div>
                Anonymous · Your name is never shared
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WHO IT'S FOR */}
      <div id="who" style={{background:"#FDFCF9",padding:"100px 48px",borderTop:"1px solid #E2D9CE",borderBottom:"1px solid #E2D9CE"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".12em",color:"#C4956A",marginBottom:14}}>Who It's For</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(30px,4vw,50px)",color:"#1E1A14",marginBottom:18,maxWidth:760}}>Built for organizations that take their people <em style={{fontStyle:"italic",color:"#4A6741"}}>seriously.</em></h2>
          <p style={{fontSize:16,color:"#6B5D4F",fontWeight:300,lineHeight:1.75,maxWidth:680,marginBottom:20}}>Burnout has already infiltrated most companies — it's operating quietly beneath the surface of your performance reviews, your turnover numbers, and your team meetings. The organizations winning the next decade aren't waiting for it to become a crisis. They're measuring it. Managing it. And turning culture into a competitive advantage before their competitors do.</p>
          <p style={{fontSize:16,color:"#6B5D4F",fontWeight:300,lineHeight:1.75,maxWidth:680,marginBottom:52}}>WellPulse is the proactive approach. Real-time wellness data that turns invisible risk into visible, actionable insight — so you can lead your people before the problem leads you.</p>

          {/* BURNOUT DATA STATS */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2,background:"#E2D9CE",borderRadius:12,overflow:"hidden",marginBottom:52}}>
            {[
              ["77%","of employees have experienced burnout at their current job — Deloitte"],
              ["2.6×","more likely to leave their employer when burned out — Gallup"],
              ["$322B","lost globally each year to burnout-related turnover — WHO"],
              ["23%","lower absenteeism in companies with high psychological safety — Gallup"],
            ].map(([n,l])=>(
              <div key={n} style={{background:"#FDFCF9",padding:"28px 24px",textAlign:"center"}}>
                <div style={{fontFamily:"'DM Serif Display',serif",fontSize:38,color:"#4A6741",lineHeight:1,marginBottom:10}}>{n}</div>
                <div style={{fontSize:12,color:"#6B5D4F",fontWeight:300,lineHeight:1.6}}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2,background:"#E2D9CE",borderRadius:12,overflow:"hidden"}}>
            {[["HR & People Operations","You need early warning signals and data to justify wellness investment to leadership. The numbers are clear — burnout drives turnover, and turnover is expensive. WellPulse gives you the proof and the tools."],
              ["CEOs & Founders","Culture is no longer a soft metric — it's a retention strategy, a performance strategy, and a recruiting advantage. WellPulse keeps a real-time pulse on it so you can lead with confidence, not guesswork."],
              ["Department Leaders","You want to be a good manager but you can't fix what you can't see. WellPulse surfaces what's happening beneath the surface of your weekly standups — before it becomes a resignation."]
            ].map(([t,d])=>(
              <div key={t} style={{background:"#FDFCF9",padding:"34px 30px"}}>
                <div style={{width:42,height:42,borderRadius:10,background:"#EEF3EE",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A6741" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
                <div style={{fontSize:16,fontWeight:600,color:"#1E1A14",marginBottom:8}}>{t}</div>
                <div style={{fontSize:14,color:"#6B5D4F",fontWeight:300,lineHeight:1.65}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WILD BLOOM COACHING */}
      <div id="coaching" style={{background:"#2C3D28",padding:"100px 48px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center"}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".12em",color:"#C4956A",marginBottom:14}}>Wild Bloom Wellness House</div>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(28px,3.5vw,46px)",color:"#FDFCF9",lineHeight:1.1,marginBottom:18}}>Data tells you where the problem is. <em style={{fontStyle:"italic",color:"#A8C5A0"}}>People help you solve it.</em></h2>
            <p style={{fontSize:16,color:"rgba(253,252,249,0.55)",fontWeight:300,lineHeight:1.75,marginBottom:28}}>WellPulse is built in partnership with Wild Bloom Wellness House — a certified coaching practice specializing in burnout recovery, stress management, and nervous system regulation.</p>

            {/* PSYCHOLOGICAL SAFETY + RETENTION DATA */}
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:32}}>
              {[
                ["50%","of burned-out employees say they would leave for a company that better supports wellbeing — McKinsey"],
                ["74%","reduction in stress reported by employees in psychologically safe teams — APA"],
                ["4×","more likely to stay at a company where they feel psychologically safe — Gallup"],
              ].map(([n,l])=>(
                <div key={n} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",background:"rgba(255,255,255,0.05)",borderRadius:8,border:"1px solid rgba(255,255,255,0.07)"}}>
                  <div style={{fontFamily:"'DM Serif Display',serif",fontSize:28,color:"#C4956A",lineHeight:1,flexShrink:0,minWidth:52}}>{n}</div>
                  <div style={{fontSize:12,color:"rgba(253,252,249,0.5)",fontWeight:300,lineHeight:1.5}}>{l}</div>
                </div>
              ))}
            </div>

            <a href="#demo" style={{padding:"13px 28px",background:"#C4956A",color:"#fff",borderRadius:4,textDecoration:"none",fontSize:14,fontWeight:600,display:"inline-block"}}>Book a Coaching Consultation</a>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[["Monthly Group Coaching","Facilitated sessions for leadership teams or departments. Stress regulation, communication, team dynamics."],
              ["Nervous System Regulation","Science-backed practices embedded into your workplace culture — not one-time events."],
              ["1-on-1 Confidential Coaching","For high-risk employees and leaders. Fully confidential. Requested anonymously through the platform."],
              ["Leadership Intensives","Off-site retreats for senior teams. Available locally, nationally, and internationally."]
            ].map(([t,d])=>(
              <div key={t} style={{display:"flex",gap:14,alignItems:"flex-start",padding:18,background:"rgba(255,255,255,0.05)",borderRadius:8,border:"1px solid rgba(255,255,255,0.07)"}}>
                <div style={{width:34,height:34,borderRadius:8,background:"rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(253,252,249,0.6)" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"#FDFCF9",marginBottom:3}}>{t}</div>
                  <div style={{fontSize:13,color:"rgba(253,252,249,0.45)",fontWeight:300,lineHeight:1.5}}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUOTE */}
      <div style={{background:"#C4956A",padding:"72px 48px",textAlign:"center"}}>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(22px,3vw,38px)",color:"#fff",lineHeight:1.3,maxWidth:720,margin:"0 auto 16px"}}>"You can't change what you don't measure. And you can't heal what you won't address."</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.6)",fontWeight:300}}>— Wild Bloom Wellness House</div>
      </div>

      {/* DEMO FORM */}
      <div id="demo" style={{background:"#F5F0EA",padding:"110px 48px",textAlign:"center"}}>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(32px,4vw,56px)",color:"#1E1A14",lineHeight:1.1,marginBottom:16,maxWidth:660,marginLeft:"auto",marginRight:"auto"}}>See WellPulse in action</h2>
        <p style={{fontSize:17,color:"#6B5D4F",fontWeight:300,lineHeight:1.7,maxWidth:500,margin:"0 auto 44px"}}>Request a live demo and an honest conversation. No pressure. No script.</p>
        <div style={{background:"#FDFCF9",border:"1px solid #E2D9CE",borderRadius:12,padding:44,maxWidth:540,margin:"0 auto",boxShadow:"0 4px 32px rgba(30,26,20,0.1)",textAlign:"left"}}>
          {submitted ? (
            <div style={{textAlign:"center",padding:"36px 20px"}}>
              <div style={{width:58,height:58,borderRadius:"50%",background:"#EEF3EE",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:24}}>✓</div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#1E1A14",marginBottom:8}}>Request received!</div>
              <div style={{fontSize:14,color:"#6B5D4F",fontWeight:300,lineHeight:1.65}}>Miranda from Wild Bloom Wellness House will be in touch within 24 hours.</div>
            </div>
          ) : (
            <>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#1E1A14",marginBottom:4}}>Request a Demo</div>
              <div style={{fontSize:14,color:"#B0A090",fontWeight:300,marginBottom:24}}>We respond within 24 hours — personally.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["First Name","firstName","text","Jane"],["Last Name","lastName","text","Smith"],["Work Email","email","email","jane@company.com"],["Company","company","text","Acme Corp"]].map(([l,k,t,p])=>(
                  <div key={k}>
                    <label style={{display:"block",fontSize:11,fontWeight:600,color:"#6B5D4F",textTransform:"uppercase",letterSpacing:".05em",marginBottom:5}}>{l}</label>
                    <input type={t} value={formData[k]} onChange={e=>setFormData({...formData,[k]:e.target.value})} placeholder={p} style={{width:"100%",padding:"9px 12px",border:"1.5px solid #E2D9CE",borderRadius:4,fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#1E1A14",background:"#F5F0EA",outline:"none"}}/>
                  </div>
                ))}
                <div style={{gridColumn:"1/-1"}}>
                  <label style={{display:"block",fontSize:11,fontWeight:600,color:"#6B5D4F",textTransform:"uppercase",letterSpacing:".05em",marginBottom:5}}>Biggest challenge right now? (optional)</label>
                  <textarea value={formData.challenge} onChange={e=>setFormData({...formData,challenge:e.target.value})} placeholder="e.g. High turnover and we don't know why..." style={{width:"100%",padding:"10px 12px",border:"1.5px solid #E2D9CE",borderRadius:4,fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#1E1A14",background:"#F5F0EA",outline:"none",resize:"vertical",minHeight:72,lineHeight:1.5}}/>
                </div>
              </div>
              <button onClick={handleDemo} disabled={sending} style={{width:"100%",padding:13,background:"#1E1A14",color:"#fff",border:"none",borderRadius:4,fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:600,cursor:"pointer",marginTop:14}}>{sending?"Sending...":"Request My Demo →"}</button>
              <p style={{fontSize:12,color:"#B0A090",fontWeight:300,textAlign:"center",marginTop:12}}>Your information is never shared or sold.</p>
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:"#1E1A14",padding:"56px 48px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:"#fff",marginBottom:5}}>WellPulse</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.35)",fontWeight:300}}>Powered by Wild Bloom Wellness House · Miranda@wildbloomwellnesshouse.com</div>
          </div>
          <div style={{display:"flex",gap:24}}>
            {[["How It Works","#how"],["Coaching","#coaching"],["Who It's For","#who"]].map(([l,h])=>(
              <a key={l} href={h} style={{fontSize:13,color:"rgba(255,255,255,0.35)",textDecoration:"none"}}>{l}</a>
            ))}
            <button onClick={onSignIn} style={{fontSize:13,color:"rgba(255,255,255,0.35)",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

function AuthScreen({ onBack }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", department:"Engineering", role:"employee", companyCode:"", companyName:"" });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [st, setSt] = useState("join");

  async function login(e) {
    e.preventDefault(); setError(""); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email:form.email, password:form.password });
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

// ─── LEADERSHIP APP ───────────────────────────────────────────────────────────

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
    { id:"reports", label:"Reports", d:<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
    { id:"actions", label:"Action Center", d:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></> },
  ];
  const toolsNav = [
    { id:"stress", label:"Stress Management", d:<><path d="M17 8C8 10 5.9 16.17 3.82 19.34c-.2.3.1.66.44.55C5.77 19.26 8.15 18.31 10 17"/><path d="M14 2s1 2 1 4-2 4-2 4"/></> },
    { id:"neuro", label:"Team Practices", d:<><path d="M12 5a3 3 0 10-5.997.125 4 4 0 00-2.526 5.77 4 4 0 00.556 6.588A4 4 0 1012 18"/><path d="M12 5a3 3 0 115.997.125 4 4 0 012.526 5.77 4 4 0 01-.556 6.588A4 4 0 1112 18"/></> },
    { id:"resources", label:"Resources Library", d:<><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></> },
  ];
  const coachingNav = [
    { id:"coaching", label:"Coaching Hub", d:<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></> },
    { id:"schedule", label:"Monthly Check-Ins", d:<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
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
            {analyticsNav.map(item=>(<div key={item.id} className={"sb-item "+(page===item.id?"on":"")} onClick={()=>setPage(item.id)}><svg className="sb-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.d}</svg>{item.label}</div>))}
            <div className="sb-sec">Wellness Tools</div>
            {toolsNav.map(item=>(<div key={item.id} className={"sb-item "+(page===item.id?"on":"")} onClick={()=>setPage(item.id)}><svg className="sb-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.d}</svg>{item.label}</div>))}
            <div className="sb-sec">Wild Bloom Coaching</div>
            {coachingNav.map(item=>(<div key={item.id} className={"sb-item "+(page===item.id?"on":"")} onClick={()=>setPage(item.id)}><svg className="sb-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.d}</svg>{item.label}</div>))}
            <div className="sb-sec">Workspace</div>
            {companyNav.map(item=>(<div key={item.id} className={"sb-item "+(page===item.id?"on":"")} onClick={()=>setPage(item.id)}><svg className="sb-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.d}</svg>{item.label}</div>))}
          </div>
          <div style={{padding:"16px 18px",borderTop:"1px solid var(--border)"}}>
            <div style={{fontSize:10,color:"var(--faint)",fontWeight:300}}>Powered by</div>
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
              {page==="actions" && <ActionCenterPage checkins={checkins} user={user}/>}
              {page==="resources" && <ResourcesPage/>}
              {page==="coaching" && <CoachingHubPage user={user}/>}
              {page==="schedule" && <MonthlyCheckInPage user={user}/>}
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
  const [companyInfo, setCompanyInfo] = useState(null);
  const [teamSizeInput, setTeamSizeInput] = useState("");
  const [savingSize, setSavingSize] = useState(false);

  useEffect(()=>{
    if(user.company_code) {
      supabase.from("companies").select("name,team_size,status,tier").eq("code",user.company_code).maybeSingle()
        .then(({data})=>{ if(data) { setCompanyInfo(data); setTeamSizeInput(data.team_size||""); } });
    }
  },[]);

  async function saveTeamSize() {
    setSavingSize(true);
    await supabase.from("companies").update({team_size:parseInt(teamSizeInput)||null}).eq("code",user.company_code);
    setCompanyInfo(prev=>({...prev,team_size:parseInt(teamSizeInput)||null}));
    setSavingSize(false);
  }

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
    const lwItems = lw.filter(c=>c.department===dept);
    const lwScore = lwItems.length ? Math.round(lwItems.reduce((a,b)=>a+Math.round((b.stress+b.workload+b.relationships+b.manager+b.balance)/5),0)/lwItems.length) : null;
    const weekTrend = lwScore !== null ? score - lwScore : null;
    return { dept, score, weekTrend, stress:avg("stress"), workload:avg("workload"), relationships:avg("relationships"), manager:avg("manager"), balance:avg("balance"), count:items.length };
  }).filter(Boolean).sort((a,b)=>a.score-b.score);

  const overall = ds.length ? Math.round(ds.reduce((a,b)=>a+b.score,0)/ds.length) : 0;
  const lastOverall = lw.length ? Math.round(lw.reduce((a,b)=>a+Math.round((b.stress+b.workload+b.relationships+b.manager+b.balance)/5),0)/lw.length) : 0;
  const trend = overall - lastOverall;
  const high = ds.filter(d=>getRisk(d.score)==="high").length;
  const teamSize = companyInfo?.team_size || null;
  const participationRate = teamSize ? Math.round((tw.length/teamSize)*100) : null;
  const alerts = ds.filter(d=>d.weekTrend!==null && d.weekTrend<=-2);

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
      {alerts.length > 0 && (
        <div style={{marginBottom:16,display:"flex",flexDirection:"column",gap:8}}>
          {alerts.map(a=>(
            <div key={a.dept} style={{background:"var(--dlight)",border:"1px solid #E8B4A0",borderRadius:"var(--r)",padding:"10px 16px",display:"flex",alignItems:"center",gap:12}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A0522D" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style={{fontSize:13,color:"var(--danger)",fontWeight:500}}><strong>{a.dept}</strong> dropped {Math.abs(a.weekTrend)} points this week — now at {a.score}/10.</span>
              <button onClick={async()=>{
                await supabase.from("support_requests").insert({ company_code:user.company_code||"", department:a.dept, week:cw, wellness_score:a.score, status:"pending" });
                try { await fetch("https://formspree.io/f/xkoybvjo",{ method:"POST", headers:{"Accept":"application/json","Content-Type":"application/json"}, body:JSON.stringify({ type:"Alert Miranda — Wellness Drop", company_code:user.company_code||"N/A", department:a.dept, score:a.score, drop:Math.abs(a.weekTrend), _subject:`Alert — ${a.dept} dropped to ${a.score}/10 — ${user.company_code||"N/A"}` }) }); } catch(e){}
                window.location.href=`mailto:Miranda@wildbloomwellnesshouse.com?subject=Alert — ${a.dept} Wellness Drop&body=Hi Miranda, ${a.dept} dropped ${Math.abs(a.weekTrend)} points this week to ${a.score}/10.`;
              }} style={{marginLeft:"auto",fontSize:11,padding:"4px 12px",background:"var(--danger)",color:"#fff",border:"none",borderRadius:20,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>Alert Miranda</button>
            </div>
          ))}
        </div>
      )}
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
          <div className="kpi-lb">Participation</div>
          <div className="kpi-v" style={{color:participationRate&&participationRate<50?"#A0522D":participationRate&&participationRate<75?"#C4956A":"#5C7A5C"}}>{participationRate!==null?participationRate+"%":tw.length}</div>
          <div className="kpi-d">{participationRate!==null?tw.length+" of "+teamSize+" employees":"responses this week"}</div>
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
          <div className="card" style={{marginBottom:16}}>
            <div className="ct">Department Ranking — Healthiest to Most At Risk <div className="ct-line"/></div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[...ds].sort((a,b)=>b.score-a.score).map((d,i)=>(
                <div key={d.dept} style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:i===0?"var(--alight)":i===ds.length-1&&getRisk(d.score)==="high"?"var(--dlight)":"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:i===0?"var(--accent)":i===ds.length-1&&getRisk(d.score)==="high"?"var(--danger)":"var(--faint)",flexShrink:0}}>{i+1}</div>
                  <div style={{fontSize:13,fontWeight:500,minWidth:120}}>{d.dept}</div>
                  <div style={{flex:1,height:8,background:"var(--border)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${d.score*10}%`,background:getRiskColor(d.score),borderRadius:4}}/></div>
                  <div style={{fontSize:13,fontWeight:700,color:getRiskColor(d.score),minWidth:36,textAlign:"right"}}>{d.score}/10</div>
                  <span className={"badge "+getRisk(d.score)} style={{minWidth:90,justifyContent:"center"}}><span className="badge-dot"/>{getRiskLabel(d.score)}</span>
                  {d.weekTrend!==null && <span style={{fontSize:11,fontWeight:600,color:d.weekTrend>0?"var(--accent)":d.weekTrend<0?"var(--danger)":"var(--faint)",minWidth:32,textAlign:"right"}}>{d.weekTrend>0?"↑"+d.weekTrend:d.weekTrend<0?"↓"+Math.abs(d.weekTrend):"—"}</span>}
                  <div style={{fontSize:11,color:"var(--faint)",minWidth:60,textAlign:"right"}}>{d.count} {d.count===1?"response":"responses"}</div>
                </div>
              ))}
            </div>
          </div>
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
    const rows = ds.map(d=>`${d.dept}\n  Score: ${d.score}/10  Risk: ${getRiskLabel(d.score)}  Responses: ${d.count}`).join("\n\n");
    const content = `WELLPULSE WELLNESS REPORT\n${"─".repeat(48)}\nCompany Code : ${user.company_code||"N/A"}\nGenerated    : ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}\nPeriod       : ${cw}\n\nOverall Score: ${overall}/10\n\n${rows}\n\nGenerated by WellPulse`;
    const blob = new Blob([content],{type:"text/plain"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `WellPulse-${new Date().toISOString().split("T")[0]}.txt`; a.click();
  }

  return (
    <div className="main">
      <div className="ph"><div className="crumb">WellPulse · Reports</div><div className="ph-title">Wellness Reports</div><div className="ph-sub">Export and review detailed reports for leadership review</div></div>
      <div className="card" style={{marginBottom:14}}>
        <div className="ct">Export Report <div className="ct-line"/></div>
        <p style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.6,marginBottom:16}}>Export a complete wellness report for <strong>{cw||"the current period"}</strong>.</p>
        <button className="btn-dk" onClick={exportReport}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Report
        </button>
      </div>
      <div className="card">
        <div className="ct">Report Preview — {cw||"No data"} <div className="ct-line"/></div>
        {ds.length===0 ? <div className="empty"><div className="empty-t">No data to report</div></div> : (
          <table className="tbl">
            <thead><tr><th>Department</th><th>Score</th><th>Risk</th><th>Recommendation</th></tr></thead>
            <tbody>
              {ds.map(d=>(
                <tr key={d.dept}>
                  <td style={{fontWeight:500}}>{d.dept}</td>
                  <td style={{fontWeight:600,color:getRiskColor(d.score)}}>{d.score}/10</td>
                  <td><span className={`badge ${getRisk(d.score)}`}><span className="badge-dot"/>{getRiskLabel(d.score)}</span></td>
                  <td style={{fontSize:12,color:"var(--soft)",fontWeight:300}}>{getRisk(d.score)==="high"?"Immediate leadership intervention recommended.":getRisk(d.score)==="medium"?"Monitor closely. Consider targeted support.":"Maintain current team practices."}</td>
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
  const [checkingOut, setCheckingOut] = useState(null);
  const [seats, setSeats] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(()=>{
    if(user.company_code){
      supabase.from("companies").select("status,plan,tier,team_size").eq("code",user.company_code).maybeSingle()
        .then(({data})=>{ if(data) setCompanyInfo(data); });
    }
  },[]);

  const STRIPE_LINKS = {
    insights: "https://buy.stripe.com/bJeeVcfLt4dE9SJdpCbEA00",
    optimize: "https://buy.stripe.com/8x2dR89n5eSi6GxadqbEA01",
    transform: "https://buy.stripe.com/dRm5kCfLtbG65Ct4T6bEA02",
  };

  function startCheckout(tier) {
    if (!seats || parseInt(seats) < 1) { alert("Please enter the number of employees first."); return; }
    setCheckingOut(tier);
    const link = STRIPE_LINKS[tier];
    const qty = parseInt(seats);
    const code = user.company_code || "";
    window.open(`${link}?prefilled_quantity=${qty}&quantity=${qty}&client_reference_id=${code}&prefilled_email=${user.email||""}`, '_blank');
    setCheckingOut(null);
  }

  function copyCode() {
    navigator.clipboard.writeText(user.company_code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tierLabels = { insights:"Insight", optimize:"Optimize", transform:"Transform" };
  const tierColors = { insights:"var(--accent)", optimize:"var(--amber)", transform:"var(--ink)" };

  return (
    <div className="main">
      <div className="ph"><div className="crumb">WellPulse · Company Settings</div><div className="ph-title">Company Settings</div><div className="ph-sub">Manage your workspace and employee access</div></div>
      <div className="card" style={{marginBottom:14}}>
        <div className="ct">Subscription <div className="ct-line"/></div>
        {companyInfo && (
          <div style={{marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:600,color:"var(--ink)",marginBottom:3}}>Current Plan: <span style={{color:tierColors[companyInfo.tier]||"var(--accent)"}}>WellPulse {tierLabels[companyInfo.tier]||"Insight"}</span></div>
            <div style={{fontSize:12,color:"var(--soft)",fontWeight:300}}>Status: <span style={{fontWeight:600,color:companyInfo.status==="active"?"var(--accent)":companyInfo.status==="trial"?"var(--warn)":"var(--danger)",textTransform:"capitalize"}}>{companyInfo.status||"Trial"}</span></div>
          </div>
        )}
        <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"16px",marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:600,color:"var(--ink)",marginBottom:8}}>Upgrade or subscribe</div>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
            <input type="number" value={seats} onChange={e=>setSeats(e.target.value)} placeholder="e.g. 150" min="1" style={{width:100,padding:"8px 12px",border:"1.5px solid var(--border)",borderRadius:"var(--r)",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"var(--ink)",background:"var(--surface)",outline:"none"}}/>
            <span style={{fontSize:13,color:"var(--soft)",fontWeight:300}}>employees</span>
            {seats && parseInt(seats) > 0 && <span style={{fontSize:12,color:"var(--faint)",marginLeft:8}}>Insight: ${(8*parseInt(seats)).toLocaleString()}/mo · Optimize: ${(22*parseInt(seats)).toLocaleString()}/mo · Transform: ${(44*parseInt(seats)).toLocaleString()}/mo</span>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {[["insights","Insight","$8/employee","var(--alight)","var(--accent)"],["optimize","Optimize","$22/employee","var(--wlight)","var(--amber)"],["transform","Transform","$44/employee","var(--surface2)","var(--ink)"]].map(([tier,label,price,bg,color])=>(
              <div key={tier} style={{background:bg,border:"1px solid var(--border)",borderRadius:"var(--r)",padding:"12px",textAlign:"center"}}>
                <div style={{fontSize:12,fontWeight:700,color,marginBottom:2}}>{label}</div>
                <div style={{fontSize:11,color:"var(--faint)",marginBottom:10}}>{price}/month</div>
                <button onClick={()=>startCheckout(tier)} disabled={checkingOut===tier} style={{width:"100%",padding:"7px",background:color,color:"#fff",border:"none",borderRadius:"var(--r)",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>{checkingOut===tier?"Redirecting...":"Subscribe"}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card" style={{marginBottom:14}}>
        <div className="ct">Your Company Access Code <div className="ct-line"/></div>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
          <div style={{background:"var(--bg2)",border:"1.5px solid var(--border)",borderRadius:"var(--rl)",padding:"20px 32px",textAlign:"center",minWidth:200}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--faint)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Company Code</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:42,color:"var(--accent)",letterSpacing:6,lineHeight:1}}>{user.company_code || "N/A"}</div>
          </div>
          <button className="btn" style={{width:"auto",padding:"10px 24px",marginTop:0}} onClick={copyCode}>{copied ? "Copied!" : "Copy Code"}</button>
        </div>
      </div>
    </div>
  );
}

function ActionCenterPage({ checkins, user }) {
  const weeks = [...new Set(checkins.map(c=>c.week))];
  const cw = weeks[weeks.length-1];
  const depts = [...new Set(checkins.map(c=>c.department))].filter(Boolean);
  const thisWeek = checkins.filter(c=>c.week===cw);

  const deptSummary = depts.map(dept=>{
    const items = thisWeek.filter(c=>c.department===dept);
    if (!items.length) return null;
    const avg = k=>Math.round(items.reduce((a,b)=>a+(b[k]||0),0)/items.length);
    const score = Math.round((avg("stress")+avg("workload")+avg("relationships")+avg("manager")+avg("balance"))/5);
    return { dept, score };
  }).filter(Boolean).sort((a,b)=>a.score-b.score);

  const high = deptSummary.filter(d=>getRisk(d.score)==="high");
  const medium = deptSummary.filter(d=>getRisk(d.score)==="medium");
  const low = deptSummary.filter(d=>getRisk(d.score)==="low");

  const actions = [
    ...high.map(d=>({ priority:"urgent", dept:d.dept, score:d.score, title:`${d.dept} is at High Risk`, desc:`With a score of ${d.score}/10, this department needs immediate attention.`, steps:["Schedule a leadership check-in this week","Review recent workload and deadlines","Consider a team reset session with Wild Bloom","Monitor next week's check-in scores closely"], color:"var(--danger)", bg:"var(--dlight)" })),
    ...medium.map(d=>({ priority:"watch", dept:d.dept, score:d.score, title:`${d.dept} Needs Monitoring`, desc:`Score of ${d.score}/10 — trending toward risk. Proactive support now prevents escalation.`, steps:["Open a conversation with your team lead about workload","Implement a team practice from the Team Practices library","Schedule a group coaching session in the next 30 days","Check if deadlines or org changes are contributing"], color:"var(--warn)", bg:"var(--wlight)" })),
    ...low.map(d=>({ priority:"healthy", dept:d.dept, score:d.score, title:`${d.dept} is Thriving`, desc:`Score of ${d.score}/10 — this team is in a healthy place. Protect and sustain what's working.`, steps:["Acknowledge and celebrate this team's wellbeing","Document what practices are working here","Consider asking this team to mentor others","Continue monthly check-ins to maintain momentum"], color:"var(--accent)", bg:"var(--alight)" })),
  ];

  return (
    <div className="main">
      <div className="ph"><div className="crumb">WellPulse · Action Center</div><div className="ph-title">Action Center</div><div className="ph-sub">Recommended actions based on your current wellness data — {cw||"no data yet"}</div></div>
      {actions.length === 0 ? (
        <div className="card"><div className="empty"><div className="empty-t">No data yet</div></div></div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {actions.map((a,i)=>(
            <div key={i} className="card" style={{borderLeft:`4px solid ${a.color}`}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",background:a.bg,color:a.color,padding:"2px 8px",borderRadius:20}}>{a.priority==="urgent"?"Urgent Action":a.priority==="watch"?"Monitor Closely":"Healthy"}</span>
                    <span style={{fontSize:11,color:"var(--faint)"}}>Score: {a.score}/10</span>
                  </div>
                  <div style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:"var(--ink)",marginBottom:4}}>{a.title}</div>
                  <div style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.6,maxWidth:600}}>{a.desc}</div>
                </div>
              </div>
              <div style={{height:1,background:"var(--border)",margin:"12px 0"}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {a.steps.map((s,j)=>(
                  <div key={j} style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:a.bg,color:a.color,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{j+1}</div>
                    <span style={{fontSize:12,color:"var(--soft)",fontWeight:300,lineHeight:1.5}}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{marginTop:14}}>
                <button onClick={async()=>{
                  await supabase.from("support_requests").insert({ company_code:user.company_code||"", department:a.dept, week:cw, wellness_score:a.score, status:"pending" });
                  try { await fetch("https://formspree.io/f/xkoybvjo",{ method:"POST", headers:{"Accept":"application/json","Content-Type":"application/json"}, body:JSON.stringify({ type:"Coaching Request — Action Center", company_code:user.company_code||"N/A", department:a.dept, score:a.score, _subject:`Coaching Request — ${a.dept} — ${user.company_code||"N/A"}` }) }); } catch(e){}
                  window.location.href=`mailto:Miranda@wildbloomwellnesshouse.com?subject=Coaching Request — ${a.dept}&body=Hi Miranda, requesting coaching support for ${a.dept} (score: ${a.score}/10).`;
                }} style={{fontSize:12,padding:"7px 16px",background:"var(--ink)",color:"#fff",borderRadius:"var(--r)",border:"none",fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>Request Coaching for {a.dept}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResourcesPage() {
  const [open, setOpen] = useState(null);
  const resources = [
    { id:1, cat:"Leadership", title:"The Manager's Guide to Burnout Prevention", desc:"A practical framework for recognizing the early signs of burnout in your team before they become performance issues.", content:"Burnout rarely arrives suddenly. The three most reliable early signals are: a decline in the quality of work rather than the quantity, withdrawal from collaborative conversations, and an increase in cynicism or detachment. The right move is a private, low-stakes check-in conversation that asks about capacity, not output." },
    { id:2, cat:"Research", title:"Why High Performers Burn Out First", desc:"Counter-intuitive data on who is most at risk in your organization.", content:"The highest performers in any organization are statistically the most burnout-prone. They take on more because they can. They say yes because they're reliable. They don't ask for help because they've built an identity around not needing it. The best managers create deliberate capacity protection for their top performers." },
    { id:3, cat:"Communication", title:"How to Have a Burnout Conversation", desc:"A step-by-step guide for managers on initiating difficult conversations about stress and capacity.", content:"Structure: (1) Open with warmth. (2) Share a specific observation. (3) Ask an open question: 'What's been the heaviest part of your workload recently?' (4) Listen fully before responding. Do not problem-solve in the first conversation. (5) Close with an offer: 'What would feel most helpful right now?'" },
    { id:4, cat:"Culture", title:"Building Psychological Safety in Your Team", desc:"Based on Google's Project Aristotle — the research-backed practices that make teams perform at their highest level.", content:"Google's five-year study found that psychological safety was the single most important factor in team effectiveness. Building it requires four behaviors: (1) Model vulnerability. (2) Respond to bad news with curiosity, not blame. (3) Actively invite dissenting opinions. (4) Follow through on what you say you'll do." },
    { id:5, cat:"Research", title:"The Neuroscience of Stress at Work", desc:"What actually happens in the brain under chronic workplace stress.", content:"Chronic workplace stress accumulates at a level below conscious awareness, gradually raising baseline cortisol, narrowing cognitive bandwidth, and increasing amygdala reactivity. The prefrontal cortex — responsible for complex decision-making, empathy, and strategic thinking — is the first casualty of chronic stress." },
    { id:6, cat:"Leadership", title:"The 90-Day Retention Reset", desc:"A structured leadership program for stabilizing a team experiencing high turnover or collective burnout.", content:"A 90-day retention reset requires three parallel tracks: (1) Structural — audit workload, eliminate low-value work. (2) Relational — increase frequency and quality of 1-on-1 conversations. (3) Cultural — implement one team ritual per week that builds psychological safety." },
    { id:7, cat:"Neuroscience", title:"What Chronic Stress Does to Your Brain", desc:"The science behind why chronic workplace stress is a measurable, physical change to your brain's structure and function.", content:"Chronic stress physically shrinks the grey matter in the prefrontal cortex — the region responsible for decision-making, behavioral regulation, emotional control, and empathy. Research led by neuroscientist Amy Arnsten at Yale shows that even moderate chronic stress can impair prefrontal cortex function within weeks. The good news: the brain is neuroplastic and can recover." },
    { id:8, cat:"Neuroscience", title:"The Stress-Performance Curve — Where Are You?", desc:"Not all stress is harmful. Understanding this relationship helps leaders and employees optimize their zone.", content:"The Yerkes-Dodson curve shows that performance improves with stress — up to a point. In the optimal zone people are challenged, focused, and performing at their peak. Past that peak, performance collapses. WellPulse check-in data is a real-time map of where your departments sit on that curve." },
  ];

  return (
    <div className="main">
      <div className="ph"><div className="crumb">WellPulse · Resources Library</div><div className="ph-title">Resources Library</div><div className="ph-sub">Curated guides, research, and frameworks for leaders on burnout, retention, and team performance</div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
        {resources.map(r=>(
          <div key={r.id} className="card" style={{cursor:"pointer"}} onClick={()=>setOpen(open===r.id?null:r.id)}>
            <div style={{fontSize:10,fontWeight:700,color:"var(--amber)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>{r.cat}</div>
            <div style={{fontSize:15,fontWeight:600,color:"var(--ink)",marginBottom:6,lineHeight:1.3}}>{r.title}</div>
            <div style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.55,marginBottom:12}}>{r.desc}</div>
            {open===r.id && <div style={{marginBottom:12,padding:"14px 16px",background:"var(--surface2)",borderRadius:"var(--r)",fontSize:13,color:"var(--soft)",lineHeight:1.75,fontWeight:300,borderLeft:"3px solid var(--accent)"}}>{r.content}</div>}
            <div style={{fontSize:12,fontWeight:600,color:"var(--accent)"}}>{open===r.id?"— Read less":"+ Read more"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachingHubPage({ user }) {
  const [sent, setSent] = useState(null);
  const [sending, setSending] = useState(null);
  const services = [
    { id:"group", title:"Monthly Group Coaching Session", desc:"A facilitated 60-minute session for your leadership team or a specific department.", duration:"60 minutes", format:"Virtual or On-Site", tier:"Optimize + Transform" },
    { id:"onsite", title:"On-Site Team Workshop", desc:"A half or full-day workshop delivered at your location.", duration:"Half or Full Day", format:"On-Site", tier:"All Tiers (Add-On)" },
    { id:"leadership", title:"Leadership Intensive", desc:"An immersive retreat for senior leadership teams.", duration:"1–3 Days", format:"Off-Site Retreat", tier:"Transform + Add-On" },
    { id:"oneone", title:"1-on-1 Coaching Session", desc:"A confidential 50-minute coaching session with a certified Wild Bloom wellness coach.", duration:"50 minutes", format:"Virtual", tier:"Transform + Add-On" },
  ];

  async function requestService(service) {
    setSending(service.id);
    try {
      await fetch("https://formspree.io/f/xkoybvjo", { method:"POST", headers:{"Accept":"application/json","Content-Type":"application/json"}, body:JSON.stringify({ type:"Coaching Service Request", service:service.title, company_code:user.company_code||"N/A", _subject:`Coaching Request — ${service.title} — ${user.company_code||"N/A"}` }) });
    } catch(e) {}
    setSent(service.id); setSending(null);
  }

  return (
    <div className="main">
      <div className="ph"><div className="crumb">WellPulse · Coaching Hub</div><div className="ph-title">Coaching Hub</div><div className="ph-sub">Book coaching sessions and workshops directly with Wild Bloom Wellness House</div></div>
      <div className="card" style={{marginBottom:16,background:"var(--ink)",border:"none"}}>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:"#fff",marginBottom:4}}>Wild Bloom Wellness House</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.6)",fontWeight:300,lineHeight:1.6}}>Certified professional coaching for burnout recovery, stress management, and nervous system regulation.</div>
          </div>
          <a href="mailto:Miranda@wildbloomwellnesshouse.com" style={{padding:"10px 20px",background:"var(--accent)",color:"#fff",borderRadius:"var(--r)",textDecoration:"none",fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>Contact Miranda</a>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {services.map(s=>(
          <div key={s.id} className="card">
            <div style={{fontSize:10,fontWeight:700,color:"var(--accent)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>{s.tier}</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:"var(--ink)",marginBottom:6}}>{s.title}</div>
            <div style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.6,marginBottom:14}}>{s.desc}</div>
            <div style={{display:"flex",gap:16,marginBottom:14}}>
              <div style={{fontSize:12,color:"var(--faint)"}}>⏱ {s.duration}</div>
              <div style={{fontSize:12,color:"var(--faint)"}}>📍 {s.format}</div>
            </div>
            <button onClick={()=>requestService(s)} disabled={sending===s.id} style={{width:"100%",padding:"9px",background:sent===s.id?"var(--alight)":"var(--ink)",color:sent===s.id?"var(--accent)":"#fff",border:sent===s.id?"1px solid var(--accent)":"none",borderRadius:"var(--r)",fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer"}}>
              {sending===s.id?"Sending...":(sent===s.id?"✓ Request Sent to Miranda":"Request This Service")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyCheckInPage({ user }) {
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const month = new Date().toLocaleString("default",{month:"long",year:"numeric"});

  async function scheduleCheckIn() {
    try {
      await fetch("https://formspree.io/f/xkoybvjo", { method:"POST", headers:{"Accept":"application/json","Content-Type":"application/json"}, body:JSON.stringify({ type:"Monthly Check-In Request", month, company_code:user.company_code||"N/A", notes:note||"No notes provided", _subject:`Monthly Check-In Request — ${month} — ${user.company_code||"N/A"}` }) });
    } catch(e) {}
    setSubmitted(true);
  }

  return (
    <div className="main">
      <div className="ph"><div className="crumb">WellPulse · Monthly Check-Ins</div><div className="ph-title">Monthly Check-Ins</div><div className="ph-sub">Schedule your monthly leadership conversation with Wild Bloom</div></div>
      <div className="g2">
        <div className="card">
          <div className="ct">Schedule — {month} <div className="ct-line"/></div>
          <p style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.7,marginBottom:16}}>A 30-minute conversation with Miranda to review your WellPulse data, discuss what's working, and align on next steps.</p>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:600,color:"var(--soft)",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Notes for this month (optional)</label>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. Engineering scores dropped this week..." style={{width:"100%",padding:"10px 12px",border:"1.5px solid var(--border)",borderRadius:"var(--r)",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"var(--ink)",background:"var(--surface2)",outline:"none",resize:"vertical",minHeight:80,lineHeight:1.6}}/>
          </div>
          {submitted ? (
            <div style={{padding:"12px 14px",background:"var(--alight)",borderRadius:"var(--r)",fontSize:13,color:"var(--accent)"}}> ✓ Request sent to Miranda! She will respond within 24 hours.</div>
          ) : (
            <button className="btn" onClick={scheduleCheckIn} style={{marginTop:0}}>Schedule Monthly Check-In</button>
          )}
        </div>
        <div className="card">
          <div className="ct">What to Expect <div className="ct-line"/></div>
          {[["WellPulse Data Review","Miranda reviews your latest scores and trends before the call."],["Leadership Conversation","A 30-minute focused conversation on what the data means."],["Action Planning","Clear next steps — coaching, team sessions, or structural changes."],["Follow-Through","Miranda follows up if new data suggests your team needs support."]].map(([t,d])=>(
            <div key={t} style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"var(--accent)",flexShrink:0,marginTop:6}}/>
              <div><div style={{fontSize:13,fontWeight:600,color:"var(--ink)",marginBottom:2}}>{t}</div><div style={{fontSize:12,color:"var(--soft)",fontWeight:300,lineHeight:1.5}}>{d}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── EMPLOYEE APP ─────────────────────────────────────────────────────────────

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
    <>
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
          <div className="content mobile-content-pad">
            {page==="checkin" && <CheckInPage user={user}/>}
            {page==="stress" && <ToolkitPage tools={STRESS_TOOLS} title="Stress Management" subtitle="Evidence-based techniques to regulate your nervous system"/>}
            {page==="neuro" && <ToolkitPage tools={NEURO_TOOLS} title="Team Practices" subtitle="Neurological practices to implement in meetings and team settings"/>}
            {page==="history" && <HistoryPage user={user}/>}
            {page==="getsupport" && <SupportPage user={user}/>}
          </div>
        </div>
      </div>
      <nav className="mobile-nav">
        {nav.slice(0,5).map(item=>(
          <button key={item.id} className={`mobile-nav-item ${page===item.id?"on":""}`} onClick={()=>setPage(item.id)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.d}</svg>
            {item.label.split(' ')[0]}
          </button>
        ))}
      </nav>
    </>
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
    const s = Math.round((ans.stress + ans.workload + ans.relationships + ans.manager + ans.balance) / 5);
    await supabase.from("checkins").insert({ user_id:user.id, week:cw, department:user.department, company_code:user.company_code||"", ...ans });
    setScore(s);
    setDone(true); setSaving(false);
  }

  async function requestSupport() {
    // Save to Supabase
    await supabase.from("support_requests").insert({
      company_code: user.company_code || "",
      department: user.department,
      week: cw,
      wellness_score: score,
      status: "pending"
    });
    // Send email notification
    try {
      await fetch("https://formspree.io/f/xkoybvjo", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Support Request — Alert Miranda",
          company_code: user.company_code || "N/A",
          department: user.department,
          wellness_score: score,
          week: cw,
          _subject: `Support Request — ${user.company_code || "N/A"} — Score ${score}/10`
        })
      });
    } catch(e) {}
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
                <div style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.65,marginBottom:16}}>You don't have to navigate this alone. If you'd like to be connected with a certified wellness coach — completely confidentially — we're here to help.</div>
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
            <div className={`br-circle ${phase==="in"?"in":phase==="out"?"out":"hold"}`}>{phase==="in"?"Breathe In":phase==="out"?"Breathe Out":"Hold"}</div>
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
              {active.steps.map((s,i)=>(<li key={i} className="m-step"><span className="m-num">{i+1}</span><span>{s}</span></li>))}
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
    // Save to Supabase
    await supabase.from("support_requests").insert({
      company_code: user.company_code || "",
      department: user.department,
      week: getWeekLabel(),
      wellness_score: null,
      status: "pending",
      notes: note || null
    });
    // Send email
    try {
      await fetch("https://formspree.io/f/xkoybvjo", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Support Request — Get Support Page",
          company_code: user.company_code || "N/A",
          department: user.department,
          notes: note || "No notes provided",
          _subject: `Support Request — ${user.company_code || "N/A"} — Get Support Page`
        })
      });
    } catch(e) {}
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <div className="ci-wrap" style={{maxWidth:600}}>
      <div className="ci-card">
        {submitted ? (
          <div className="ci-done">
            <div className="ci-check"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5C7A5C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
            <h2>Request received</h2>
            <p style={{marginBottom:20}}>A certified wellness coach from Wild Bloom Wellness House will follow up through your company's HR team to arrange confidential support. You remain completely anonymous.</p>
            <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--rl)",padding:"16px 18px",textAlign:"left"}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--faint)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:4}}>Need immediate support?</div>
              <div style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.6}}>Contact Wild Bloom directly at <strong style={{color:"var(--ink)"}}>Miranda@wildbloomwellnesshouse.com</strong></div>
            </div>
          </div>
        ) : (
          <>
            <div className="ci-wk">Confidential Support</div>
            <div className="ci-title">Request Wellness Support</div>
            <div className="ci-sub" style={{marginBottom:28}}>Sometimes work feels overwhelming. You don't have to navigate it alone.</div>
            <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--rl)",padding:"18px 20px",marginBottom:24}}>
              <div style={{fontSize:13,fontWeight:500,color:"var(--ink)",marginBottom:8}}>How this works</div>
              {["Your request is completely anonymous — your name is never shared","A certified coach from Wild Bloom Wellness House will be notified","They will work with your HR team to arrange confidential 1-on-1 support","You control whether and how much you share in any coaching session"].map((s,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:"var(--accent)",color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
                  <div style={{fontSize:13,color:"var(--soft)",fontWeight:300,lineHeight:1.5}}>{s}</div>
                </div>
              ))}
            </div>
            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontSize:11,fontWeight:600,color:"var(--soft)",marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Optional — share a little context (anonymous)</label>
              <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. I have been feeling overwhelmed with workload lately..." style={{width:"100%",padding:"10px 12px",border:"1.5px solid var(--border)",borderRadius:"var(--r)",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"var(--ink)",background:"var(--surface2)",outline:"none",resize:"vertical",minHeight:90,lineHeight:1.6}}/>
            </div>
            <button className="btn" onClick={requestSupport} disabled={submitting} style={{marginTop:0}}>{submitting?"Submitting...":"Request Confidential Support"}</button>
            <div style={{marginTop:16,textAlign:"center",fontSize:12,color:"var(--faint)",fontWeight:300}}>Or contact Wild Bloom directly at <strong style={{color:"var(--soft)"}}>Miranda@wildbloomwellnesshouse.com</strong></div>
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
                  const s = Math.round((c.stress+c.workload+c.relationships+c.manager+c.balance)/5);
                  return (
                    <tr key={c.id}>
                      <td style={{fontSize:12,color:"var(--soft)"}}>{c.week}</td>
                      <td style={{fontWeight:600,color:getRiskColor(s)}}>{s}/10</td>
                      <td><span className={`badge ${getRisk(s)}`}><span className="badge-dot"/>{getRiskLabel(s)}</span></td>
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
