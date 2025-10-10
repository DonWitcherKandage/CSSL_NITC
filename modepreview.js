/* Controller for Folded LED Display: switches days and sets countdown without modifying model.js */
(function(){
  // Ensure the page’s exposed hooks exist
  if (!window.setAgendaData || !window.setCountdownTarget || !window.setDay) {
    console.warn('modepreview: required hooks not found. Aborting.');
    return;
  }

  // Optional model; we won’t modify it
  let model = null;
  try { model = new ConferenceModel(); } catch(e){ console.warn('modepreview: model not available, using local schedule.', e); }

  // Fallback schedule mirrors model.js exactly (displayTime as on the event)
  const SCHEDULE = {
    'Inauguration': {
      date: '2025-10-14',
      items: [
        { time: '05:00 PM', title: 'Registration' },
        { time: '06:00 PM', title: 'Arrival of Chief Guest' },
        { time: '06:05 PM', title: 'Lighting of Digital Lamp' },
        { time: '06:10 PM', title: 'NITC 2025 Curtain Raiser' },
        { time: '06:20 PM', title: 'CSSL National ICT Awards' },
        { time: '06:45 PM', title: 'Address by the Chief Guest' },
        { time: '06:55 PM', title: 'Keynote: Guest of Honor' },
        { time: '07:15 PM', title: 'Keynote: Strategic Partner' },
        { time: '07:25 PM', title: 'Dance Act 2' },
        { time: '07:30 PM', title: 'CSSL ICT Awards 2024' },
        { time: '07:40 PM', title: 'CSSL ICT Awards 2024' },
        { time: '07:50 PM', title: 'Keynote Speaker (Diamond Sponsor 1)' },
        { time: '07:55 PM', title: 'Keynote Speaker (Diamond Sponsor 2)' },
        { time: '08:00 PM', title: 'Sponsor Recognition of the NITC 2024' },
        { time: '08:10 PM', title: 'Final Dance Act' },
        { time: '08:15 PM', title: 'Vote of Thanks' },
        { time: '08:20 PM', title: 'Fellowship & Cocktail' }
      ]
    },
    'Day 1': {
      date: '2025-10-15',
      items: [
        { time: '08:15 AM', title: 'Registration' },
        { time: '09:00 AM', title: 'Guest speech' },
        { time: '09:20 AM', title: 'Keynote 1: Mastercard' },
        { time: '09:45 AM', title: 'Panel Discussion 1' },
        { time: '10:45 AM', title: 'Morning Tea' },
        { time: '11:20 AM', title: 'Keynote 2: DMS' },
        { time: '11:45 AM', title: 'Keynote 3: SAT' },
        { time: '12:10 PM', title: 'Keynote 4' },
        { time: '12:35 PM', title: 'Mr. Sumudu Rathnayake' },
        { time: '01:00 PM', title: 'Lunch' },
        { time: '02:00 PM', title: 'Fintech: Mr. Shashi Madanayake' },
        { time: '02:25 PM', title: 'Fintech: Mr. Karthik Kishore' },
        { time: '02:50 PM', title: 'Fintech: Mr. Mahesh Patel' },
        { time: '03:15 PM', title: 'Afternoon Tea' },
        { time: '03:35 PM', title: 'EduTech: Dr. Dayan Rajapakse' },
        { time: '04:00 PM', title: 'TravelTech: Mr. Aruna Basnayake' },
        { time: '04:25 PM', title: 'Cybersecurity: Mr. Sampath Wimalaweera' },
        { time: '04:50 PM', title: 'Raffle Draw' }
      ]
    },
    'Day 2': {
      date: '2025-10-16',
      items: [
        { time: '08:30 AM', title: 'Registration' },
        { time: '09:00 AM', title: 'Guest Speech' },
        { time: '09:20 AM', title: 'Keynote 5' },
        { time: '09:45 AM', title: 'Keynote 6' },
        { time: '10:10 AM', title: 'Keynote 7' },
        { time: '10:35 AM', title: 'Morning Tea' },
        { time: '11:00 AM', title: 'Huawei Representative Keynote' },
        { time: '11:25 AM', title: 'Panel Discussion 2' },
        { time: '12:25 PM', title: 'Lunch' },
        { time: '01:40 PM', title: 'InfoSec: Mr. Joseph McGuire' },
        { time: '02:05 PM', title: 'InfoSec: Mr. Mohnissh Manukulasuriya' },
        { time: '02:30 PM', title: 'Big Data Analysis' },
        { time: '02:55 PM', title: 'Afternoon Tea' },
        { time: '03:30 PM', title: 'Digital Infrastructure: Mr. Ashok Srinivasan' },
        { time: '03:55 PM', title: 'Digital Infrastructure: Mr. Vijay Balan' },
        { time: '04:20 PM', title: 'Digital Transport: Mr. Udana Wickramasinghe' },
        { time: '04:45 PM', title: 'Raffle Draw' }
      ]
    }
  };

  // Helper: map to UI
  const toItem = (s) => ({ displayTime: s.displayTime || s.time || '', title: s.title || '' });

  // Compute first session start (HH:MM 24h)
  function firstSessionTime(items){
    const times = items
      .map(i => (i.time || i.displayTime || '').toString())
      .map(t => {
        const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (!m) return null;
        let h = parseInt(m[1],10);
        const mm = parseInt(m[2],10);
        const ap = (m[3]||'').toUpperCase();
        if (ap==='PM' && h<12) h+=12;
        if (ap==='AM' && h===12) h=0;
        return {h, m:mm};
      })
      .filter(Boolean)
      .sort((a,b)=> a.h!==b.h? a.h-b.h : a.m-b.m);
    if (times.length===0) return {h:9, m:0};
    return times[0];
  }

  function bundleFromSchedule(day){
    const d = SCHEDULE[day] || {date:'', items:[]};
    const items = (d.items||[]).map(toItem);
    const first = firstSessionTime(items);
    return { label: day, date: d.date, items, first };
  }

  // Prefer model data per-day when available
  function toDisplayTime(it){
    if (it.displayTime) return it.displayTime;
    const t = String(it.time||'');
    const m = t.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return t;
    let h = parseInt(m[1],10), mm = m[2];
    const ap = h>=12 ? 'PM':'AM';
    const h12 = h===0?12:(h>12? h-12 : h);
    return `${h12}:${mm} ${ap}`;
  }
  function bundleFromModel(day){
    if (!model) return null;
    const dateStr = (model.conferenceDates && model.conferenceDates[day]) || '';
    const list = (model.allAgendaData && model.allAgendaData[day]) || [];
    const items = Array.isArray(list) ? list.map(it=>({ displayTime: toDisplayTime(it), title: it.title||'' })) : [];
    const first = firstSessionTime(items);
    return { label: day, date: dateStr, items, first };
  }

  function setCountdownFrom(dateStr, h, m){
    const hh = String(h).padStart(2,'0');
    const mm = String(m).padStart(2,'0');
    window.setCountdownTarget(dateStr, hh+':'+mm);
  }

  function minusHours(h, m, delta){
    let total = h*60 + m - delta*60;
    if (total < 0) total = 0;
    return {h: Math.floor(total/60), m: total%60};
  }

  function activate(bundle, preHours){
    window.setDay(bundle.label);
    window.setAgendaData(bundle.items);
    const pre = minusHours(bundle.first.h, bundle.first.m, preHours);
    setCountdownFrom(bundle.date, pre.h, pre.m);
  }

  function todayYMD(){
    const local = new Date();
    const yyyy = local.getFullYear();
    const mm = String(local.getMonth()+1).padStart(2,'0');
    const dd = String(local.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function evaluate(){
    const dates = (model && model.conferenceDates) || {
      'Inauguration': SCHEDULE['Inauguration'].date,
      'Day 1': SCHEDULE['Day 1'].date,
      'Day 2': SCHEDULE['Day 2'].date
    };
    const today = todayYMD();
    const now = new Date();

    function lastEnd(items){
      // estimate last end as last time + 30 minutes
      if (!items.length) return {h:23,m:59};
      const last = items[items.length-1].displayTime || items[items.length-1].time || '23:59';
      const m = last.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!m){ return {h:23,m:59}; }
      let h = parseInt(m[1],10), mm = parseInt(m[2],10); const ap=(m[3]||'').toUpperCase();
      if (ap==='PM' && h<12) h+=12; if (ap==='AM' && h===12) h=0;
      const total = h*60+mm+30; return {h: Math.min(23, Math.floor(total/60)), m: total%60};
    }

    const todayDay = today===dates['Day 1'] ? 'Day 1' : today===dates['Day 2'] ? 'Day 2' : 'Inauguration';
    const todayBundle = bundleFromModel(todayDay) || bundleFromSchedule(todayDay);
    const nextDay = todayDay==='Inauguration' ? 'Day 1' : todayDay==='Day 1' ? 'Day 2' : null;

    // Determine if current day is finished (after last item + buffer)
    let finished = false;
    if (todayBundle && todayBundle.items.length){
      const le = lastEnd(todayBundle.items);
      const nowH = now.getHours(), nowM = now.getMinutes();
      finished = (nowH>le.h) || (nowH===le.h && nowM>=le.m);
    }

    if (finished && nextDay){
      const nb = bundleFromModel(nextDay) || bundleFromSchedule(nextDay);
      activate(nb, 2);
    } else {
      if (todayDay==='Inauguration'){
        // Inaug fixed target at 18:00 on its date (matching original behavior)
        const b = todayBundle;
        window.setDay('Inauguration');
        window.setAgendaData(b.items);
        window.setCountdownTarget(b.date || dates['Inauguration'], '18:00');
      } else {
        activate(todayBundle, 2);
      }
    }
  }

  // Initial apply and periodic refresh
  evaluate();
  setInterval(evaluate, 30000);
})();
