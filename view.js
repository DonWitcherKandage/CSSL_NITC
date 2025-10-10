/* ============================================================================
   VIEW - PRESENTATION LAYER - Complete Fixed Version
   ============================================================================ */

class ConferenceView {
    constructor() {
        // Cache DOM elements (PRESERVED FROM ORIGINAL)
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
        
        // Display identification (enhanced for combined layout)
        this.isCombined = !!this.agendaList && !!this.currentDetail;
        this.isDisplay1 = !!this.agendaList; // true when agenda exists (single or combined)
        this.isDisplay2 = !!this.currentDetail; // true when details exists (single or combined)
        
        // Socket.IO camera configuration
        this.socket = null;
        this.cameraConnected = false;
        this.cameraStreamingActive = false;
        this.showCameraSection = false;
        this.videoElement = null;
        this.serverUrl = 'http://localhost:3001';
        this.connectionAttempts = 0;
        this.maxConnectionAttempts = 3;
        
        // Pre-event highlight system (PRESERVED FROM ORIGINAL)
        this.preEventMode = false;
        this.highlightInterval = null;
        this.currentHighlightIndex = 0;
        this.highlightDuration = 15000;
        
        // Current day for the conference (PRESERVED FROM ORIGINAL)
        this.currentDay = 'Inauguration';
        
        console.log(`View initialized for ${this.isDisplay1 ? 'Display 1 (Agenda)' : 'Display 2 (Details)'}`);
        
        // Camera integration disabled: do NOT initialize Socket.IO camera
        this.showCameraSection = false;
        this.cameraConnected = false;
        this.cameraStreamingActive = false;
        
        // Set up periodic day sync (PRESERVED FROM ORIGINAL)
        this.setupDaySync();
    }

    /**
     * Initialize Socket.IO with better error handling
     */
    initializeSocketCamera() {
        if (!this.isDisplay2 || this.connectionAttempts >= this.maxConnectionAttempts) {
            if (this.connectionAttempts >= this.maxConnectionAttempts) {
                console.log('Camera server not available - proceeding without camera');
                this.showCameraSection = false;
                this.updateDisplayWithoutCamera();
            }
            return;
        }

        this.connectionAttempts++;

        try {
            console.log(`Attempting camera connection (${this.connectionAttempts}/${this.maxConnectionAttempts})`);
            
            // Check if Socket.IO is available
            if (typeof io === 'undefined') {
                console.error('Socket.IO library not loaded');
                this.showCameraSection = false;
                this.updateDisplayWithoutCamera();
                return;
            }
            
            // Initialize Socket.IO connection
            this.socket = io(this.serverUrl, {
                transports: ['websocket', 'polling'],
                timeout: 3000,
                reconnection: false,
                forceNew: true
            });

            // Connection successful
            this.socket.on('connect', () => {
                console.log('Camera server connected successfully');
                this.cameraConnected = true;
                this.showCameraSection = true;
                this.connectionAttempts = 0;
                this.updateCameraStatus('connected');
                this.socket.emit('request-stream');
                this.updateDisplayWithCamera();
            });

            // Connection failed
            this.socket.on('connect_error', (error) => {
                console.log(`Camera connection failed (attempt ${this.connectionAttempts})`);
                this.cameraConnected = false;
                
                if (this.connectionAttempts < this.maxConnectionAttempts) {
                    setTimeout(() => {
                        this.initializeSocketCamera();
                    }, 2000);
                } else {
                    console.log('Camera server not available - proceeding without camera');
                    this.showCameraSection = false;
                    this.updateDisplayWithoutCamera();
                }
            });

            // Disconnected
            this.socket.on('disconnect', (reason) => {
                console.log('Camera disconnected:', reason);
                this.cameraConnected = false;
                this.cameraStreamingActive = false;
                this.showCameraSection = false;
                this.updateDisplayWithoutCamera();
            });

            // Receive video frames
            this.socket.on('video-frame', (frameData) => {
                this.displayVideoFrame(frameData);
            });

            // Camera status updates
            this.socket.on('camera-status', (status) => {
                this.handleCameraStatusUpdate(status);
            });

            // Stream events
            this.socket.on('stream-started', () => {
                console.log('Camera stream started');
                this.cameraStreamingActive = true;
                this.updateCameraStatus('streaming');
            });

            this.socket.on('stream-stopped', () => {
                console.log('Camera stream stopped');
                this.cameraStreamingActive = false;
                this.updateCameraStatus('stopped');
            });

        } catch (error) {
            console.error('Failed to initialize camera:', error);
            this.showCameraSection = false;
            this.updateDisplayWithoutCamera();
        }
    }

