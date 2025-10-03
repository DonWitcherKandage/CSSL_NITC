# NITC 2025 Conference Day Setup Guide

## 📋 **Complete Setup Documentation**

This guide covers everything needed to set up the live camera streaming system for the NITC 2025 conference day.

---

## 🎯 **Overview**

The system consists of two main components:
1. **Camera Server** - Captures conference hall camera and streams it
2. **Display System** - Shows the live stream on conference displays

---

## 🏢 **Hardware Requirements**

### **Camera Server Computer (Conference Hall)**
- **Computer:** Laptop or desktop with USB/HDMI input
- **Camera:** USB webcam or HDMI camera
- **Network:** Connected to same network as display computers
- **Software:** Node.js, FFmpeg

### **Display Computers**
- **Computer:** Any computer with modern browser
- **Network:** Connected to same network as camera server
- **Software:** Modern web browser (Chrome, Firefox, Safari, Edge)

---

## 🔧 **Step 1: Camera Server Setup**

### **1.1 Install Required Software**

#### **Install Node.js:**
```bash
# Download from https://nodejs.org/
# Or use package manager:
# macOS: brew install node
# Ubuntu: sudo apt install nodejs npm
```

#### **Install FFmpeg:**
```bash
# macOS:
brew install ffmpeg

# Ubuntu/Debian:
sudo apt update
sudo apt install ffmpeg

# Windows:
# Download from https://ffmpeg.org/download.html
```

### **1.2 Setup Camera Server**

#### **Navigate to Camera Server Directory:**
```bash
cd /Users/theconqueror/Documents/Works/CSSL/NITC-Camera-Server
```

#### **Install Dependencies:**
```bash
npm install
```

#### **Test FFmpeg Installation:**
```bash
ffmpeg -version
```

#### **Test Camera Detection:**
```bash
# List available cameras
ffmpeg -f avfoundation -list_devices true -i ""
```

### **1.3 Configure Camera Server**

#### **Update server.js for your camera:**
```javascript
// In NITC-Camera-Server/server.js
// Change camera index if needed (usually 0 for first camera)
'-i', '0', // Change this number if camera is not detected
```

#### **Start Camera Server:**
```bash
node server.js
```

#### **Expected Output:**
```
Conference Camera Server running on http://localhost:8000
HLS stream available at: http://localhost:8000/media/live/conference/index.m3u8
Starting camera stream...
```

### **1.4 Test Camera Server**

#### **Open Test Page:**
```
http://localhost:8000/test-stream.html
```

#### **Verify:**
- Camera feed appears
- No error messages in console
- Stream status shows "LIVE"

---

## 🖥️ **Step 2: Display System Setup**

### **2.1 Prepare Display Files**

#### **Copy Files to Display Computer:**
- `display2-conference.html`
- `styles.css`
- `model.js`
- `view.js`
- `controller.js`
- `app-display2.js`

### **2.2 Configure Network Settings**

#### **Find Camera Server IP Address:**
```bash
# On camera server computer:
ifconfig | grep inet
# Note the IP address (e.g., 192.168.1.100)
```

#### **Update Display Configuration:**
Edit `display2-conference.html` and update the stream URL:
```javascript
// Change this line:
hls.loadSource('http://localhost:8000/media/live/conference/index.m3u8');

// To this (replace with actual IP):
hls.loadSource('http://192.168.1.100:8000/media/live/conference/index.m3u8');
```

### **2.3 Start Display System**

#### **Option A: Using Python Server (Recommended)**
```bash
cd /path/to/display/files
python3 start-server.py
```

#### **Option B: Using Node.js Server**
```bash
npx http-server -p 8080 -c-1
```

#### **Open Display:**
```
http://localhost:8080/display2-conference.html
```

---

## 🌐 **Step 3: Network Configuration**

### **3.1 Same Network Setup (Recommended)**

#### **Requirements:**
- All computers on same WiFi network
- Camera server accessible from display computers
- Port 8000 open on camera server

#### **Test Connectivity:**
```bash
# From display computer, test connection:
curl http://192.168.1.100:8000/media/live/conference/index.m3u8
```

### **3.2 Different Networks Setup**

#### **Option A: Port Forwarding**
1. Configure router to forward port 8000 to camera server
2. Use public IP address in display configuration
3. Update stream URL in `display2-conference.html`

#### **Option B: VPN Setup**
1. Set up VPN connection between networks
2. Use VPN IP addresses for communication
3. Update stream URLs accordingly

---

## 🔧 **Step 4: Camera Configuration**

### **4.1 Camera Selection**

#### **USB Webcam:**
- Connect via USB
- Usually detected as device 0
- Test with: `ffmpeg -f avfoundation -i 0 -t 5 test.mp4`

#### **HDMI Camera:**
- Connect via HDMI capture card
- May be device 1 or higher
- Test with: `ffmpeg -f avfoundation -i 1 -t 5 test.mp4`

### **4.2 Camera Settings**

