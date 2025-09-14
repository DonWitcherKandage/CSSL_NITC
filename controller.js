/* ============================================================================
   CONTROLLER - BUSINESS LOGIC LAYER (MVC Architecture)
   ============================================================================ */

/**
 * ConferenceController - Manages interaction between Model and View
 */
class ConferenceController {
    constructor() {
        // Initialize MVC components
        this.model = new ConferenceModel();
        this.view = new ConferenceView();
        
        // Real-time update interval
        this.updateInterval = null;
        this.updateFrequency = 1000; // Update every 1 second
        
        // Bind event handlers
        this.setupEventHandlers();
        
        // Start the application
        this.initialize();
    }

    /**
     * Set up all event handlers
     */
    setupEventHandlers() {
        // Set up view event handlers (for testing purposes)
        this.view.setEventHandlers({
            onPrevious: () => this.handlePrevious(),
            onNext: () => this.handleNext(),
            onAutoToggle: () => this.handleAutoToggle(),
            onItemClick: (index) => this.handleItemClick(index)
        });

        // Keyboard event handlers (for testing)
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Handle page visibility changes (pause/resume when tab is hidden/shown)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseUpdates();
            } else {
                this.resumeUpdates();
            }
        });
        
        // Handle window beforeunload (cleanup)
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    /**
     * Initialize the application
     */
    initialize() {
        try {
            console.log('🚀 Conference Real-Time Display System Starting...');
            console.log(`📅 Conference Schedule: 12:00 PM - 5:00 PM (Sri Lankan Time)`);
            console.log(`📊 Loaded ${this.model.getAgendaData().length} agenda items`);
            
            // Show loading state
            this.view.showLoading();
            
            // Perform initial real-time update
            this.performRealTimeUpdate();
            
            // Start the real-time update timer
            this.startRealTimeUpdates();
            
            console.log('✅ System initialized successfully');
            console.log('🕒 Real-time mode active - system will automatically track conference progress');
            
        } catch (error) {
            console.error('❌ Failed to initialize conference system:', error);
            this.view.showError('Failed to initialize system. Please refresh the page.');
        }
    }

    /**
     * Start real-time updates
     */
    startRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateInterval = setInterval(() => {
            this.performRealTimeUpdate();
        }, this.updateFrequency);
        
        console.log('⏰ Real-time updates started');
    }

    /**
     * Pause real-time updates (when tab is hidden)
     */
    pauseUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            console.log('⏸️ Updates paused (tab hidden)');
        }
    }

    /**
     * Resume real-time updates (when tab becomes visible)
     */
    resumeUpdates() {
        if (!this.updateInterval) {
            // Perform immediate update when tab becomes visible
            this.performRealTimeUpdate();
            // Restart the timer
            this.startRealTimeUpdates();
            console.log('▶️ Updates resumed (tab visible)');
        }
    }

    /**
     * Perform a real-time update cycle
     */
    performRealTimeUpdate() {
        try {
            // Update clock display
            const currentTimeWithSeconds = this.model.getCurrentRealTimeWithSeconds();
            this.view.updateClock(currentTimeWithSeconds);
            
            // Check for event changes
            const hasEventChanged = this.model.updateRealTimeEvent();
            
            // Update display if event changed or this is the first update
            if (hasEventChanged || !this.lastUpdateTime) {
                this.updateDisplay();
                this.lastUpdateTime = new Date();
            }
            
            // Update debug information
            this.updateDebugInfo();
            
        } catch (error) {
            console.error('❌ Error during real-time update:', error);
            this.view.showError('Real-time update failed. System will retry automatically.');
        }
    }

    /**
     * Update all display elements
     */
    updateDisplay() {
        try {
            const agendaData = this.model.getAgendaData();
            const currentIndex = this.model.getCurrentEventIndex();
            const currentEvent = this.model.getCurrentEvent();
            const status = this.model.getConferenceStatus();
            const nextEvent = this.model.getNextEvent();
            const timeUntilNext = this.model.getTimeUntilNextEvent();
            
            // Update both screens
            this.view.renderAgendaList(agendaData, currentIndex);
            this.view.renderCurrentEvent(currentEvent, status, nextEvent, timeUntilNext);
            
            // Update controls (mostly disabled in real-time mode)
            this.view.updateControls(currentIndex, agendaData.length, false);
            
        } catch (error) {
            console.error('❌ Error updating display:', error);
            this.view.showError('Display update failed. Please refresh the page.');
        }
    }

    /**
     * Update debug information panel
     */
    updateDebugInfo() {
        try {
            const currentEvent = this.model.getCurrentEvent();
            const status = this.model.getConferenceStatus();
            
            const debugInfo = {
                systemTime: this.model.getCurrentRealTime() + ' (Sri Lankan)',
                displayTime: currentEvent ? currentEvent.displayTime : 'None',
                currentEvent: currentEvent ? currentEvent.title : 'None',
                mode: 'Real-Time',
                status: status.charAt(0).toUpperCase() + status.slice(1)
            };
            
            this.view.updateDebugPanel(debugInfo);
            
        } catch (error) {
            console.error('❌ Error updating debug info:', error);
        }
    }

    /**
     * Handle previous button click (for testing only)
     */
    handlePrevious() {
        console.log('⚠️ Manual override: Previous event (testing mode)');
        if (this.model.previousEvent()) {
            this.updateDisplay();
            // Reset to real-time after 30 seconds
            setTimeout(() => {
                console.log('🔄 Returning to real-time mode...');
                this.model.resetToRealTime();
                this.updateDisplay();
            }, 30000);
        }
    }

    /**
     * Handle next button click (for testing only)
     */
    handleNext() {
        console.log('⚠️ Manual override: Next event (testing mode)');
        if (this.model.nextEvent()) {
            this.updateDisplay();
            // Reset to real-time after 30 seconds
            setTimeout(() => {
                console.log('🔄 Returning to real-time mode...');
                this.model.resetToRealTime();
                this.updateDisplay();
            }, 30000);
        }
    }

    /**
     * Handle auto mode toggle (disabled in real-time mode)
     */
    handleAutoToggle() {
        console.log('ℹ️ Auto mode is disabled - system runs in real-time mode');
    }

    /**
     * Handle agenda item click (for testing only)
     * @param {number} index Index of clicked item
     */
    handleItemClick(index) {
        console.log(`⚠️ Manual override: Jump to event ${index} (testing mode)`);
        this.model.setCurrentEventIndex(index);
        this.updateDisplay();
        // Reset to real-time after 30 seconds
        setTimeout(() => {
            console.log('🔄 Returning to real-time mode...');
            this.model.resetToRealTime();
            this.updateDisplay();
        }, 30000);
    }

    /**
     * Handle keyboard input (for testing and control)
     * @param {KeyboardEvent} e Keyboard event
     */
    handleKeyPress(e) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.handlePrevious();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.handleNext();
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                console.log('🔄 Manual reset to real-time mode');
                this.model.resetToRealTime();
                this.updateDisplay();
                break;
            case 'h':
            case 'H':
                e.preventDefault();
                // Toggle control visibility
                if (this.view.controls.classList.contains('hidden')) {
                    this.view.showControls();
                    console.log('👁️ Controls shown');
                } else {
                    this.view.hideControls();
                    console.log('🙈 Controls hidden');
                }
                break;
            case 'd':
            case 'D':
                e.preventDefault();
                // Toggle debug panel
                const debugPanel = document.getElementById('debugPanel');
                if (debugPanel) {
                    debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
                    console.log('🐛 Debug panel toggled');
                }
                break;
        }
    }

    /**
     * Hide control buttons (for production deployment)
     */
    hideControlButtons() {
        this.view.hideControls();
        console.log('🙈 Control buttons hidden for production mode');
    }

    /**
     * Show control buttons (for testing)
     */
    showControlButtons() {
        this.view.showControls();
        console.log('👁️ Control buttons shown for testing mode');
    }

    /**
     * Get current system status for external monitoring
     * @returns {Object} System status object
     */
    getSystemStatus() {
        return {
            isRunning: !!this.updateInterval,
            currentTime: this.model.getCurrentRealTime(),
            currentEvent: this.model.getCurrentEvent(),
            conferenceStatus: this.model.getConferenceStatus(),
            nextEvent: this.model.getNextEvent(),
            timeUntilNext: this.model.getTimeUntilNextEvent()
        };
    }

    /**
     * Cleanup resources when page unloads
     */
    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        console.log('🧹 System cleanup completed');
    }

    /**
     * Restart the system (useful for error recovery)
     */
    restart() {
        console.log('🔄 Restarting conference system...');
        this.cleanup();
        this.initialize();
    }
}