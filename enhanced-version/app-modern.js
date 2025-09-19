/* ============================================================================
   MODERN CONFERENCE APPLICATION - MAIN ENTRY POINT
   Auto-detects display type or runs unified dual-screen mode
   ============================================================================ */

/**
 * Main Conference Application Class
 * Handles initialization, display detection, and application lifecycle
 */
class ModernConferenceApp {
    constructor() {
        this.controller = null;
        this.displayType = null;
        this.isInitialized = false;
        this.config = {
            autoDetectDisplay: true,
            enableCrossSync: true,
            enableDebugMode: false,
            enablePreviewMode: false,
            updateFrequency: 1000
        };
        
        // Performance and health monitoring
        this.health = {
            startTime: Date.now(),
            initializationTime: null,
            errorCount: 0,
            warningCount: 0,
            lastHealthCheck: null
        };
        
        console.log('ModernConferenceApp instance created');
    }

    /**
     * Main initialization method
     */
    async initialize() {
        try {
            console.log('🚀 Initializing NITC 2025 Modern Conference Display System...');
            console.log('================================================================');
            
            // Detect display type
            this.detectDisplayType();
            
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Initialize based on display type
            await this.initializeForDisplayType();
            
            // Set up global features
            this.setupGlobalFeatures();
            
            // Health monitoring
            this.startHealthMonitoring();
            
            this.isInitialized = true;
            this.health.initializationTime = Date.now() - this.health.startTime;
            
            console.log('✅ System initialized successfully');
            console.log(`📺 Display Type: ${this.displayType}`);
            console.log(`⏱️ Initialization Time: ${this.health.initializationTime}ms`);
            console.log('================================================================');
            
            // Log available commands
            setTimeout(() => {
                this.logGlobalCommands();
            }, 2000);
            
        } catch (error) {
            console.error('❌ Critical initialization error:', error);
            this.handleCriticalError(error);
        }
    }

    /**
     * Detect display type based on DOM elements
     */
    detectDisplayType() {
        const hasAgendaContainer = !!document.getElementById('agendaContainer');
        const hasEventDisplay = !!document.querySelector('.event-display');
        const hasCurrentEventCard = !!document.getElementById('currentEventCard');
        const hasEventShowcase = !!document.getElementById('eventShowcase');
        
        if (hasAgendaContainer && hasCurrentEventCard) {
            this.displayType = 'Display 1 (Agenda)';
        } else if (hasEventDisplay && hasEventShowcase) {
            this.displayType = 'Display 2 (Details)';
        } else if (hasAgendaContainer && hasEventDisplay) {
            this.displayType = 'Unified (Both Screens)';
        } else {
            this.displayType = 'Unknown';
            console.warn('Could not detect display type from DOM elements');
        }
        
        console.log(`🔍 Display type detected: ${this.displayType}`);
    }

    /**
     * Wait for DOM to be fully ready
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                const handleLoad = () => {
                    document.removeEventListener('DOMContentLoaded', handleLoad);
                    window.removeEventListener('load', handleLoad);
                    resolve();
                };
                
                document.addEventListener('DOMContentLoaded', handleLoad);
                window.addEventListener('load', handleLoad);
            }
        });
    }

    /**
     * Initialize application based on detected display type
     */
    async initializeForDisplayType() {
        try {
            // Create controller which will create model and view
            this.controller = new ModernConferenceController();
            
            // Wait for controller to be ready
            await this.waitForControllerReady();
            
            // Configure based on display type
            switch (this.displayType) {
                case 'Display 1 (Agenda)':
                    await this.configureDisplay1();
                    break;
                    
                case 'Display 2 (Details)':
                    await this.configureDisplay2();
                    break;
                    
                case 'Unified (Both Screens)':
                    await this.configureUnifiedDisplay();
                    break;
                    
                default:
                    console.warn('Unknown display type, using default configuration');
                    break;
            }
            
        } catch (error) {
            throw new Error(`Failed to initialize for display type: ${error.message}`);
        }
    }