#### **Resolution and Quality:**
```javascript
// In server.js, adjust these settings:
'-c:v', 'libx264',           // Video codec
'-preset', 'ultrafast',      // Encoding speed
'-tune', 'zerolatency',     // Low latency
'-f', 'hls',                // Output format
'-hls_time', '2',           // Segment duration
```

#### **Quality Settings:**
- **High Quality:** `-preset medium -crf 23`
- **Low Latency:** `-preset ultrafast -tune zerolatency`
- **Balanced:** `-preset fast -crf 28`

---

## 🚀 **Step 5: Conference Day Execution**

### **5.1 Pre-Conference Setup (30 minutes before)**

#### **Camera Server:**
1. Start camera server: `node server.js`
2. Verify camera feed: `http://[server-ip]:8000/test-stream.html`
3. Check network connectivity
4. Note server IP address

#### **Display System:**
1. Start display server: `python3 start-server.py`
2. Open display: `http://localhost:8080/display2-conference.html`
3. Verify stream connection
4. Test full-screen mode

### **5.2 During Conference**

#### **Monitoring:**
- Check camera server console for errors
- Monitor display for stream quality
- Have backup plan ready

#### **Troubleshooting:**
- If stream stops: Restart camera server
- If display fails: Refresh browser
- If network issues: Check connectivity

### **5.3 Post-Conference**

#### **Cleanup:**
1. Stop camera server (Ctrl+C)
2. Stop display server (Ctrl+C)
3. Disconnect camera
4. Archive logs if needed

---

## 🛠️ **Troubleshooting Guide**

### **Common Issues and Solutions**

#### **Camera Not Detected:**
```bash
# Check available devices:
ffmpeg -f avfoundation -list_devices true -i ""

# Test specific device:
ffmpeg -f avfoundation -i 0 -t 5 test.mp4
```

#### **Stream Not Loading:**
1. Check server is running: `curl http://localhost:8000`
2. Verify camera is working: `http://localhost:8000/test-stream.html`
3. Check network connectivity
4. Verify firewall settings

#### **Poor Video Quality:**
1. Adjust camera settings in `server.js`
2. Check camera positioning
3. Verify lighting conditions
4. Test different resolution settings

#### **Network Issues:**
1. Ping between computers: `ping 192.168.1.100`
2. Check port accessibility: `telnet 192.168.1.100 8000`
3. Verify firewall settings
4. Test with different network

---

## 📱 **Mobile/Tablet Setup (Optional)**

### **For Mobile Displays:**
1. Use same network configuration
2. Open `display2-conference.html` in mobile browser
3. Enable full-screen mode
4. Test touch interactions

---

## 🔒 **Security Considerations**

### **Network Security:**
- Use private network (not public WiFi)
- Enable firewall on all computers
- Consider VPN for remote access
- Monitor network traffic

### **Access Control:**
- Limit access to authorized personnel
- Use strong passwords for network
- Monitor system access
- Keep software updated

---

## 📊 **Performance Monitoring**

### **Key Metrics:**
- Stream latency (should be < 5 seconds)
- Video quality (check for artifacts)
- Network bandwidth usage
- Server CPU usage

### **Monitoring Tools:**
- Browser developer tools
- Network monitoring software
- System resource monitors
- FFmpeg logs

---

## 🆘 **Emergency Procedures**

### **Backup Plans:**
1. **Camera fails:** Use laptop camera as backup
2. **Network fails:** Use local display mode
3. **Server fails:** Restart with minimal configuration
4. **Display fails:** Use alternative display method

### **Quick Recovery:**
1. **Restart camera server:** `node server.js`
2. **Restart display:** Refresh browser
3. **Check connections:** Verify all cables
4. **Test basic functionality:** Use test pages

---

## 📞 **Support Contacts**

### **Technical Support:**
- Primary: [Your contact information]
- Backup: [Secondary contact]
- Emergency: [Emergency contact]

### **Equipment Contacts:**
- Camera equipment: [Contact]
- Network support: [Contact]
- Venue technical: [Contact]

---

## 📝 **Checklist for Conference Day**

### **Pre-Conference (1 hour before):**
- [ ] Camera server running
- [ ] Camera feed working
- [ ] Display system ready
- [ ] Network connectivity verified
- [ ] Backup plans ready
- [ ] All cables connected
- [ ] Test full system

### **During Conference:**
- [ ] Monitor camera server
- [ ] Check display quality
- [ ] Monitor network
- [ ] Be ready for troubleshooting
- [ ] Document any issues

### **Post-Conference:**
- [ ] Stop all servers
- [ ] Disconnect equipment
- [ ] Archive logs
- [ ] Clean up files
- [ ] Document lessons learned

---

## 🎯 **Success Criteria**

### **System Working When:**
- Camera feed appears on display
- Stream latency < 5 seconds
- Video quality is acceptable
- No error messages in console
- Network connectivity stable
- All displays showing same content

### **Ready for Conference When:**
- All tests pass
- Backup plans in place
- Team trained on troubleshooting
- Equipment properly configured
- Network stable and secure

---

*This documentation should be reviewed and updated before each conference. Keep this guide accessible during the event for quick reference.*
