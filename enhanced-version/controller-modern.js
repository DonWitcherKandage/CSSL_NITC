/* ============================================================================
   MODERN CONFERENCE CONTROLLER - BUSINESS LOGIC LAYER (MVC Architecture)
   Enhanced with improved state management and error handling
   ============================================================================ */

/**
 * ModernConferenceController - Manages interaction between Model and View with enhanced features
 */
class ModernConferenceController {
    constructor() {
        // Initialize MVC components
        this.model = new ModernConferenceModel();
        this.view = new ModernConferenceView();
        
        // Controller state management
        this.state = {
            isRealTimeMode: true,
            manualEventIndex: -1,
            isRunning: false,
            lastUpdateTime: null,
            updateCount: 0,
            errorCount: 0,
            maxErrors: 5
        };
        
        // Update configuration
        this.updateConfig = {
            frequency: 1000, // Update every 1 second
            maxRetries: 3,
            retryDelay: 2000 // 2 seconds
        };
        
        // Timer management
        this.timers = {
            updateInterval: null,
            retryTimeout: null
        };
        
        // Performance tracking
        this.performance = {
            lastUpdateDuration: 0,
            averageUpdateDuration: 0,
            updateHistory: []
        };
        
        // Cross-display synchronization
        this.syncConfig = {
            enabled: true,
            frequency: 1000,
            storageKey: 'nitc2025_modern_sync'
        };
        
        // Bind event handlers and initialize
        this.bindEventHandlers();
        this.initialize();
    }

