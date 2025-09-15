/* ============================================================================
   APPLICATION INITIALIZATION - DISPLAY 1 (AGENDA LIST)
   ============================================================================ */

// Global controller instance
let conferenceApp = null;

/**
 * Initialize particles for display 1 only
 */
async function initializeParticles() {
    try {
        // Check if tsParticles is available
        if (typeof tsParticles === 'undefined') {
            throw new Error('tsParticles library not loaded');
        }

        // Slow-motion particles configuration
        const slowMotionConfig = {
            particles: {
                color: {
                    value: "#ffffff"
                },
                links: {
                    color: "#ffffff",
                    opacity: 0.3,
                    width: 1,
                    distance: 120
                },
                number: {
                    value: 50
                },
                opacity: {
                    value: 0.4,
                    random: {
                        enable: true,
                        minimumValue: 0.1
                    }
                },
                size: {
                    value: 2,
                    random: {
                        enable: true,
                        minimumValue: 1
                    }
                },
                move: {
                    enable: true,
                    speed: 0.2, // Very slow for slow-motion effect
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: {
                        default: "bounce"
                    }
                }
            },
            background: {
                color: {
                    value: "transparent"
                }
            },
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "grab"
                    },
                    onClick: {
                        enable: false
                    }
                },
                modes: {
                    grab: {
                        distance: 100,
                        links: {
                            opacity: 0.6
                        }
                    }
                }
            },
            detectRetina: true,
            fpsLimit: 30 // Lower FPS for smoother slow motion
        };

        // Load particles for display 1 only
        await tsParticles.load("tsparticles-left", slowMotionConfig);
        
        console.log('✅ Slow-motion particles initialized successfully for Display 1');
        
        // Hide particle error message if it exists
        const particleError = document.getElementById('particleError');
        if (particleError) {
            particleError.style.display = 'none';
        }
        
    } catch (error) {
        console.error('❌ Failed to initialize particles:', error.message);
        
        // Show error message in debug panel
        const particleError = document.getElementById('particleError');
        if (particleError) {
            particleError.style.display = 'block';
            particleError.textContent = `Particles failed: ${error.message}`;
        }
        
        // Retry after 5 seconds
        setTimeout(() => {
            console.log('🔄 Retrying particle initialization...');
            initializeParticles();
        }, 5000);
    }
}

/**
 * Initialize the application when page loads
 */
