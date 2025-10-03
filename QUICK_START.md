# NITC 2025 Conference System - Quick Start Guide

## 🚀 **Quick Start (5 Minutes)**

### **For Testing (Right Now):**
```bash
# 1. Start display server
cd /Users/theconqueror/Documents/Works/CSSL/NITC-Agenda
python3 start-server.py

# 2. Open in browser
http://localhost:8080/display2-test-simple.html
```

### **For Conference Day:**

#### **Camera Server (Conference Hall Computer):**
```bash
# 1. Setup camera server
cd NITC-Camera-Server
node setup.js

# 2. Start camera server
node server.js
```

#### **Display System (Display Computer):**
```bash
# 1. Setup display system
cd NITC-Agenda
node setup-display.js

# 2. Start display server
python3 start-server.py

# 3. Open conference display
http://localhost:8080/display2-conference.html
```

## 📋 **File Overview**

### **Test Files:**
- `display2-test-simple.html` - Simple test with laptop camera
- `display2-test.html` - Full test with laptop camera
- `start-server.py` - Python server for testing

### **Conference Files:**
- `display2-conference.html` - Conference hall camera display
- `NITC-Camera-Server/server.js` - Camera streaming server
- `NITC-Camera-Server/setup.js` - Camera server setup

### **Setup Scripts:**
- `start-conference-system.js` - Unified startup script
- `setup-display.js` - Display system configuration
- `CONFERENCE_DAY_SETUP.md` - Complete documentation

## 🎯 **Common Commands**

### **Start Everything:**
```bash
node start-conference-system.js
```

### **Test Camera:**
```bash
# Camera server
http://localhost:8000/test-stream.html

# Display system
http://localhost:8080/display2-test-simple.html
```

### **Conference Display:**
```bash
http://localhost:8080/display2-conference.html
```

## 🔧 **Configuration**

### **Camera Server IP:**
Edit `display2-conference.html`:
```javascript
const CONFIG = {
    SERVER_URL: 'http://192.168.1.100:8000', // Your camera server IP
    // ... rest of config
};
```

### **Camera Settings:**
Edit `NITC-Camera-Server/server.js`:
```javascript
const CONFIG = {
  CAMERA_INDEX: '0',        // Camera device
  RESOLUTION: '1280x720',   // Video resolution
  QUALITY: 'ultrafast',     // Quality preset
  // ... rest of config
};
```

## 🆘 **Troubleshooting**

### **Camera Not Working:**
1. Check camera connection
2. Run `node setup.js` in camera server directory
3. Verify FFmpeg installation: `ffmpeg -version`

### **Display Not Loading:**
1. Check server is running: `curl http://localhost:8080`
2. Verify camera server: `curl http://localhost:8000`
3. Check browser console for errors

### **Network Issues:**
1. Verify both computers on same network
2. Test connectivity: `ping [camera-server-ip]`
3. Check firewall settings

## 📞 **Support**

- **Documentation:** `CONFERENCE_DAY_SETUP.md`
- **Test System:** Use `display2-test-simple.html`
- **Conference System:** Use `display2-conference.html`
- **Setup Help:** Run `node start-conference-system.js`

---

*For complete setup instructions, see `CONFERENCE_DAY_SETUP.md`*
