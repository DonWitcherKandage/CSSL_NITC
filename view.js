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
        
        // Webcam settings for production use - AUTOMATIC TIMING CONTROL
        this.webcamEnabled = false; // Start disabled
        this.webcamStream = null;
        this.webcamVideoElement = null;
        this.webcamInitialized = false;
        this.showBroadcastMessage = true; // Show broadcast message initially
        
        // Set initial state based on current time
        this.setInitialCameraState();
        
        // Pre-event highlight system - SIMPLIFIED
        this.preEventMode = false;
        this.highlightInterval = null;
        this.currentHighlightIndex = 0;
        this.highlightDuration = 15000; // 15 seconds per event
        
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
            // Check immediately and then every 5 seconds
            setTimeout(() => this.checkEventStatusForCamera(), 1000);
            setInterval(() => this.checkEventStatusForCamera(), 5000);
        }
        
        // FORCE START PREVIEW MODE FOR TESTING - Remove this line after testing
        if (this.isDisplay1) {
            setTimeout(() => {
                console.log('FORCE STARTING PREVIEW MODE FOR TESTING');
                this.startPreEventHighlights();
            }, 3000);
        }
    }

    /**
     * Start pre-event highlight mode - WORKING VERSION
     */
    startPreEventHighlights() {
        if (!this.isDisplay1) return;
        
        console.log('=== STARTING PRE-EVENT HIGHLIGHT MODE ===');
        this.preEventMode = true;
        this.currentHighlightIndex = 0;
        
        // Clear any existing interval
        if (this.highlightInterval) {
            clearInterval(this.highlightInterval);
        }
        
        // Start highlighting immediately
        this.doHighlight();
        
        // Set up interval to continue highlighting
        this.highlightInterval = setInterval(() => {
            this.doHighlight();
        }, this.highlightDuration);
    }

    /**
     * Do the actual highlighting - SIMPLE WHITE BACKGROUND
     */
    doHighlight() {
        console.log('--- Starting highlight cycle ---');
        
        // Get agenda data
        const agenda = window.conferenceApp?.model?.getAgendaData() || [];
        if (agenda.length === 0) {
            console.log('No agenda data available');
            return;
        }
        
        // Clear all previous highlights
        const allEvents = document.querySelectorAll('.current-event-card, .upcoming-event');
        allEvents.forEach(element => {
            element.style.transform = '';
            element.style.boxShadow = '';
            element.style.border = '';
            element.style.background = '';
            element.style.color = '';
            element.style.padding = '';
            element.style.height = '';
        });
        
        // Find target element
        let targetElement = null;
        
        // Check if we have a current event card first
        const currentCard = document.querySelector('.current-event-card');
        const upcomingEvents = document.querySelectorAll('.upcoming-event');
        
        if (this.currentHighlightIndex === 0 && currentCard) {
            targetElement = currentCard;
        } else {
            const upcomingIndex = currentCard ? this.currentHighlightIndex - 1 : this.currentHighlightIndex;
            if (upcomingIndex >= 0 && upcomingIndex < upcomingEvents.length) {
                targetElement = upcomingEvents[upcomingIndex];
            }
        }
        
        // Apply highlight if we found an element
        if (targetElement) {
            console.log(`Highlighting event ${this.currentHighlightIndex + 1}/${agenda.length}: ${agenda[this.currentHighlightIndex]?.title}`);
            
            // Apply simple white background highlight
            targetElement.style.background = 'white';
            targetElement.style.color = '#081A30';
            targetElement.style.padding = '25px 30px'; // Slightly more padding for height
            targetElement.style.borderRadius = '10px';
            targetElement.style.transition = 'all 0.3s ease';
            
            // Make text elements dark
            const timeElement = targetElement.querySelector('.time');
            const titleElement = targetElement.querySelector('.title');
            if (timeElement) timeElement.style.color = '#081A30';
            if (titleElement) titleElement.style.color = '#081A30';
            
        } else {
            console.log(`Could not find element for index ${this.currentHighlightIndex}`);
        }
        
        // Move to next event
        this.currentHighlightIndex = (this.currentHighlightIndex + 1) % agenda.length;
    }

    /**
     * Stop pre-event highlight mode
     */
    stopPreEventHighlights() {
        console.log('=== STOPPING PRE-EVENT HIGHLIGHT MODE ===');
        this.preEventMode = false;
        
        if (this.highlightInterval) {
            clearInterval(this.highlightInterval);
            this.highlightInterval = null;
        }
        
        // Clear all highlights
        const allEvents = document.querySelectorAll('.current-event-card, .upcoming-event');
        allEvents.forEach(element => {
            element.style.transform = '';
            element.style.boxShadow = '';
            element.style.border = '';
            element.style.background = '';
        });
    }

    /**
     * Initialize webcam for Display 2 - PRODUCTION READY WITH LOGITECH DETECTION
     */
    async initializeWebcam() {
        if (!this.isDisplay2 || this.webcamInitialized) return;
        
        try {
            console.log('Initializing webcam for Display 2...');
            
            // First, get all available video devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            console.log('Available video devices:', videoDevices.map(d => d.label));
            
            // Try to find Logitech camera first
            const logitechCamera = videoDevices.find(device => 
                device.label.toLowerCase().includes('logitech') ||
                device.label.toLowerCase().includes('webcam') ||
                device.label.toLowerCase().includes('usb')
            );
            
            let constraints = {
                video: {
                    width: { ideal: 1280, max: 1920 },
                    height: { ideal: 720, max: 1080 },
                    frameRate: { ideal: 30, max: 60 }
                },
                audio: false
            };
            
            // If Logitech camera found, specify it
            if (logitechCamera) {
                constraints.video.deviceId = { exact: logitechCamera.deviceId };
                console.log('Using Logitech camera:', logitechCamera.label);
            } else {
                console.log('Logitech camera not found, using default camera');
            }
            
            // Request webcam access
            this.webcamStream = await navigator.mediaDevices.getUserMedia(constraints);
            
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
     * Generate webcam HTML for Display 2 - WITH BROADCAST MESSAGE
     */
    generateWebcamHTML() {
        if (!this.isDisplay2) {
            return '';
        }

        // Show broadcast message instead of camera when disabled
        if (!this.webcamEnabled && this.showBroadcastMessage) {
            return `
                <div class="webcam-container">
                    <div class="webcam-header">
                        <span class="webcam-title">Conference Hall</span>
                        <span class="webcam-status">● STANDBY</span>
                    </div>
                    <div class="broadcast-message">
                        <div class="broadcast-icon">📡</div>
                        <h3>Live Broadcast Will Start Soon</h3>
                        <p>Online streaming will begin when the event starts</p>
                        <div class="broadcast-time">Please stand by...</div>
                    </div>
                </div>
            `;
        }

        // Show camera if enabled
        if (this.webcamEnabled) {
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

        return '';
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
     * Set initial camera state based on current time and day's first event
     */
    setInitialCameraState() {
        const model = window.conferenceApp?.model;
        if (!model) return;
        
        const agenda = model.getAgendaData();
        if (!agenda || agenda.length === 0) return;
        
        const currentTime = model.getCurrentRealTime();
        const currentMinutes = model.timeToMinutes(currentTime);
        const firstEventMinutes = model.timeToMinutes(agenda[0].time);
        
        const eventStarted = currentMinutes >= firstEventMinutes;
        
        if (eventStarted) {
            this.webcamEnabled = true;
            this.showBroadcastMessage = false;
            console.log(`Initial state: Event started (${currentTime} >= ${agenda[0].time}), camera enabled`);
        } else {
            this.webcamEnabled = false;
            this.showBroadcastMessage = true;
            console.log(`Initial state: Before event (${currentTime} < ${agenda[0].time}), camera disabled`);
        }
    }

    /**
     * Check timing and update camera state automatically - DYNAMIC FOR ANY DAY
     */
    checkEventStatusForCamera() {
        if (!this.isDisplay2) return;
        
        const model = window.conferenceApp?.model;
        if (!model) return;
        
        const agenda = model.getAgendaData();
        if (!agenda || agenda.length === 0) return;
        
        const currentTime = model.getCurrentRealTime();
        const currentMinutes = model.timeToMinutes(currentTime);
        const firstEventMinutes = model.timeToMinutes(agenda[0].time);
        const eventStarted = currentMinutes >= firstEventMinutes;
        
        console.log(`Time check: ${currentTime} vs ${agenda[0].time} - Event started: ${eventStarted}, Camera: ${this.webcamEnabled}`);
        
        if (eventStarted && !this.webcamEnabled) {
            console.log('Enabling camera - event started');
            this.webcamEnabled = true;
            this.showBroadcastMessage = false;
            this.updateDisplayNow();
        } else if (!eventStarted && this.webcamEnabled) {
            console.log('Disabling camera - before event');
            this.webcamEnabled = false;
            this.showBroadcastMessage = true;
            this.updateDisplayNow();
        }
    }

    /**
     * Force display update immediately
     */
    updateDisplayNow() {
        if (window.conferenceApp?.controller) {
            window.conferenceApp.controller.updateDisplay();
        }
    }

    /**
     * Generate QR code HTML - FORCE SHOW WHEN CAMERA DISABLED
     */
    generateQRCodeHTML() {
        if (!this.isDisplay2) {
            console.log('QR Debug: Not Display 2');
            return '';
        }
        
        // If camera is disabled, show QR code regardless of timing
        if (!this.webcamEnabled) {
            console.log('QR Debug: Camera disabled - showing QR code');
            return `
                <div class="qr-code-container">
                    <div class="qr-code-header">
                        <h3>For More Event Details</h3>
                    </div>
                    <div class="qr-code-content">
                        <div class="qr-code">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=https://nitc.lk/%23schedule" 
                                 alt="QR Code for NITC Schedule">
                        </div>
                        <div class="qr-code-text">
                            <p><strong>Scan to visit:</strong></p>
                            <p class="website-url">nitc.lk/#schedule</p>
                            <p class="qr-instruction">Scan with your phone camera for complete event schedule and details</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        console.log('QR Debug: Camera enabled - hiding QR code');
        return ''; // No QR code when camera is on
    }

    /**
     * Enable webcam feed (for when event starts)
     */
    enableWebcam() {
        this.webcamEnabled = true;
        this.showBroadcastMessage = false;
        console.log('Webcam enabled - starting live feed');
        
        // Re-render current event to show camera
        if (this.isDisplay2) {
            // Trigger a re-render by updating the display
            setTimeout(() => {
                const currentDetail = document.getElementById('currentDetail');
                if (currentDetail && currentDetail.innerHTML.includes('broadcast-message')) {
                    // Force a refresh of the display
                    window.location.reload();
                }
            }, 100);
        }
    }

    /**
     * Disable webcam feed (show broadcast message)
     */
    disableWebcam() {
        this.webcamEnabled = false;
        this.showBroadcastMessage = true;
        
        // Stop any existing stream
        if (this.webcamStream) {
            this.webcamStream.getTracks().forEach(track => track.stop());
            this.webcamStream = null;
        }
        
        console.log('Webcam disabled - showing broadcast message');
    }

    /**
     * Check if event has started and automatically enable camera - IMMEDIATE FIX
     */
    checkEventStatusForCamera() {
        if (!this.isDisplay2) return;
        
        // Get current time directly
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeMinutes = currentHour * 60 + currentMinute;
        
        // Event starts at 9:00 AM = 540 minutes since midnight
        const eventStartMinutes = 9 * 60; // 540 minutes
        
        const eventStarted = currentTimeMinutes >= eventStartMinutes;
        
        console.log(`DIRECT TIME CHECK: ${currentHour}:${currentMinute.toString().padStart(2, '0')} (${currentTimeMinutes}min) vs 9:00 AM (${eventStartMinutes}min) - Started: ${eventStarted}`);
        
        // BEFORE 9:00 AM: Show QR code, disable camera
        if (!eventStarted) {
            if (this.webcamEnabled) {
                console.log('BEFORE EVENT: Disabling camera, showing QR and broadcast message');
                this.webcamEnabled = false;
                this.showBroadcastMessage = true;
                this.forceDisplayUpdate();
            }
        }
        
        // AT/AFTER 9:00 AM: Show camera, hide QR
        if (eventStarted) {
            if (!this.webcamEnabled) {
                console.log('EVENT STARTED: Enabling camera, hiding QR and broadcast message');
                this.webcamEnabled = true;
                this.showBroadcastMessage = false;
                this.forceDisplayUpdate();
            }
        }
    }

    /**
     * Force display update
     */
    forceDisplayUpdate() {
        if (window.conferenceApp?.controller) {
            setTimeout(() => {
                window.conferenceApp.controller.updateDisplay();
                console.log('Display updated - Camera:', this.webcamEnabled, 'Broadcast:', this.showBroadcastMessage);
            }, 100);
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

            // Generate webcam HTML and QR code
            const webcamHtml = this.generateWebcamHTML();
            const qrCodeHtml = this.generateQRCodeHTML();
            
            if (currentEvent && status === 'active') {
                // Active event with webcam and QR code
                this.currentDetail.innerHTML = `
                    <div class="event-content">
                        <div class="current-time">${currentEvent.displayTime}</div>
                        <div class="current-title">${currentEvent.title}</div>
                        <div class="current-description">${currentEvent.description}</div>
                    </div>
                    ${qrCodeHtml}
                    ${webcamHtml}
                `;
            } else if (status === 'waiting') {
                // Conference waiting with webcam and QR code
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
                    ${qrCodeHtml}
                    ${webcamHtml}
                `;
            } else if (status === 'completed') {
                // Conference completed with webcam and QR code
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
                    ${qrCodeHtml}
                    ${webcamHtml}
                `;
            } else {
                // Default state with webcam and QR code
                this.currentDetail.innerHTML = `
                    <div class="event-content">
                        <div class="no-current-event">
                            <h2>NITC 2025 Conference</h2>
                            <p>Waiting for event information...</p>
                        </div>
                    </div>
                    ${qrCodeHtml}
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
        
        // Clean up highlight interval
        if (this.highlightInterval) {
            clearInterval(this.highlightInterval);
            this.highlightInterval = null;
        }
    }
}

// Global shortcuts for console testing and camera control
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

window.enableCamera = function() {
    if (window.conferenceApp && window.conferenceApp.view) {
        window.conferenceApp.view.enableWebcam();
    }
};

window.disableCamera = function() {
    if (window.conferenceApp && window.conferenceApp.view) {
        window.conferenceApp.view.disableWebcam();
    }
};

window.startPreviewMode = function() {
    if (window.conferenceApp && window.conferenceApp.view) {
        window.conferenceApp.view.startPreEventHighlights();
    }
};

window.stopPreviewMode = function() {
    if (window.conferenceApp && window.conferenceApp.view) {
        window.conferenceApp.view.stopPreEventHighlights();
    }
};

console.log('ConferenceView loaded with pre-event highlight system');
console.log('Preview mode will auto-start in 3 seconds for testing');
console.log('Global shortcuts: startPreviewMode(), stopPreviewMode(), enableCamera(), disableCamera()');