function initializeConferenceApp() {
    try {
        console.log('🌟 NITC 2025 Conference Real-Time Display System - DISPLAY 1 (AGENDA)');
        console.log('================================================');
        
        // Create the controller (which creates model and view)
        conferenceApp = new ConferenceController();
        
        // Set up cross-display synchronization
        setupCrossDisplaySync();
        
        // Initialize particles after a short delay to ensure DOM is ready
        setTimeout(() => {
            initializeParticles();
        }, 1000);
        
        // Log system information
        console.log('📍 Location: Sri Lanka (UTC+5:30)');
        console.log('⏰ Schedule: 12:00 PM - 6:00 PM');
        console.log('🔄 Mode: Real-Time Automatic');
        console.log('🎨 Design: NITC 2025 Conference Theme with Slow-Motion Particles');
        console.log('📺 Display: 1 - Agenda List');
        console.log('================================================');
        
        // Log available controls
        setTimeout(() => {
            logAvailableControls();
        }, 3000);
        
    } catch (error) {
        console.error('❌ Critical error initializing conference app:', error);
        
        // Show error in the UI if possible
        const errorContainer = document.getElementById('agendaList');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div style="color: white; text-align: center; padding: 50px;">
                    <h2>System Error</h2>
                    <p>Failed to initialize NITC 2025 conference display system</p>
                    <div style="margin-top: 20px;">
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
 * Set up cross-display synchronization
 */
function setupCrossDisplaySync() {
    // Broadcast current state for cross-display sync
    setInterval(() => {
        if (conferenceApp) {
            const status = conferenceApp.getSystemStatus();
            localStorage.setItem('nitc2025_sync', JSON.stringify({
                currentEventIndex: status.currentEvent ? conferenceApp.model.getCurrentEventIndex() : -1,
                conferenceStatus: status.conferenceStatus,
                currentTime: status.currentTime,
                timestamp: Date.now()
            }));
        }
    }, 1000);
}

/**
 * Log available control functions to console
 */
function logAvailableControls() {
    console.log('\n🎮 Available Console Commands:');
    console.log('=====================================');
    console.log('hideButtons()         - Hide control buttons for production');
    console.log('showButtons()         - Show control buttons for testing');
    console.log('getStatus()           - Get current system status');
    console.log('getSchedule()         - View full conference schedule');
    console.log('restartSystem()       - Restart the entire system');
    console.log('setDay("Day 1")       - Change conference day display');
    console.log('hideParticles()       - Hide particle effects');
    console.log('showParticles()       - Show particle effects');
    console.log('');
    console.log('⌨️ Keyboard Shortcuts:');
    console.log('H                     - Toggle control buttons');
    console.log('D                     - Toggle debug panel');
    console.log('R                     - Reset to real-time mode');
    console.log('← →                   - Manual navigation (testing only)');
    console.log('');
    console.log('ℹ️ System Information:');
    console.log('- System automatically tracks real Sri Lankan time');
    console.log('- Events change based on actual conference schedule');
    console.log('- Manual overrides reset to real-time after 30 seconds');
    console.log('- Debug panel shows current status and timing');
    console.log('- Custom PNG logo support (place nitc-logo.png in folder)');
    console.log('- Slow-motion particles effect enabled');
    console.log('- Cross-display sync enabled with Display 2');
    console.log('=====================================\n');
}

/**
 * Hide control buttons (for production deployment)
 */
function hideButtons() {
    if (conferenceApp) {
        conferenceApp.hideControlButtons();
        
        const debugPanel = document.getElementById('debugPanel');
        if (debugPanel) {
            debugPanel.style.display = 'none';
        }
        
        console.log('🎬 Production mode activated - controls hidden');
        console.log('✨ Clean display ready for conference presentation');
    } else {
        console.log('⚠️ System not ready yet. Please wait for initialization.');
    }
}

/**
 * Show control buttons (for testing)
 */
function showButtons() {
    if (conferenceApp) {
        conferenceApp.showControlButtons();
        
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
 * Hide particle effects
 */
function hideParticles() {
    const leftParticles = document.getElementById('tsparticles-left');
    if (leftParticles) leftParticles.style.display = 'none';
    console.log('🎭 Particles hidden');
}

/**
 * Show particle effects
 */
function showParticles() {
    const leftParticles = document.getElementById('tsparticles-left');
    if (leftParticles) leftParticles.style.display = 'block';
    console.log('✨ Particles shown');
}

/**
 * Get current system status
 */
function getStatus() {
    if (conferenceApp) {
        const status = conferenceApp.getSystemStatus();
        console.log('📊 NITC 2025 Conference System Status - Display 1:');
        console.log('====================================');
        console.log(`🕒 Current Time: ${status.currentTime} (Sri Lankan)`);
        console.log(`🎯 Conference Status: ${status.conferenceStatus}`);
        console.log(`📍 Current Event: ${status.currentEvent ? status.currentEvent.title : 'None'}`);
        console.log(`⭐ Next Event: ${status.nextEvent ? status.nextEvent.title : 'None'}`);
        console.log(`⏱️ Time Until Next: ${status.timeUntilNext > 0 ? status.timeUntilNext + ' minutes' : 'N/A'}`);
        console.log(`🔄 System Running: ${status.isRunning ? 'Yes' : 'No'}`);
        console.log('====================================');
        return status;
    } else {
        console.log('⚠️ System not ready yet. Please wait for initialization.');
        return null;
    }
}

/**
 * Restart the entire system
 */
function restartSystem() {
    if (conferenceApp) {
        console.log('🔄 Restarting NITC 2025 conference system...');
        conferenceApp.restart();
        
        setTimeout(() => {
            initializeParticles();
        }, 2000);
        
        console.log('✅ System restarted successfully');
    } else {
        console.log('🚀 Starting system for the first time...');
        initializeConferenceApp();
    }
}

/**
 * Get conference schedule for reference
 */
function getSchedule() {
    if (conferenceApp) {
        const agenda = conferenceApp.model.getAgendaData();
        console.log('📅 NITC 2025 Conference Schedule (Sri Lankan Time):');
        console.log('=================================================');
        agenda.forEach((item, index) => {
            console.log(`${index + 1}. ${item.displayTime} - ${item.title} (${item.duration} min)`);
        });
        console.log('=================================================');
        return agenda;
    } else {
        console.log('⚠️ System not ready yet. Please wait for initialization.');
        return null;
    }
}

/**
 * Change conference day display
 */
function setDay(dayName) {
    if (conferenceApp) {
        conferenceApp.view.updateConferenceDay(dayName);
        console.log(`📅 Conference day updated to: ${dayName}`);
    } else {
        console.log('⚠️ System not ready yet. Please wait for initialization.');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeConferenceApp);
} else {
    initializeConferenceApp();
}

// Handle page errors
window.addEventListener('error', (event) => {
    console.error('💥 Unhandled error:', event.error);
});

// Expose global functions
window.hideButtons = hideButtons;
window.showButtons = showButtons;
window.getStatus = getStatus;
window.getSchedule = getSchedule;
window.restartSystem = restartSystem;
window.setDay = setDay;
window.hideParticles = hideParticles;
window.showParticles = showParticles;

// Expose the controller for advanced debugging
Object.defineProperty(window, 'conferenceApp', {
    get: () => conferenceApp,
    enumerable: true
});

// Monitor system health
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
        console.log('✅ NITC 2025 Conference Display 1 is ready!');
        console.log('💡 Type getStatus() to see current status');
        console.log('🎭 Type hideButtons() for production mode');
        console.log('📅 Type setDay("Day 1") to change conference day');
        console.log('✨ Type hideParticles() to disable particle effects');
        console.log('🎯 System is now tracking real Sri Lankan time automatically');
    }
}, 5000);