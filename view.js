/* ============================================================================
   VIEW - PRESENTATION LAYER (MVC Architecture) - DUAL DISPLAY FIXED
   ============================================================================ */

/**
 * ConferenceView - Manages all UI updates and rendering
 */
class ConferenceView {
    constructor() {
        // Cache DOM elements for performance
        this.agendaList = document.getElementById('agendaList');
        this.currentDetail = document.getElementById('currentDetail');
        this.currentClock = document.getElementById('currentClock');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.autoBtn = document.getElementById('autoBtn');
        this.controls = document.getElementById('controls');
        
        // Debug elements
        this.debugSystemTime = document.getElementById('debugSystemTime');
        this.debugDisplayTime = document.getElementById('debugDisplayTime');
        this.debugCurrentEvent = document.getElementById('debugCurrentEvent');
        this.debugMode = document.getElementById('debugMode');
        this.debugStatus = document.getElementById('debugStatus');
        
        // Current day for the conference
        this.currentDay = 'Inauguration'; // Can be changed to 'Day 1', 'Day 2', etc.
        this.logoUrl = null; // Custom logo URL
        this.logoAltText = 'Conference Logo';
        
        // Detect which display we're on
        this.isDisplay1 = !!this.agendaList;
        this.isDisplay2 = !!this.currentDetail && !this.agendaList;
        
        console.log(`View initialized for ${this.isDisplay1 ? 'Display 1 (Agenda)' : 'Display 2 (Details)'}`);
    }

    /**
     * Set the current conference day
     * @param {string} day Day name like 'Inauguration', 'Day 1', 'Day 2'
     */
    setCurrentDay(day) {
        this.currentDay = day;
    }

    /**
     * Add custom logo image
     * @param {string} logoUrl URL to the logo image
     * @param {string} altText Alt text for the logo
     */
    setLogo(logoUrl, altText = 'Conference Logo') {
        this.logoUrl = logoUrl;
        this.logoAltText = altText;
    }

    /**
     * Get logo HTML - uses PNG logo
     * @returns {string} HTML for logo section
     */
    getLogoHtml() {
        // Use the PNG logo file (make sure it's in your NITC-Agenda folder)
        return `<img src="nitc-logo.png" alt="NITC 2025 Logo">`;
    }

    /**
     * Render the complete agenda list on Screen 1 (following new design)
     * @param {Array} agendaData Array of agenda items
     * @param {number} currentIndex Currently active event index (-1 if none)
     */
    renderAgendaList(agendaData, currentIndex) {
        // Only render if we're on Display 1
        if (!this.isDisplay1 || !this.agendaList) {
            return;
        }

        try {
            // Clear existing content
            this.agendaList.innerHTML = '';
            
            // Create header section with logo and title
            const headerSection = document.createElement('div');
            headerSection.className = 'agenda-header';
            headerSection.innerHTML = `
                <div class="conference-logo">
                    ${this.getLogoHtml()}
                </div>
                <div class="event-title-section">
                    <div class="event-title">EVENT<br>SCHEDULE</div>
                    <div class="event-day">${this.currentDay}</div>
                </div>
            `;
            this.agendaList.appendChild(headerSection);
            
            // Find current event
            const currentEvent = currentIndex >= 0 ? agendaData[currentIndex] : null;
            
            // If there's a current event, show it prominently at the top
            if (currentEvent) {
                const currentEventCard = document.createElement('div');
                currentEventCard.className = 'current-event-card';
                currentEventCard.innerHTML = `
                    <div class="time">${currentEvent.displayTime}</div>
                    <div class="title">${currentEvent.title}</div>
                `;
                
                // Add click handler for testing
                currentEventCard.addEventListener('click', () => {
                    if (this.onItemClick) {
                        this.onItemClick(currentIndex);
                    }
                });
                
                this.agendaList.appendChild(currentEventCard);
            }
            
            // Create upcoming events section
            const upcomingSection = document.createElement('div');
            upcomingSection.className = 'upcoming-events';
            
            // Add upcoming events (only future events, no past events)
            let hasUpcomingEvents = false;
            for (let i = currentIndex + 1; i < agendaData.length; i++) {
                const item = agendaData[i];
                const upcomingEvent = document.createElement('div');
                upcomingEvent.className = 'upcoming-event';
                upcomingEvent.innerHTML = `
                    <div class="time">${item.displayTime} <span style="font-size: 0.8em;">Onwards</span></div>
                    <div class="title">${item.title}</div>
                `;
                
                // Add click handler for testing
                upcomingEvent.addEventListener('click', () => {
                    if (this.onItemClick) {
                        this.onItemClick(i);
                    }
                });
                
                upcomingSection.appendChild(upcomingEvent);
                hasUpcomingEvents = true;
            }
            
            // If no upcoming events, show completion message
            if (!hasUpcomingEvents) {
                const completionMessage = document.createElement('div');
                completionMessage.className = 'upcoming-event';
                completionMessage.innerHTML = `
                    <div class="time" style="color: #27ae60;">Conference Complete</div>
                    <div class="title" style="color: #27ae60;">Thank you for participating!</div>
                `;
                upcomingSection.appendChild(completionMessage);
            }
            
            this.agendaList.appendChild(upcomingSection);
            
        } catch (error) {
            console.error('Error rendering agenda list:', error);
            if (this.agendaList) {
                this.agendaList.innerHTML = `
                    <div style="color: white; text-align: center; padding: 50px;">
                        <h2>Display Error</h2>
                        <p>Failed to render agenda list</p>
                        <p style="font-size: 0.8em; margin-top: 10px;">${error.message}</p>
                    </div>
                `;
            }
        }
    }

