/* ============================================================================
   VIEW - PRESENTATION LAYER (MVC Architecture) - SOCKET.IO CAMERA INTEGRATION
   ============================================================================ */

/**
 * ConferenceView - Manages all UI updates and rendering with Socket.IO camera streaming
 * This preserves ALL your existing functionality and adds camera support
 */
class ConferenceView {
    constructor() {
        // Cache DOM elements for performance (PRESERVED FROM ORIGINAL)
        this.agendaList = document.getElementById('agendaList');
        this.currentDetail = document.getElementById('currentDetail');
        this.currentClock = document.getElementById('currentClock');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.autoBtn = document.getElementById('autoBtn');
        this.controls = document.getElementById('controls');
        
        // Debug elements (PRESERVED FROM ORIGINAL)
        this.debugSystemTime = document.getElementById('debugSystemTime');
        this.debugDisplayTime = document.getElementById('debugDisplayTime');
        this.debugCurrentEvent = document.getElementById('debugCurrentEvent');
        this.debugMode = document.getElementById('debugMode');
        this.debugStatus = document.getElementById('debugStatus');
        
        // Display identification (PRESERVED FROM ORIGINAL)
        this.isDisplay1 = !!this.agendaList && !this.currentDetail;
        this.isDisplay2 = !!this.currentDetail;
        
        // Socket.IO camera configuration (NEW)
        this.socket = null;
        this.cameraConnected = false;
        this.cameraEnabled = true;
        this.videoElement = null;
        this.serverUrl = 'http://localhost:3001'; // CHANGE THIS to your server's IP
        
        // Pre-event highlight system (PRESERVED FROM ORIGINAL)
        this.preEventMode = false;
        this.highlightInterval = null;
        this.currentHighlightIndex = 0;
        this.highlightDuration = 15000;
        
        // Current day for the conference (PRESERVED FROM ORIGINAL)
        this.currentDay = 'Inauguration';
        this.logoUrl = null;
        this.logoAltText = 'Conference Logo';
        
        console.log(`View initialized for ${this.isDisplay1 ? 'Display 1 (Agenda)' : 'Display 2 (Details)'}`);
        
        // Initialize Socket.IO camera ONLY for Display 2 (NEW)
        if (this.isDisplay2) {
            console.log('Display 2 detected - initializing Socket.IO camera connection...');
            setTimeout(() => {
                this.initializeSocketCamera();
            }, 1000);
        }
        
        // Set up periodic day sync (PRESERVED FROM ORIGINAL)
        this.setupDaySync();
    }

    /**
     * Initialize Socket.IO connection for camera streaming (NEW)
     */
    initializeSocketCamera() {
        if (!this.isDisplay2) {
            console.log('Skipping Socket.IO init - not Display 2');
            return;
        }

        try {
            console.log('Connecting to camera server at:', this.serverUrl);
            
            // Check if Socket.IO is available
            if (typeof io === 'undefined') {
                console.error('Socket.IO library not loaded. Please add the Socket.IO script to your HTML.');
                this.updateCameraStatus('library_missing', 'Socket.IO library not found');
                return;
            }
            
            // Initialize Socket.IO connection
            this.socket = io(this.serverUrl, {
                transports: ['websocket', 'polling'],
                timeout: 5000,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 2000
            });

            // Connection successful
            this.socket.on('connect', () => {
                console.log('Socket.IO connected to camera server');
                this.cameraConnected = true;
                this.updateCameraStatus('connected');
                
                // Request camera stream
                this.socket.emit('request-stream');
            });

            // Connection failed
            this.socket.on('connect_error', (error) => {
                console.error('Socket.IO connection failed:', error);
                this.cameraConnected = false;
                this.updateCameraStatus('connection_failed', 'Cannot connect to camera server');
            });

            // Disconnected
            this.socket.on('disconnect', (reason) => {
                console.log('Socket.IO disconnected:', reason);
                this.cameraConnected = false;
                this.updateCameraStatus('disconnected', 'Connection lost');
            });

            // Receive video frames
            this.socket.on('video-frame', (frameData) => {
                this.displayVideoFrame(frameData);
            });

            // Camera status updates
            this.socket.on('camera-status', (status) => {
                console.log('Camera status update:', status);
                this.updateCameraStatus(status.state, status.message);
            });

            // Stream started
            this.socket.on('stream-started', () => {
                console.log('Camera stream started');
                this.updateCameraStatus('streaming');
            });

            // Stream stopped
            this.socket.on('stream-stopped', () => {
                console.log('Camera stream stopped');
                this.updateCameraStatus('stopped');
            });

        } catch (error) {
            console.error('Failed to initialize Socket.IO camera:', error);
            this.cameraConnected = false;
            this.updateCameraStatus('initialization_failed', error.message);
        }
    }

