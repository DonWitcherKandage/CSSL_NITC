/* ============================================================================
   MODERN CONFERENCE VIEW - PRESENTATION LAYER (MVC Architecture)
   Enhanced UI with smooth animations and modern design patterns
   ============================================================================ */

/**
 * ModernConferenceView - Manages all UI updates and rendering with enhanced animations
 */
class ModernConferenceView {
    constructor() {
        // Display configuration
        this.isDisplay1 = false; // Agenda display
        this.isDisplay2 = false; // Details display
        this.currentDay = 'Inauguration';
        
        // Animation state management
        this.animationInProgress = false;
        this.animationQueue = [];
        this.lastRenderTime = 0;
        
        // Preview mode for highlighting events
        this.previewMode = {
            active: false,
            interval: null,
            currentIndex: 0,
            duration: 12000, // 12 seconds per event
            totalEvents: 0
        };
        
        // Initialize DOM elements and determine display type
        this.initializeElements();
        this.detectDisplayType();
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log(`ModernConferenceView initialized for ${this.isDisplay1 ? 'Display 1 (Agenda)' : 'Display 2 (Details)'}`);
    }

    /**
     * Initialize and cache DOM elements for performance
     */
    initializeElements() {
        // Common elements
        this.elements = {
            // Status bar elements
            statusBar: document.querySelector('.status-bar'),
            digitalClock: document.getElementById('digitalClock'),
            statusBadge: document.querySelector('.status-badge'),
            
            // Conference header elements
            conferenceHeader: document.querySelector('.conference-header'),
            conferenceLogo: document.querySelector('.conference-logo'),
            conferenceTitle: document.querySelector('.conference-title'),
            conferenceDay: document.querySelector('.conference-day'),
            
            // Display 1 specific elements (agenda)
            agendaContainer: document.getElementById('agendaContainer'),
            currentEventCard: document.getElementById('currentEventCard'),
            upcomingEventsList: document.getElementById('upcomingEventsList'),
            
            // Display 2 specific elements (details)
            eventDisplay: document.querySelector('.event-display'),
            eventShowcase: document.getElementById('eventShowcase'),
            showcaseTime: document.getElementById('showcaseTime'),
            showcaseTitle: document.getElementById('showcaseTitle'),
            showcaseDescription: document.getElementById('showcaseDescription'),
            showcaseSpeaker: document.getElementById('showcaseSpeaker'),
            waitingState: document.getElementById('waitingState'),
            nextEventPreview: document.getElementById('nextEventPreview'),
            
            // Progress and widgets
            progressContainer: document.getElementById('progressContainer'),
            
            // Background animation
            backgroundAnimation: document.querySelector('.background-animation')
        };
    }

    /**
     * Detect which display type this is based on DOM elements
     */
    detectDisplayType() {
        this.isDisplay1 = !!this.elements.agendaContainer;
        this.isDisplay2 = !!this.elements.eventDisplay;
        
        if (!this.isDisplay1 && !this.isDisplay2) {
            console.warn('Could not detect display type - neither agenda nor event display elements found');
        }
    }

    /**
     * Set up event listeners for interactive elements
     */
    setupEventListeners() {
        // Add click handlers for upcoming events (Display 1)
        if (this.isDisplay1) {
            document.addEventListener('click', (e) => {
                const eventElement = e.target.closest('.upcoming-event');
                if (eventElement && this.onItemClick) {
                    const index = parseInt(eventElement.dataset.index);
                    if (!isNaN(index)) {
                        this.onItemClick(index);
                    }
                }
            });
        }

        // Add hover effects for better interactivity
        document.addEventListener('mouseover', this.handleMouseOver.bind(this));
        document.addEventListener('mouseout', this.handleMouseOut.bind(this));
        
        // Listen for conference day changes
        window.addEventListener('conference_day_changed', (e) => {
            this.updateConferenceDay(e.detail.newDay);
        });
    }

    /**
     * Handle mouse over events for enhanced interactivity
     */
    handleMouseOver(e) {
        if (e.target.closest('.upcoming-event')) {
            const element = e.target.closest('.upcoming-event');
            element.style.transform = 'translateX(8px)';
            element.style.background = 'rgba(255, 255, 255, 0.15)';
        }
        
        if (e.target.closest('.current-event-card')) {
            const element = e.target.closest('.current-event-card');
            element.style.transform = 'translateY(-6px)';
        }
    }

