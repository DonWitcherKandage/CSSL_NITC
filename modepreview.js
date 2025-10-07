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

  // EDIT HERE with full schedule from https://nitc.lk/#schedule if needed
  // Times are SLT as shown on site
  const SCHEDULE = {
    'Inauguration': {
      date: '2025-10-14',
      items: [
        { time: '06:00 PM', title: 'Registration' },
        { time: '06:30 PM', title: 'Arrival of Chief Guests' },
        { time: '06:35 PM', title: 'National Anthem & Digital Lamp' },
        { time: '06:45 PM', title: 'Welcome Performance' },
        { time: '06:55 PM', title: 'Welcome Address' },
        { time: '07:10 PM', title: 'Awards Segment 1' },
        { time: '07:25 PM', title: 'Chief Guest Address' },
        { time: '07:45 PM', title: 'Guest of Honor Keynote' },
        { time: '08:05 PM', title: 'Sponsor Keynotes' },
        { time: '08:25 PM', title: 'Awards Segment 2' },
        { time: '08:45 PM', title: 'Closing & Vote of Thanks' },
        { time: '09:00 PM', title: 'Fellowship & Cocktail' }
      ]
    },
    'Day 1': {
      date: '2025-10-15',
      items: [
        // TODO: Replace with the full Day 1 sessions from nitc.lk/#schedule
        { time: '09:00 AM', title: 'Registration' },
        { time: '09:30 AM', title: 'Keynote' },
        { time: '10:15 AM', title: 'Panel Discussion' },
        { time: '11:00 AM', title: 'Tea Break' },
        { time: '11:15 AM', title: 'Workshop' },
        { time: '12:30 PM', title: 'Lunch Break' },
        { time: '02:00 PM', title: 'Panel Discussion' },
        { time: '03:15 PM', title: 'Sponsor Session' }
      ]
    },
    'Day 2': {
      date: '2025-10-16',
      items: [
        // TODO: Replace with the full Day 2 sessions from nitc.lk/#schedule
        { time: '09:00 AM', title: 'Registration' },
        { time: '09:30 AM', title: 'Keynote' },
        { time: '10:15 AM', title: 'Panel Discussion' },
        { time: '11:00 AM', title: 'Tea Break' },
        { time: '11:15 AM', title: 'Workshop' },
        { time: '12:30 PM', title: 'Lunch Break' },
        { time: '02:00 PM', title: 'Panel Discussion' },
        { time: '03:15 PM', title: 'Closing' }
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

  function bundleFromModel(day){
    if (!model) return null;
    const dateStr = (model.conferenceDates && model.conferenceDates[day]) || '';
    const list = model.getAgendaDataForDay ? model.getAgendaDataForDay(day) : model.getAgendaData();
    const items = Array.isArray(list) ? list.map(toItem) : [];
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

    if (today === dates['Day 1']){
      const b = bundleFromModel('Day 1') || bundleFromSchedule('Day 1');
      activate(b, 2);
    } else if (today === dates['Day 2']){
      const b = bundleFromModel('Day 2') || bundleFromSchedule('Day 2');
      activate(b, 2);
    } else {
      // Default: Inauguration with fixed 18:00 target
      const b = bundleFromModel('Inauguration') || bundleFromSchedule('Inauguration');
      window.setDay('Inauguration');
      window.setAgendaData(b.items);
      window.setCountdownTarget(b.date || '2025-10-14', '18:00');
    }
  }

  // Initial apply and periodic refresh
  evaluate();
  setInterval(evaluate, 30000);
})();
