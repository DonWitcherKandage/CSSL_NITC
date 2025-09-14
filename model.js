/* ============================================================================
   MODEL - DATA LAYER (MVC Architecture)
   ============================================================================ */

/**
 * ConferenceModel - Manages all data and business logic
 */
class ConferenceModel {
    constructor() {
        // Conference agenda data - Sri Lankan Schedule (12:00 PM - 5:00 PM)
        this.agendaData = [
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
                time: "17:00",
                displayTime: "5:00 PM",
                title: "Conference Conclusion",
                description: "Official end of the conference. Thank you for your active participation and engagement. Safe travels to all attendees. See you at our next event!",
                duration: 0
            }
        ];

        // Current state - Always use real-time mode
        this.currentEventIndex = -1; // -1 means no current event (before/after schedule)
        this.isAutoMode = false; // Manual mode disabled for real-time
        this.lastRealTimeCheck = null; // Track when we last checked real time
        this.conferenceStatus = 'waiting'; // waiting, active, completed
    }

    /**
     * Get the agenda data
     * @returns {Array} Array of agenda items
     */
    getAgendaData() {
        return this.agendaData;
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
        if (this.currentEventIndex >= 0 && this.currentEventIndex < this.agendaData.length) {
            return this.agendaData[this.currentEventIndex];
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
        
        const firstEventMinutes = this.timeToMinutes(this.agendaData[0].time);
        const lastEventMinutes = this.timeToMinutes(this.agendaData[this.agendaData.length - 1].time);
        
        // Check if conference hasn't started yet
        if (currentMinutes < firstEventMinutes) {
            return {
                eventIndex: -1,
                status: 'waiting',
                message: 'Conference starts soon...'
            };
        }
        
        // Check if conference has ended
        if (currentMinutes >= lastEventMinutes + (this.agendaData[this.agendaData.length - 1].duration || 0)) {
            return {
                eventIndex: -1,
                status: 'completed',
                message: 'Conference has concluded'
            };
        }
        
        // Find active event (within its time duration)
        for (let i = 0; i < this.agendaData.length; i++) {
            const event = this.agendaData[i];
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
        for (let i = this.agendaData.length - 1; i >= 0; i--) {
            const eventMinutes = this.timeToMinutes(this.agendaData[i].time);
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
            
            console.log(`🕒 Real-time update: ${realTimeResult.message}`);
            if (realTimeResult.eventIndex >= 0) {
                console.log(`Current event: ${this.agendaData[realTimeResult.eventIndex].title}`);
            }
        }
        
        return hasChanged;
    }

    /**
     * Get next upcoming event
     * @returns {Object|null} Next event or null
     */
    getNextEvent() {
        const currentTime = this.getCurrentRealTime();
        const currentMinutes = this.timeToMinutes(currentTime);
        
        for (let i = 0; i < this.agendaData.length; i++) {
            const eventMinutes = this.timeToMinutes(this.agendaData[i].time);
            if (eventMinutes > currentMinutes) {
                return this.agendaData[i];
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
        if (this.currentEventIndex < this.agendaData.length - 1) {
            this.currentEventIndex++;
            this.conferenceStatus = 'active';
            console.log('⚠️ Manual override: Next event');
            return true;
        }
        return false;
    }

    previousEvent() {
        if (this.currentEventIndex > 0) {
            this.currentEventIndex--;
            this.conferenceStatus = 'active';
            console.log('⚠️ Manual override: Previous event');
            return true;
        }
        return false;
    }

    setCurrentEventIndex(index) {
        if (index >= -1 && index < this.agendaData.length) {
            this.currentEventIndex = index;
            this.conferenceStatus = index >= 0 ? 'active' : 'waiting';
            console.log('⚠️ Manual override: Set event index');
        }
    }

    /**
     * Reset to real-time mode (stop manual overrides)
     */
    resetToRealTime() {
        this.updateRealTimeEvent();
        console.log('✅ Reset to real-time mode');
    }
}