    /**
     * Handle mouse out events
     */
    handleMouseOut(e) {
        if (e.target.closest('.upcoming-event')) {
            const element = e.target.closest('.upcoming-event');
            element.style.transform = 'translateX(0)';
            element.style.background = '';
        }
        
        if (e.target.closest('.current-event-card')) {
            const element = e.target.closest('.current-event-card');
            element.style.transform = '';
        }
    }

    /**
     * Update the digital clock display
     */
    updateClock(timeString) {
        if (this.elements.digitalClock) {
            // Add smooth transition for time changes
            if (this.elements.digitalClock.textContent !== timeString) {
                this.elements.digitalClock.style.opacity = '0.7';
                setTimeout(() => {
                    this.elements.digitalClock.textContent = timeString;
                    this.elements.digitalClock.style.opacity = '1';
                }, 100);
            }
        }
    }

    /**
     * Update the conference day display
     */
    updateConferenceDay(day) {
        this.currentDay = day;
        
        if (this.elements.conferenceDay) {
            // Animate day change
            this.elements.conferenceDay.style.transform = 'scale(0.9)';
            this.elements.conferenceDay.style.opacity = '0.7';
            
            setTimeout(() => {
                this.elements.conferenceDay.textContent = day;
                this.elements.conferenceDay.style.transform = 'scale(1)';
                this.elements.conferenceDay.style.opacity = '1';
            }, 200);
        }
    }

    /**
     * Render agenda list for Display 1
     */
    renderAgendaList(agendaData, currentIndex) {
        if (!this.isDisplay1) return;

        try {
            // Update current event card
            this.renderCurrentEventCard(agendaData, currentIndex);
            
            // Update upcoming events list
            this.renderUpcomingEvents(agendaData, currentIndex);
            
            // Update progress indicators
            this.updateProgressIndicators(agendaData, currentIndex);
            
        } catch (error) {
            console.error('Error rendering agenda list:', error);
            this.showError('Failed to render agenda list');
        }
    }

    /**
     * Render the current event card
     */
    renderCurrentEventCard(agendaData, currentIndex) {
        if (!this.elements.currentEventCard) return;

        const currentEvent = currentIndex >= 0 ? agendaData[currentIndex] : null;
        
        if (currentEvent) {
            const cardHTML = `
                <div class="event-time">${currentEvent.displayTime}</div>
                <div class="event-title">${currentEvent.title}</div>
                <div class="event-duration">${currentEvent.duration} minutes</div>
                ${currentEvent.speaker ? `<div class="event-speaker">Speaker: ${currentEvent.speaker}</div>` : ''}
            `;
            
            if (this.elements.currentEventCard.innerHTML !== cardHTML) {
                this.animateCardChange(this.elements.currentEventCard, cardHTML);
            }
            
            this.elements.currentEventCard.classList.add('active');
            this.elements.currentEventCard.style.display = 'block';
        } else {
            this.elements.currentEventCard.style.display = 'none';
            this.elements.currentEventCard.classList.remove('active');
        }
    }

    /**
     * Render upcoming events list
     */
    renderUpcomingEvents(agendaData, currentIndex) {
        if (!this.elements.upcomingEventsList) return;

        let upcomingHTML = '';
        let hasUpcoming = false;

        // Generate upcoming events
        for (let i = currentIndex + 1; i < agendaData.length; i++) {
            const event = agendaData[i];
            upcomingHTML += `
                <div class="upcoming-event" data-index="${i}">
                    <div class="event-time">${event.displayTime}</div>
                    <div class="event-title">${event.title}</div>
                    <div class="event-duration">${event.duration} minutes</div>
                    ${event.speaker ? `<div class="event-speaker">${event.speaker}</div>` : ''}
                </div>
            `;
            hasUpcoming = true;
        }

        // Show completion message if no upcoming events
        if (!hasUpcoming) {
            upcomingHTML = `
                <div class="upcoming-event completion-message">
                    <div class="event-time" style="color: #22c55e;">Conference Complete</div>
                    <div class="event-title" style="color: #22c55e;">Thank you for participating!</div>
                    <div class="event-duration">See you next time</div>
                </div>
            `;
        }

        // Animate list update if content changed
        if (this.elements.upcomingEventsList.innerHTML !== upcomingHTML) {
            this.animateListChange(this.elements.upcomingEventsList, upcomingHTML);
        }
    }

    /**
     * Render current event for Display 2
     */
    renderCurrentEvent(currentEvent, status, nextEvent, timeUntilNext) {
        if (!this.isDisplay2) return;

        try {
            if (currentEvent && status === 'active') {
                this.showActiveEvent(currentEvent, nextEvent);
            } else {
                this.showWaitingState(status, nextEvent, timeUntilNext);
            }
        } catch (error) {
            console.error('Error rendering current event:', error);
            this.showError('Failed to render event details');
        }
    }

