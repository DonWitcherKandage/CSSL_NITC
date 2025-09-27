/* ============================================================================
   MODEL - DATA LAYER (MVC Architecture) - WITH AUTOMATIC DAY DETECTION
   ============================================================================ */

/**
 * ConferenceModel - Manages all data and business logic with automatic day switching
 */
class ConferenceModel {
    constructor() {
        // Conference dates (updated for NITC 2025)
        this.conferenceDates = {
            'Inauguration': '2025-09-27',    // September 27th
            'Day 1': '2025-09-28',           // September 28th
            'Day 2': '2025-09-29'            // September 29th
        };
        
        // Automatically detect current day based on real date
        this.currentDay = this.detectCurrentDay();
        console.log(`Conference day automatically detected: ${this.currentDay}`);
        
        // Real NITC 2025 agenda data
        this.allAgendaData = {
            'Inauguration': [
                {
                    time: "17:00",
                    displayTime: "5:00 PM",
                    title: "Arrival of Guests Registration",
                    description: "Guest arrival and registration. Sponsor videos presentation.",
                    duration: 60
                },
                {
                    time: "18:00",
                    displayTime: "6:00 PM",
                    title: "Arrival of Chief Guest & Guest of Honour",
                    description: "CSSL President welcomes Chief Guest & Guest of Honour. Introduction of CSSL Executive Council members. Traditional dancers escort dignitaries to the hall.",
                    duration: 5
                },
                {
                    time: "18:05",
                    displayTime: "6:05 PM",
                    title: "National Anthem & Digital Lamp Lighting",
                    description: "National Anthem followed by lighting of Digital Lamp (Digital Display showing NITC 2025) by Chief Guest. Video and light show presentation.",
                    duration: 5
                },
                {
                    time: "18:10",
                    displayTime: "6:10 PM",
                    title: "Welcome Dance Performance",
                    description: "Welcome dance by the dancing troupe. NITC 2025 Curtain Raiser will be shown.",
                    duration: 10
                },
                {
                    time: "18:20",
                    displayTime: "6:20 PM",
                    title: "Welcome Address",
                    description: "Welcome address by Mr. Heshan Karunaratne, President/Computer Society of Sri Lanka.",
                    duration: 10
                },
                {
                    time: "18:30",
                    displayTime: "6:30 PM",
                    title: "CSSL National ICT Awards 2024 - Part 1",
                    description: "Chief Guest presents CSSL National ICT Awards: ICT Researcher of the Year, ICT Educator of the Year, Chief Information Officer of the Year, ICT Student Award - School Category.",
                    duration: 15
                },
                {
                    time: "18:45",
                    displayTime: "6:45 PM",
                    title: "Address by Chief Guest",
                    description: "Address by Chief Guest - His Excellency Anura Kumara Dissanayake, The President of the Democratic Socialist Republic of Sri Lanka.",
                    duration: 10
                },
                {
                    time: "18:55",
                    displayTime: "6:55 PM",
                    title: "Keynote by Guest of Honor",
                    description: "Keynote address by Guest of Honor Hon. Eranga Weeraratne, Deputy Minister of Digital Economy.",
                    duration: 20
                },
                {
                    time: "19:15",
                    displayTime: "7:15 PM",
                    title: "Strategic Partner Keynote",
                    description: "Keynote address by Strategic Partner Mastercard - Mr. Sandun Hapugoda, Country Manager Mastercard. Strategic Partner's Corporate Video (30 sec).",
                    duration: 10
                },
                {
                    time: "19:25",
                    displayTime: "7:25 PM",
                    title: "Dance Act 2",
                    description: "Second dance performance.",
                    duration: 5
                },
                {
                    time: "19:30",
                    displayTime: "7:30 PM",
                    title: "CSSL ICT Awards 2024 Judges Recognition",
                    description: "Recognition ceremony for CSSL ICT Awards 2024 judges with dignitaries on stage.",
                    duration: 10
                },
                {
                    time: "19:40",
                    displayTime: "7:40 PM",
                    title: "CSSL ICT Awards 2024 - Part 2",
                    description: "Remaining awards: Best Founder Award, ICT Student Award - Postgraduate Category, ICT Student Award - Undergraduate Category, Emerging ICT Leader of the Year.",
                    duration: 10
                },
                {
                    time: "19:50",
                    displayTime: "7:50 PM",
                    title: "Diamond Sponsor Keynote - DMS",
                    description: "Keynote Address by Diamond Sponsor DMS Software Technologies - Mr. Lasantha Bogoda, Director/CEO. Corporate Video (30 Sec).",
                    duration: 5
                },
                {
                    time: "19:55",
                    displayTime: "7:55 PM",
                    title: "Diamond Sponsor Keynote - SAT",
                    description: "Keynote Address by Diamond Sponsor South Asian Technologies (SAT) - Mr. Feroze Kamardeen, Director SAT Group. Corporate Video (30 Sec).",
                    duration: 5
                },
                {
                    time: "20:00",
                    displayTime: "8:00 PM",
                    title: "Sponsor Recognition",
                    description: "Sponsor Recognition of NITC 2024 with sponsors invited on stage one by one.",
                    duration: 10
                },
                {
                    time: "20:10",
                    displayTime: "8:10 PM",
                    title: "Final Dance Act",
                    description: "Final dance performance.",
                    duration: 5
                },
                {
                    time: "20:15",
                    displayTime: "8:15 PM",
                    title: "Vote of Thanks",
                    description: "Vote of Thanks by Conference Chair.",
                    duration: 5
                },
                {
                    time: "20:20",
                    displayTime: "8:20 PM",
                    title: "Fellowship & Cocktail",
                    description: "Fellowship and cocktail session for all attendees.",
                    duration: 160
                }
            ],

            'Day 1': [
                {
                    time: "08:15",
                    displayTime: "8:15 AM",
                    title: "Registration",
                    description: "Day 1 Conference registration and check-in.",
                    duration: 45
                },
                {
                    time: "09:00",
                    displayTime: "9:00 AM",
                    title: "Guest Speech",
                    description: "Guest Speech by Hon Eranga Weeraratne, Deputy Minister of Digital Economy.",
                    duration: 20
                },
                {
                    time: "09:20",
                    displayTime: "9:20 AM",
                    title: "Keynote 1: Mastercard",
                    description: "Keynote by Mr. Sandun Hapugoda, Country Manager - Sri Lanka & Maldives at Mastercard.",
                    duration: 25
                },
                {
                    time: "09:45",
                    displayTime: "9:45 AM",
                    title: "Panel Discussion 1: E-Government 5.0",
                    description: "E-Government 5.0: Towards Human-Centric, Integrated, and Proactive Public Services. Panel: Mastercard, DMS, SAT, CryptoGen. Moderator: Mr. Niranjan De Silva, Past President of CSSL.",
                    duration: 60
                },
                {
                    time: "10:45",
                    displayTime: "10:45 AM",
                    title: "Morning Tea",
                    description: "Morning tea break and networking.",
                    duration: 35
                },
                {
                    time: "11:20",
                    displayTime: "11:20 AM",
                    title: "Keynote 2: DMS",
                    description: "Keynote by Mr. Yu Ka Chan, Director - Cloud Engineering ASEAN - Oracle Corporation.",
                    duration: 25
                },
                {
                    time: "11:45",
                    displayTime: "11:45 AM",
                    title: "Keynote 3: SAT",
                    description: "Keynote by Mr. Sudhir Jampala, National Manager, OpenText.",
                    duration: 25
                },
                {
                    time: "12:10",
                    displayTime: "12:10 PM",
                    title: "Keynote 4: Taking SL Digital Businesses Global",
                    description: "Dr. Yasas V. Abeywickrama, Chief Operating Officer, Doerscircle - Singapore. Topic: Taking SL Digital Businesses Global.",
                    duration: 25
                },
                {
                    time: "12:35",
                    displayTime: "12:35 PM",
                    title: "Digital Economy Insights",
                    description: "Mr. Sumudu Rathnayake, Advisor - Digital Economy, Ministry of Digital Economy, Director RDA.",
                    duration: 25
                },
                {
                    time: "13:00",
                    displayTime: "1:00 PM",
                    title: "Lunch Break",
                    description: "Lunch break and networking opportunity.",
                    duration: 60
                },
                {
                    time: "14:00",
                    displayTime: "2:00 PM",
                    title: "FinTech Session 1",
                    description: "Mastercard - Mr. Shashi Madanayake, Director Account Management at Mastercard. Session Chair: Dr. Dharmasri Kumaratunge.",
                    duration: 25
                },
                {
                    time: "14:25",
                    displayTime: "2:25 PM",
                    title: "FinTech Session 2",
                    description: "SAT - Mr. Karthik Kishore, Regional Director, Zscaler.",
                    duration: 25
                },
                {
                    time: "14:50",
                    displayTime: "2:50 PM",
                    title: "FinTech Session 3",
                    description: "Aiken - Mr. Mahesh Patel, Director Products, Hitachi Payment Services (Pvt) Ltd.",
                    duration: 25
                },
                {
                    time: "15:15",
                    displayTime: "3:15 PM",
                    title: "Afternoon Tea",
                    description: "Afternoon tea break.",
                    duration: 20
                },
                {
                    time: "15:35",
                    displayTime: "3:35 PM",
                    title: "EduTech Session",
                    description: "Dr. Dayan Rajapakse, Managing Director @ ESU (ESOFT Uni). Topic: Ethical use of AI in teaching & learning. Session Chair: Mr. Conrard Dias.",
                    duration: 25
                },
                {
                    time: "16:00",
                    displayTime: "4:00 PM",
                    title: "TravelTech Session",
                    description: "DMS - Mr. Aruna Basnayake, AGM Digital Engineering & Strategic Solutions, DMS Software Technologies. Topic: Transforming Travel Experience Through AI and Personalization.",
                    duration: 25
                },
                {
                    time: "16:25",
                    displayTime: "4:25 PM",
                    title: "Cybersecurity Session",
                    description: "Fortinet - Mr. Sampath Wimalaweera, Principal Systems Engineer, Fortinet. Topic: Unified Threat Detection with a Turnkey SOC Platform.",
                    duration: 25
                },
                {
                    time: "16:50",
                    displayTime: "4:50 PM",
                    title: "Raffle Draw",
                    description: "Day 1 Raffle Draw and closing.",
                    duration: 10
                }
            ],

            'Day 2': [
                {
                    time: "08:30",
                    displayTime: "8:30 AM",
                    title: "Registration",
                    description: "Day 2 Conference registration and check-in.",
                    duration: 30
                },
                {
                    time: "09:00",
                    displayTime: "9:00 AM",
                    title: "Guest Speech",
                    description: "Guest Speech by Dr. Harshana Suriyapperuma, Secretary to the Ministry of Finance.",
                    duration: 20
                },
                {
                    time: "09:20",
                    displayTime: "9:20 AM",
                    title: "Keynote 5: Mastercard",
                    description: "Keynote by Mr. Nachiket Limaye, Principal, Services Business Development.",
                    duration: 25
                },
                {
                    time: "09:45",
                    displayTime: "9:45 AM",
                    title: "Keynote 6: SAT",
                    description: "Keynote by Mr. Hari Krishnan, Technical Manager - Strategic Account Management, Manage Engine.",
                    duration: 25
                },
                {
                    time: "10:10",
                    displayTime: "10:10 AM",
                    title: "Keynote 7: DMS",
                    description: "Mr. Rajan CS, Regional Manager, India Enterprise & Sri Lanka, Google. Topic: Leveraging AI for Business Transformation.",
                    duration: 25
                },
                {
                    time: "10:35",
                    displayTime: "10:35 AM",
                    title: "Morning Tea",
                    description: "Morning tea break and networking.",
                    duration: 25
                },
                {
                    time: "11:00",
                    displayTime: "11:00 AM",
                    title: "Keynote: Huawei",
                    description: "TBA - Huawei Representative Keynote.",
                    duration: 25
                },
                {
                    time: "11:25",
                    displayTime: "11:25 AM",
                    title: "Panel Discussion 2: Business Automation and Agentic AI",
                    description: "Panel: Mastercard, DMS, SAT, Fortinet. Moderator: Dr. Romesh Ranawana, Group Chief Analytics & AI Officer, Dialog Axiata.",
                    duration: 60
                },
                {
                    time: "12:25",
                    displayTime: "12:25 PM",
                    title: "Lunch Break",
                    description: "Extended lunch break and networking.",
                    duration: 75
                },
                {
                    time: "13:40",
                    displayTime: "1:40 PM",
                    title: "InfoSec Session 1",
                    description: "Mastercard - Mr. Joseph McGuire, Principal, Innovation Consulting, Mastercard. Session Chair: Mr. Chrishanta Silva.",
                    duration: 25
                },
                {
                    time: "14:05",
                    displayTime: "2:05 PM",
                    title: "InfoSec Session 2",
                    description: "Kaspersky - Mr. Mohnissh Manukulasuriya, Territory Channel Manager – AEC West, Kaspersky. Topic: Adopting a Cybersecurity Framework for Resilience with Kaspersky.",
                    duration: 25
                },
                {
                    time: "14:30",
                    displayTime: "2:30 PM",
                    title: "Big Data Analytics",
                    description: "DELL Technologies - Mr. Varuna Jayalath, Country General Manager, Sri Lanka and Maldives. Head of Telecom Sector, Asia Emerging Markets, DELL Technologies.",
                    duration: 25
                },
                {
                    time: "14:55",
                    displayTime: "2:55 PM",
                    title: "Afternoon Tea",
                    description: "Afternoon tea break.",
                    duration: 35
                },
                {
                    time: "15:30",
                    displayTime: "3:30 PM",
                    title: "Digital Infrastructure",
                    description: "CommScope - Mr. Ashok Srinivasan, Director, Technical Sales India & SAARC, CommScope. Topic: Trends and Technologies enabling the Digital Infrastructure. Session Chair: Mr. Chandana Weerasinghe.",
                    duration: 25
                },
                {
                    time: "15:55",
                    displayTime: "3:55 PM",
                    title: "Digital Transport",
                    description: "Speaker to be announced - Digital Transport session.",
                    duration: 25
                },
                {
                    time: "16:20",
                    displayTime: "4:20 PM",
                    title: "eHealth",
                    description: "Speaker to be announced - eHealth session.",
                    duration: 25
                },
                {
                    time: "16:45",
                    displayTime: "4:45 PM",
                    title: "Raffle Draw",
                    description: "Day 2 Raffle Draw and conference closing.",
                    duration: 15
                }
            ]
        };

        // Current state - Always use real-time mode
        this.currentEventIndex = -1; // -1 means no current event (before/after schedule)
        this.isAutoMode = false; // Manual mode disabled for real-time
        this.lastRealTimeCheck = null; // Track when we last checked real time
        this.conferenceStatus = 'waiting'; // waiting, active, completed
        
        // Check for day changes every minute
        this.setupDayChangeDetection();
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
        const sriLankanTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
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
        const sriLankanTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
        return sriLankanTime.getUTCHours().toString().padStart(2, '0') + ':' + 
               sriLankanTime.getUTCMinutes().toString().padStart(2, '0') + ':' + 
               sriLankanTime.getUTCSeconds().toString().padStart(2, '0');
    }

    /**
     * Find which event should be currently active based on real time
     * @returns {Object} Object with eventIndex and status
     */
    findCurrentRealTimeEvent() {
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

console.log('ConferenceModel loaded with NITC 2025 real agenda data');
console.log('Conference dates: Inauguration (Sep 27), Day 1 (Sep 28), Day 2 (Sep 29)');
console.log('Use updateConferenceDates() to change conference dates if needed');