    /**
     * Bind event handlers for view interactions
     */
    bindEventHandlers() {
        // Set up view event handlers
        this.view.setEventHandlers({
            onPrevious: () => this.handlePrevious(),
            onNext: () => this.handleNext(),
            onAutoToggle: () => this.toggleRealTimeMode(),
            onItemClick: (index) => this.handleItemClick(index)
        });

        // Keyboard event handlers
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Page visibility changes (pause/resume when tab is hidden/shown)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseUpdates();
            } else {
                this.resumeUpdates();
            }
        });
        
        // Window beforeunload (cleanup)
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });

        // Error handling
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event.error);
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleGlobalError(event.reason);
        });

        console.log('Event handlers bound successfully');
    }

    /**
     * Initialize the application with error handling
     */
    async initialize() {
        try {
            console.log('Initializing Modern NITC 2025 Conference Display System...');
            console.log('================================================');
            
            // Show loading state
            this.view.showLoading();
            
            // Wait for DOM to be fully ready
            await this.waitForDOM();
            
            // Perform initial update
            await this.performUpdate();
            
            // Start the update cycle
            this.startUpdates();
            
            // Set up cross-display synchronization
            this.setupCrossDisplaySync();
            
            // Initialize performance monitoring
            this.initializePerformanceMonitoring();
            
            this.state.isRunning = true;
            
            console.log('System initialized successfully');
            console.log(`Mode: ${this.state.isRealTimeMode ? 'Real-Time' : 'Manual'}`);
            console.log(`Display Type: ${this.view.isDisplay1 ? 'Display 1 (Agenda)' : 'Display 2 (Details)'}`);
            console.log('================================================');
            
            // Log available controls after initialization
            setTimeout(() => {
                this.logAvailableControls();
            }, 2000);
            
        } catch (error) {
            console.error('Critical error during initialization:', error);
            this.handleCriticalError(error);
        }
    }

    /**
     * Wait for DOM to be fully ready
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    /**
     * Start the update cycle with error handling
     */
    startUpdates() {
        if (this.timers.updateInterval) {
            clearInterval(this.timers.updateInterval);
        }
        
        this.timers.updateInterval = setInterval(() => {
            this.performUpdate().catch(error => {
                this.handleUpdateError(error);
            });
        }, this.updateConfig.frequency);
        
        console.log('Update cycle started');
    }

    /**
     * Pause updates when tab is hidden
     */
    pauseUpdates() {
        if (this.timers.updateInterval) {
            clearInterval(this.timers.updateInterval);
            this.timers.updateInterval = null;
            console.log('Updates paused (tab hidden)');
        }
    }

    /**
     * Resume updates when tab becomes visible
     */
    resumeUpdates() {
        if (!this.timers.updateInterval && this.state.isRunning) {
            // Perform immediate update when tab becomes visible
            this.performUpdate().catch(error => {
                this.handleUpdateError(error);
            });
            
            // Restart the timer
            this.startUpdates();
            console.log('Updates resumed (tab visible)');
        }
    }

    /**
     * Main update cycle with performance tracking
     */
    async performUpdate() {
        const startTime = performance.now();
        
        try {
            // Update clock
            const currentTimeWithSeconds = this.model.getCurrentRealTimeWithSeconds();
            this.view.updateClock(currentTimeWithSeconds);
            
            let hasChanged = false;
            
            if (this.state.isRealTimeMode) {
                // Real-time mode: follow actual schedule
                hasChanged = this.model.updateRealTimeEvent();
            } else {
                // Manual mode: use manually selected event
                const currentIndex = this.model.getCurrentEventIndex();
                if (currentIndex !== this.state.manualEventIndex) {
                    this.model.setCurrentEventIndex(this.state.manualEventIndex);
                    hasChanged = true;
                }
            }
            
            // Update display if event changed or this is the first update
            if (hasChanged || !this.state.lastUpdateTime) {
                await this.updateDisplay();
                this.state.lastUpdateTime = new Date();
            }
            
            // Update status badge
            this.view.updateStatusBadge(this.model.getConferenceStatus());
            
            // Update cross-display sync data
            this.updateSyncData();
            
            // Track performance
            const endTime = performance.now();
            this.trackPerformance(endTime - startTime);
            
            this.state.updateCount++;
            this.state.errorCount = 0; // Reset error count on successful update
            
        } catch (error) {
            throw new Error(`Update cycle failed: ${error.message}`);
        }
    }

    /**
     * Update all display elements with error handling
     */
    async updateDisplay() {
        try {
            const agendaData = this.model.getAgendaData();
            const currentIndex = this.state.isRealTimeMode ? 
                this.model.getCurrentEventIndex() : 
                this.state.manualEventIndex;
            
            const currentEvent = this.model.getCurrentEvent();
            const status = this.model.getConferenceStatus();
            const nextEvent = this.model.getNextEvent();
            const timeUntilNext = this.model.getTimeUntilNextEvent();
            
            // Update views based on display type
            if (this.view.isDisplay1) {
                this.view.renderAgendaList(agendaData, currentIndex);
            }
            
            if (this.view.isDisplay2) {
                this.view.renderCurrentEvent(currentEvent, status, nextEvent, timeUntilNext);
            }
            
        } catch (error) {
            console.error('Error updating display:', error);
            this.view.showError('Display update failed. System will retry automatically.');
            throw error;
        }
    }

    /**
     * Toggle between real-time and manual mode
     */
    toggleRealTimeMode() {
        console.log(`Toggle requested. Current mode: ${this.state.isRealTimeMode ? 'Real-Time' : 'Manual'}`);
        
        this.state.isRealTimeMode = !this.state.isRealTimeMode;
        
        if (this.state.isRealTimeMode) {
            console.log('Switched to Real-Time Mode');
            // Reset to current real-time event
            this.model.resetToRealTime();
            this.state.manualEventIndex = -1;
        } else {
            console.log('Switched to Manual Mode');
            // Set manual index to current real-time index or 0 if none
            this.state.manualEventIndex = Math.max(0, this.model.getCurrentEventIndex());
        }
        
        // Force immediate update to reflect mode change
        this.performUpdate().catch(error => {
            this.handleUpdateError(error);
        });
        
        console.log(`Mode switch complete. New mode: ${this.state.isRealTimeMode ? 'Real-Time' : 'Manual'}`);
    }

    /**
     * Handle previous button click
     */
    handlePrevious() {
        if (!this.state.isRealTimeMode) {
            const agendaData = this.model.getAgendaData();
            if (this.state.manualEventIndex > 0) {
                this.state.manualEventIndex--;
                this.performUpdate().catch(error => {
                    this.handleUpdateError(error);
                });
                console.log(`Manual navigation: Previous event (${this.state.manualEventIndex})`);
            }
        } else {
            console.log('Previous button disabled in Real-Time mode');
        }
    }

    /**
     * Handle next button click
     */
    handleNext() {
        if (!this.state.isRealTimeMode) {
            const agendaData = this.model.getAgendaData();
            if (this.state.manualEventIndex < agendaData.length - 1) {
                this.state.manualEventIndex++;
                this.performUpdate().catch(error => {
                    this.handleUpdateError(error);
                });
                console.log(`Manual navigation: Next event (${this.state.manualEventIndex})`);
            }
        } else {
            console.log('Next button disabled in Real-Time mode');
        }
    }

    /**
     * Handle agenda item click
     */
    handleItemClick(index) {
        if (!this.state.isRealTimeMode) {
            this.state.manualEventIndex = index;
            this.performUpdate().catch(error => {
                this.handleUpdateError(error);
            });
            console.log(`Manual navigation: Jump to event ${index}`);
        } else {
            console.log('Item click disabled in Real-Time mode');
        }
    }

    /**
     * Handle keyboard input
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
                if (!this.state.isRealTimeMode) {
                    this.toggleRealTimeMode();
                }
                break;
            case 't':
            case 'T':
                e.preventDefault();
                this.toggleRealTimeMode();
                break;
            case 'p':
            case 'P':
                e.preventDefault();
                if (this.view.previewMode.active) {
                    this.view.stopPreviewHighlighting();
                } else {
                    this.view.startPreviewHighlighting();
                }
                break;
            case 's':
            case 'S':
                e.preventDefault();
                this.logSystemStatus();
                break;
        }
    }

    /**
     * Set up cross-display synchronization
     */
    setupCrossDisplaySync() {
        if (!this.syncConfig.enabled) return;

        // Broadcast current state for other displays
        setInterval(() => {
            this.updateSyncData();
        }, this.syncConfig.frequency);

        // Listen for sync updates from other displays
        window.addEventListener('storage', (e) => {
            if (e.key === this.syncConfig.storageKey && e.newValue) {
                this.processSyncData(e.newValue);
            }
        });

        console.log('Cross-display synchronization enabled');
    }

    /**
     * Update synchronization data
     */
    updateSyncData() {
        if (!this.syncConfig.enabled) return;

        try {
            const syncData = {
                currentEventIndex: this.model.getCurrentEventIndex(),
                conferenceStatus: this.model.getConferenceStatus(),
                currentTime: this.model.getCurrentRealTime(),
                currentDay: this.model.getCurrentDay(),
                timestamp: Date.now(),
                source: this.view.isDisplay1 ? 'display1' : 'display2'
            };

            localStorage.setItem(this.syncConfig.storageKey, JSON.stringify(syncData));
        } catch (error) {
            console.warn('Failed to update sync data:', error);
        }
    }

    /**
     * Process incoming sync data
     */
    processSyncData(syncDataString) {
        try {
            const syncData = JSON.parse(syncDataString);
            
            // Only sync if data is recent (within 3 seconds)
            if (Date.now() - syncData.timestamp < 3000) {
                // Update model to match sync data
                if (syncData.currentDay !== this.model.getCurrentDay()) {
                    this.model.setCurrentDay(syncData.currentDay);
                }
                
                this.model.setCurrentEventIndex(syncData.currentEventIndex);
                this.model.conferenceStatus = syncData.conferenceStatus;
                
                // Force display update
                this.updateDisplay().catch(error => {
                    console.warn('Failed to update display from sync:', error);
                });
            }
        } catch (error) {
            console.warn('Failed to process sync data:', error);
        }
    }

    /**
     * Initialize performance monitoring
     */
    initializePerformanceMonitoring() {
        // Log performance statistics every 30 seconds
        setInterval(() => {
            this.logPerformanceStats();
        }, 30000);
    }

    /**
     * Track performance metrics
     */
    trackPerformance(duration) {
        this.performance.lastUpdateDuration = duration;
        this.performance.updateHistory.push(duration);
        
        // Keep only last 100 measurements
        if (this.performance.updateHistory.length > 100) {
            this.performance.updateHistory = this.performance.updateHistory.slice(-100);
        }
        
        // Calculate average
        this.performance.averageUpdateDuration = 
            this.performance.updateHistory.reduce((a, b) => a + b, 0) / this.performance.updateHistory.length;
    }

    /**
     * Handle update errors with retry logic
     */
    async handleUpdateError(error) {
        this.state.errorCount++;
        console.error(`Update error (${this.state.errorCount}/${this.updateConfig.maxErrors}):`, error);
        
        if (this.state.errorCount >= this.updateConfig.maxErrors) {
            console.error('Maximum update errors reached, stopping updates');
            this.pauseUpdates();
            this.view.showError('Multiple update failures detected. Please refresh the page.');
            return;
        }
        
        // Retry after delay
        if (this.timers.retryTimeout) {
            clearTimeout(this.timers.retryTimeout);
        }
        
        this.timers.retryTimeout = setTimeout(() => {
            console.log('Retrying update after error...');
            this.performUpdate().catch(retryError => {
                console.error('Retry failed:', retryError);
            });
        }, this.updateConfig.retryDelay);
    }

    /**
     * Handle critical errors
     */
    handleCriticalError(error) {
        console.error('Critical system error:', error);
        this.state.isRunning = false;
        this.pauseUpdates();
        
        this.view.showError('Critical system error occurred. Please refresh the page and contact support if the issue persists.');
        
        // Attempt recovery after delay
        setTimeout(() => {
            console.log('Attempting system recovery...');
            this.restart();
        }, 10000);
    }

    /**
     * Handle global errors
     */
    handleGlobalError(error) {
        console.error('Global error caught:', error);
        
        // Don't restart for minor errors
        if (error.name === 'TypeError' || error.name === 'ReferenceError') {
            console.log('Attempting to continue after global error...');
        } else {
            this.handleUpdateError(error);
        }
    }

    /**
     * Get comprehensive system status
     */
    getSystemStatus() {
        const modelDiagnostics = this.model.getSystemDiagnostics();
        const viewStatus = this.view.getViewStatus();
        
        return {
            // Controller state
            controller: {
                isRunning: this.state.isRunning,
                mode: this.state.isRealTimeMode ? 'real-time' : 'manual',
                updateCount: this.state.updateCount,
                errorCount: this.state.errorCount,
                lastUpdateTime: this.state.lastUpdateTime
            },
            
            // Performance metrics
            performance: {
                lastUpdateDuration: Math.round(this.performance.lastUpdateDuration * 100) / 100,
                averageUpdateDuration: Math.round(this.performance.averageUpdateDuration * 100) / 100,
                updatesPerSecond: Math.round(1000 / this.updateConfig.frequency * 100) / 100
            },
            
            // Model and view status
            model: modelDiagnostics,
            view: viewStatus,
            
            // Sync status
            sync: {
                enabled: this.syncConfig.enabled,
                frequency: this.syncConfig.frequency
            }
        };
    }

    /**
     * Log system status to console
     */
    logSystemStatus() {
        const status = this.getSystemStatus();
        console.log('=== MODERN NITC 2025 SYSTEM STATUS ===');
        console.table(status.controller);
        console.table(status.performance);
        console.log('Model Status:', status.model);
        console.log('View Status:', status.view);
        console.log('=====================================');
    }

    /**
     * Log performance statistics
     */
    logPerformanceStats() {
        if (this.performance.updateHistory.length > 0) {
            const avgDuration = Math.round(this.performance.averageUpdateDuration * 100) / 100;
            const maxDuration = Math.round(Math.max(...this.performance.updateHistory) * 100) / 100;
            const minDuration = Math.round(Math.min(...this.performance.updateHistory) * 100) / 100;
            
            console.log(`Performance: Avg ${avgDuration}ms, Min ${minDuration}ms, Max ${maxDuration}ms (${this.state.updateCount} updates)`);
        }
    }

    /**
     * Log available control functions
     */
    logAvailableControls() {
        console.log('\n=== MODERN CONSOLE COMMANDS ===');
        console.log('getStatus()          - Get comprehensive system status');
        console.log('getSchedule()        - View full conference schedule');
        console.log('setDay("Day 1")      - Change conference day');
        console.log('restartSystem()      - Restart entire system');
        console.log('startPreview()       - Start event highlighting (Display 1)');
        console.log('stopPreview()        - Stop event highlighting');
        console.log('toggleSync()         - Toggle cross-display sync');
        console.log('');
        console.log('=== KEYBOARD SHORTCUTS ===');
        console.log('T                    - Toggle Real-Time/Manual mode');
        console.log('P                    - Toggle Preview highlighting');
        console.log('S                    - Show system status');
        console.log('← →                  - Navigate events (Manual mode)');
        console.log('');
        console.log('=== SYSTEM INFO ===');
        console.log('- Real-time Sri Lankan time tracking');
        console.log('- Automatic day detection and switching');
        console.log('- Cross-display synchronization enabled');
        console.log('- Enhanced error handling and recovery');
        console.log('- Performance monitoring active');
        console.log('================================\n');
    }

    /**
     * Restart the entire system
     */
    restart() {
        console.log('Restarting Modern NITC 2025 system...');
        
        this.cleanup();
        
        // Reset state
        this.state = {
            isRealTimeMode: true,
            manualEventIndex: -1,
            isRunning: false,
            lastUpdateTime: null,
            updateCount: 0,
            errorCount: 0,
            maxErrors: 5
        };
        
        // Reinitialize
        setTimeout(() => {
            this.initialize();
        }, 1000);
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        // Clear all timers
        if (this.timers.updateInterval) {
            clearInterval(this.timers.updateInterval);
            this.timers.updateInterval = null;
        }
        
        if (this.timers.retryTimeout) {
            clearTimeout(this.timers.retryTimeout);
            this.timers.retryTimeout = null;
        }
        
        // Cleanup view resources
        this.view.cleanup();
        
        this.state.isRunning = false;
        
        console.log('Modern conference system cleaned up');
    }
}