    /**
     * Display received video frame from Socket.IO (NEW)
     */
    displayVideoFrame(frameData) {
        if (!this.videoElement) {
            this.videoElement = document.getElementById('socketio-camera-feed');
        }

        if (this.videoElement && frameData) {
            try {
                // frameData should be base64 encoded image
                if (typeof frameData === 'string') {
                    this.videoElement.src = `data:image/jpeg;base64,${frameData}`;
                } else if (frameData.data) {
                    this.videoElement.src = `data:image/jpeg;base64,${frameData.data}`;
                }
            } catch (error) {
                console.error('Error displaying video frame:', error);
            }
        }
    }

    /**
     * Update camera connection status (NEW)
     */
    updateCameraStatus(status, message = '') {
        const statusElement = document.querySelector('.camera-status');
        
        if (statusElement) {
            switch (status) {
                case 'connected':
                    statusElement.textContent = '● CONNECTED';
                    statusElement.style.color = '#f39c12';
                    break;
                case 'streaming':
                    statusElement.textContent = '● LIVE';
                    statusElement.style.color = '#00ff00';
                    break;
                case 'disconnected':
                    statusElement.textContent = '● DISCONNECTED';
                    statusElement.style.color = '#e74c3c';
                    break;
                case 'connection_failed':
                case 'initialization_failed':
                    statusElement.textContent = '● CONNECTION FAILED';
                    statusElement.style.color = '#e74c3c';
                    break;
                case 'library_missing':
                    statusElement.textContent = '● LIBRARY ERROR';
                    statusElement.style.color = '#e74c3c';
                    break;
                case 'stopped':
                    statusElement.textContent = '● STANDBY';
                    statusElement.style.color = '#f39c12';
                    break;
                default:
                    statusElement.textContent = '● UNKNOWN';
                    statusElement.style.color = '#95a5a6';
            }
        }

        // Update error message if provided
        if (message) {
            const errorElement = document.querySelector('.camera-error-message');
            if (errorElement) {
                errorElement.textContent = message;
            }
        }
    }

