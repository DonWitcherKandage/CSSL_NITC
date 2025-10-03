#!/usr/bin/env node

/**
 * NITC 2025 Conference Display Setup Script
 * 
 * This script helps configure the display system for your specific setup.
 * Run this to configure the display for your camera server.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🖥️  NITC 2025 Conference Display Setup');
console.log('=====================================');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupDisplay() {
  console.log('\n📡 Camera Server Configuration');
  console.log('Please provide the camera server details:\n');
  
  // Get camera server IP
  const serverIP = await askQuestion('Enter camera server IP address (e.g., 192.168.1.100): ');
  const serverPort = await askQuestion('Enter camera server port (default: 8000): ') || '8000';
  
  const serverUrl = `http://${serverIP}:${serverPort}`;
  
  console.log(`\n📺 Display Configuration`);
  console.log(`Camera server URL: ${serverUrl}`);
  console.log(`Stream URL: ${serverUrl}/media/live/conference/index.m3u8`);
  
  // Update display2-conference.html
  const conferenceFile = path.join(__dirname, 'display2-conference.html');
  
  if (fs.existsSync(conferenceFile)) {
    let content = fs.readFileSync(conferenceFile, 'utf8');
    
    // Update the server URL in the configuration
    content = content.replace(
      /SERVER_URL: 'http:\/\/localhost:8000'/,
      `SERVER_URL: '${serverUrl}'`
    );
    
    fs.writeFileSync(conferenceFile, content);
    console.log('✅ Updated display2-conference.html');
  } else {
    console.log('❌ display2-conference.html not found');
  }
  
  // Create a configuration file
  const config = {
    cameraServer: {
      ip: serverIP,
      port: serverPort,
      url: serverUrl,
      streamUrl: `${serverUrl}/media/live/conference/index.m3u8`
    },
    display: {
      testMode: 'display2-test-simple.html',
      conferenceMode: 'display2-conference.html'
    },
    setup: {
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  };
  
  const configFile = path.join(__dirname, 'display-config.json');
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  console.log('✅ Created display-config.json');
  
  console.log('\n🎯 Setup Summary');
  console.log('================');
  console.log(`📡 Camera Server: ${serverUrl}`);
  console.log(`📺 Stream URL: ${serverUrl}/media/live/conference/index.m3u8`);
  console.log(`🧪 Test Page: ${serverUrl}/test-stream.html`);
  console.log('\n📋 Next Steps:');
  console.log('1. Start the camera server on the camera computer');
  console.log('2. Start this display server: python3 start-server.py');
  console.log('3. Open display2-conference.html in your browser');
  console.log('4. Test the connection');
  
  console.log('\n✅ Display setup completed!');
  console.log('📖 For detailed instructions, see CONFERENCE_DAY_SETUP.md');
  
  rl.close();
}

setupDisplay().catch(error => {
  console.error('❌ Setup failed:', error);
  rl.close();
  process.exit(1);
});
