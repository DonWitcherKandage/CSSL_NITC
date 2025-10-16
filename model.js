/* ============================================================================
   MODEL - DATA LAYER (MVC Architecture) - WITH AUTOMATIC DAY DETECTION
   ============================================================================ */

/**
 * ConferenceModel - Manages all data and business logic with automatic day switching
 */
class ConferenceModel {
    constructor() {
        // Get today's date
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        // Conference dates (REAL): Oct 14, 15, 16
        this.conferenceDates = {
            'Inauguration': '2025-10-14',
            'Day 1': '2025-10-15',
            'Day 2': '2025-10-16'
        };
        
        // Automatically detect current day based on real date
        this.currentDay = this.detectCurrentDay();
        console.log(`Conference day automatically detected: ${this.currentDay}`);
        
        // Build exact agenda for Oct 14–16 and shorten descriptions for Screen 2
        this.allAgendaData = this.normalizeAgendaData(this.buildStaticAgenda());
        
        // Current state - Always use real-time mode
        this.currentEventIndex = -1; // -1 means no current event (before/after schedule)
        this.isAutoMode = false; // Manual mode disabled for real-time
        this.lastRealTimeCheck = null; // Track when we last checked real time
        this.conferenceStatus = 'waiting'; // waiting, active, completed
        this.timeOffsetMinutes = 0;
        
        // Check for day changes every minute
        this.setupDayChangeDetection();
    }

    /**
     * Apply external agenda and dates (e.g., parsed from Agenda-NITC-Shorten.xlsx)
     * payload: { allAgendaData: {DayName:[{time,displayTime,title,description,duration?}]}, conferenceDates: {DayName:'YYYY-MM-DD'} }
     */
    applyExternalAgenda(payload) {
        try {
            if (payload?.allAgendaData) this.allAgendaData = this.normalizeAgendaData(payload.allAgendaData);
            if (payload?.conferenceDates) this.conferenceDates = payload.conferenceDates;
            // Re-evaluate day and reset state
            this.currentDay = this.detectCurrentDay();
            this.currentEventIndex = -1;
            this.conferenceStatus = 'waiting';
            console.log('External agenda applied. Current day:', this.currentDay);
            if (window.conferenceApp?.view) {
                window.conferenceApp.view.updateConferenceDay(this.currentDay);
            }
        } catch (e) {
            console.error('Failed to apply external agenda:', e);
        }
    }

    /**
     * Truncate text to a character limit without breaking words, appending ellipsis if needed
     */
    truncateText(text, maxChars = 220) {
        try {
            if (!text || typeof text !== 'string') return text;
            const trimmed = text.trim().replace(/\s+/g, ' ');
            if (trimmed.length <= maxChars) return trimmed;
            const cut = trimmed.slice(0, maxChars);
            const lastSpace = cut.lastIndexOf(' ');
            return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + '…';
        } catch {
            return text;
        }
    }

    /**
     * Normalize agenda data by truncating descriptions for better fit on Screen 2.
     * Targets roughly 3–4 lines at the current font size in 256px width.
     */
    normalizeAgendaData(agendaByDay) {
        // Return agenda with full descriptions (no truncation)
        const out = {};
        try {
            for (const day of Object.keys(agendaByDay)) {
                out[day] = (agendaByDay[day] || []).map(item => ({
                    ...item,
                    description: (item.description || '').trim()
                }));
            }
            return out;
        } catch {
            return agendaByDay;
        }
    }