// Global functions for console access - Fixed and Enhanced
if (typeof window !== 'undefined') {
    // Status and system functions
    window.getStatus = function() {
        if (window.conferenceApp && window.conferenceApp.getSystemStatus) {
            const status = window.conferenceApp.getSystemStatus();
            console.log('=== MODERN SYSTEM STATUS ===');
            console.table(status.controller);
            console.log('Model Status:', status.model);
            console.log('View Status:', status.view);
            console.log('=============================');
            return status;
        } else {
            console.log('System not ready - conferenceApp not found');
            return null;
        }
    };

    // Schedule function
    window.getSchedule = function() {
        if (window.conferenceApp && window.conferenceApp.model && window.conferenceApp.model.getAgendaData) {
            const agenda = window.conferenceApp.model.getAgendaData();
            console.log('=== CONFERENCE SCHEDULE ===');
            agenda.forEach((item, index) => {
                console.log(`${index + 1}. ${item.displayTime} - ${item.title} (${item.duration} min)`);
                if (item.speaker) console.log(`   Speaker: ${item.speaker}`);
            });
            console.log('===========================');
            return agenda;
        } else {
            console.log('Schedule not available - model not initialized');
            return null;
        }
    };

    // Day setting function
    window.setDay = function(dayName) {
        if (window.conferenceApp && window.conferenceApp.model && window.conferenceApp.model.setCurrentDay) {
            const success = window.conferenceApp.model.setCurrentDay(dayName);
            if (success && window.conferenceApp.view && window.conferenceApp.view.updateConferenceDay) {
                window.conferenceApp.view.updateConferenceDay(dayName);
                console.log(`Conference day updated to: ${dayName}`);
            } else if (!success) {
                console.log(`Failed to set day to: ${dayName}`);
            }
            return success;
        } else {
            console.log('setDay not available - system not initialized');
            return false;
        }
    };

    // System restart function
    window.restartSystem = function() {
        if (window.conferenceApp && window.conferenceApp.restart) {
            console.log('Restarting conference system...');
            window.conferenceApp.restart();
        } else {
            console.log('Restart not available - reloading page instead');
            window.location.reload();
        }
    };

    // Sync toggle function
    window.toggleSync = function() {
        if (window.conferenceApp && window.conferenceApp.syncConfig) {
            window.conferenceApp.syncConfig.enabled = !window.conferenceApp.syncConfig.enabled;
            console.log(`Cross-display sync ${window.conferenceApp.syncConfig.enabled ? 'enabled' : 'disabled'}`);
            return window.conferenceApp.syncConfig.enabled;
        } else {
            console.log('Sync toggle not available');
            return false;
        }
    };

    // Debug system function
    window.debugSystem = function() {
        console.log('=== SYSTEM DEBUG INFO ===');
        console.log('conferenceApp exists:', !!window.conferenceApp);
        if (window.conferenceApp) {
            console.log('- controller exists:', !!window.conferenceApp.controller);
            console.log('- model exists:', !!window.conferenceApp.model);
            console.log('- view exists:', !!window.conferenceApp.view);
            console.log('- state:', window.conferenceApp.state);
        }
        console.log('=========================');
    };
}

console.log('ModernConferenceController loaded with enhanced error handling and performance monitoring');