    /**
     * Show active event on Display 2
     */
    showActiveEvent(currentEvent, nextEvent) {
        if (!this.elements.eventShowcase || this.animationInProgress) return;

        // Show showcase, hide waiting state
        if (this.elements.eventShowcase) this.elements.eventShowcase.style.display = 'block';
        if (this.elements.waitingState) this.elements.waitingState.style.display = 'none';

        // Animate content change
        this.animateEventShowcase(() => {
            if (this.elements.showcaseTime) {
                this.elements.showcaseTime.textContent = currentEvent.displayTime;
            }
            
            if (this.elements.showcaseTitle) {
                this.elements.showcaseTitle.textContent = currentEvent.title;
            }
            
            if (this.elements.showcaseDescription) {
                this.elements.showcaseDescription.textContent = currentEvent.description;
            }
            
            if (this.elements.showcaseSpeaker && currentEvent.speaker) {
                this.elements.showcaseSpeaker.textContent = `Speaker: ${currentEvent.speaker}`;
                this.elements.showcaseSpeaker.style.display = 'block';
            } else if (this.elements.showcaseSpeaker) {
                this.elements.showcaseSpeaker.style.display = 'none';
            }
            
            // Update next event preview
            this.updateNextEventPreview(nextEvent);
        });
    }

    /**
     * Show waiting state on Display 2
     */
    showWaitingState(status, nextEvent, timeUntilNext) {
        if (!this.elements.waitingState) return;

        // Hide showcase, show waiting state
        if (this.elements.eventShowcase) this.elements.eventShowcase.style.display = 'none';
        if (this.elements.waitingState) this.elements.waitingState.style.display = 'block';

        let waitingHTML = '';

        if (status === 'waiting' && nextEvent) {
            const timeText = timeUntilNext > 0 ? 
                `Starts in ${timeUntilNext} minutes` : 'Starting now';
            
            waitingHTML = `
                <div class="waiting-title">Conference Starts Soon</div>
                <div class="waiting-subtitle">Please take your seats and prepare for an amazing experience</div>
                <div class="next-event-preview">
                    <div class="next-event-title">First Event</div>
                    <div class="next-event-content">
                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${nextEvent.title}</div>
                        <div class="next-event-time">${nextEvent.displayTime}</div>
                        <div style="color: var(--accent-blue); font-weight: bold; margin-top: 1rem;">
                            ${timeText}
                        </div>
                    </div>
                </div>
            `;
        } else if (status === 'completed') {
            waitingHTML = `
                <div class="waiting-title">Conference Complete</div>
                <div class="waiting-subtitle">Thank you for your participation!</div>
                <div class="next-event-preview">
                    <div class="next-event-content">
                        <div style="color: var(--accent-blue);">We hope you enjoyed the sessions</div>
                        <div style="margin-top: 1rem;">Follow-up materials will be sent via email</div>
                        <div style="margin-top: 0.5rem;">See you at our next conference!</div>
                    </div>
                </div>
            `;
        } else {
            waitingHTML = `
                <div class="waiting-title">NITC 2025</div>
                <div class="waiting-subtitle">Modern Conference Display System</div>
            `;
        }

        if (this.elements.waitingState.innerHTML !== waitingHTML) {
            this.animateContentChange(this.elements.waitingState, waitingHTML);
        }
    }

    /**
     * Update next event preview
     */
    updateNextEventPreview(nextEvent) {
        if (!this.elements.nextEventPreview) return;

        if (nextEvent) {
            const previewHTML = `
                <div class="next-event-title">Next Event</div>
                <div class="next-event-content">
                    <div>${nextEvent.title}</div>
                    <div class="next-event-time">${nextEvent.displayTime}</div>
                </div>
            `;
            
            this.elements.nextEventPreview.innerHTML = previewHTML;
            this.elements.nextEventPreview.style.display = 'block';
        } else {
            this.elements.nextEventPreview.style.display = 'none';
        }
    }

    /**
     * Update progress indicators - Fixed to remove progress dots
     */
    updateProgressIndicators(agendaData, currentIndex) {
        // Progress indicators are disabled - do nothing
        return;
    }

    /**
     * Animation helper: Animate card content change
     */
    animateCardChange(element, newHTML) {
        if (!element || this.animationInProgress) return;

        this.animationInProgress = true;
        
        element.style.transform = 'scale(0.95)';
        element.style.opacity = '0.7';
        
        setTimeout(() => {
            element.innerHTML = newHTML;
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
            this.animationInProgress = false;
        }, 200);
    }

