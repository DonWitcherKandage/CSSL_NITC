/* ============================================================================
   MODERN CONFERENCE MODEL - DATA LAYER (MVC Architecture)
   Enhanced with automatic day detection and improved timing logic
   ============================================================================ */

/**
 * ModernConferenceModel - Manages all data and business logic with enhanced features
 */
class ModernConferenceModel {
    constructor() {
        // Conference dates configuration
        this.conferenceDates = {
            'Inauguration': '2025-09-18',
            'Day 1': '2025-09-19',
            'Day 2': '2025-09-20'
        };
        
        // Automatically detect current day based on real date
        this.currentDay = this.detectCurrentDay();
        console.log(`Conference day automatically detected: ${this.currentDay}`);
        
        // Enhanced multi-day agenda data with detailed descriptions
        this.allAgendaData = {
            'Inauguration': [
                {
                    time: "12:00",
                    displayTime: "12:00 PM",
                    title: "Arrival of the Chief Guest & the Guest of Honour",
                    description: "Welcome our distinguished Chief Guest and Guest of Honour as they arrive for the inauguration ceremony. Please take your seats as we prepare to begin this momentous conference that will showcase the latest innovations in technology and digital transformation.",
                    duration: 20,
                    speaker: "Conference Organizers",
                    type: "ceremony"
                },
                {
                    time: "12:20",
                    displayTime: "12:20 PM",
                    title: "Welcome Address by Mr. Heshan Karunaratne",
                    description: "Opening remarks and welcome address by Mr. Heshan Karunaratne, President of CSSL. Setting the tone for the conference and introducing key participants, objectives, and the vision for technological advancement in Sri Lanka.",
                    duration: 10,
                    speaker: "Mr. Heshan Karunaratne - President, CSSL",
                    type: "address"
                },
                {
                    time: "12:30",
                    displayTime: "12:30 PM",
                    title: "CSSL National ICT Awards 2025 - Session 1",
                    description: "First session of the prestigious CSSL National ICT Awards ceremony, recognizing outstanding achievements and innovations in the field of information and communication technology. Celebrating excellence in digital innovation across various sectors.",
                    duration: 15,
                    speaker: "CSSL Awards Committee",
                    type: "awards"
                },
                {
                    time: "12:45",
                    displayTime: "12:45 PM",
                    title: "Address by the Chief Guest",
                    description: "Keynote address by our distinguished Chief Guest, sharing insights on the future of technology and its transformative impact on society, business innovation, and economic growth in the digital age.",
                    duration: 10,
                    speaker: "Chief Guest",
                    type: "keynote"
                },
                {
                    time: "12:55",
                    displayTime: "12:55 PM",
                    title: "Address by the Guest of Honor",
                    description: "Inspiring address by our Guest of Honor, highlighting the critical importance of innovation and technological advancement in driving sustainable economic growth and social development across all sectors.",
                    duration: 15,
                    speaker: "Guest of Honor",
                    type: "keynote"
                },
                {
                    time: "13:10",
                    displayTime: "1:10 PM",
                    title: "Keynote Address By Mr. Sandun Hapugoda",
                    description: "Strategic keynote presentation by Mr. Sandun Hapugoda, Country Manager - Sri Lanka and Maldives Mastercards, focusing on digital payment innovations, financial technology trends, and the future of cashless economies in South Asia.",
                    duration: 20,
                    speaker: "Mr. Sandun Hapugoda - Country Manager, Mastercard",
                    type: "keynote"
                },
                {
                    time: "13:30",
                    displayTime: "1:30 PM",
                    title: "CSSL National ICT Awards 2025 - Session 2",
                    description: "Second session of the national ICT awards ceremony, continuing the recognition of exceptional contributions to the technology sector and digital innovation landscape. Honoring pioneers in emerging technologies.",
                    duration: 15,
                    speaker: "CSSL Awards Committee",
                    type: "awards"
                },
                {
                    time: "13:45",
                    displayTime: "1:45 PM",
                    title: "Keynote Address by Mr. Lasantha Bogoda",
                    description: "Industry insights presentation by Mr. Lasantha Bogoda, Director/CEO of DMS Software Technologies (Pvt) Ltd, covering enterprise software solutions, digital transformation strategies, and the evolution of business technology platforms.",
                    duration: 10,
                    speaker: "Mr. Lasantha Bogoda - CEO, DMS Software Technologies",
                    type: "keynote"
                },
                {
                    time: "13:55",
                    displayTime: "1:55 PM",
                    title: "Keynote Address by Mr. Shanaka de Silva",
                    description: "Strategic business presentation by Mr. Shanaka de Silva, Group Finance Director at South Asian Technologies Group, discussing technology investment landscapes, growth opportunities, and financial strategies for tech companies in the region.",
                    duration: 20,
                    speaker: "Mr. Shanaka de Silva - Group Finance Director, South Asian Technologies",
                    type: "keynote"
                },
                {
                    time: "14:15",
                    displayTime: "2:15 PM",
                    title: "Recognition of Sponsors NITC 2025",
                    description: "Special acknowledgment and appreciation ceremony for all sponsors and partners who made NITC 2025 possible. Recognition of their valuable contributions to the conference success and their commitment to advancing technology in Sri Lanka.",
                    duration: 20,
                    speaker: "Conference Organizers",
                    type: "ceremony"
                },
                {
                    time: "14:35",
                    displayTime: "2:35 PM",
                    title: "Vote of Thanks by Dr. Amal Illesinghe",
                    description: "Closing remarks and heartfelt gratitude expressed by Dr. Amal Illesinghe, Conference Chair - NITC 2025, thanking all participants, speakers, sponsors, and organizers for making this inauguration a remarkable success.",
                    duration: 15,
                    speaker: "Dr. Amal Illesinghe - Conference Chair, NITC 2025",
                    type: "closing"
                },
                {
                    time: "14:50",
                    displayTime: "2:50 PM",
                    title: "Inauguration Conclusion",
                    description: "Official conclusion of the inauguration ceremony. Thank you for your active participation in this remarkable opening event. We look forward to seeing you tomorrow for Day 1 sessions starting at 8:15 AM with exciting technical presentations and networking opportunities!",
                    duration: 0,
                    speaker: "Conference Team",
                    type: "conclusion"
                }
            ],

            'Day 1': [
                {
                    time: "08:15",
                    displayTime: "8:15 AM",
                    title: "Registration & Welcome",
                    description: "Participant registration and check-in for Day 1. Collect your conference materials, name tags, networking kit, and technical session guides. Network with fellow participants and prepare for an exciting day of innovation and learning.",
                    duration: 45,
                    speaker: "Conference Team",
                    type: "registration"
                },
                {
                    time: "09:00",
                    displayTime: "9:00 AM",
                    title: "Guest Speech: Hon. Eranga Weeraratne",
                    description: "Opening guest speech by the Honorable Eranga Weeraratne, setting the strategic tone for Day 1 discussions on digital transformation, innovation policy, and the role of technology in national development.",
                    duration: 20,
                    speaker: "Hon. Eranga Weeraratne",
                    type: "keynote"
                },
                {
                    time: "09:20",
                    displayTime: "9:20 AM",
                    title: "Keynote 1: Future of Technology",
                    description: "First keynote presentation exploring cutting-edge technology trends, emerging innovations, and their transformative impact on modern business practices, society, and the global digital economy.",
                    duration: 25,
                    speaker: "Technology Expert",
                    type: "keynote"
                },
                {
                    time: "09:45",
                    displayTime: "9:45 AM",
                    title: "Panel Discussion 1: E-Government 5.0",
                    description: "Expert panel discussing the evolution of e-government services towards human-centric design, seamless integration, and proactive public service delivery. Exploring the future of digital governance and citizen engagement platforms.",
                    duration: 60,
                    speaker: "Government Technology Panel",
                    type: "panel"
                },
                {
                    time: "10:45",
                    displayTime: "10:45 AM",
                    title: "Morning Tea & Networking",
                    description: "Networking break with premium tea, coffee, and light refreshments. Connect with fellow participants, speakers, and industry leaders. Exchange ideas and build valuable professional relationships.",
                    duration: 35,
                    speaker: "All Participants",
                    type: "break"
                },
                {
                    time: "11:20",
                    displayTime: "11:20 AM",
                    title: "Keynote 2: Digital Innovation Strategies",
                    description: "Second keynote presentation focusing on strategic approaches to digital innovation, technology adoption frameworks, and best practices for organizational digital transformation in competitive markets.",
                    duration: 25,
                    speaker: "Innovation Strategist",
                    type: "keynote"
                }
                // Additional Day 1 events can be added here
            ],

            'Day 2': [
                {
                    time: "08:30",
                    displayTime: "8:30 AM",
                    title: "Day 2 Registration",
                    description: "Welcome back to NITC 2025! Day 2 registration and check-in. Collect your Day 2 materials and prepare for advanced sessions covering emerging technologies, industry insights, and future trends.",
                    duration: 30,
                    speaker: "Conference Team",
                    type: "registration"
                },
                {
                    time: "09:00",
                    displayTime: "9:00 AM",
                    title: "Guest Speech: Dr. Hans Wijesuriya",
                    description: "Opening guest speech by Dr. Hans Wijesuriya, Chief Advisor to the President of Sri Lanka on Digital Economy & Chairman, ICT Agency of Sri Lanka. Strategic insights on national digital transformation initiatives.",
                    duration: 20,
                    speaker: "Dr. Hans Wijesuriya - Chief Advisor on Digital Economy",
                    type: "keynote"
                }
                // Additional Day 2 events can be added here
            ]
        };

        // Current state tracking
        this.currentEventIndex = -1; // -1 means no current event (before/after schedule)
        this.conferenceStatus = 'waiting'; // waiting, active, completed
        this.lastRealTimeCheck = null;
        
        // Enhanced timing and status tracking
        this.statusHistory = [];
        this.eventTransitions = [];
        
        // Set up automatic day change detection
        this.setupDayChangeDetection();
        
        console.log(`Model initialized for ${this.currentDay} with ${this.getAgendaData().length} events`);
    }

