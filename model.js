/* ============================================================================
   MODEL - DATA LAYER (MVC Architecture) - WITH AUTOMATIC DAY DETECTION
   ============================================================================ */

/**
 * ConferenceModel - Manages all data and business logic with automatic day switching
 */
class ConferenceModel {
    constructor() {
        // Conference dates (modify these to match your actual conference dates)
        this.conferenceDates = {
            'Inauguration': '2025-09-15', // Yesterday's date
            'Day 1': '2025-09-16',        // Today's date  
            'Day 2': '2025-09-17'         // Tomorrow's date
        };
        
        // Automatically detect current day based on real date
        this.currentDay = this.detectCurrentDay();
        console.log(`📅 Automatically detected conference day: ${this.currentDay}`);
        
        // Multi-day agenda data
        this.allAgendaData = {
            'Inauguration': [
                {
                    time: "12:00", // 24-hour format for accurate time matching
                    displayTime: "12:00 PM", // Display format for users
                    title: "Arrival of the Chief Guest & the Guest of Honour",
                    description: "Welcome our distinguished Chief Guest and Guest of Honour. Please take your seats as we prepare to begin this momentous conference.",
                    duration: 20 // Duration in minutes
                },
                {
                    time: "12:20",
                    displayTime: "12:20 PM",
                    title: "Welcome Address by Mr. Heshan Karunaratne",
                    description: "Opening remarks and welcome address by Mr. Heshan Karunaratne, President of CSSL. Setting the tone for today's discussions and introducing key participants.",
                    duration: 25
                },
                {
                    time: "12:45",
                    displayTime: "12:45 PM",
                    title: "Keynote Speech - Future of Technology",
                    description: "An inspiring keynote presentation exploring emerging technologies, digital transformation trends, and their profound impact on society and business innovation.",
                    duration: 45
                },
                {
                    time: "13:30",
                    displayTime: "1:30 PM",
                    title: "Panel Discussion: Digital Innovation",
                    description: "Interactive panel featuring industry leaders discussing digital transformation strategies, innovation frameworks, and best practices for modern businesses.",
                    duration: 45
                },
                {
                    time: "14:15",
                    displayTime: "2:15 PM",
                    title: "Networking Break & Refreshments",
                    description: "Light refreshments will be served in the lobby area. Perfect opportunity to network with fellow attendees, speakers, and industry professionals.",
                    duration: 30
                },
                {
                    time: "14:45",
                    displayTime: "2:45 PM",
                    title: "Technical Workshop: AI Applications",
                    description: "Hands-on workshop demonstrating practical applications of artificial intelligence in modern business environments. Bring your laptops for interactive sessions.",
                    duration: 45
                },
                {
                    time: "15:30",
                    displayTime: "3:30 PM",
                    title: "Startup Pitch Session",
                    description: "Emerging startups present their innovative solutions and cutting-edge technologies to a panel of investors and industry experts. Witness the future of tech innovation.",
                    duration: 45
                },
                {
                    time: "16:15",
                    displayTime: "4:15 PM",
                    title: "Awards Ceremony",
                    description: "Recognition of outstanding achievements in technology and innovation. Presentation of awards to deserving recipients who have made significant contributions to the industry.",
                    duration: 30
                },
                {
                    time: "16:45",
                    displayTime: "4:45 PM",
                    title: "Closing Remarks & Thank You",
                    description: "Final thoughts and key takeaways from today's conference. Acknowledgment of sponsors, speakers, and participants. Summary of important insights and next steps.",
                    duration: 15
                },
                {
                    time: "23:30",
                    displayTime: "11:30 PM",
                    title: "Inauguration Conclusion",
                    description: "Official end of the inauguration ceremony. Thank you for your active participation. See you tomorrow for Day 1 sessions!",
                    duration: 0
                }
            ],

            'Day 1': [
                {
                    time: "09:00",
                    displayTime: "9:00 AM",
                    title: "Registration & Morning Coffee",
                    description: "Participant registration and networking over coffee. Collect your conference materials and connect with fellow attendees before the day begins.",
                    duration: 30
                },
                {
                    time: "09:30",
                    displayTime: "9:30 AM",
                    title: "Day 1 Opening Session",
                    description: "Welcome to Day 1 of NITC 2025. Overview of today's agenda, introduction to speakers, and setting expectations for an exciting day of learning and innovation.",
                    duration: 30
                },
                {
                    time: "10:00",
                    displayTime: "10:00 AM",
                    title: "Blockchain & Cryptocurrency Trends",
                    description: "Deep dive into the latest developments in blockchain technology and cryptocurrency markets. Understanding the implications for businesses and society.",
                    duration: 45
                },
                {
                    time: "10:45",
                    displayTime: "10:45 AM",
                    title: "Coffee Break & Networking",
                    description: "Short break with coffee and light snacks. Perfect time to discuss the blockchain session and network with other participants.",
                    duration: 15
                },
                {
                    time: "11:00",
                    displayTime: "11:00 AM",
                    title: "Cloud Computing & DevOps Best Practices",
                    description: "Modern approaches to cloud infrastructure, containerization, and DevOps workflows. Learn from industry experts about scalable and efficient deployment strategies.",
                    duration: 60
                },
                {
                    time: "12:00",
                    displayTime: "12:00 PM",
                    title: "Lunch Break",
                    description: "Buffet lunch with networking opportunities. Enjoy delicious food while connecting with speakers and fellow attendees from various industries.",
                    duration: 60
                },
                {
                    time: "13:00",
                    displayTime: "1:00 PM",
                    title: "Cybersecurity in the Digital Age",
                    description: "Critical security challenges facing organizations today. Learn about threat detection, prevention strategies, and building resilient security frameworks.",
                    duration: 45
                },
                {
                    time: "13:45",
                    displayTime: "1:45 PM",
                    title: "Interactive Q&A Session",
                    description: "Open floor discussion with all Day 1 speakers. Ask questions, share insights, and engage in meaningful conversations about today's topics.",
                    duration: 30
                },
                {
                    time: "14:15",
                    displayTime: "2:15 PM",
                    title: "Hands-on Workshop: Modern Web Development",
                    description: "Practical coding workshop covering latest web technologies, frameworks, and development methodologies. Bring your laptops for hands-on experience.",
                    duration: 90
                },
                {
                    time: "15:45",
                    displayTime: "3:45 PM",
                    title: "Day 1 Closing & Day 2 Preview",
                    description: "Wrap-up of Day 1 highlights, key takeaways, and exciting preview of tomorrow's Day 2 sessions. Thank you for an amazing first day!",
                    duration: 15
                }
            ],

            'Day 2': [
                {
                    time: "09:00",
                    displayTime: "9:00 AM",
                    title: "Day 2 Welcome & Recap",
                    description: "Welcome back to NITC 2025! Quick recap of Day 1 highlights and introduction to today's advanced sessions and workshops.",
                    duration: 30
                },
                {
                    time: "09:30",
                    displayTime: "9:30 AM",
                    title: "Machine Learning & Data Science",
                    description: "Advanced techniques in machine learning, data analysis, and predictive modeling. Real-world applications and case studies from leading organizations.",
                    duration: 60
                },
                {
                    time: "10:30",
                    displayTime: "10:30 AM",
                    title: "Coffee Break",
                    description: "Refreshment break with coffee, tea, and networking opportunities. Discuss the ML session and prepare for the next presentation.",
                    duration: 15
                },
                {
                    time: "10:45",
                    displayTime: "10:45 AM",
                    title: "IoT & Smart Cities Initiative",
                    description: "Internet of Things applications in building smart cities. Explore sensor networks, data collection, and urban planning technologies for the future.",
                    duration: 45
                },
                {
                    time: "11:30",
                    displayTime: "11:30 AM",
                    title: "Quantum Computing Fundamentals",
                    description: "Introduction to quantum computing principles, current state of the technology, and potential applications that could revolutionize computing.",
                    duration: 45
                },
                {
                    time: "12:15",
                    displayTime: "12:15 PM",
                    title: "Lunch & Networking Session",
                    description: "Extended lunch break with structured networking activities. Meet industry leaders, potential collaborators, and like-minded professionals.",
                    duration: 75
                },
                {
                    time: "13:30",
                    displayTime: "1:30 PM",
                    title: "Entrepreneurship & Innovation Panel",
                    description: "Panel discussion with successful entrepreneurs and innovators. Learn about startup journeys, funding strategies, and scaling technology businesses.",
                    duration: 60
                },
                {
                    time: "14:30",
                    displayTime: "2:30 PM",
                    title: "Future of Work & Remote Technologies",
                    description: "How technology is reshaping the workplace. Remote work tools, collaboration platforms, and the evolution of professional environments.",
                    duration: 45
                },
                {
                    time: "15:15",
                    displayTime: "3:15 PM",
                    title: "Final Networking & Feedback Session",
                    description: "Last chance to network with all participants. Share feedback about the conference and exchange contact information with new connections.",
                    duration: 30
                },
                {
                    time: "15:45",
                    displayTime: "3:45 PM",
                    title: "Conference Grand Finale",
                    description: "Official closing ceremony of NITC 2025. Thank you messages, final announcements, and celebration of two incredible days of learning and innovation.",
                    duration: 15
                },
                {
                    time: "16:00",
                    displayTime: "4:00 PM",
                    title: "NITC 2025 Conclusion",
                    description: "Thank you for being part of NITC 2025! Safe travels to all participants. Stay connected and we look forward to seeing you at future events.",
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
        
        console.log(`📅 Today's date: ${today}`);
        console.log(`📋 Conference dates:`, this.conferenceDates);
        
        // Check if today matches any conference date
        for (const [dayName, date] of Object.entries(this.conferenceDates)) {
            if (date === today) {
                console.log(`✅ Found matching day: ${dayName} for date ${today}`);
                return dayName;
            }
        }
        
        // If no exact match, check if we're past certain dates
        const todayTime = new Date(today).getTime();
        
        // Check if today is after Day 2
        const day2Time = new Date(this.conferenceDates['Day 2']).getTime();
        if (todayTime > day2Time) {
            console.log(`📅 Today is after Day 2, showing Day 2 content`);
            return 'Day 2';
        }
        
        // Check if today is after Day 1
        const day1Time = new Date(this.conferenceDates['Day 1']).getTime();
        if (todayTime > day1Time) {
            console.log(`📅 Today is after Day 1, showing Day 1 content`);
            return 'Day 1';
        }
        
        // Check if today is after Inauguration
        const inaugTime = new Date(this.conferenceDates['Inauguration']).getTime();
        if (todayTime > inaugTime) {
            console.log(`📅 Today is after Inauguration, showing Inauguration content`);
            return 'Inauguration';
        }
        
        // Default to Inauguration if before conference starts
        console.log(`📅 Before conference starts, defaulting to Inauguration`);
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
                console.log(`🔄 Day change detected: ${this.currentDay} → ${detectedDay}`);
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
        console.log('📅 Conference dates updated:', this.conferenceDates);
        
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