    /**
     * Reduce font-size by 1px steps until the element's scrollWidth fits within clientWidth.
     * Prevents a single long word from being split/hanging. Minimum font-size safeguard at 12px.
     */
    fitDescriptionToWidth(el) {
        try {
            // Respect CSS: do not split words
            el.style.wordBreak = 'normal';
            el.style.overflowWrap = 'normal';
            el.style.hyphens = 'none';

            // Compute initial size in pixels
            const computed = window.getComputedStyle(el);
            let sizePx = parseFloat(computed.fontSize);
            const minPx = 12;

            // Shrink only if content overflows horizontally
            // Use a small async to ensure layout is ready
            const shrink = () => {
                let guard = 30; // safety to avoid infinite loops
                while (el.scrollWidth > el.clientWidth && sizePx > minPx && guard-- > 0) {
                    sizePx -= 1;
                    el.style.fontSize = sizePx + 'px';
                }
            };
            if ('requestAnimationFrame' in window) {
                requestAnimationFrame(shrink);
            } else {
                setTimeout(shrink, 0);
            }
        } catch (e) {
            // no-op fail safe
        }
    }

    /**
     * Handle camera status updates
     */
    handleCameraStatusUpdate(status) {
        console.log('Camera status:', status);
        
        if (status.state === 'disconnected') {
            this.cameraConnected = false;
            this.cameraStreamingActive = false;
            this.showCameraSection = false;
            this.updateDisplayWithoutCamera();
        } else if (status.state === 'connected') {
            this.cameraConnected = true;
            this.showCameraSection = true;
            this.updateCameraStatus('connected');
            this.updateDisplayWithCamera();
        } else if (status.state === 'streaming') {
            this.cameraStreamingActive = true;
            this.updateCameraStatus('streaming');
        }
    }