    /**
     * Automatically detect which conference day based on current date
     * @returns {string} Conference day name
     */
    detectCurrentDay() {
        const today = new Date().toISOString().split('T')[0];
        
        console.log(`Today's date: ${today}`);
        console.log(`Conference dates:`, this.conferenceDates);
        
        // Check if today matches any conference date
        for (const [dayName, date] of Object.entries(this.conferenceDates)) {
            if (date === today) {
                console.log(`Found matching day: ${dayName} for date ${today}`);
                return dayName;
            }
        }
        
        // If no exact match, determine based on progression
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
     * Set up automatic day change detection with enhanced monitoring
     */
    setupDayChangeDetection() {
        // Check for day changes every minute
        setInterval(() => {
            const detectedDay = this.detectCurrentDay();
            if (detectedDay !== this.currentDay) {
                console.log(`Day change detected: ${this.currentDay} → ${detectedDay}`);
                
                // Log the transition
                this.eventTransitions.push({
                    timestamp: new Date(),
                    type: 'day_change',
                    from: this.currentDay,
                    to: detectedDay
                });
                
                this.currentDay = detectedDay;
                this.currentEventIndex = -1; // Reset event index
                this.conferenceStatus = 'waiting'; // Reset status
                
                // Notify any listeners about day change
                this.notifyDayChange(detectedDay);
            }
        }, 60000); // Check every minute
    }

    /**
     * Notify external systems about day changes
     */
    notifyDayChange(newDay) {
        // Notify the view if available
        if (window.conferenceApp && window.conferenceApp.view) {
            window.conferenceApp.view.updateConferenceDay(newDay);
        }
        
        // Dispatch custom event for any listeners
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('conferenceTheme_theme_changed', {
                detail: { newDay, timestamp: new Date() }
            }));
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
     * Get all available conference days
     * @returns {Array} Array of day names
     */
    getAvailableDays() {
        return Object.keys(this.allAgendaData);
    }

    /**
     * Set current day (manual override with validation)
     * @param {string} dayName Day name ('Inauguration', 'Day 1', 'Day 2')
     * @returns {boolean} True if day was set successfully
     */
    setCurrentDay(dayName) {
        if (this.allAgendaData[dayName]) {
            const previousDay = this.currentDay;
            this.currentDay = dayName;
            this.currentEventIndex = -1; // Reset event index
            this.conferenceStatus = 'waiting'; // Reset status
            
            // Log the manual change
            this.eventTransitions.push({
                timestamp: new Date(),
                type: 'manual_day_change',
                from: previousDay,
                to: dayName
            });
            
            console.log(`Conference day manually switched to: ${dayName}`);
            this.notifyDayChange(dayName);
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
     * Convert time string to minutes since midnight (enhanced with validation)
     * @param {string} timeStr Time in "HH:MM" format
     * @returns {number} Minutes since midnight
     */
    timeToMinutes(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') {
            console.warn('Invalid time string provided:', timeStr);
            return 0;
        }
        
        const [hours, minutes] = timeStr.split(':').map(Number);
        
        if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            console.warn('Invalid time format:', timeStr);
            return 0;
        }
        
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
     * Enhanced method to find current real-time event with detailed status
     * @returns {Object} Object with eventIndex, status, and additional metadata
     */
    findCurrentRealTimeEvent() {
        const currentTime = this.getCurrentRealTime();
        const currentMinutes = this.timeToMinutes(currentTime);
        const agenda = this.getAgendaData();
        
        if (agenda.length === 0) {
            return {
                eventIndex: -1,
                status: 'waiting',
                message: `No events scheduled for ${this.currentDay}`,
                timeInfo: { currentTime, currentMinutes }
            };
        }
        
        const firstEventMinutes = this.timeToMinutes(agenda[0].time);
        const lastEvent = agenda[agenda.length - 1];
        const lastEventMinutes = this.timeToMinutes(lastEvent.time);
        const lastEventEndMinutes = lastEventMinutes + (lastEvent.duration || 0);
        
        // Before conference starts
        if (currentMinutes < firstEventMinutes) {
            const minutesUntilStart = firstEventMinutes - currentMinutes;
            return {
                eventIndex: -1,
                status: 'waiting',
                message: `${this.currentDay} starts in ${minutesUntilStart} minutes`,
                timeInfo: { currentTime, currentMinutes, minutesUntilStart },
                nextEvent: agenda[0]
            };
        }
        
        // After conference ends
        if (currentMinutes >= lastEventEndMinutes) {
            return {
                eventIndex: -1,
                status: 'completed',
                message: `${this.currentDay} has concluded`,
                timeInfo: { currentTime, currentMinutes },
                completedAt: `${Math.floor(lastEventEndMinutes / 60)}:${(lastEventEndMinutes % 60).toString().padStart(2, '0')}`
            };
        }
        
        // Find active event
        for (let i = 0; i < agenda.length; i++) {
            const event = agenda[i];
            const eventStart = this.timeToMinutes(event.time);
            const eventEnd = eventStart + (event.duration || 0);
            
            // Current time is within this event's duration
            if (currentMinutes >= eventStart && currentMinutes < eventEnd) {
                const eventProgress = ((currentMinutes - eventStart) / (event.duration || 1)) * 100;
                const minutesRemaining = eventEnd - currentMinutes;
                
                return {
                    eventIndex: i,
                    status: 'active',
                    message: 'Event in progress',
                    timeInfo: { 
                        currentTime, 
                        currentMinutes, 
                        eventProgress: Math.round(eventProgress),
                        minutesRemaining 
                    },
                    currentEvent: event,
                    nextEvent: agenda[i + 1] || null
                };
            }
        }
        
        // Between events - find the most recent completed event
        let mostRecentIndex = -1;
        for (let i = agenda.length - 1; i >= 0; i--) {
            const eventEnd = this.timeToMinutes(agenda[i].time) + (agenda[i].duration || 0);
            if (eventEnd <= currentMinutes) {
                mostRecentIndex = i;
                break;
            }
        }
        
        // Find next upcoming event
        let nextEventIndex = -1;
        for (let i = 0; i < agenda.length; i++) {
            const eventStart = this.timeToMinutes(agenda[i].time);
            if (eventStart > currentMinutes) {
                nextEventIndex = i;
                break;
            }
        }
        
        const nextEvent = nextEventIndex >= 0 ? agenda[nextEventIndex] : null;
        const minutesUntilNext = nextEvent ? this.timeToMinutes(nextEvent.time) - currentMinutes : -1;
        
        return {
            eventIndex: mostRecentIndex,
            status: 'between',
            message: nextEvent ? `Next event in ${minutesUntilNext} minutes` : 'No more events today',
            timeInfo: { currentTime, currentMinutes, minutesUntilNext },
            lastCompletedEvent: mostRecentIndex >= 0 ? agenda[mostRecentIndex] : null,
            nextEvent: nextEvent
        };
    }

    /**
     * Update current event based on real time with enhanced tracking
     * @returns {boolean} True if event changed, false otherwise
     */
    updateRealTimeEvent() {
        const realTimeResult = this.findCurrentRealTimeEvent();
        const previousIndex = this.currentEventIndex;
        const previousStatus = this.conferenceStatus;
        
        const hasChanged = this.currentEventIndex !== realTimeResult.eventIndex || 
                          this.conferenceStatus !== realTimeResult.status;
        
        if (hasChanged) {
            // Log the transition
            this.eventTransitions.push({
                timestamp: new Date(),
                type: 'event_change',
                from: { index: previousIndex, status: previousStatus },
                to: { index: realTimeResult.eventIndex, status: realTimeResult.status },
                timeInfo: realTimeResult.timeInfo
            });
            
            this.currentEventIndex = realTimeResult.eventIndex;
            this.conferenceStatus = realTimeResult.status;
            this.lastRealTimeCheck = new Date();
            
            console.log(`Real-time update (${this.currentDay}): ${realTimeResult.message}`);
            if (realTimeResult.eventIndex >= 0) {
                const agenda = this.getAgendaData();
                console.log(`Current event: ${agenda[realTimeResult.eventIndex].title}`);
            }
        }
        
        // Update status history
        this.statusHistory.push({
            timestamp: new Date(),
            status: this.conferenceStatus,
            eventIndex: this.currentEventIndex,
            timeInfo: realTimeResult.timeInfo
        });
        
        // Keep only last 100 status entries to prevent memory bloat
        if (this.statusHistory.length > 100) {
            this.statusHistory = this.statusHistory.slice(-100);
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
     * Get current event index
     * @returns {number} Current event index (-1 if no current event)
     */
    getCurrentEventIndex() {
        return this.currentEventIndex;
    }

    /**
     * Get current event data with enhanced information
     * @returns {Object|null} Current event object with additional metadata or null
     */
    getCurrentEvent() {
        const agenda = this.getAgendaData();
        if (this.currentEventIndex >= 0 && this.currentEventIndex < agenda.length) {
            const event = agenda[this.currentEventIndex];
            
            // Add calculated metadata
            const currentMinutes = this.timeToMinutes(this.getCurrentRealTime());
            const eventStart = this.timeToMinutes(event.time);
            const eventEnd = eventStart + (event.duration || 0);
            const progress = this.conferenceStatus === 'active' ? 
                Math.round(((currentMinutes - eventStart) / (event.duration || 1)) * 100) : 0;
            
            return {
                ...event,
                metadata: {
                    index: this.currentEventIndex,
                    totalEvents: agenda.length,
                    progress: Math.max(0, Math.min(100, progress)),
                    isActive: this.conferenceStatus === 'active',
                    startMinutes: eventStart,
                    endMinutes: eventEnd
                }
            };
        }
        return null;
    }

    /**
     * Get conference status
     * @returns {string} 'waiting', 'active', 'between', or 'completed'
     */
    getConferenceStatus() {
        return this.conferenceStatus;
    }

    /**
     * Get system diagnostics and status information
     * @returns {Object} Comprehensive system status
     */
    getSystemDiagnostics() {
        const agenda = this.getAgendaData();
        const currentEvent = this.getCurrentEvent();
        
        return {
            currentDay: this.currentDay,
            availableDays: this.getAvailableDays(),
            currentTime: this.getCurrentRealTime(),
            currentTimeWithSeconds: this.getCurrentRealTimeWithSeconds(),
            conferenceStatus: this.conferenceStatus,
            currentEventIndex: this.currentEventIndex,
            totalEvents: agenda.length,
            currentEvent: currentEvent,
            nextEvent: this.getNextEvent(),
            timeUntilNext: this.getTimeUntilNextEvent(),
            statusHistory: this.statusHistory.slice(-10), // Last 10 status changes
            eventTransitions: this.eventTransitions.slice(-5), // Last 5 transitions
            lastRealTimeCheck: this.lastRealTimeCheck,
            conferenceDates: this.conferenceDates
        };
    }

    /**
     * Manual navigation methods (for testing purposes)
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
            console.log('Manual override: Set event index to', index);
        }
    }

    /**
     * Reset to real-time mode (stop manual overrides)
     */
    resetToRealTime() {
        this.updateRealTimeEvent();
        console.log(`Reset to real-time mode for ${this.currentDay}`);
    }

    /**
     * Update conference dates (for configuration)
     * @param {Object} dates Object with day names as keys and dates as values
     */
    updateConferenceDates(dates) {
        this.conferenceDates = { ...this.conferenceDates, ...dates };
        console.log('Conference dates updated:', this.conferenceDates);
        
        // Re-detect current day
        const newDay = this.detectCurrentDay();
        if (newDay !== this.currentDay) {
            this.setCurrentDay(newDay);
        }
    }
}

// Global functions for external access
if (typeof window !== 'undefined') {
    window.updateConferenceDates = function(dates) {
        if (window.conferenceApp && window.conferenceApp.model) {
            window.conferenceApp.model.updateConferenceDates(dates);
        }
    };
}

console.log('ModernConferenceModel loaded with enhanced features and automatic day detection');