    /**
     * Returns true if today's date is before the first conference day (Inauguration)
     */
    isBeforeConferenceStart() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const firstDay = this.conferenceDates['Inauguration'];
            return today < firstDay;
        } catch {
            return false;
        }
    }

    /**
     * Returns true if current time is at/after the final end time: 2025-10-16 17:00 SLT (UTC+05:30)
     */
    isAfterFinalEnd() {
        try {
            // 16:30 +05:30 is 11:00 UTC
            const finalEndUTC = new Date('2025-10-16T11:00:00Z');
            const now = new Date();
            return now.getTime() >= finalEndUTC.getTime();
        } catch {
            return false;
        }
    }

    /**
     * Convenience status: 'ended' when after final end, otherwise current conferenceStatus
     */
    getFinalEndStatus() {
        return this.isAfterFinalEnd() ? 'ended' : this.getConferenceStatus();
    }

    /**
     * Build exact agenda for Oct 14–16 using provided times and descriptions.
     * Durations are computed from successive item times; last item defaults to 10 minutes.
     */
    buildStaticAgenda() {
        const to24 = (s) => {
            // s like '5:00 PM' or '8.15 pm' -> 'HH:MM'
            const t = s.replace(/\./g, ':').replace(/\s+/g, '').toUpperCase();
            const m = t.match(/(\d{1,2}):(\d{2})(AM|PM)/);
            if (!m) return s; // assume already HH:MM
            let h = parseInt(m[1], 10);
            const min = parseInt(m[2], 10);
            const ampm = m[3];
            if (ampm === 'PM' && h !== 12) h += 12;
            if (ampm === 'AM' && h === 12) h = 0;
            return `${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
        };
        const disp = (hhmm) => {
            const [H,M] = hhmm.split(':').map(Number);
            const ap = H >= 12 ? 'PM' : 'AM';
            const h12 = H === 0 ? 12 : (H>12?H-12:H);
            return `${h12}:${String(M).padStart(2,'0')} ${ap}`;
        };
        const addMinutes = (hhmm, mins) => {
            const [H,M] = hhmm.split(':').map(Number);
            const total = H*60 + M + mins;
            const mod = ((total % (24*60)) + (24*60)) % (24*60);
            const nh = Math.floor(mod/60);
            const nm = mod % 60;
            return `${String(nh).padStart(2,'0')}:${String(nm).padStart(2,'0')}`;
        };
        const shiftTimes = (arr, mins) => arr.map(it => {
            const shifted = addMinutes(it.time, mins);
            return { ...it, time: shifted, displayTime: disp(shifted) };
        });
        const OFFSET_MINUTES = 0;
        const withDurations = (arr) => arr.map((it, i) => {
            const curM = parseInt(it.time.split(':')[0],10)*60 + parseInt(it.time.split(':')[1],10);
            const next = arr[i+1];
            let dur = 10;
            if (next) {
                const nm = parseInt(next.time.split(':')[0],10)*60 + parseInt(next.time.split(':')[1],10);
                dur = Math.max(5, nm - curM);
            }
            if (!next && it.title === 'Raffle Draw') {
                const endM = 16*60 + 30; // 4:30 PM end for raffle draw
                dur = Math.max(5, endM - curM);
            }
            return { ...it, duration: dur };
        });

        const inauguration = ([
            { time: to24('5:00 PM'), displayTime: '5:00 PM', title: 'Registration', description: 'Arrival of Guests and Registration.' },
            { time: to24('6:00 PM'), displayTime: '6:00 PM', title: 'Arrival of Chief Guest', description: 'Introduction of the Executive Council.' },
            { time: to24('6:05 PM'), displayTime: '6:05 PM', title: 'Lighting of Digital Lamp', description: 'Digital Lamp lighting to launch NITC 2025.' },
            { time: to24('6:10 PM'), displayTime: '6:10 PM', title: 'Welcome Dance', description: 'Welcome dance by dance troop.' },
            { time: to24('6:13 PM'), displayTime: '6:13 PM', title: 'NITC 2025 Curtain Raiser', description: 'Introduces CSSL & NITC and invites the CSSL President.' },
            { time: to24('6:20 PM'), displayTime: '6:20 PM', title: 'Welcome Address', description: 'Mr. Heshan Karunaratne, President/ Computer Society of Sri Lanka' },
            { time: to24('6:45 PM'), displayTime: '6:45 PM', title: 'Address by the Chief Guest', description: 'Address by His Excellency Anura Kumara Dissanayake' },
            { time: to24('6:55 PM'), displayTime: '6:55 PM', title: 'Keynote: Guest of Honor', description: 'Hon. Eranga Weeraratne, Deputy Minister of Digital Economy.' },
            { time: to24('7:15 PM'), displayTime: '7:15 PM', title: 'Keynote: Strategic Partner', description: 'Keynote by Mr. Sandun Hapugoda, Country Manager Mastercard.' },
            { time: to24('7:25 PM'), displayTime: '7:25 PM', title: 'Dance Act 2', description: 'Dance Act 2.' },
            { time: to24('7:30 PM'), displayTime: '7:30 PM', title: 'CSSL ICT Awards 2024', description: 'Secretary of Digital Economy, CSSL President, Project Chair, NITC 2025 Conference Chair.' },
            { time: to24('7:40 PM'), displayTime: '7:40 PM', title: 'CSSL ICT Awards 2024', description: 'Best Founder, ICT Student, Emerging ICT Leader of the Year.' },
            { time: to24('7:50 PM'), displayTime: '7:50 PM', title: 'Keynote Speaker (Diamond Sponsor 1)', description: 'DMS Software Technologies Mr. Lasantha Bogoda, Director/CEO.' },
            { time: to24('7:55 PM'), displayTime: '7:55 PM', title: 'Keynote Speaker (Diamond Sponsor 2)', description: 'SAT Group Mr. Feroze Kamardeen, Director.' },
            { time: to24('8:00 PM'), displayTime: '8:00 PM', title: 'Sponsor Recognition of the NITC 2024', description: 'Recognize NITC 2024 sponsors on stage.' },
            { time: to24('8:10 PM'), displayTime: '8:10 PM', title: 'Final Dance Act', description: 'Final dance act.' },
            { time: to24('8:15 PM'), displayTime: '8:15 PM', title: 'Vote of Thanks', description: 'Vote of Thanks by Conference Chair.' },
            { time: to24('8:20 PM'), displayTime: '8:20 PM', title: 'Fellowship & Cocktail', description: 'Fellowship & Cocktail.' }
        ]);

        const day1 = ([
            { time: to24('8:15 AM'), displayTime: '8:15 AM', title: 'Registration', description: 'Registration.' },
            { time: to24('9:00 AM'), displayTime: '9:00 AM', title: 'Guest speech', description: 'Guest speaker: Mr. Sanjaya Karunasena, CEO of GovTech.' },
            { time: to24('9:20 AM'), displayTime: '9:20 AM', title: 'Keynote 1: Mastercard', description: 'Mr. Sandun Hapugoda, Country Manager at Mastercard.' },
            { time: to24('9:45 AM'), displayTime: '9:45 AM', title: 'Panel Discussion 1', description: 'Human-Centric Integrated Public Services.' },
            { time: to24('10:45 AM'), displayTime: '10:45 AM', title: 'Morning Tea', description: 'Morning Tea.' },
            { time: to24('11:20 AM'), displayTime: '11:20 AM', title: 'Keynote 2: DMS', description: 'Mr. Yu Ka Chan, Director - Cloud Engineering ASEAN.' },
            { time: to24('11:45 AM'), displayTime: '11:45 AM', title: 'Keynote 3: SAT', description: 'Mr. Sudhir Jampala, National Manager at OpenText.' },
            { time: to24('12:10 PM'), displayTime: '12:10 PM', title: 'Keynote 4', description: 'Dr. Yasas V. Abeywickrama on taking SL Digital Businesses Global.' },
            { time: to24('12:35 PM'), displayTime: '12:35 PM', title: 'Mr. Sumudu Rathnayake', description: 'Driving financial inclusion through digital transformation.' },
            { time: to24('1:00 PM'), displayTime: '1:00 PM', title: 'Lunch', description: 'Lunch.' },
            { time: to24('2:00 PM'), displayTime: '2:00 PM', title: 'Fintech: Mr. Shashi Madanayake', description: 'Mastercard Mr. Shashi Madanayake.' },
            { time: to24('2:25 PM'), displayTime: '2:25 PM', title: 'Fintech: Mr. Mr. Vaibhav Chandra', description: 'Head of Business, Zscaler Sri Lanka' },
            { time: to24('2:50 PM'), displayTime: '2:50 PM', title: 'Fintech: Mr. Mahesh Patel', description: 'Aiken Director Products, Hitachi Payment Services (Pvt) Ltd.' },
            { time: to24('3:15 PM'), displayTime: '3:15 PM', title: 'Afternoon Tea', description: 'Afternoon Tea.' },
            { time: to24('3:35 PM'), displayTime: '3:35 PM', title: 'EduTech: Dr. Dayan Rajapakse', description: 'Responsible integration of AI in learning.' },
            { time: to24('4:00 PM'), displayTime: '4:00 PM', title: 'TravelTech: Mr. Aruna Basnayake', description: 'AI and personalization transforming travel experiences.' },
            { time: to24('4:25 PM'), displayTime: '4:25 PM', title: 'Cybersecurity: Mr. Sampath Wimalaweera', description: 'Unified Threat Detection with a Turnkey SOC Platform.' },
            { time: to24('4:50 PM'), displayTime: '4:50 PM', title: 'Raffle Draw', description: 'Raffle Draw.' }
        ]);

        const day2 = ([
            { time: to24('8:30 AM'), displayTime: '8:30 AM', title: 'Registration', description: 'Registration.' },
            { time: to24('9:00 AM'), displayTime: '9:00 AM', title: 'Guest Speech', description: 'Hon. Chathuranga Abeysinghe, Deputy Minister of Industry and Entrepreneurship Development.' },
            { time: to24('9:20 AM'), displayTime: '9:20 AM', title: 'Keynote 5', description: 'Mr. Nachiket Limaye, Principal, Services Business Development.' },
            { time: to24('9:45 AM'), displayTime: '9:45 AM', title: 'Keynote 6', description: 'Mr. Hari Krishnan, Technical Manager - Strategic Account Management.' },
            { time: to24('10:10 AM'), displayTime: '10:10 AM', title: 'Keynote 7', description: 'Mr.Jaspreet Singh Narang Customer Engineer Google Workspace, Google Cloud India.' },
            { time: to24('10:35 AM'), displayTime: '10:35 AM', title: 'Morning Tea', description: 'Morning Tea.' },
            { time: to24('11:00 AM'), displayTime: '11:00 AM', title: 'Keynote 8', description: 'Mr. Wang Yujue Data Center Architect, Huawei Asia-Pacific.' },
            { time: to24('11:25 AM'), displayTime: '11:25 AM', title: 'Panel Discussion 2', description: 'Business Automation and Agentic AI Mastercard, DMS, SAT, Fortinet.'},
            { time: to24('1:00 PM'), displayTime: '1:00 PM', title: 'Lunch', description: 'Lunch.' },
            { time: to24('2:00 PM'), displayTime: '2:00 PM', title: 'InfoSec: Mr. Joseph McGuire', description: 'Mastercard Principal, Innovation Consulting.' },
            { time: to24('2:25 PM'), displayTime: '2:25 PM', title: 'InfoSec: Mr. Mohnissh Manukulasuriya', description: 'Kaspersky Cybersecurity Framework for Resilience.' },
            { time: to24('2:50 PM'), displayTime: '2:50 PM', title: 'Big Data Analysis', description: 'Mr. Varuna Jayalath Country Director, Dell Technologies, Sri Lanka, and Maldives.' },
            { time: to24('3:15 PM'), displayTime: '3:15 PM', title: 'Digital Infrastructure: Mr. Ashok Srinivasan', description: 'Shaping digital infrastructure.' },
            { time: to24('3:40 PM'), displayTime: '3:40 PM', title: 'Digital Infrastructure: Mr. Vijay Balan', description: 'Intelligent IT financial management in human-centric society.' },
            { time: to24('4:05 PM'), displayTime: '4:05 PM', title: 'Raffle Draw', description: 'Raffle Draw.' }
        ]);

        const inaugurationShifted = withDurations(shiftTimes(inauguration, OFFSET_MINUTES));
        const day1Shifted = withDurations(shiftTimes(day1, OFFSET_MINUTES));
        const day2Shifted = withDurations(shiftTimes(day2, OFFSET_MINUTES));

        return { 'Inauguration': inaugurationShifted, 'Day 1': day1Shifted, 'Day 2': day2Shifted };
    }

    /**
     * Automatically detect which conference day it should be based on current date
     * @returns {string} Conference day name
     */
    detectCurrentDay() {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        
        console.log(`Today's date: ${today}`);
        console.log(`Conference dates:`, this.conferenceDates);
        
        // Check if today matches any conference date
        for (const [dayName, date] of Object.entries(this.conferenceDates)) {
            if (date === today) {
                console.log(`Found matching day: ${dayName} for date ${today}`);
                return dayName;
            }
        }
        
        // If no exact match, check if we're past certain dates
        const todayTime = new Date(today).getTime();
        
        // Check if today is after Day 2
        const day2Time = new Date(this.conferenceDates['Day 2']).getTime();
        if (todayTime > day2Time) {
            console.log(`Today is after Day 2, showing Day 2 content`);
            return 'Day 2';
        }
        
        // Check if today is after Day 1
        const day1Time = new Date(this.conferenceDates['Day 1']).getTime();
        if (todayTime > day1Time) {
            console.log(`Today is after Day 1, showing Day 1 content`);
            return 'Day 1';
        }
        
        // Check if today is after Inauguration
        const inaugurationTime = new Date(this.conferenceDates['Inauguration']).getTime();
        if (todayTime > inaugurationTime) {
            console.log(`Today is after Inauguration, showing Inauguration content`);
            return 'Inauguration';
        }
        
        // Default to Inauguration if before conference starts
        console.log(`Before conference starts, defaulting to Inauguration`);
        return 'Inauguration';
    }

    /**
     * Set up automatic day change detection
     */
    setupDayChangeDetection() {
        // Check for day changes every minute
        setInterval(() => {
            const detectedDay = this.detectCurrentDay();
            if (detectedDay !== this.currentDay) {
                console.log(`Day change detected: ${this.currentDay} → ${detectedDay}`);
                this.currentDay = detectedDay;
                this.currentEventIndex = -1; // Reset event index
                this.conferenceStatus = 'waiting'; // Reset status
                
                // Notify the view to update the day display
                if (window.conferenceApp && window.conferenceApp.view) {
                    window.conferenceApp.view.updateConferenceDay(detectedDay);
                }
            }
        }, 60000); // Check every minute
    }

    /**
     * Update conference dates (call this to change the dates for your actual conference)
     * @param {Object} dates Object with day names as keys and dates as values
     */
    updateConferenceDates(dates) {
        this.conferenceDates = { ...this.conferenceDates, ...dates };
        console.log('Conference dates updated:', this.conferenceDates);
        
        // Re-detect current day
        const newDay = this.detectCurrentDay();
        if (newDay !== this.currentDay) {
            this.currentDay = newDay;
            this.currentEventIndex = -1;
            this.conferenceStatus = 'waiting';
            
            if (window.conferenceApp && window.conferenceApp.view) {
                window.conferenceApp.view.updateConferenceDay(newDay);
            }
        }
    }

    /**
     * Get the agenda data for current day
     * @returns {Array} Array of agenda items for current day
     */
    getAgendaData() {
        return this.allAgendaData[this.currentDay] || [];
    }

    /**
     * Get all available days
     * @returns {Array} Array of day names
     */
    getAvailableDays() {
        return Object.keys(this.allAgendaData);
    }

    /**
     * Set current day (manual override)
     * @param {string} dayName Day name ('Inauguration', 'Day 1', 'Day 2')
     * @returns {boolean} True if day was set successfully
     */
    setCurrentDay(dayName) {
        if (this.allAgendaData[dayName]) {
            this.currentDay = dayName;
            this.currentEventIndex = -1; // Reset event index
            this.conferenceStatus = 'waiting'; // Reset status
            console.log(`Conference day manually switched to: ${dayName}`);
            return true;
        } else {
            console.log(`Day "${dayName}" not found. Available days: ${this.getAvailableDays().join(', ')}`);
            return false;
        }
    }

    /**
     * Get current day name
     * @returns {string} Current day name
     */
    getCurrentDay() {
        return this.currentDay;
    }

    /**
     * Get current event index
     * @returns {number} Current event index (-1 if no current event)
     */
    getCurrentEventIndex() {
        return this.currentEventIndex;
    }

    /**
     * Get current event data
     * @returns {Object|null} Current event object or null
     */
    getCurrentEvent() {
        const agenda = this.getAgendaData();
        if (this.currentEventIndex >= 0 && this.currentEventIndex < agenda.length) {
            return agenda[this.currentEventIndex];
        }
        return null;
    }

    /**
     * Get conference status
     * @returns {string} 'waiting', 'active', or 'completed'
     */
    getConferenceStatus() {
        return this.conferenceStatus;
    }

    /**
     * Convert time string to minutes since midnight
     * @param {string} timeStr Time in "HH:MM" format
     * @returns {number} Minutes since midnight
     */
    timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    /**
     * Get current real time in HH:MM format (Sri Lankan time)
     * @returns {string} Current time as "HH:MM"
     */
    getCurrentRealTime() {
        const now = new Date();
        // Convert to Sri Lankan time (UTC+5:30)
        const sriLankanTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000) + (this.timeOffsetMinutes * 60 * 1000));
        return sriLankanTime.getUTCHours().toString().padStart(2, '0') + ':' + 
               sriLankanTime.getUTCMinutes().toString().padStart(2, '0');
    }

    /**
     * Get current real time with seconds for display
     * @returns {string} Current time as "HH:MM:SS"
     */
    getCurrentRealTimeWithSeconds() {
        const now = new Date();
        // Convert to Sri Lankan time (UTC+5:30)
        const sriLankanTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000) + (this.timeOffsetMinutes * 60 * 1000));
        return sriLankanTime.getUTCHours().toString().padStart(2, '0') + ':' + 
               sriLankanTime.getUTCMinutes().toString().padStart(2, '0') + ':' + 
               sriLankanTime.getUTCSeconds().toString().padStart(2, '0');
    }

    /**
     * Find which event should be currently active based on real time
     * @returns {Object} Object with eventIndex and status
     */
    findCurrentRealTimeEvent() {
        // Respect actual conference dates: do not mark events active on a different date
        try {
            const today = new Date().toISOString().split('T')[0];
            const currentDayDate = this.conferenceDates[this.currentDay];
            if (currentDayDate) {
                if (today < currentDayDate) {
                    return {
                        eventIndex: -1,
                        status: 'waiting',
                        message: `${this.currentDay} starts on ${currentDayDate}`
                    };
                }
                if (today > currentDayDate) {
                    return {
                        eventIndex: -1,
                        status: 'completed',
                        message: `${this.currentDay} has concluded`
                    };
                }
            }
        } catch {}

        const currentTime = this.getCurrentRealTime();
        const currentMinutes = this.timeToMinutes(currentTime);
        const agenda = this.getAgendaData();
        
        if (agenda.length === 0) {
            return {
                eventIndex: -1,
                status: 'waiting',
                message: `No events for ${this.currentDay}`
            };
        }
        
        const firstEventMinutes = this.timeToMinutes(agenda[0].time);
        const lastEventMinutes = this.timeToMinutes(agenda[agenda.length - 1].time);
        
        // Check if conference hasn't started yet
        if (currentMinutes < firstEventMinutes) {
            return {
                eventIndex: -1,
                status: 'waiting',
                message: `${this.currentDay} starts soon...`
            };
        }
        
        // Check if conference has ended
        if (currentMinutes >= lastEventMinutes + (agenda[agenda.length - 1].duration || 0)) {
            return {
                eventIndex: -1,
                status: 'completed',
                message: `${this.currentDay} has concluded`
            };
        }
        
        // Find active event (within its time duration)
        for (let i = 0; i < agenda.length; i++) {
            const event = agenda[i];
            const eventStart = this.timeToMinutes(event.time);
            const eventEnd = eventStart + (event.duration || 0);
            
            // If current time is within this event's duration
            if (currentMinutes >= eventStart && currentMinutes < eventEnd) {
                return {
                    eventIndex: i,
                    status: 'active',
                    message: 'Event in progress'
                };
            }
        }
        
        // If between events, find the most recent event that has started
        let mostRecentIndex = -1;
        for (let i = agenda.length - 1; i >= 0; i--) {
            const eventMinutes = this.timeToMinutes(agenda[i].time);
            if (eventMinutes <= currentMinutes) {
                mostRecentIndex = i;
                break;
            }
        }
        
        return {
            eventIndex: mostRecentIndex,
            status: 'active',
            message: 'Between events'
        };
    }

    /**
     * Update current event based on real time
     * @returns {boolean} True if event changed, false otherwise
     */
    updateRealTimeEvent() {
        const realTimeResult = this.findCurrentRealTimeEvent();
        const hasChanged = this.currentEventIndex !== realTimeResult.eventIndex || 
                          this.conferenceStatus !== realTimeResult.status;
        
        if (hasChanged) {
            this.currentEventIndex = realTimeResult.eventIndex;
            this.conferenceStatus = realTimeResult.status;
            this.lastRealTimeCheck = new Date();
            
            console.log(`Real-time update (${this.currentDay}): ${realTimeResult.message}`);
            if (realTimeResult.eventIndex >= 0) {
                const agenda = this.getAgendaData();
                console.log(`Current event: ${agenda[realTimeResult.eventIndex].title}`);
            }
        }
        
        return hasChanged;
    }

    /**
     * Get next upcoming event for current day
     * @returns {Object|null} Next event or null
     */
    getNextEvent() {
        const currentTime = this.getCurrentRealTime();
        const currentMinutes = this.timeToMinutes(currentTime);
        const agenda = this.getAgendaData();
        
        for (let i = 0; i < agenda.length; i++) {
            const eventMinutes = this.timeToMinutes(agenda[i].time);
            if (eventMinutes > currentMinutes) {
                return agenda[i];
            }
        }
        
        return null; // No more events today
    }

    /**
     * Get time until next event in minutes
     * @returns {number} Minutes until next event, -1 if no next event
     */
    getTimeUntilNextEvent() {
        const nextEvent = this.getNextEvent();
        if (!nextEvent) return -1;
        
        const currentMinutes = this.timeToMinutes(this.getCurrentRealTime());
        const nextEventMinutes = this.timeToMinutes(nextEvent.time);
        
        return nextEventMinutes - currentMinutes;
    }

    /**
     * Manual navigation methods (for testing purposes only)
     */
    nextEvent() {
        const agenda = this.getAgendaData();
        if (this.currentEventIndex < agenda.length - 1) {
            this.currentEventIndex++;
            this.conferenceStatus = 'active';
            console.log('Manual override: Next event');
            return true;
        }
        return false;
    }

    previousEvent() {
        if (this.currentEventIndex > 0) {
            this.currentEventIndex--;
            this.conferenceStatus = 'active';
            console.log('Manual override: Previous event');
            return true;
        }
        return false;
    }

    setCurrentEventIndex(index) {
        const agenda = this.getAgendaData();
        if (index >= -1 && index < agenda.length) {
            this.currentEventIndex = index;
            this.conferenceStatus = index >= 0 ? 'active' : 'waiting';
            console.log('Manual override: Set event index');
        }
    }

    setTimeOffsetMinutes(minutes) {
        if (Number.isFinite(minutes)) {
            this.timeOffsetMinutes = minutes;
            this.updateRealTimeEvent();
        }
    }

    /**
     * Reset to real-time mode (stop manual overrides)
     */
    resetToRealTime() {
        this.updateRealTimeEvent();
        console.log(`Reset to real-time mode for ${this.currentDay}`);
    }
}

// Add global function to update conference dates
window.updateConferenceDates = function(dates) {
    if (window.conferenceApp && window.conferenceApp.model) {
        window.conferenceApp.model.updateConferenceDates(dates);
    }
};

// Add global function to update time offset (in minutes). Example: updateTimeOffset(-60)
window.updateTimeOffset = function(minutes) {
    if (window.conferenceApp && window.conferenceApp.model) {
        window.conferenceApp.model.setTimeOffsetMinutes(minutes);
    }
};

console.log('ConferenceModel loaded with NITC 2025 real agenda data');
console.log('Conference dates: Inauguration (Oct 3), Day 1 (Oct 4), Day 2 (Oct 5)');
console.log('Use updateConferenceDates() to change conference dates if needed');