    /**
     * Animation helper: Animate list content change
     */
    animateListChange(element, newHTML) {
        if (!element) return;

        element.style.opacity = '0.8';
        setTimeout(() => {
            element.innerHTML = newHTML;
            element.style.opacity = '1';
        }, 150);
    }

    /**
     * Animation helper: Animate event showcase change
     */
    animateEventShowcase(callback) {
        if (!this.elements.eventShowcase || this.animationInProgress) return;

        this.animationInProgress = true;
        
        this.elements.eventShowcase.classList.add('slide-in-right');
        
        setTimeout(() => {
            callback();
            this.elements.eventShowcase.classList.remove('slide-in-right');
            this.animationInProgress = false;
        }, 300);
    }

    /**
     * Animation helper: Animate general content change
     */
    animateContentChange(element, newHTML) {
        if (!element) return;

        element.style.transform = 'translateY(10px)';
        element.style.opacity = '0.8';
        
        setTimeout(() => {
            element.innerHTML = newHTML;
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        }, 200);
    }

    /**
     * Preview Mode: Start event highlighting
     */
    startPreviewHighlighting() {
        if (!this.isDisplay1 || this.previewMode.active) return;

        console.log('Starting preview highlighting mode');
        
        this.previewMode.active = true;
        this.previewMode.currentIndex = 0;
        
        // Get total events for cycling
        if (window.conferenceApp && window.conferenceApp.model) {
            const agenda = window.conferenceApp.model.getAgendaData();
            this.previewMode.totalEvents = agenda.length;
        }
        
        // Start highlighting immediately
        this.doPreviewHighlight();
        
        // Continue highlighting every 12 seconds
        this.previewMode.interval = setInterval(() => {
            this.doPreviewHighlight();
        }, this.previewMode.duration);
    }

    /**
     * Preview Mode: Stop event highlighting
     */
    stopPreviewHighlighting() {
        if (!this.previewMode.active) return;

        console.log('Stopping preview highlighting mode');
        
        this.previewMode.active = false;
        
        if (this.previewMode.interval) {
            clearInterval(this.previewMode.interval);
            this.previewMode.interval = null;
        }
        
        this.clearAllHighlights();
    }

    /**
     * Preview Mode: Perform highlighting
     */
    doPreviewHighlight() {
        if (!this.previewMode.active || !window.conferenceApp) return;

        const agenda = window.conferenceApp.model.getAgendaData();
        if (agenda.length === 0) return;

        // Clear previous highlights
        this.clearAllHighlights();

        // Find target element to highlight
        let targetElement = null;
        const currentCard = document.querySelector('.current-event-card');
        const upcomingEvents = document.querySelectorAll('.upcoming-event');

        if (this.previewMode.currentIndex === 0 && currentCard && currentCard.style.display !== 'none') {
            targetElement = currentCard;
        } else {
            const upcomingIndex = currentCard && currentCard.style.display !== 'none' ? 
                this.previewMode.currentIndex - 1 : this.previewMode.currentIndex;
            
            if (upcomingIndex >= 0 && upcomingIndex < upcomingEvents.length) {
                targetElement = upcomingEvents[upcomingIndex];
            }
        }

        // Apply highlight
        if (targetElement) {
            targetElement.classList.add('event-highlight');
            console.log(`Highlighting event ${this.previewMode.currentIndex + 1}/${this.previewMode.totalEvents}: ${agenda[this.previewMode.currentIndex]?.title}`);
        }

        // Move to next event
        this.previewMode.currentIndex = (this.previewMode.currentIndex + 1) % this.previewMode.totalEvents;
    }

    /**
     * Preview Mode: Clear all highlights
     */
    clearAllHighlights() {
        const allEvents = document.querySelectorAll('.current-event-card, .upcoming-event');
        allEvents.forEach(element => {
            element.classList.remove('event-highlight');
        });
    }

    /**
     * Set event handlers for controller interaction
     */
    setEventHandlers(handlers) {
        this.onPrevious = handlers.onPrevious;
        this.onNext = handlers.onNext;
        this.onAutoToggle = handlers.onAutoToggle;
        this.onItemClick = handlers.onItemClick;
    }

