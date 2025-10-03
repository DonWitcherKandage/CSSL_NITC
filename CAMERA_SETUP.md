# NITC 2025 Conference Camera Streaming Setup

This document explains how to use the live camera streaming features for the conference display.

## Files Created

### Display Files
- `display2-test.html` - For testing with laptop camera
- `display2-conference.html` - For conference hall camera streaming
- `display2.html` - Original display (unchanged)

### Camera Server
- Updated `NITC-Camera-Server/server.js` with improved error handling
- `NITC-Camera-Server/test-stream.html` - Simple test page for camera server

## Usage Instructions

### For Testing (Laptop Camera)

1. Open `display2-test.html` in your browser
2. Allow camera access when prompted
3. The laptop's front camera will be used for live streaming
4. Perfect for testing the display layout and functionality

### For Conference (Conference Hall Camera)

1. **Start the Camera Server:**
   ```bash
   cd NITC-Camera-Server
   npm install
   node server.js
   ```

2. **Test the Camera Server:**
   - Open `http://localhost:8000/test-stream.html` in your browser
   - Verify the camera stream is working

3. **Use Conference Display:**
   - Open `display2-conference.html` in your browser
   - The display will connect to the camera server automatically

## Technical Details

### Laptop Camera (Test Mode)
- Uses browser's `getUserMedia()` API
- Direct camera access without server
- Good for testing and development

### Conference Hall Camera
- Uses FFmpeg to capture camera and create HLS stream
- HLS.js library for cross-browser compatibility
- Server runs on `localhost:8000`
- Stream available at: `http://localhost:8000/media/live/conference/index.m3u8`

## Troubleshooting

### Laptop Camera Issues
- Ensure camera permissions are granted in browser
- Check if camera is being used by another application
- Try refreshing the page

### Conference Camera Issues
- Verify FFmpeg is installed: `ffmpeg -version`
- Check if camera server is running: `http://localhost:8000`
- Look at server console for error messages
- Test with `test-stream.html` first

### Browser Compatibility
- Chrome/Firefox: Uses HLS.js library
- Safari: Uses native HLS support
- Edge: Uses HLS.js library

## Server Requirements

- Node.js
- FFmpeg installed and accessible in PATH
- Camera device available (for conference mode)

## Notes

- The original `display2.html` remains unchanged
- All existing functionality is preserved
- Camera streaming is additive to the existing display system
- Test mode is perfect for setup and rehearsal
- Conference mode is for the actual event