    /**
     * Wait for controller to be ready
     */
    waitForControllerReady() {
        return new Promise((resolve) => {
            const checkReady = () => {
                if (this.controller && this.controller.state && this.controller.state.isRunning) {
                    resolve();
                } else {
                    setTimeout(checkReady, 100);
                }
            };
            checkReady();
        });
    }

    /**
     * Configure for Display 1 (Agenda)
     */
    async configureDisplay1() {
        console.log('⚙️ Configuring for Display 1 (Agenda Screen)...');
        
        // Enable preview mode capability
        this.config.enablePreviewMode = true;
        
        // Set up agenda-specific features
        if (this.controller.view && this.controller.view.isDisplay1) {
            // Add enhanced keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.key === 'P' || e.key === 'p') {
                    e.preventDefault();
                    this.togglePreviewMode();
                }
            });
            
            console.log('📋 Display 1 configuration complete');
            console.log('- Preview mode available (Press P)');
            console.log('- Agenda list with real-time updates');
            console.log('- Cross-display sync broadcasting');
        }
    }

    /**
     * Configure for Display 2 (Details)
     */
    async configureDisplay2() {
        console.log('⚙️ Configuring for Display 2 (Event Details Screen)...');
        
        // Set up details-specific features
        if (this.controller.view && this.controller.view.isDisplay2) {
            // Initialize enhanced widgets
            this.initializeDisplay2Widgets();
            
            console.log('📄 Display 2 configuration complete');
            console.log('- Event details with rich descriptions');
            console.log('- Interactive widgets enabled');
            console.log('- Cross-display sync receiving');
        }
    }

    /**
     * Configure for unified display (both screens)
     */
    async configureUnifiedDisplay() {
        console.log('⚙️ Configuring for Unified Display (Both Screens)...');
        
        // Enable all features
        this.config.enablePreviewMode = true;
        
        // Set up both display features
        await this.configureDisplay1();
        await this.configureDisplay2();
        
        console.log('🖥️ Unified display configuration complete');
        console.log('- Both agenda and details active');
        console.log('- All features enabled');
    }

    /**
     * Initialize Display 2 specific widgets
     */
    initializeDisplay2Widgets() {
        const widgets = document.querySelectorAll('.widget');
        
        widgets.forEach((widget, index) => {
            // Add staggered entrance animation
            widget.style.animationDelay = `${index * 0.2}s`;
            widget.classList.add('widget-entrance');
            
            // Add click interaction
            widget.addEventListener('click', () => {
                this.handleWidgetClick(widget);
            });
        });
    }

    /**
     * Handle widget click interactions
     */
    handleWidgetClick(widget) {
        const widgetTitle = widget.querySelector('.widget-title')?.textContent;
        
        // Add click feedback
        widget.style.transform = 'scale(0.95)';
        setTimeout(() => {
            widget.style.transform = '';
        }, 150);
        
        console.log(`Widget clicked: ${widgetTitle}`);
    }

    /**
     * Set up global features available to all displays
     */
    setupGlobalFeatures() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'F1':
                    e.preventDefault();
                    this.showHelp();
                    break;
                    
                case 'F2':
                    e.preventDefault();
                    this.toggleDebugMode();
                    break;
                    
                case 'F5':
                    // Allow refresh but log it
                    console.log('🔄 Page refresh requested');
                    break;
                    
                case 'Escape':
                    e.preventDefault();
                    this.exitFullscreen();
                    break;
            }
        });
        
        // Global error handling
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.handleGlobalError(event.reason);
        });
        
        // Page visibility handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('📴 Page hidden - optimizing performance');
            } else {
                console.log('👁️ Page visible - resuming full operation');
            }
        });
        
        // Setup cross-display synchronization
        if (this.config.enableCrossSync) {
            this.setupCrossDisplaySync();
        }
        
        console.log('🌐 Global features configured');
    }

    /**
     * Start health monitoring
     */
    startHealthMonitoring() {
        setInterval(() => {
            this.performHealthCheck();
        }, 30000); // Every 30 seconds
        
        console.log('🏥 Health monitoring started');
    }

    /**
     * Perform system health check
     */
    performHealthCheck() {
        this.health.lastHealthCheck = new Date();
        
        if (!this.controller || !this.controller.state.isRunning) {
            this.health.errorCount++;
            console.warn('⚠️ Health check failed - controller not running');
            
            if (this.health.errorCount >= 3) {
                console.error('💔 Multiple health check failures - attempting restart');
                this.restart();
            }
        } else {
            this.health.errorCount = 0; // Reset on successful check
        }
    }

    /**
     * Set up cross-display synchronization
     */
    setupCrossDisplaySync() {
        // This is handled by the controller, but we can add app-level sync here
        console.log('🔄 Cross-display synchronization enabled');
    }

    /**
     * Toggle preview mode (for Display 1)
     */
    togglePreviewMode() {
        if (this.controller && this.controller.view) {
            if (this.controller.view.previewMode && this.controller.view.previewMode.active) {
                this.controller.view.stopPreviewHighlighting();
                console.log('🎭 Preview mode stopped');
            } else {
                this.controller.view.startPreviewHighlighting();
                console.log('🎭 Preview mode started - events will highlight every 12 seconds');
            }
        }
    }

    /**
     * Toggle debug mode
     */
    toggleDebugMode() {
        this.config.enableDebugMode = !this.config.enableDebugMode;
        
        if (this.config.enableDebugMode) {
            this.showDebugInfo();
            console.log('🐛 Debug mode enabled');
        } else {
            this.hideDebugInfo();
            console.log('🐛 Debug mode disabled');
        }
    }

    /**
     * Show debug information
     */
    showDebugInfo() {
        let debugPanel = document.getElementById('globalDebugPanel');
        
        if (!debugPanel) {
            debugPanel = document.createElement('div');
            debugPanel.id = 'globalDebugPanel';
            debugPanel.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(15, 23, 42, 0.95);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                font-family: monospace;
                font-size: 0.8rem;
                z-index: 9999;
                max-width: 300px;
                border: 1px solid #3b82f6;
            `;
            document.body.appendChild(debugPanel);
        }
        
        const status = this.getSystemStatus();
        debugPanel.innerHTML = `
            <div style="color: #3b82f6; font-weight: bold; margin-bottom: 0.5rem;">SYSTEM DEBUG</div>
            <div>Display: ${this.displayType}</div>
            <div>Uptime: ${Math.round((Date.now() - this.health.startTime) / 1000)}s</div>
            <div>Errors: ${this.health.errorCount}</div>
            <div>Controller: ${status.controller ? 'OK' : 'ERROR'}</div>
            <div>Last Check: ${this.health.lastHealthCheck ? this.health.lastHealthCheck.toLocaleTimeString() : 'Never'}</div>
        `;
        
        debugPanel.style.display = 'block';
    }

    /**
     * Hide debug information
     */
    hideDebugInfo() {
        const debugPanel = document.getElementById('globalDebugPanel');
        if (debugPanel) {
            debugPanel.style.display = 'none';
        }
    }

    /**
     * Show help information
     */
    showHelp() {
        console.log('\n=== NITC 2025 MODERN DISPLAY HELP ===');
        console.log('Display Type:', this.displayType);
        console.log('');
        console.log('GLOBAL SHORTCUTS:');
        console.log('F1 - Show this help');
        console.log('F2 - Toggle debug mode');
        console.log('F5 - Refresh page');
        console.log('Esc - Exit fullscreen');
        console.log('');
        console.log('DISPLAY-SPECIFIC:');
        if (this.displayType.includes('Display 1')) {
            console.log('P - Toggle preview highlighting');
            console.log('T - Toggle real-time/manual mode');
            console.log('← → - Navigate events (manual mode)');
        }
        if (this.displayType.includes('Display 2')) {
            console.log('Click widgets for interactions');
            console.log('Hover effects on all elements');
        }
        console.log('');
        console.log('CONSOLE COMMANDS:');
        console.log('app.getStatus() - System status');
        console.log('app.restart() - Restart system');
        console.log('app.getHealth() - Health metrics');
        console.log('=====================================\n');
    }

    /**
     * Exit fullscreen mode
     */
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        console.log('📺 Exited fullscreen mode');
    }

    /**
     * Handle global errors
     */
    handleGlobalError(error) {
        this.health.errorCount++;
        console.error('🚨 Global error caught:', error);
        
        // Don't restart for minor errors
        if (this.health.errorCount < 5) {
            console.log('⚠️ Error logged, system continuing...');
        } else {
            console.error('💥 Too many errors, restarting system...');
            this.restart();
        }
    }

    /**
     * Handle critical errors
     */
    handleCriticalError(error) {
        console.error('💥 Critical error:', error);
        
        // Show error in UI
        const errorHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(239, 68, 68, 0.95);
                color: white;
                padding: 2rem;
                border-radius: 12px;
                text-align: center;
                z-index: 10000;
                max-width: 400px;
            ">
                <h2>System Error</h2>
                <p>NITC 2025 Display System encountered a critical error</p>
                <p style="margin-top: 1rem; font-size: 0.9em; opacity: 0.9;">
                    ${error.message}
                </p>
                <button onclick="location.reload()" style="
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background: white;
                    color: #ef4444;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    Refresh Page
                </button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', errorHTML);
    }

    /**
     * Get comprehensive system status
     */
    getSystemStatus() {
        return {
            app: {
                displayType: this.displayType,
                isInitialized: this.isInitialized,
                config: this.config,
                uptime: Date.now() - this.health.startTime
            },
            health: this.health,
            controller: this.controller ? this.controller.getSystemStatus() : null
        };
    }

    /**
     * Get health metrics
     */
    getHealth() {
        return {
            ...this.health,
            uptime: Date.now() - this.health.startTime,
            status: this.health.errorCount < 3 ? 'Healthy' : 'Warning'
        };
    }

    /**
     * Restart the entire application
     */
    restart() {
        console.log('🔄 Restarting NITC 2025 Modern Display System...');
        
        // Cleanup existing controller
        if (this.controller) {
            this.controller.cleanup();
        }
        
        // Reset health metrics
        this.health.errorCount = 0;
        this.health.warningCount = 0;
        this.health.startTime = Date.now();
        
        // Reinitialize after short delay
        setTimeout(() => {
            this.initialize();
        }, 1000);
    }

    /**
     * Log global commands
     */
    logGlobalCommands() {
        console.log('\n=== GLOBAL APPLICATION COMMANDS ===');
        console.log('app.getStatus()      - Complete system status');
        console.log('app.getHealth()      - Health metrics');
        console.log('app.restart()        - Restart entire system');
        console.log('app.toggleDebugMode() - Toggle debug display');
        console.log('app.togglePreviewMode() - Toggle preview (Display 1)');
        console.log('app.showHelp()       - Show help information');
        console.log('');
        console.log('=== CONTROLLER COMMANDS ===');
        console.log('getStatus()          - Controller status');
        console.log('getSchedule()        - Conference schedule');
        console.log('setDay("Day 1")      - Change conference day');
        console.log('=====================================\n');
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        if (this.controller) {
            this.controller.cleanup();
        }
        
        // Remove debug panel
        const debugPanel = document.getElementById('globalDebugPanel');
        if (debugPanel) {
            debugPanel.remove();
        }
        
        console.log('🧹 Application cleanup completed');
    }
}

/* ============================================================================
   APPLICATION INITIALIZATION AND GLOBAL SETUP
   ============================================================================ */

// Global application instance
let app = null;

/**
 * Main initialization function
 */
async function initializeModernApp() {
    try {
        // Create and initialize the application
        app = new ModernConferenceApp();
        await app.initialize();
        
        // Expose to global scope for debugging
        window.app = app;
        window.conferenceApp = app.controller;
        
        console.log('🎉 NITC 2025 Modern Conference Display System Ready!');
        console.log('Type "app.showHelp()" for available commands');
        
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
    }
}

/**
 * Initialize when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModernApp);
} else {
    initializeModernApp();
}

/**
 * Global cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
    if (app) {
        app.cleanup();
    }
});

/**
 * Global functions for console access
 */
window.initializeModernApp = initializeModernApp;

console.log('ModernConferenceApp loaded - waiting for DOM ready...');