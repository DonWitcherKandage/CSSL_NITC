/* ============================================================================
   MODEL - DATA LAYER (MVC Architecture) - WITH AUTOMATIC DAY DETECTION
   ============================================================================ */

/**
 * ConferenceModel - Manages all data and business logic with automatic day switching
 */
class ConferenceModel {
    constructor() {
        // Conference dates (updated to September 24-26, 2025)
        this.conferenceDates = {
            'Day 1': '2025-09-24',        // September 24th
            'Day 2': '2025-09-25',        // September 25th  
            'Day 3': '2025-09-26'         // September 26th
        };
        
        // Automatically detect current day based on real date
        this.currentDay = this.detectCurrentDay();
        console.log(`Conference day automatically detected: ${this.currentDay}`);
        
        // Multi-day agenda data (4:00 AM to 11:00 PM, 15 items per day)
        this.allAgendaData = {
            'Day 1': [
                {
                    time: "04:00",
                    displayTime: "4:00 AM",
                    title: "Registration and Welcome",
                    description: "Early morning registration and participant check-in. Collect your conference materials and networking kit for Day 1.",
                    duration: 60
                },
                {
                    time: "05:00",
                    displayTime: "5:00 AM",
                    title: "Opening Ceremony",
                    description: "Official opening ceremony with welcome address and conference overview.",
                    duration: 45
                },
                {
                    time: "05:45",
                    displayTime: "5:45 AM",
                    title: "Keynote 1: Digital Transformation",
                    description: "First keynote presentation exploring digital transformation trends and their impact on business.",
                    duration: 60
                },
                {
                    time: "06:45",
                    displayTime: "6:45 AM",
                    title: "Panel Discussion: AI in Enterprise",
                    description: "Expert panel discussing artificial intelligence implementation in enterprise environments.",
                    duration: 75
                },
                {
                    time: "08:00",
                    displayTime: "8:00 AM",
                    title: "Morning Break",
                    description: "Coffee break and networking opportunity.",
                    duration: 30
                },
                {
                    time: "08:30",
                    displayTime: "8:30 AM",
                    title: "Cloud Computing Workshop",
                    description: "Hands-on workshop covering cloud computing best practices and implementation strategies.",
                    duration: 90
                },
                {
                    time: "10:00",
                    displayTime: "10:00 AM",
                    title: "Cybersecurity Essentials",
                    description: "Critical cybersecurity session covering threat landscape and protection strategies.",
                    duration: 60
                },
                {
                    time: "11:00",
                    displayTime: "11:00 AM",
                    title: "Data Analytics Deep Dive",
                    description: "Comprehensive session on data analytics platforms and machine learning applications.",
                    duration: 90
                },
                {
                    time: "12:30",
                    displayTime: "12:30 PM",
                    title: "Lunch Break",
                    description: "Buffet lunch with networking opportunities.",
                    duration: 90
                },
                {
                    time: "14:00",
                    displayTime: "2:00 PM",
                    title: "Mobile Development Trends",
                    description: "Latest trends in mobile application development and cross-platform solutions.",
                    duration: 60
                },
                {
                    time: "15:00",
                    displayTime: "3:00 PM",
                    title: "DevOps and Automation",
                    description: "DevOps methodologies and automation tools for modern software development.",
                    duration: 75
                },
                {
                    time: "16:15",
                    displayTime: "4:15 PM",
                    title: "Afternoon Tea",
                    description: "Tea break and networking session.",
                    duration: 30
                },
                {
                    time: "16:45",
                    displayTime: "4:45 PM",
                    title: "Blockchain and Cryptocurrency",
                    description: "Understanding blockchain technology and its practical applications.",
                    duration: 90
                },
                {
                    time: "18:15",
                    displayTime: "6:15 PM",
                    title: "IoT and Smart Systems",
                    description: "Internet of Things implementation and smart system architectures.",
                    duration: 75
                },
                {
                    time: "19:30",
                    displayTime: "7:30 PM",
                    title: "Day 1 Networking Dinner",
                    description: "Networking dinner with speakers and participants. Day 1 concludes at 11:00 PM.",
                    duration: 210
                }
            ],

            'Day 2': [
                {
                    time: "04:00",
                    displayTime: "4:00 AM",
                    title: "Day 2 Registration",
                    description: "Day 2 participant check-in and material distribution.",
                    duration: 60
                },
                {
                    time: "05:00",
                    displayTime: "5:00 AM",
                    title: "Keynote 2: Future of Work",
                    description: "Keynote on how technology is reshaping the future workplace and employment.",
                    duration: 60
                },
                {
                    time: "06:00",
                    displayTime: "6:00 AM",
                    title: "Machine Learning Workshop",
                    description: "Practical machine learning workshop with hands-on exercises.",
                    duration: 90
                },
                {
                    time: "07:30",
                    displayTime: "7:30 AM",
                    title: "Digital Marketing Revolution",
                    description: "How digital technologies are transforming marketing strategies.",
                    duration: 75
                },
                {
                    time: "08:45",
                    displayTime: "8:45 AM",
                    title: "Morning Break",
                    description: "Coffee and networking break.",
                    duration: 30
                },
                {
                    time: "09:15",
                    displayTime: "9:15 AM",
                    title: "Quantum Computing Introduction",
                    description: "Introduction to quantum computing and its potential applications.",
                    duration: 90
                },
                {
                    time: "10:45",
                    displayTime: "10:45 AM",
                    title: "Green Technology Solutions",
                    description: "Sustainable technology solutions for environmental challenges.",
                    duration: 75
                },
                {
                    time: "12:00",
                    displayTime: "12:00 PM",
                    title: "E-Commerce Platforms",
                    description: "Building and scaling modern e-commerce platforms.",
                    duration: 60
                },
                {
                    time: "13:00",
                    displayTime: "1:00 PM",
                    title: "Lunch Break",
                    description: "Extended lunch break with structured networking.",
                    duration: 90
                },
                {
                    time: "14:30",
                    displayTime: "2:30 PM",
                    title: "Virtual Reality Applications",
                    description: "VR and AR applications in business and education.",
                    duration: 75
                },
                {
                    time: "15:45",
                    displayTime: "3:45 PM",
                    title: "Software Architecture Patterns",
                    description: "Modern software architecture patterns and microservices.",
                    duration: 90
                },
                {
                    time: "17:15",
                    displayTime: "5:15 PM",
                    title: "Afternoon Break",
                    description: "Tea break and networking opportunity.",
                    duration: 30
                },
                {
                    time: "17:45",
                    displayTime: "5:45 PM",
                    title: "Database Technologies",
                    description: "NoSQL, NewSQL, and distributed database systems.",
                    duration: 75
                },
                {
                    time: "19:00",
                    displayTime: "7:00 PM",
                    title: "API Design and Integration",
                    description: "RESTful API design, GraphQL, and system integration patterns.",
                    duration: 90
                },
                {
                    time: "20:30",
                    displayTime: "8:30 PM",
                    title: "Day 2 Social Event",
                    description: "Evening social event and networking. Day 2 concludes at 11:00 PM.",
                    duration: 150
                }
            ],

            'Day 3': [
                {
                    time: "04:00",
                    displayTime: "4:00 AM",
                    title: "Final Day Registration",
                    description: "Day 3 registration and final conference materials.",
                    duration: 60
                },
                {
                    time: "05:00",
                    displayTime: "5:00 AM",
                    title: "Keynote 3: Innovation Leadership",
                    description: "Final keynote on leading innovation in technology organizations.",
                    duration: 60
                },
                {
                    time: "06:00",
                    displayTime: "6:00 AM",
                    title: "Startup Pitch Session",
                    description: "Technology startup presentations and investor pitches.",
                    duration: 90
                },
                {
                    time: "07:30",
                    displayTime: "7:30 AM",
                    title: "Digital Health Technologies",
                    description: "Healthcare technology innovations and digital health platforms.",
                    duration: 75
                },
                {
                    time: "08:45",
                    displayTime: "8:45 AM",
                    title: "Morning Break",
                    description: "Final morning coffee break.",
                    duration: 30
                },
                {
                    time: "09:15",
                    displayTime: "9:15 AM",
                    title: "FinTech Innovations",
                    description: "Financial technology innovations and digital payment systems.",
                    duration: 90
                },
                {
                    time: "10:45",
                    displayTime: "10:45 AM",
                    title: "Smart City Technologies",
                    description: "Urban technology solutions and smart city infrastructure.",
                    duration: 75
                },
                {
                    time: "12:00",
                    displayTime: "12:00 PM",
                    title: "Education Technology",
                    description: "EdTech platforms and digital learning innovations.",
                    duration: 60
                },
                {
                    time: "13:00",
                    displayTime: "1:00 PM",
                    title: "Final Lunch",
                    description: "Final conference lunch with networking.",
                    duration: 90
                },
                {
                    time: "14:30",
                    displayTime: "2:30 PM",
                    title: "Technology Ethics Panel",
                    description: "Panel discussion on ethics in technology development.",
                    duration: 75
                },
                {
                    time: "15:45",
                    displayTime: "3:45 PM",
                    title: "5G and Future Networks",
                    description: "5G technology and next-generation network architectures.",
                    duration: 90
                },
                {
                    time: "17:15",
                    displayTime: "5:15 PM",
                    title: "Final Break",
                    description: "Last networking break of the conference.",
                    duration: 30
                },
                {
                    time: "17:45",
                    displayTime: "5:45 PM",
                    title: "Technology Trends 2026",
                    description: "Predictions and trends for technology in the coming year.",
                    duration: 75
                },
                {
                    time: "19:00",
                    displayTime: "7:00 PM",
                    title: "Awards Ceremony",
                    description: "Recognition awards and achievement ceremony.",
                    duration: 90
                },
                {
                    time: "20:30",
                    displayTime: "8:30 PM",
                    title: "Closing Ceremony & Gala",
                    description: "Official conference closing ceremony and farewell gala. Conference concludes at 11:00 PM.",
                    duration: 150
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
        
        // Check if today is after Day 3
        const day3Time = new Date(this.conferenceDates['Day 3']).getTime();
        if (todayTime > day3Time) {
            console.log(`Today is after Day 3, showing Day 3 content`);
            return 'Day 3';
        }
        
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
        
        // Default to Day 1 if before conference starts
        console.log(`Before conference starts, defaulting to Day 1`);
        return 'Day 1';
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
     * @param {string} dayName Day name ('Day 1', 'Day 2', 'Day 3')
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