/* ============================================================================
   VIEW - PRESENTATION LAYER (MVC Architecture) - WITH LIVE CAMERA FEED
   ============================================================================ */

/**
 * ConferenceView - Manages all UI updates and rendering with live camera integration
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
        
        // Camera settings - NEW CAMERA FUNCTIONALITY
        this.cameraStreamUrl = null; // Set this to your camera stream URL
        this.showCameraFeed = false; // Start disabled
        this.cameraPosition = 'bottom'; // 'top', 'bottom', 'left', 'right' - Default to bottom
        this.hlsPlayer = null; // HLS player instance
        
        // Current day for the conference
        this.currentDay = 'Inauguration'; // Can be changed to 'Day 1', 'Day 2', etc.
        this.logoUrl = null; // Custom logo URL
        this.logoAltText = 'Conference Logo';
        
        // Detect which display we're on
        this.isDisplay1 = !!this.agendaList;
        this.isDisplay2 = !!this.currentDetail && !this.agendaList;
        
        console.log(`View initialized for ${this.isDisplay1 ? 'Display 1 (Agenda)' : 'Display 2 (Details)'}`);
        
        // Initialize HLS support
        this.initializeHLS();
        
        // Set up periodic day sync (every 30 seconds)
        this.setupDaySync();
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
                    
                    // Update the header if it exists
                    this.updateDayInHeader(modelDay);
                }
            }
        }, 30000); // Every 30 seconds
        
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
        }, 2000); // After 2 seconds
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
     * Initialize HLS.js support for cross-browser HLS streaming - NEW
     */
    initializeHLS() {
        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            this.hlsSupported = true;
            console.log('HLS.js is supported - ready for live streaming');
        } else {
            this.hlsSupported = false;
            console.log('HLS.js not supported - falling back to native video support');
        }
    }

    /**
     * Set the camera stream URL - NEW
     * @param {string} url - The streaming URL (HLS .m3u8, RTMP, or HTTP stream)
     */
    setCameraStream(url) {
        this.cameraStreamUrl = url;
        console.log('Camera stream URL set to:', url);
        
        // If camera is currently active, update the stream
        if (this.showCameraFeed) {
            this.setupCameraStream();
        }
    }

    /**
     * Set camera position on Display 2 - NEW
     * @param {string} position - 'top', 'bottom', 'left', 'right'
     */
    setCameraPosition(position) {
        this.cameraPosition = position;
        console.log('Camera position set to:', position);
    }

    /**
     * Toggle camera feed on/off - NEW
     * @param {boolean} show - Whether to show camera feed
     */
    toggleCameraFeed(show = !this.showCameraFeed) {
        this.showCameraFeed = show;
        console.log('Camera feed:', show ? 'enabled' : 'disabled');
        
        if (show && this.cameraStreamUrl) {
            this.setupCameraStream();
        }
    }

    /**
     * Setup the camera stream with HLS support - NEW
     */
    setupCameraStream() {
        const cameraElement = document.querySelector('.camera-feed');
        if (!cameraElement || !this.cameraStreamUrl) return;

        // Show loading state
        this.showCameraLoading(true);

        // Check if it's an HLS stream (.m3u8)
        if (this.cameraStreamUrl.includes('.m3u8')) {
            this.setupHLSStream(cameraElement);
        } else {
            // Regular video stream
            cameraElement.src = this.cameraStreamUrl;
            cameraElement.load();
        }

        // Handle video events
        cameraElement.onloadstart = () => {
            console.log('Camera stream loading started');
        };

        cameraElement.oncanplay = () => {
            console.log('Camera stream ready to play');
            this.showCameraLoading(false);
            cameraElement.play().catch(e => console.log('Auto-play prevented:', e));
        };

        cameraElement.onerror = (e) => {
            console.error('Camera stream error:', e);
            this.showCameraError();
        };
    }

    /**
     * Setup HLS stream using HLS.js - NEW
     */
    setupHLSStream(videoElement) {
        if (this.hlsSupported) {
            // Use HLS.js
            if (this.hlsPlayer) {
                this.hlsPlayer.destroy();
            }
            
            this.hlsPlayer = new Hls();
            this.hlsPlayer.loadSource(this.cameraStreamUrl);
            this.hlsPlayer.attachMedia(videoElement);
            
            this.hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('HLS manifest parsed successfully');
                this.showCameraLoading(false);
                videoElement.play().catch(e => console.log('Auto-play prevented:', e));
            });

            this.hlsPlayer.on(Hls.Events.ERROR, (event, data) => {
                console.error('HLS error:', data);
                this.showCameraError();
            });
        } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            videoElement.src = this.cameraStreamUrl;
        } else {
            console.error('HLS not supported in this browser');
            this.showCameraError();
        }
    }

    /**
     * Show camera loading state - NEW
     */
    showCameraLoading(show) {
        const cameraContainer = document.querySelector('.camera-container');
        if (cameraContainer) {
            if (show) {
                cameraContainer.innerHTML = `
                    <div class="camera-header">
                        <span class="camera-title">Conference Hall</span>
                        <span class="camera-status">● CONNECTING</span>
                    </div>
                    <div class="camera-feed camera-placeholder">
                        <div class="camera-loading">
                            <div class="loading-spinner"></div>
                            <p>Connecting to live stream...</p>
                        </div>
                    </div>
                `;
            }
        }
    }

    /**
     * Show camera error state - NEW
     */
    showCameraError() {
        const cameraContainer = document.querySelector('.camera-container');
        if (cameraContainer) {
            cameraContainer.innerHTML = `
                <div class="camera-header">
                    <span class="camera-title">Conference Hall</span>
                    <span class="camera-status">● CONNECTION ERROR</span>
                </div>
                <div class="camera-feed camera-placeholder">
                    <div class="camera-loading">
                        <p>⚠️ Stream not available</p>
                        <p style="font-size: 0.8em; opacity: 0.7;">Check camera connection</p>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Generate camera HTML based on current settings - NEW
     */
    generateCameraHTML() {
        return `
            <div class="camera-container camera-${this.cameraPosition}">
                <div class="camera-header">
                    <span class="camera-title">Conference Hall</span>
                    <span class="camera-status">● LIVE</span>
                </div>
                <video class="camera-feed" 
                       autoplay 
                       muted 
                       playsinline
                       poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23000'/%3E%3C/svg%3E">
                    <p>Your browser doesn't support HTML5 video.</p>
                </video>
            </div>
        `;
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
     * Update the current item display on Screen 2 - MODIFIED TO INCLUDE CAMERA
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

            let cameraHtml = '';
            
            // Add camera feed HTML based on position and if enabled - NEW CAMERA FUNCTIONALITY
            if (this.showCameraFeed && this.cameraStreamUrl) {
                cameraHtml = this.generateCameraHTML();
            }

            // Generate layout based on camera position
            const layoutClass = (this.cameraPosition === 'left' || this.cameraPosition === 'right') ? 
                               'event-layout-horizontal' : '';
            
            if (currentEvent && status === 'active') {
                // We have an active current event - display it WITH CAMERA
                this.currentDetail.innerHTML = `
                    <div class="${layoutClass}">
                        ${this.cameraPosition === 'top' ? cameraHtml : ''}
                        ${this.cameraPosition === 'left' ? cameraHtml : ''}
                        
                        <div class="event-content">
                            <div class="current-time">${currentEvent.displayTime}</div>
                            <div class="current-title">${currentEvent.title}</div>
                            <div class="current-description">${currentEvent.description}</div>
                        </div>
                        
                        ${this.cameraPosition === 'right' ? cameraHtml : ''}
                        ${this.cameraPosition === 'bottom' ? cameraHtml : ''}
                    </div>
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
                    <div class="${layoutClass}">
                        ${this.cameraPosition === 'top' ? cameraHtml : ''}
                        ${this.cameraPosition === 'left' ? cameraHtml : ''}
                        
                        <div class="event-content">
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
                        </div>
                        
                        ${this.cameraPosition === 'right' ? cameraHtml : ''}
                        ${this.cameraPosition === 'bottom' ? cameraHtml : ''}
                    </div>
                `;
            } else if (status === 'completed') {
                // Conference has ended
                this.currentDetail.innerHTML = `
                    <div class="${layoutClass}">
                        ${this.cameraPosition === 'top' ? cameraHtml : ''}
                        ${this.cameraPosition === 'left' ? cameraHtml : ''}
                        
                        <div class="event-content">
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
                        </div>
                        
                        ${this.cameraPosition === 'right' ? cameraHtml : ''}
                        ${this.cameraPosition === 'bottom' ? cameraHtml : ''}
                    </div>
                `;
            } else {
                // Default waiting state
                this.currentDetail.innerHTML = `
                    <div class="${layoutClass}">
                        ${this.cameraPosition === 'top' ? cameraHtml : ''}
                        ${this.cameraPosition === 'left' ? cameraHtml : ''}
                        
                        <div class="event-content">
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
                        </div>
                        
                        ${this.cameraPosition === 'right' ? cameraHtml : ''}
                        ${this.cameraPosition === 'bottom' ? cameraHtml : ''}
                    </div>
                `;
            }

            // Setup camera stream if camera container exists
            if (this.showCameraFeed && this.cameraStreamUrl) {
                setTimeout(() => this.setupCameraStream(), 100);
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

// Create global shortcuts for easy console testing - NEW CAMERA FUNCTIONS
window.setCameraStream = function(url) {
    if (window.conferenceApp && window.conferenceApp.view) {
        window.conferenceApp.view.setCameraStream(url);
    }
};

window.setCameraPosition = function(position) {
    if (window.conferenceApp && window.conferenceApp.view) {
        window.conferenceApp.view.setCameraPosition(position);
    }
};

window.toggleCamera = function(show) {
    if (window.conferenceApp && window.conferenceApp.view) {
        window.conferenceApp.view.toggleCameraFeed(show);
    }
};

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

console.log('ConferenceView loaded with live camera feed integration');
console.log('Global shortcuts available: setCameraStream(), setCameraPosition(), toggleCamera(), hideButtons(), showButtons()');