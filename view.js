/* ============================================================================
   VIEW - PRESENTATION LAYER (MVC Architecture) - WITH WEBCAM INTEGRATION
   ============================================================================ */

/**
 * ConferenceView - Manages all UI updates and rendering with live webcam integration
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
        
        // Webcam settings for production use
        this.webcamEnabled = true;
        this.webcamStream = null;
        this.webcamVideoElement = null;
        this.webcamInitialized = false;
        
        // Current day for the conference
        this.currentDay = 'Inauguration';
        this.logoUrl = null;
        this.logoAltText = 'Conference Logo';
        
        // Detect which display we're on
        this.isDisplay1 = !!this.agendaList;
        this.isDisplay2 = !!this.currentDetail && !this.agendaList;
        
        console.log(`View initialized for ${this.isDisplay1 ? 'Display 1 (Agenda)' : 'Display 2 (Details)'}`);
        
        // Set up periodic day sync
        this.setupDaySync();
        
        // Initialize webcam for Display 2 after a short delay
        if (this.isDisplay2) {
            setTimeout(() => this.initializeWebcam(), 1000);
        }
    }

    /**
     * Initialize webcam for Display 2 - PRODUCTION READY
     */
    async initializeWebcam() {
        if (!this.isDisplay2 || this.webcamInitialized) return;
        
        try {
            console.log('Initializing webcam for Display 2...');
            
            // Request webcam access with optimal settings for conference
            this.webcamStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640, max: 1280 },
                    height: { ideal: 480, max: 720 },
                    frameRate: { ideal: 30, max: 60 }
                },
                audio: false
            });
            
            this.webcamInitialized = true;
            console.log('Webcam initialized successfully');
            
            // Apply webcam to any existing video element
            this.attachWebcamToVideoElement();
            
        } catch (error) {
            console.error('Webcam initialization failed:', error);
            this.webcamEnabled = false;
            
            // Show user-friendly error in webcam area
            setTimeout(() => this.showWebcamError(error.message), 500);
        }
    }

    /**
     * Attach webcam stream to video element
     */
    attachWebcamToVideoElement() {
        if (!this.webcamStream) return;
        
        const videoElement = document.getElementById('live-webcam-feed');
        if (videoElement) {
            videoElement.srcObject = this.webcamStream;
            videoElement.onloadedmetadata = () => {
                videoElement.play().catch(e => console.log('Autoplay prevented:', e));
            };
            console.log('Webcam stream attached to video element');
        }
    }

    /**
     * Generate webcam HTML for Display 2 - OPTIMIZED FOR VERTICAL SCREENS
     */
    generateWebcamHTML() {
        if (!this.webcamEnabled || !this.isDisplay2) {
            return '';
        }

        return `
            <div class="webcam-container">
                <div class="webcam-header">
                    <span class="webcam-title">Live from Conference Hall</span>
                    <span class="webcam-status">● LIVE</span>
                </div>
                <video 
                    id="live-webcam-feed" 
                    class="webcam-feed" 
                    autoplay 
                    muted 
                    playsinline>
                    <div class="webcam-fallback">
                        <p>Camera not available</p>
                    </div>
                </video>
            </div>
        `;
    }

    /**
     * Show webcam error state
     */
    showWebcamError(errorMessage) {
        const webcamContainer = document.querySelector('.webcam-container');
        if (webcamContainer) {
            webcamContainer.innerHTML = `
                <div class="webcam-header">
                    <span class="webcam-title">Conference Hall</span>
                    <span class="webcam-status">● CONNECTION ERROR</span>
                </div>
                <div class="webcam-error">
                    <p>Camera not available</p>
                    <p class="error-details">${errorMessage}</p>
                </div>
            `;
        }
    }

    /**
     * Set up periodic day synchronization with model
     */
    setupDaySync() {
        // Check for day updates every 30 seconds
        setInterval(() => {
            if (window.conferenceApp && window.conferenceApp.model) {
                const modelDay = window.conferenceApp.model.getCurrentDay();
                if (modelDay !== this.currentDay) {
                    console.log(`View day sync: ${this.currentDay} -> ${modelDay}`);
                    this.currentDay = modelDay;
                    this.updateDayInHeader(modelDay);
                }
            }
        }, 30000);
        
        // Also sync immediately after a short delay
        setTimeout(() => {
            if (window.conferenceApp && window.conferenceApp.model) {
                const modelDay = window.conferenceApp.model.getCurrentDay();
                if (modelDay !== this.currentDay) {
                    console.log(`Initial view day sync: ${this.currentDay} -> ${modelDay}`);
                    this.currentDay = modelDay;
                    this.updateDayInHeader(modelDay);
                }
            }
        }, 2000);
    }

    /**
     * Update the day text in the header
     */
    updateDayInHeader(newDay) {
        const dayElement = document.querySelector('.event-day');
        if (dayElement && dayElement.textContent !== newDay) {
            dayElement.textContent = newDay;
            console.log(`Header updated to show: ${newDay}`);
        }
    }

    /**
     * Set the current conference day
     */
    setCurrentDay(day) {
        this.currentDay = day;
    }

    /**
     * Add custom logo image
     */
    setLogo(logoUrl, altText = 'Conference Logo') {
        this.logoUrl = logoUrl;
        this.logoAltText = altText;
    }

    /**
     * Get logo HTML - uses PNG logo
     */
    getLogoHtml() {
        return `<img src="nitc-logo.png" alt="NITC 2025 Logo">`;
    }

    /**
     * Render the complete agenda list on Screen 1
     */
    renderAgendaList(agendaData, currentIndex) {
        if (!this.isDisplay1 || !this.agendaList) {
            return;
        }

        try {
            this.agendaList.innerHTML = '';
            
            // Create header section
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
            
            // Current event
            const currentEvent = currentIndex >= 0 ? agendaData[currentIndex] : null;
            
            if (currentEvent) {
                const currentEventCard = document.createElement('div');
                currentEventCard.className = 'current-event-card';
                currentEventCard.innerHTML = `
                    <div class="time">${currentEvent.displayTime}</div>
                    <div class="title">${currentEvent.title}</div>
                `;
                
                currentEventCard.addEventListener('click', () => {
                    if (this.onItemClick) {
                        this.onItemClick(currentIndex);
                    }
                });
                
                this.agendaList.appendChild(currentEventCard);
            }
            
            // Upcoming events
            const upcomingSection = document.createElement('div');
            upcomingSection.className = 'upcoming-events';
            
            let hasUpcomingEvents = false;
            for (let i = currentIndex + 1; i < agendaData.length; i++) {
                const item = agendaData[i];
                const upcomingEvent = document.createElement('div');
                upcomingEvent.className = 'upcoming-event';
                upcomingEvent.innerHTML = `
                    <div class="time">${item.displayTime} <span style="font-size: 0.8em;">Onwards</span></div>
                    <div class="title">${item.title}</div>
                `;
                
                upcomingEvent.addEventListener('click', () => {
                    if (this.onItemClick) {
                        this.onItemClick(i);
                    }
                });
                
                upcomingSection.appendChild(upcomingEvent);
                hasUpcomingEvents = true;
            }
            
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
     * Update the current item display on Screen 2 - WITH WEBCAM INTEGRATION
     */
    renderCurrentEvent(currentEvent, status, nextEvent, timeUntilNext) {
        if (!this.isDisplay2 || !this.currentDetail) {
            return;
        }

        try {
            this.currentDetail.innerHTML = '';

            // Generate webcam HTML
            const webcamHtml = this.generateWebcamHTML();
            
            if (currentEvent && status === 'active') {
                // Active event with webcam
                this.currentDetail.innerHTML = `
                    <div class="event-content">
                        <div class="current-time">${currentEvent.displayTime}</div>
                        <div class="current-title">${currentEvent.title}</div>
                        <div class="current-description">${currentEvent.description}</div>
                    </div>
                    ${webcamHtml}
                `;
            } else if (status === 'waiting') {
                // Conference waiting with webcam
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
                    <div class="event-content">
                        <div class="no-current-event">
                            <h2>Conference Starts Soon...</h2>
                            <p>Please take your seats and prepare for an amazing experience</p>
                            ${nextEventHtml}
                        </div>
                    </div>
                    ${webcamHtml}
                `;
            } else if (status === 'completed') {
                // Conference completed with webcam
                this.currentDetail.innerHTML = `
                    <div class="event-content">
                        <div class="no-current-event">
                            <h2>Conference Has Concluded</h2>
                            <p>Thank you for your participation!</p>
                            <div class="conference-info">
                                <h4>Thank You!</h4>
                                <p>We hope you enjoyed today's sessions</p>
                                <p>Follow-up materials will be sent via email</p>
                                <p>Stay connected with our community</p>
                                <p>See you at our next event!</p>
                            </div>
                        </div>
                    </div>
                    ${webcamHtml}
                `;
            } else {
                // Default state with webcam
                this.currentDetail.innerHTML = `
                    <div class="event-content">
                        <div class="no-current-event">
                            <h2>NITC 2025 Conference</h2>
                            <p>Waiting for event information...</p>
                        </div>
                    </div>
                    ${webcamHtml}
                `;
            }

            // Attach webcam stream after DOM update
            setTimeout(() => this.attachWebcamToVideoElement(), 100);
            
        } catch (error) {
            console.error('Error rendering current event:', error);
            if (this.currentDetail) {
                this.currentDetail.innerHTML = `
                    <div class="no-current-event">
                        <h2>Display Error</h2>
                        <p>Failed to render event details</p>
                        <div class="conference-info">
                            <h4>Error Details</h4>
                            <p>Please refresh the page</p>
                            <p>Contact technical support</p>
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
     */
    updateControls(currentIndex, totalEvents, isAutoMode) {
        if (!this.isDisplay1) {
            return;
        }

        try {
            if (this.prevBtn) this.prevBtn.disabled = currentIndex <= 0;
            if (this.nextBtn) this.nextBtn.disabled = currentIndex >= totalEvents - 1;
            
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
     */
    updateDebugPanel(debugInfo) {
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
     */
    setEventHandlers(handlers) {
        this.onPrevious = handlers.onPrevious;
        this.onNext = handlers.onNext;
        this.onAutoToggle = handlers.onAutoToggle;
        this.onItemClick = handlers.onItemClick;
        
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
                            <p>Please refresh the page</p>
                            <p>Check your internet connection</p>
                            <p>Contact technical support if issue persists</p>
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
                            <p>Please refresh the page</p>
                            <p>Check your internet connection</p>
                            <p>Contact technical support if issue persists</p>
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
     */
    updateConferenceDay(day) {
        this.setCurrentDay(day);
        const dayElement = document.querySelector('.event-day');
        if (dayElement) {
            dayElement.textContent = day;
        }
    }

    /**
     * Cleanup webcam resources - call this when closing the app
     */
    cleanup() {
        if (this.webcamStream) {
            this.webcamStream.getTracks().forEach(track => track.stop());
            this.webcamStream = null;
            console.log('Webcam resources cleaned up');
        }
    }
}

// Global shortcuts for console testing
window.hideButtons = function() {
    if (window.conferenceApp && window.conferenceApp.view) {
        window.conferenceApp.view.hideControls();
    }
};

window.showButtons = function() {
    if (window.conferenceApp && window.conferenceApp.view) {
        window.conferenceApp.view.showControls();
    }
};

console.log('ConferenceView loaded with production-ready webcam integration');
console.log('Global shortcuts available: hideButtons(), showButtons()');