    /**
     * Generate Socket.IO camera HTML for Display 2 (NEW)
     */
    generateSocketCameraHTML() {
        if (!this.isDisplay2 || !this.cameraEnabled) {
            return '';
        }

        return `
            <div class="webcam-container">
                <div class="webcam-header">
                    <span class="webcam-title">Live from Conference Hall</span>
                    <span class="camera-status">● CONNECTING</span>
                </div>
                <div class="camera-feed-container">
                    <img 
                        id="socketio-camera-feed" 
                        class="webcam-feed" 
                        alt="Live camera feed"
                        style="object-fit: cover; width: 100%; height: 400px; background: #000;">
                    <div class="camera-error-overlay" style="display: none;">
                        <div class="error-content">
                            <div class="error-icon">📷</div>
                            <div class="error-text">Camera Unavailable</div>
                            <div class="camera-error-message">Connecting...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ========================================================================
    // ALL EXISTING METHODS PRESERVED EXACTLY AS THEY WERE
    // ========================================================================

    /**
     * Start pre-event highlight mode (PRESERVED FROM ORIGINAL)
     */
    startPreEventHighlights() {
        if (!this.isDisplay1) return;
        
        console.log('=== STARTING PRE-EVENT HIGHLIGHT MODE ===');
        this.preEventMode = true;
        this.currentHighlightIndex = 0;
        
        if (this.highlightInterval) {
            clearInterval(this.highlightInterval);
        }
        
        this.doHighlight();
        
        this.highlightInterval = setInterval(() => {
            this.doHighlight();
        }, this.highlightDuration);
    }

    /**
     * Do the actual highlighting (PRESERVED FROM ORIGINAL)
     */
    doHighlight() {
        const agenda = window.conferenceApp?.model?.getAgendaData() || [];
        if (agenda.length === 0) return;
        
        // Clear all highlights
        const allEvents = document.querySelectorAll('.current-event-card, .upcoming-event');
        allEvents.forEach(element => {
            element.style.transform = '';
            element.style.boxShadow = '';
            element.style.border = '';
            element.style.background = '';
            element.style.color = '';
            element.style.padding = '';
        });
        
        // Find target element to highlight
        let targetElement = null;
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
        
        // Apply highlight styling
        if (targetElement) {
            targetElement.style.background = 'white';
            targetElement.style.color = '#081A30';
            targetElement.style.padding = '25px 30px';
            targetElement.style.borderRadius = '10px';
            targetElement.style.transition = 'all 0.3s ease';
            
            const timeElement = targetElement.querySelector('.time');
            const titleElement = targetElement.querySelector('.title');
            if (timeElement) timeElement.style.color = '#081A30';
            if (titleElement) titleElement.style.color = '#081A30';
        }
        
        this.currentHighlightIndex = (this.currentHighlightIndex + 1) % agenda.length;
    }

    /**
     * Stop pre-event highlight mode (PRESERVED FROM ORIGINAL)
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
     * Set up periodic day synchronization with model (PRESERVED FROM ORIGINAL)
     */
    setupDaySync() {
        setInterval(() => {
            if (window.conferenceApp && window.conferenceApp.model) {
                const modelDay = window.conferenceApp.model.getCurrentDay();
                if (modelDay !== this.currentDay) {
                    console.log(`Day sync: ${this.currentDay} → ${modelDay}`);
                    this.currentDay = modelDay;
                    this.updateDayInHeader(modelDay);
                }
            }
        }, 30000);
        
        setTimeout(() => {
            if (window.conferenceApp && window.conferenceApp.model) {
                const modelDay = window.conferenceApp.model.getCurrentDay();
                if (modelDay !== this.currentDay) {
                    console.log(`Initial day sync: ${this.currentDay} → ${modelDay}`);
                    this.currentDay = modelDay;
                    this.updateDayInHeader(modelDay);
                }
            }
        }, 2000);
    }

    /**
     * Update the day text in the header (PRESERVED FROM ORIGINAL)
     */
    updateDayInHeader(newDay) {
        const dayElement = document.querySelector('.event-day');
        if (dayElement && dayElement.textContent !== newDay) {
            dayElement.textContent = newDay;
            console.log(`Header updated to show: ${newDay}`);
        }
    }

    /**
     * Set the current conference day (PRESERVED FROM ORIGINAL)
     */
    setCurrentDay(day) {
        this.currentDay = day;
    }

    /**
     * Get logo HTML (PRESERVED FROM ORIGINAL)
     */
    getLogoHtml() {
        return `<img src="nitc-logo.png" alt="NITC 2025 Logo">`;
    }

    /**
     * Render the complete agenda list on Screen 1 (PRESERVED FROM ORIGINAL)
     */
    renderAgendaList(agendaData, currentIndex) {
        if (!this.isDisplay1 || !this.agendaList) {
            return;
        }

        try {
            this.agendaList.innerHTML = '';
            
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
     * Update the current item display on Screen 2 - WITH SOCKET.IO CAMERA (UPDATED)
     */
    renderCurrentEvent(currentEvent, status, nextEvent, timeUntilNext) {
        if (!this.isDisplay2 || !this.currentDetail) {
            return;
        }

        try {
            this.currentDetail.innerHTML = '';

            // Generate Socket.IO camera HTML
            const cameraHtml = this.generateSocketCameraHTML();
            
            if (currentEvent && status === 'active') {
                this.currentDetail.innerHTML = `
                    <div class="event-content">
                        <div class="current-time">${currentEvent.displayTime}</div>
                        <div class="current-title">${currentEvent.title}</div>
                        <div class="current-description">${currentEvent.description}</div>
                    </div>
                    ${cameraHtml}
                `;
            } else if (status === 'waiting') {
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
                    ${cameraHtml}
                `;
            } else if (status === 'completed') {
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
                    ${cameraHtml}
                `;
            } else {
                this.currentDetail.innerHTML = `
                    <div class="event-content">
                        <div class="no-current-event">
                            <h2>NITC 2025 Conference</h2>
                            <p>Waiting for event information...</p>
                        </div>
                    </div>
                    ${cameraHtml}
                `;
            }

            // Initialize camera connection after DOM update
            setTimeout(() => {
                this.videoElement = document.getElementById('socketio-camera-feed');
                if (this.socket && this.socket.connected) {
                    this.socket.emit('request-stream');
                }
            }, 100);
            
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
     * ALL OTHER METHODS PRESERVED FROM ORIGINAL
     */
    
    updateControls(currentIndex, totalEvents, isAutoMode) {
        if (!this.isDisplay1) return;
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

    updateClock(timeString) {
        try {
            if (this.currentClock) {
                this.currentClock.textContent = timeString;
            }
        } catch (error) {
            console.error('Error updating clock:', error);
        }
    }

    updateDebugPanel(debugInfo) {
        if (!this.isDisplay1) return;
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

    hideControls() {
        if (this.controls) {
            this.controls.classList.add('hidden');
        }
    }

    showControls() {
        if (this.controls) {
            this.controls.classList.remove('hidden');
        }
    }

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
                        <div class="conference-logo">${this.getLogoHtml()}</div>
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

    updateConferenceDay(day) {
        this.setCurrentDay(day);
        const dayElement = document.querySelector('.event-day');
        if (dayElement) {
            dayElement.textContent = day;
        }
    }

    /**
     * Restart Socket.IO camera connection (NEW)
     */
    restartSocketCamera() {
        console.log('Restarting Socket.IO camera connection...');
        
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        
        this.cameraConnected = false;
        
        setTimeout(() => {
            this.initializeSocketCamera();
        }, 1000);
    }

    /**
     * Cleanup resources (UPDATED)
     */
    cleanup() {
        console.log('Cleaning up resources...');
        
        // Disconnect Socket.IO
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        
        // Clear highlight interval
        if (this.highlightInterval) {
            clearInterval(this.highlightInterval);
            this.highlightInterval = null;
        }
        
        this.cameraConnected = false;
        this.videoElement = null;
        
        console.log('Cleanup completed');
    }
}

// Global functions for console testing and camera control (UPDATED)
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

window.restartSocketCamera = function() {
    if (window.conferenceApp && window.conferenceApp.view) {
        window.conferenceApp.view.restartSocketCamera();
        console.log('Socket.IO camera restart initiated from console');
    }
};

window.checkSocketCameraStatus = function() {
    if (window.conferenceApp && window.conferenceApp.view) {
        const view = window.conferenceApp.view;
        console.log('Socket.IO Camera Status:');
        console.log('- Display 2:', view.isDisplay2);
        console.log('- Camera Enabled:', view.cameraEnabled);
        console.log('- Socket Connected:', view.cameraConnected);
        console.log('- Socket Object:', !!view.socket);
        console.log('- Server URL:', view.serverUrl);
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

console.log('ConferenceView loaded with Socket.IO camera support');
console.log('Console commands: restartSocketCamera(), checkSocketCameraStatus(), startPreviewMode(), stopPreviewMode()');