    /**
     * Display received video frame
     */
    displayVideoFrame(frameData) {
        if (!this.videoElement) {
            this.videoElement = document.getElementById('socketio-camera-feed');
        }

        if (this.videoElement && frameData) {
            try {
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
     * Update camera status indicator
     */
    updateCameraStatus(status) {
        const statusElement = document.querySelector('.camera-status');
        
        if (statusElement) {
            switch (status) {
                case 'connected':
                    statusElement.textContent = '● READY';
                    statusElement.style.color = '#f39c12';
                    break;
                case 'streaming':
                    statusElement.textContent = '● LIVE';
                    statusElement.style.color = '#00ff00';
                    break;
                case 'stopped':
                    statusElement.textContent = '● STANDBY';
                    statusElement.style.color = '#f39c12';
                    break;
                default:
                    statusElement.textContent = '● CONNECTING';
                    statusElement.style.color = '#95a5a6';
            }
        }
    }

    /**
     * Generate camera HTML when available
     */
    generateCameraHTML() {
        // Camera integration removed
        return '';
    }

    /**
     * Generate "coming soon" message when camera not available
     */
    generateCameraComingSoonHTML() {
        // Camera integration removed
        return '';
    }

    /**
     * Update display when camera is available
     */
    updateDisplayWithCamera() {
        if (window.conferenceApp?.controller) {
            setTimeout(() => {
                window.conferenceApp.controller.updateDisplay();
            }, 100);
        }
    }

    /**
     * Update display when camera is not available
     */
    updateDisplayWithoutCamera() {
        if (window.conferenceApp?.controller) {
            setTimeout(() => {
                window.conferenceApp.controller.updateDisplay();
            }, 100);
        }
    }

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

        // Remove preview highlight from all cards first (no inline style overrides)
        document.querySelectorAll('.upcoming-event').forEach(el => el.classList.remove('preview-highlight'));

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

        if (targetElement) {
            targetElement.classList.add('preview-highlight');
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
        
        const allEvents = document.querySelectorAll('.current-event-card, .upcoming-event');
        allEvents.forEach(element => {
            element.style.transform = '';
            element.style.boxShadow = '';
            element.style.border = '';
            element.style.background = '';
        });
    }

    /**
     * Set up periodic day synchronization (PRESERVED FROM ORIGINAL)
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

    updateDayInHeader(newDay) {
        const dayElement = document.querySelector('.event-day');
        if (dayElement && dayElement.textContent !== newDay) {
            dayElement.textContent = newDay;
            console.log(`Header updated to show: ${newDay}`);
        }
    }

    setCurrentDay(day) {
        this.currentDay = day;
    }

    getLogoHtml() {
        return `<img src="nitc-logo.png" alt="NITC 2025 Logo">`;
    }

    getNextDayFirstEvent() {
        try {
            const app = window.conferenceApp;
            if (!app?.model) return null;
            const days = app.model.getAvailableDays();
            const today = app.model.getCurrentDay();
            const idx = days.indexOf(today);
            if (idx === -1) return null;
            const nextDay = days[idx + 1];
            if (!nextDay) return null;
            const all = app.model.allAgendaData || {};
            const events = all[nextDay] || [];
            if (events.length === 0) return null;
            return { day: nextDay, first: events[0] };
        } catch { return null; }
    }

    /**
     * Render agenda list (PRESERVED FROM ORIGINAL)
     */
    renderAgendaList(agendaData, currentIndex) {
        // In combined mode, agenda should render when element exists.
        if (!this.agendaList) return;

        try {
            this.agendaList.innerHTML = '';

            // If before conference start (before Oct 14), show only header and return
            const mdl = window.conferenceApp?.model;
            if (mdl?.isBeforeConferenceStart?.()) {
                const headerOnly = document.createElement('div');
                headerOnly.className = 'agenda-header';
                headerOnly.innerHTML = `
                    <div class="logo-3d-wrapper small">
                        <div class="logo-stack">
                            ${Array.from({ length: 32 }).map((_, i) => `<div class="slice" style="--i: ${i}"></div>`).join('')}
                        </div>
                    </div>
                    <div class="event-title-section">
                        <div class="event-title">EVENT<br>SCHEDULE</div>
                        <div class="event-day">${this.currentDay}</div>
                    </div>
                `;
                this.agendaList.appendChild(headerOnly);
                return;
            }
            
            // Header (spinning logo + event title + day) – exact structure as reference
            const headerSection = document.createElement('div');
            headerSection.className = 'agenda-header';
            headerSection.innerHTML = `
                <div class="logo-3d-wrapper small">
                    <div class="logo-stack">
                        ${Array.from({ length: 32 }).map((_, i) => `<div class="slice" style="--i: ${i}"></div>`).join('')}
                    </div>
                </div>
                <div class="event-title-section">
                    <div class="event-title">EVENT<br>SCHEDULE</div>
                    <div class="event-day">${this.currentDay}</div>
                </div>
            `;
            this.agendaList.appendChild(headerSection);

            // If the day is completed, show countdown instead of cards
            const status = window.conferenceApp?.model?.getConferenceStatus?.() || 'active';
            if (status === 'completed') {
                const wrap = document.createElement('div');
                wrap.className = 'countdown-section';
                wrap.innerHTML = `
                    <h2 class="countdown-title">Starts In</h2>
                    <div class="countdown-display">
                        <div class="countdown-item"><span class="countdown-number" id="cd-days">00</span><span class="countdown-label">Days</span></div>
                        <div class="countdown-item"><span class="countdown-number" id="cd-hours">00</span><span class="countdown-label">Hours</span></div>
                        <div class="countdown-item"><span class="countdown-number" id="cd-minutes">00</span><span class="countdown-label">Minutes</span></div>
                        <div class="countdown-item"><span class="countdown-number" id="cd-seconds">00</span><span class="countdown-label">Seconds</span></div>
                    </div>
                `;
                this.agendaList.appendChild(wrap);

                const nextInfo = this.getNextDayFirstEvent();
                if (nextInfo) {
                    const dates = window.conferenceApp.model.conferenceDates || {};
                    const dateStr = dates[nextInfo.day]; // YYYY-MM-DD
                    const timeStr = nextInfo.first.time; // HH:MM 24h
                    const target = new Date(`${dateStr}T${timeStr}:00`);
                    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = String(v).padStart(2,'0'); };
                    const tick = () => {
                        const now = new Date();
                        const diff = target - now;
                        if (diff <= 0) { ['cd-days','cd-hours','cd-minutes','cd-seconds'].forEach(id=>setVal(id,0)); return; }
                        const dayMs = 1000*60*60*24;
                        const days = Math.floor(diff/dayMs);
                        const hours = Math.floor((diff%dayMs)/(1000*60*60));
                        const minutes = Math.floor((diff%(1000*60*60))/(1000*60));
                        const seconds = Math.floor((diff%(1000*60))/1000);
                        setVal('cd-days', days); setVal('cd-hours', hours); setVal('cd-minutes', minutes); setVal('cd-seconds', seconds);
                    };
                    tick();
                    if (this._countdownTimer) clearInterval(this._countdownTimer);
                    this._countdownTimer = setInterval(tick, 1000);
                }
                return; // don't render cards when completed
            }
            
            const upcomingSection = document.createElement('div');
            upcomingSection.className = 'upcoming-events';

            // Build a window of at most 3 cards: current + next two
            const windowCards = [];
            const statusNow = mdl?.getConferenceStatus?.() || 'waiting';
            const canHighlight = currentIndex >= 0 && statusNow === 'active';
            if (currentIndex >= 0 && currentIndex < agendaData.length) {
                windowCards.push({ idx: currentIndex, cls: canHighlight ? 'upcoming-event preview-highlight' : 'upcoming-event' });
                if (currentIndex + 1 < agendaData.length) windowCards.push({ idx: currentIndex + 1, cls: 'upcoming-event' });
                if (currentIndex + 2 < agendaData.length) windowCards.push({ idx: currentIndex + 2, cls: 'upcoming-event' });
            } else {
                // Before first event: show first three
                for (let i = 0; i < Math.min(3, agendaData.length); i++) {
                    windowCards.push({ idx: i, cls: 'upcoming-event' });
                }
            }

            if (windowCards.length === 0) {
                // Day completed or no events
                const msg = document.createElement('div');
                msg.className = 'upcoming-event';
                msg.innerHTML = `
                    <div class="time">No upcoming events</div>
                    <div class="title">Please check back later</div>
                `;
                upcomingSection.appendChild(msg);
            } else {
                for (const c of windowCards) {
                    const item = agendaData[c.idx];
                    const card = document.createElement('div');
                    card.className = c.cls;
                    card.innerHTML = `
                        <div class="time">${item.displayTime}</div>
                        <div class="title">${item.title}</div>
                        <div class="scan"></div>
                        <div class="trace"></div>
                        <div class="flux"></div>
                        <div class="stripes"></div>
                        <div class="halo"></div>
                        <div class="halo2"></div>
                        <div class="ripples"></div>
                        <div class="wires"></div>
                        <div class="edges"></div>
                        <div class="orbit"></div>
                    `;
                    card.addEventListener('click', () => {
                        if (this.onItemClick) this.onItemClick(c.idx);
                    });
                    upcomingSection.appendChild(card);
                }
            }

            this.agendaList.appendChild(upcomingSection);
            
        } catch (error) {
            console.error('Error rendering agenda list:', error);
        }
    }

    /**
     * Render current event with smart camera handling
     */
    renderCurrentEvent(currentEvent, status, nextEvent, timeUntilNext) {
        // In combined mode, details should render when element exists.
        if (!this.currentDetail) return;

        try {
            this.currentDetail.innerHTML = '';

            if (currentEvent && status === 'active') {
                // Show visible livestream placeholder and vertically centered group with description
                this.currentDetail.innerHTML = `
                    <div class="event-content" style="position:relative;display:flex;flex-direction:column;align-items:stretch;min-height:100%;">
                        <div class="center-pack">
                            <div class="stream-box"></div>
                            <div class="current-description">${currentEvent.description}</div>
                        </div>
                        <div style="position:absolute; left:0; right:0; bottom:10px; width:100%; text-align:center; padding:0 10px; opacity:.95;">
                            <div class="event-title">NITC 2025</div>
                        </div>
                    </div>
                `;
                // Fit description to avoid breaking a single long word across lines
                const descEl = this.currentDetail.querySelector('.current-description');
                if (descEl) this.fitDescriptionToWidth(descEl);
            } else if (status === 'waiting') {
                // Waiting: show camera box + 'coming soon' texts (no line/box around text)
                this.currentDetail.innerHTML = `
                    <div class="event-content" style="position:relative;min-height:100%;display:flex;flex-direction:column;align-items:stretch;">
                        <div class="center-pack">
                            <div class="stream-box"></div>
                            <div class="typing-title">Event starts soon...</div>
                            <div class="wait-sub">Please stay tuned while we prepare the next session</div>
                        </div>
                        <div style="position:absolute; left:0; right:0; bottom:10px; width:100%; text-align:center; padding:0 10px; opacity:.95;">
                            <div class="event-title">NITC 2025</div>
                        </div>
                    </div>
                `;
            } else if (status === 'completed') {
                const nextDayInfo = this.getNextDayFirstEvent();
                const followText = nextDayInfo
                    ? `Next: ${nextDayInfo.day} starts at ${nextDayInfo.first.displayTime}`
                    : `See you at our next event!`;
                this.currentDetail.innerHTML = `
                    <div class="event-content">
                        <div class="no-current-event">
                            <h2>Today's conference has concluded</h2>
                            <p>${followText}</p>
                        </div>
                    </div>
                `;
            } else {
                this.currentDetail.innerHTML = `
                    <div class="event-content">
                        <div class="no-current-event">
                            <h2>NITC 2025 Conference</h2>
                            <p>Waiting for event information...</p>
                        </div>
                    </div>
                `;
            }

        } catch (error) {
            console.error('Error rendering current event:', error);
        }
    }

    // All preserved methods
    updateControls(currentIndex, totalEvents, isAutoMode) {
        // Controls only apply to the agenda screen; render if present
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
                        <div class="logo-3d-wrapper small">
                            <div class="logo-stack">
                                ${Array.from({ length: 32 }).map((_, i) => `<div class=\"slice\" style=\"--i: ${i}\"></div>`).join('')}
                            </div>
                        </div>
                        <div class="event-title-section">
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

    restartSocketCamera() {
        console.log('Restarting camera connection...');
        
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        
        this.cameraConnected = false;
        this.connectionAttempts = 0;
        this.showCameraSection = true;
        
        setTimeout(() => {
            this.initializeSocketCamera();
        }, 1000);
    }

    cleanup() {
        console.log('Cleaning up resources...');
        
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        
        if (this.highlightInterval) {
            clearInterval(this.highlightInterval);
            this.highlightInterval = null;
        }
        
        this.cameraConnected = false;
        this.videoElement = null;
    }
}

// Global functions
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
        console.log('Camera restart initiated from console');
    }
};

window.checkSocketCameraStatus = function() {
    if (window.conferenceApp && window.conferenceApp.view) {
        const view = window.conferenceApp.view;
        console.log('Camera Status:');
        console.log('- Display 2:', view.isDisplay2);
        console.log('- Camera Connected:', view.cameraConnected);
        console.log('- Camera Streaming:', view.cameraStreamingActive);
        console.log('- Show Camera Section:', view.showCameraSection);
        console.log('- Connection Attempts:', view.connectionAttempts);
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

console.log('ConferenceView loaded with smart camera handling');