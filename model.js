/* ============================================================================
   MODEL - DATA LAYER (MVC Architecture) - WITH AUTOMATIC DAY DETECTION
   ============================================================================ */

/**
 * ConferenceModel - Manages all data and business logic with automatic day switching
 */
class ConferenceModel {
    constructor() {
        // Conference dates (updated to match current date)
        this.conferenceDates = {
            'Inauguration': '2025-09-18', // Today's date (Thursday)
            'Day 1': '2025-09-19',        // Tomorrow (Friday)
            'Day 2': '2025-09-20'         // Day after tomorrow (Saturday)
        };
        
        // Automatically detect current day based on real date
        this.currentDay = this.detectCurrentDay();
        console.log(`Conference day automatically detected: ${this.currentDay}`);
        
        // Multi-day agenda data
        this.allAgendaData = {
            'Inauguration': [
                {
                    time: "12:00", // 12:00 PM (Noon)
                    displayTime: "12:00 PM",
                    title: "Arrival of the Chief Guest & the Guest of Honour",
                    description: "Welcome our distinguished Chief Guest and Guest of Honour as they arrive for the inauguration ceremony. Please take your seats as we prepare to begin this momentous conference.",
                    duration: 20
                },
                {
                    time: "12:20",
                    displayTime: "12:20 PM",
                    title: "Welcome Address by Mr. Heshan Karunaratne",
                    description: "Opening remarks and welcome address by Mr. Heshan Karunaratne, President of CSSL. Setting the tone for the conference and introducing key participants and objectives.",
                    duration: 10
                },
                {
                    time: "12:30",
                    displayTime: "12:30 PM",
                    title: "CSSL National ICT Awards 2025 - Session 1",
                    description: "First session of the prestigious CSSL National ICT Awards ceremony, recognizing outstanding achievements and innovations in the field of information and communication technology.",
                    duration: 15
                },
                {
                    time: "12:45",
                    displayTime: "12:45 PM",
                    title: "Address by the Chief Guest",
                    description: "Keynote address by our distinguished Chief Guest, sharing insights on the future of technology and its impact on society and business transformation.",
                    duration: 10
                },
                {
                    time: "12:55",
                    displayTime: "12:55 PM",
                    title: "Address by the Guest of Honor",
                    description: "Inspiring address by our Guest of Honor, highlighting the importance of innovation and technological advancement in driving economic growth and social development.",
                    duration: 15
                },
                {
                    time: "13:10",
                    displayTime: "1:10 PM",
                    title: "Keynote Address By Mr. Sandun Hapugoda",
                    description: "Strategic keynote presentation by Mr. Sandun Hapugoda, Country Manager - Sri Lanka and Maldives Mastercards, focusing on digital payment innovations and financial technology trends.",
                    duration: 20
                },
                {
                    time: "13:30",
                    displayTime: "1:30 PM",
                    title: "CSSL National ICT Awards 2025 - Session 2",
                    description: "Second session of the national ICT awards ceremony, continuing the recognition of exceptional contributions to the technology sector and digital innovation landscape.",
                    duration: 15
                },
                {
                    time: "13:45",
                    displayTime: "1:45 PM",
                    title: "Keynote Address by Mr. Lasantha Bogoda",
                    description: "Industry insights presentation by Mr. Lasantha Bogoda, Director/CEO of DMS Software Technologies (Pvt) Ltd, covering enterprise software solutions and digital transformation strategies.",
                    duration: 10
                },
                {
                    time: "13:55",
                    displayTime: "1:55 PM",
                    title: "Keynote Address by Mr. Shanaka de Silva",
                    description: "Strategic business presentation by Mr. Shanaka de Silva, Group Finance Director at South Asian Technologies Group, discussing technology investment and growth opportunities in the region.",
                    duration: 20
                },
                {
                    time: "14:15",
                    displayTime: "2:15 PM",
                    title: "Recognition of Sponsors NITC 2025",
                    description: "Special acknowledgment and appreciation ceremony for all sponsors and partners who made NITC 2025 possible. Recognition of their valuable contributions to the conference success.",
                    duration: 20
                },
                {
                    time: "14:35",
                    displayTime: "2:35 PM",
                    title: "Vote of Thanks by Dr. Amal Illesinghe",
                    description: "Closing remarks and heartfelt gratitude expressed by Dr. Amal Illesinghe, Conference Chair - NITC 2025, thanking all participants, speakers, sponsors, and organizers for making this inauguration a success.",
                    duration: 15
                },
                {
                    time: "14:50",
                    displayTime: "2:50 PM",
                    title: "Inauguration Conclusion",
                    description: "Official end of the inauguration ceremony. Thank you for your active participation. We look forward to seeing you tomorrow for Day 1 sessions starting at 8:15 AM!",
                    duration: 0
                }
            ],

            'Day 1': [
                {
                    time: "03:00",
                    displayTime: "3:00 AM",
                    title: "Registration",
                    description: "Participant registration and check-in. Collect your conference materials, name tags, and networking kit for Day 1 sessions.",
                    duration: 45
                },
                {
                    time: "09:00",
                    displayTime: "9:00 AM",
                    title: "Guest Speech: Hon. Eranga Weeraratne",
                    description: "Opening guest speech by the Honorable Eranga Weeraratne, setting the tone for Day 1 discussions on digital transformation and innovation.",
                    duration: 20
                },
                {
                    time: "09:20",
                    displayTime: "9:20 AM",
                    title: "Keynote 1",
                    description: "First keynote presentation exploring cutting-edge technology trends and their impact on modern business and society.",
                    duration: 25
                },
                {
                    time: "09:45",
                    displayTime: "9:45 AM",
                    title: "Panel Discussion 1: E-Government 5.0: Towards Human-Centric, Integrated and Proactive Public Services",
                    description: "Expert panel discussing the evolution of e-government services, focusing on human-centric design, integration, and proactive public service delivery.",
                    duration: 60
                },
                {
                    time: "10:45",
                    displayTime: "10:45 AM",
                    title: "Morning Tea",
                    description: "Networking break with tea, coffee, and light refreshments. Connect with fellow participants and speakers.",
                    duration: 35
                },
                {
                    time: "11:20",
                    displayTime: "11:20 AM",
                    title: "Keynote 2",
                    description: "Second keynote presentation focusing on emerging technologies and digital innovation strategies.",
                    duration: 25
                },
                {
                    time: "11:45",
                    displayTime: "11:45 AM",
                    title: "Keynote 3",
                    description: "Third keynote session exploring advanced technological solutions and their practical applications.",
                    duration: 25
                },
                {
                    time: "12:10",
                    displayTime: "12:10 PM",
                    title: "Keynote 4: Dr. Yasas V. Abeywickrama",
                    description: "Keynote presentation by Dr. Yasas V. Abeywickrama, Chief Operating Officer at Doerscircle - Singapore, sharing insights on operational excellence and technology leadership.",
                    duration: 25
                },
                {
                    time: "12:35",
                    displayTime: "12:35 PM",
                    title: "Guest Speech: Mr. Sumudu Rathnayake",
                    description: "Special guest speech by Mr. Sumudu Rathnayake discussing industry perspectives and technological advancements.",
                    duration: 25
                },
                {
                    time: "13:00",
                    displayTime: "1:00 PM",
                    title: "Lunch",
                    description: "Buffet lunch with networking opportunities. Enjoy delicious food while connecting with speakers and fellow attendees.",
                    duration: 60
                },
                {
                    time: "14:00",
                    displayTime: "2:00 PM",
                    title: "FinTech",
                    description: "Comprehensive session on Financial Technology innovations, digital payments, blockchain applications, and the future of financial services.",
                    duration: 75
                },
                {
                    time: "15:15",
                    displayTime: "3:15 PM",
                    title: "Tea",
                    description: "Afternoon tea break with networking opportunities. Discuss the FinTech session and prepare for upcoming presentations.",
                    duration: 20
                },
                {
                    time: "15:35",
                    displayTime: "3:35 PM",
                    title: "EduTech",
                    description: "Educational Technology session covering digital learning platforms, e-learning innovations, and the transformation of education through technology.",
                    duration: 25
                },
                {
                    time: "16:00",
                    displayTime: "4:00 PM",
                    title: "TravelTech",
                    description: "Travel Technology innovations including booking platforms, digital tourism solutions, and smart travel experiences.",
                    duration: 25
                },
                {
                    time: "16:25",
                    displayTime: "4:25 PM",
                    title: "Cybersecurity",
                    description: "Critical cybersecurity session covering threat landscape, security frameworks, and protection strategies for modern organizations.",
                    duration: 25
                },
                {
                    time: "16:50",
                    displayTime: "4:50 PM",
                    title: "Raffle Draw",
                    description: "Exciting raffle draw session with prizes for conference participants. Thank you for your active participation in Day 1!",
                    duration: 10
                },
                {
                    time: "17:00",
                    displayTime: "5:00 PM",
                    title: "Day 1 Conclusion",
                    description: "Official end of Day 1. Thank you for an amazing day of learning and networking. See you tomorrow for Day 2 starting at 8:30 AM!",
                    duration: 0
                }
            ],

            'Day 2': [
                {
                    time: "11:00",
                    displayTime: "11:00 AM",
                    title: "Registration",
                    description: "Day 2 registration and check-in. Welcome back to NITC 2025! Collect your Day 2 materials and prepare for advanced sessions.",
                    duration: 30
                },
                {
                    time: "09:00",
                    displayTime: "9:00 AM",
                    title: "Guest Speech: Dr. Hans Wijesuriya",
                    description: "Opening guest speech by Dr. Hans Wijesuriya, Chief Advisor to the President of Sri Lanka on Digital Economy & Chairman, ICT Agency of Sri Lanka.",
                    duration: 20
                },
                {
                    time: "09:20",
                    displayTime: "9:20 AM",
                    title: "Keynote 5",
                    description: "Fifth keynote presentation exploring advanced technology concepts and their implementation in various sectors.",
                    duration: 25
                },
                {
                    time: "09:45",
                    displayTime: "9:45 AM",
                    title: "Keynote 6",
                    description: "Sixth keynote session focusing on innovation strategies and technological disruption in modern industries.",
                    duration: 25
                },
                {
                    time: "10:10",
                    displayTime: "10:10 AM",
                    title: "Keynote 7",
                    description: "Seventh keynote presentation covering cutting-edge research and development in technology sectors.",
                    duration: 25
                },
                {
                    time: "10:35",
                    displayTime: "10:35 AM",
                    title: "Morning Tea",
                    description: "Mid-morning refreshment break with networking opportunities. Connect with Day 2 speakers and participants.",
                    duration: 25
                },
                {
                    time: "11:00",
                    displayTime: "11:00 AM",
                    title: "Keynote 8",
                    description: "Eighth keynote session exploring emerging technologies and their potential impact on future business models.",
                    duration: 25
                },
                {
                    time: "11:25",
                    displayTime: "11:25 AM",
                    title: "Panel Discussion 2: Business Automation and Agentic AI",
                    description: "Expert panel discussing the role of artificial intelligence in business automation, agentic AI systems, and their transformative impact on organizational efficiency.",
                    duration: 60
                },
                {
                    time: "12:25",
                    displayTime: "12:25 PM",
                    title: "Lunch",
                    description: "Extended lunch break with structured networking activities. Meet industry leaders and potential collaborators.",
                    duration: 75
                },
                {
                    time: "13:40",
                    displayTime: "1:40 PM",
                    title: "InfoSec",
                    description: "Information Security session covering advanced security protocols, data protection strategies, and enterprise security frameworks.",
                    duration: 50
                },
                {
                    time: "14:30",
                    displayTime: "2:30 PM",
                    title: "Big Data Analytics",
                    description: "Comprehensive session on Big Data technologies, analytics platforms, machine learning applications, and data-driven decision making.",
                    duration: 25
                },
                {
                    time: "14:55",
                    displayTime: "2:55 PM",
                    title: "Tea",
                    description: "Afternoon tea break with networking opportunities. Discuss the data analytics session and connect with fellow participants.",
                    duration: 35
                },
                {
                    time: "15:30",
                    displayTime: "3:30 PM",
                    title: "Track Sessions",
                    description: "Specialized track sessions covering various technology domains and industry-specific applications.",
                    duration: 25
                },
                {
                    time: "15:55",
                    displayTime: "3:55 PM",
                    title: "Digital Transport",
                    description: "Transportation Technology session exploring smart mobility solutions, digital logistics, and the future of connected transportation systems.",
                    duration: 25
                },
                {
                    time: "16:20",
                    displayTime: "4:20 PM",
                    title: "eHealth",
                    description: "Electronic Health solutions covering telemedicine, health informatics, digital health platforms, and healthcare technology innovations.",
                    duration: 30
                },
                {
                    time: "16:50",
                    displayTime: "4:50 PM",
                    title: "Raffle Draw",
                    description: "Day 2 raffle draw with exciting prizes for conference participants. Celebration of two successful days of learning and networking.",
                    duration: 10
                },
                {
                    time: "17:00",
                    displayTime: "5:00 PM",
                    title: "Digital Investment Summit",
                    description: "Special summit session on digital investment opportunities, funding strategies for tech startups, and investment trends in the digital economy.",
                    duration: 30
                },
                {
                    time: "17:30",
                    displayTime: "5:30 PM",
                    title: "NITC 2025 Grand Finale",
                    description: "Official closing ceremony of NITC 2025. Thank you messages, final announcements, and celebration of two incredible days of innovation and learning. Safe travels to all participants!",
                    duration: 0
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
        const inaugTime = new Date(this.conferenceDates['Inauguration']).getTime();
        if (todayTime > inaugTime) {
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

console.log('ConferenceModel loaded with automatic day detection');
console.log('Use updateConferenceDates() to change conference dates if needed');