/* ============================================================================
   APPLICATION INITIALIZATION AND GLOBAL FUNCTIONS
   ============================================================================ */

// Global controller instance
let conferenceApp = null;

/**
 * Initialize the application when page loads
 */
function initializeConferenceApp() {
    try {
        console.log('🌟 Conference Real-Time Display System');
        console.log('======================================');
        
        // Create the controller (which creates model and view)
        conferenceApp = new ConferenceController();
        
        // Log system information
        console.log('📍 Location: Sri Lanka (UTC+5:30)');
        console.log('⏰ Schedule: 12:00 PM - 5:00 PM');
        console.log('🔄 Mode: Real-Time Automatic');
        console.log('======================================');
        
        // Log available controls
        setTimeout(() => {
            logAvailableControls();
        }, 3000);
        
    } catch (error) {
        console.error('❌ Critical error initializing conference app:', error);
        
        // Show error in the UI if possible
        const errorContainer = document.getElementById('currentDetail');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="no-current-event">
                    <h2>System Error</h2>
                    <p>Failed to initialize conference display system</p>
                    <div class="conference-info">
                        <h4>Error Details</h4>
                        <p>🔄 Please refresh the page</p>
                        <p>🌐 Check your internet connection</p>
                        <p>📞 Contact technical support</p>
                        <p style="font-family: monospace; font-size: 0.8em; margin-top: 10px;">
                            Error: ${error.message}
                        </p>
                    </div>
                </div>
            `;
        }
    }
}

/**
 * Log available control functions to console
 */
function logAvailableControls() {
    console.log('\n🎮 Available Console Commands:');
    console.log('=====================================');
    console.log('hideButtons()      - Hide control buttons for production');
    console.log('showButtons()      - Show control buttons for testing');
    console.log('getStatus()        - Get current system status');
    console.log('restartSystem()    - Restart the entire system');
    console.log('');
    console.log('⌨️  Keyboard Shortcuts:');
    console.log('H                  - Toggle control buttons');
    console.log('D                  - Toggle debug panel');
    console.log('R                  - Reset to real-time mode');
    console.log('← →                - Manual navigation (testing only)');
    console.log('');
    console.log('ℹ️  System Information:');
    console.log('- System automatically tracks real Sri Lankan time');
    console.log('- Events change based on actual conference schedule');
    console.log('- Manual overrides reset to real-time after 30 seconds');
    console.log('- Debug panel shows current status and timing');
    console.log('=====================================\n');
}

/**
 * Hide control buttons (for production deployment)
 * Usage: hideButtons()
 */
function hideButtons() {
    if (conferenceApp) {
        conferenceApp.hideControlButtons();
        
        // Also hide debug panel in production
        const debugPanel = document.getElementById('debugPanel');
        if (debugPanel) {
            debugPanel.style.display = 'none';
        }
        
        console.log('🎬 Production mode activated - controls hidden');
    } else {
        console.log('⚠️ System not ready yet. Please wait for initialization.');
    }
}

/**
 * Show control buttons (for testing)
 * Usage: showButtons()
 */
function showButtons() {
    if (conferenceApp) {
        conferenceApp.showControlButtons();
        
        // Also show debug panel for testing
        const debugPanel = document.getElementById('debugPanel');
        if (debugPanel) {
            debugPanel.style.display = 'block';
        }
        
        console.log('🧪 Testing mode activated - controls visible');
    } else {
        console.log('⚠️ System not ready yet. Please wait for initialization.');
    }
}

/**
 * Get current system status
 * Usage: getStatus()
 */
function getStatus() {
    if (conferenceApp) {
        const status = conferenceApp.getSystemStatus();
        console.log('📊 Current System Status:');
        console.log('========================');
        console.log(`🕒 Current Time: ${status.currentTime} (Sri Lankan)`);
        console.log(`🎯 Conference Status: ${status.conferenceStatus}`);
        console.log(`📍 Current Event: ${status.currentEvent ? status.currentEvent.title : 'None'}`);
        console.log(`⏭️ Next Event: ${status.nextEvent ? status.nextEvent.title : 'None'}`);
        console.log(`⏱️ Time Until Next: ${status.timeUntilNext > 0 ? status.timeUntilNext + ' minutes' : 'N/A'}`);
        console.log(`🔄 System Running: ${status.isRunning ? 'Yes' : 'No'}`);
        console.log('========================');
        return status;
    } else {
        console.log('⚠️ System not ready yet. Please wait for initialization.');
        return null;
    }
}

/**
 * Restart the entire system
 * Usage: restartSystem()
 */
function restartSystem() {
    if (conferenceApp) {
        console.log('🔄 Restarting conference system...');
        conferenceApp.restart();
        console.log('✅ System restarted successfully');
    } else {
        console.log('🚀 Starting system for the first time...');
        initializeConferenceApp();
    }
}

/**
 * Force update display (useful for debugging)
 * Usage: forceUpdate()
 */
function forceUpdate() {
    if (conferenceApp) {
        console.log('🔄 Forcing display update...');
        conferenceApp.performRealTimeUpdate();
        console.log('✅ Display updated');
    } else {
        console.log('⚠️ System not ready yet. Please wait for initialization.');
    }
}

/**
 * Get conference schedule for reference
 * Usage: getSchedule()
 */
function getSchedule() {
    if (conferenceApp) {
        const agenda = conferenceApp.model.getAgendaData();
        console.log('📅 Conference Schedule (Sri Lankan Time):');
        console.log('========================================');
        agenda.forEach((item, index) => {
            console.log(`${index + 1}. ${item.displayTime} - ${item.title} (${item.duration} min)`);
        });
        console.log('========================================');
        return agenda;
    } else {
        console.log('⚠️ System not ready yet. Please wait for initialization.');
        return null;
    }
}

/* ============================================================================
   EVENT LISTENERS AND APPLICATION STARTUP
   ============================================================================ */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeConferenceApp);
} else {
    // DOM already loaded, initialize immediately
    initializeConferenceApp();
}

// Handle page errors
window.addEventListener('error', (event) => {
    console.error('💥 Unhandled error:', event.error);
    
    // Try to show error in UI
    const errorContainer = document.getElementById('currentDetail');
    if (errorContainer && !conferenceApp) {
        errorContainer.innerHTML = `
            <div class="no-current-event">
                <h2>System Error</h2>
                <p>An unexpected error occurred</p>
                <div class="conference-info">
                    <h4>Recovery Options</h4>
                    <p>🔄 Try: restartSystem()</p>
                    <p>🌐 Or refresh the page</p>
                </div>
            </div>
        `;
    }
});

// Expose global functions for console access
window.hideButtons = hideButtons;
window.showButtons = showButtons;
window.getStatus = getStatus;
window.restartSystem = restartSystem;
window.forceUpdate = forceUpdate;
window.getSchedule = getSchedule;

// Also expose the controller for advanced debugging
Object.defineProperty(window, 'conferenceApp', {
    get: () => conferenceApp,
    enumerable: true
});

/* ============================================================================
   SYSTEM HEALTH MONITORING
   ============================================================================ */

// Monitor system health every 30 seconds
setInterval(() => {
    if (conferenceApp) {
        const status = conferenceApp.getSystemStatus();
        if (!status.isRunning) {
            console.warn('⚠️ System health check: Updates not running, attempting restart...');
            conferenceApp.restart();
        }
    }
}, 30000);

// Log system startup completion
setTimeout(() => {
    if (conferenceApp) {
        console.log('✅ Conference Real-Time Display System is ready!');
        console.log('💡 Type getStatus() to see current status');
        console.log('🎭 Type hideButtons() for production mode');
    }
}, 5000);