    /**
     * Update the current item display on Screen 2
     * @param {Object|null} currentEvent Current event object or null
     * @param {string} status Conference status: 'waiting', 'active', 'completed'
     * @param {Object|null} nextEvent Next upcoming event
     * @param {number} timeUntilNext Minutes until next event
     */
    renderCurrentEvent(currentEvent, status, nextEvent, timeUntilNext) {
        // Only render if we're on Display 2
        if (!this.isDisplay2 || !this.currentDetail) {
            return;
        }

        try {
            // Clear existing content
            this.currentDetail.innerHTML = '';
            
            if (currentEvent && status === 'active') {
                // We have an active current event - display it
                this.currentDetail.innerHTML = `
                    <div class="current-time">${currentEvent.displayTime}</div>
                    <div class="current-title">${currentEvent.title}</div>
                    <div class="current-description">${currentEvent.description}</div>
                `;
            } else if (status === 'waiting') {
                // Conference hasn't started yet
                let nextEventHtml = '';
                if (nextEvent) {
                    const timeText = timeUntilNext > 0 ? 
                        `Starts in ${timeUntilNext} minutes` : 
                        'Starting now';
                    
                    nextEventHtml = `
                        <div class="next-event-preview">
                            <h3>First Event:</h3>
                            <div style="color: #e74c3c; font-size: 1.2em; margin-bottom: 10px;">
                                ${nextEvent.displayTime}
                            </div>
                            <div style="font-size: 1.1em; margin-bottom: 10px;">
                                ${nextEvent.title}
                            </div>
                            <div style="color: #f39c12; font-weight: bold;">
                                ${timeText}
                            </div>
                        </div>
                    `;
                }
                
                this.currentDetail.innerHTML = `
                    <div class="no-current-event">
                        <h2>Conference Starts Soon...</h2>
                        <p>Please take your seats and prepare for an amazing experience</p>
                        ${nextEventHtml}
                        <div class="conference-info">
                            <h4>Conference Schedule</h4>
                            <p>📅 Today's sessions run from 12:00 PM to 5:00 PM</p>
                            <p>🎯 Join us for cutting-edge insights and networking</p>
                            <p>📱 Follow live updates on our social media</p>
                        </div>
                    </div>
                `;
            } else if (status === 'completed') {
                // Conference has ended
                this.currentDetail.innerHTML = `
                    <div class="no-current-event">
                        <h2>Conference Has Concluded</h2>
                        <p>Thank you for your participation!</p>
                        <div class="conference-info">
                            <h4>Thank You!</h4>
                            <p>🎉 We hope you enjoyed today's sessions</p>
                            <p>📧 Follow-up materials will be sent via email</p>
                            <p>🤝 Stay connected with our community</p>
                            <p>📅 See you at our next event!</p>
                        </div>
                    </div>
                `;
            } else {
                // Default waiting state
                this.currentDetail.innerHTML = `
                    <div class="no-current-event">
                        <h2>NITC 2025 Conference</h2>
                        <p>Waiting for event information...</p>
                        <div class="conference-info">
                            <h4>System Status</h4>
                            <p>📺 Display 2 - Event Details</p>
                            <p>🔄 Syncing with Display 1...</p>
                            <p>⏰ Real-time updates enabled</p>
                        </div>
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('Error rendering current event:', error);
            if (this.currentDetail) {
                this.currentDetail.innerHTML = `
                    <div class="no-current-event">
                        <h2>Display Error</h2>
                        <p>Failed to render event details</p>
                        <div class="conference-info">
                            <h4>Error Details</h4>
                            <p>🔄 Please refresh the page</p>
                            <p>📞 Contact technical support</p>
                            <p style="font-family: monospace; font-size: 0.8em; margin-top: 10px;">
                                ${error.message}
                            </p>
                        </div>
                    </div>
                `;
            }
        }
    }

    /**
     * Update control button states
     * @param {number} currentIndex Current event index
     * @param {number} totalEvents Total number of events
     * @param {boolean} isAutoMode Whether auto mode is active (always false for real-time)
     */
    updateControls(currentIndex, totalEvents, isAutoMode) {
        // Only update controls on Display 1
        if (!this.isDisplay1) {
            return;
        }

        try {
            // In real-time mode, disable manual controls but keep for testing
            if (this.prevBtn) this.prevBtn.disabled = currentIndex <= 0;
            if (this.nextBtn) this.nextBtn.disabled = currentIndex >= totalEvents - 1;
            
            // Auto mode is disabled in real-time system
            if (this.autoBtn) {
                this.autoBtn.disabled = true;
                this.autoBtn.textContent = 'Real-Time Mode';
                this.autoBtn.classList.remove('auto-active');
            }
        } catch (error) {
            console.error('Error updating controls:', error);
        }
    }

    /**
     * Update the live clock display
     */
    updateClock(timeString) {
        try {
            if (this.currentClock) {
                this.currentClock.textContent = timeString;
            }
        } catch (error) {
            console.error('Error updating clock:', error);
        }
    }

    /**
     * Update debug panel information
     * @param {Object} debugInfo Debug information object
     */
    updateDebugPanel(debugInfo) {
        // Only update debug panel on Display 1
        if (!this.isDisplay1) {
            return;
        }

        try {
            if (this.debugSystemTime) this.debugSystemTime.textContent = debugInfo.systemTime;
            if (this.debugDisplayTime) this.debugDisplayTime.textContent = debugInfo.displayTime;
            if (this.debugCurrentEvent) this.debugCurrentEvent.textContent = debugInfo.currentEvent;
            if (this.debugMode) this.debugMode.textContent = debugInfo.mode;
            if (this.debugStatus) this.debugStatus.textContent = debugInfo.status;
        } catch (error) {
            console.error('Error updating debug panel:', error);
        }
    }

    /**
     * Hide control buttons (for production use)
     */
    hideControls() {
        if (this.controls) {
            this.controls.classList.add('hidden');
        }
    }

    /**
     * Show control buttons (for testing)
     */
    showControls() {
        if (this.controls) {
            this.controls.classList.remove('hidden');
        }
    }

    /**
     * Set event handlers
     * @param {Object} handlers Object containing event handler functions
     */
    setEventHandlers(handlers) {
        this.onPrevious = handlers.onPrevious;
        this.onNext = handlers.onNext;
        this.onAutoToggle = handlers.onAutoToggle;
        this.onItemClick = handlers.onItemClick;
        
        // Bind button events (only on Display 1)
        if (this.isDisplay1) {
            if (this.prevBtn) this.prevBtn.addEventListener('click', this.onPrevious);
            if (this.nextBtn) this.nextBtn.addEventListener('click', this.onNext);
            if (this.autoBtn) this.autoBtn.addEventListener('click', this.onAutoToggle);
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        try {
            if (this.isDisplay2 && this.currentDetail) {
                this.currentDetail.innerHTML = `
                    <div class="no-current-event">
                        <h2>Loading Conference Data...</h2>
                        <p>Please wait while we prepare the agenda</p>
                    </div>
                `;
            }
            
            if (this.isDisplay1 && this.agendaList) {
                this.agendaList.innerHTML = `
                    <div class="agenda-header">
                        <div class="conference-logo">
                            ${this.getLogoHtml()}
                        </div>
                        <div style="margin-left: 160px;">
                            <div class="event-title">EVENT<br>SCHEDULE</div>
                            <div class="event-day">Loading...</div>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error showing loading state:', error);
        }
    }

    /**
     * Show error state
     * @param {string} errorMessage Error message to display
     */
    showError(errorMessage) {
        try {
            if (this.isDisplay2 && this.currentDetail) {
                this.currentDetail.innerHTML = `
                    <div class="no-current-event">
                        <h2>System Error</h2>
                        <p>${errorMessage}</p>
                        <div class="conference-info">
                            <h4>Troubleshooting</h4>
                            <p>🔄 Please refresh the page</p>
                            <p>🔍 Check your internet connection</p>
                            <p>📞 Contact technical support if issue persists</p>
                        </div>
                    </div>
                `;
            }

            if (this.isDisplay1 && this.agendaList) {
                this.agendaList.innerHTML = `
                    <div style="color: white; text-align: center; padding: 50px;">
                        <h2>System Error</h2>
                        <p>${errorMessage}</p>
                        <div style="margin-top: 20px;">
                            <h4>Troubleshooting</h4>
                            <p>🔄 Please refresh the page</p>
                            <p>🔍 Check your internet connection</p>
                            <p>📞 Contact technical support if issue persists</p>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error showing error state:', error);
        }
    }

    /**
     * Update the conference day dynamically
     * @param {string} day New day to display
     */
    updateConferenceDay(day) {
        this.setCurrentDay(day);
        // Find and update the day element if it exists
        const dayElement = document.querySelector('.event-day');
        if (dayElement) {
            dayElement.textContent = day;
        }
    }
}