    /**
     * Show loading state
     */
    showLoading() {
        const loadingHTML = `
            <div class="waiting-state">
                <div class="waiting-title">Loading Conference Data...</div>
                <div class="waiting-subtitle">Please wait while we prepare the agenda</div>
            </div>
        `;

        if (this.isDisplay1 && this.elements.agendaContainer) {
            this.elements.agendaContainer.innerHTML = loadingHTML;
        }

        if (this.isDisplay2 && this.elements.eventDisplay) {
            this.elements.eventDisplay.innerHTML = loadingHTML;
        }
    }

    /**
     * Show error state
     */
    showError(errorMessage) {
        const errorHTML = `
            <div class="waiting-state">
                <div class="waiting-title">System Error</div>
                <div class="waiting-subtitle">${errorMessage}</div>
                <div class="next-event-preview">
                    <div class="next-event-content">
                        <div>Please refresh the page</div>
                        <div style="margin-top: 0.5rem;">Check your internet connection</div>
                        <div style="margin-top: 0.5rem;">Contact technical support if issue persists</div>
                    </div>
                </div>
            </div>
        `;

        if (this.isDisplay1 && this.elements.agendaContainer) {
            this.elements.agendaContainer.innerHTML = errorHTML;
        }

        if (this.isDisplay2 && this.elements.eventDisplay) {
            this.elements.eventDisplay.innerHTML = errorHTML;
        }
    }

    /**
     * Update status badge
     */
    updateStatusBadge(status) {
        if (!this.elements.statusBadge) return;

        const statusMap = {
            'waiting': { text: 'WAITING', color: '#f59e0b' },
            'active': { text: 'LIVE', color: '#22c55e' },
            'between': { text: 'BREAK', color: '#3b82f6' },
            'completed': { text: 'COMPLETE', color: '#6b7280' }
        };

        const statusInfo = statusMap[status] || statusMap['waiting'];
        
        this.elements.statusBadge.querySelector('span').textContent = statusInfo.text;
        this.elements.statusBadge.style.backgroundColor = `${statusInfo.color}33`;
        this.elements.statusBadge.style.borderColor = `${statusInfo.color}66`;
        this.elements.statusBadge.style.color = statusInfo.color;
    }

    /**
     * Cleanup resources when destroying view
     */
    cleanup() {
        this.stopPreviewHighlighting();
        
        // Clear any pending animations
        this.animationInProgress = false;
        this.animationQueue = [];
        
        console.log('ModernConferenceView cleaned up');
    }

    /**
     * Get system status for debugging
     */
    getViewStatus() {
        return {
            displayType: this.isDisplay1 ? 'Display 1 (Agenda)' : 'Display 2 (Details)',
            currentDay: this.currentDay,
            animationInProgress: this.animationInProgress,
            previewMode: {
                active: this.previewMode.active,
                currentIndex: this.previewMode.currentIndex,
                totalEvents: this.previewMode.totalEvents
            },
            elementsFound: Object.keys(this.elements).filter(key => !!this.elements[key]).length,
            totalElements: Object.keys(this.elements).length
        };
    }
}

// Global functions for console access - Fixed function exposure
if (typeof window !== 'undefined') {
    // Expose preview functions
    window.startPreview = function() {
        if (window.conferenceApp && window.conferenceApp.view && window.conferenceApp.view.startPreviewHighlighting) {
            window.conferenceApp.view.startPreviewHighlighting();
            console.log('Preview highlighting started');
        } else {
            console.log('Preview function not available - system may not be initialized');
        }
    };

    window.stopPreview = function() {
        if (window.conferenceApp && window.conferenceApp.view && window.conferenceApp.view.stopPreviewHighlighting) {
            window.conferenceApp.view.stopPreviewHighlighting();
            console.log('Preview highlighting stopped');
        } else {
            console.log('Preview function not available - system may not be initialized');
        }
    };

    // Expose view status function
    window.getViewStatus = function() {
        if (window.conferenceApp && window.conferenceApp.view && window.conferenceApp.view.getViewStatus) {
            return window.conferenceApp.view.getViewStatus();
        } else {
            console.log('View status not available - system may not be initialized');
            return null;
        }
    };

    // Additional debugging functions
    window.debugView = function() {
        if (window.conferenceApp && window.conferenceApp.view) {
            console.log('View Debug Info:');
            console.log('- Display 1:', window.conferenceApp.view.isDisplay1);
            console.log('- Display 2:', window.conferenceApp.view.isDisplay2);
            console.log('- Preview Mode:', window.conferenceApp.view.previewMode);
            console.log('- Current Day:', window.conferenceApp.view.currentDay);
            return window.conferenceApp.view;
        }
        return null;
    };
}

console.log('ModernConferenceView loaded with enhanced animations and two-display support');