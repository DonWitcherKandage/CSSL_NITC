#!/usr/bin/env node

/**
 * NITC 2025 Conference System Startup Script
 * 
 * This script provides a unified way to start the entire conference system.
 * It can start the camera server, display server, or both.
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎥 NITC 2025 Conference System Startup');
console.log('=====================================');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

function showMenu() {
  console.log('\n📋 Available Options:');
  console.log('1. Start Camera Server (Conference Hall)');
  console.log('2. Start Display System (Display Computer)');
  console.log('3. Start Both (Development/Testing)');
  console.log('4. Setup Camera Server');
  console.log('5. Setup Display System');
  console.log('6. Test System');
  console.log('7. Exit');
}

function startCameraServer() {
  console.log('\n🎥 Starting Camera Server...');
  
  const cameraServerPath = path.join(__dirname, '..', 'NITC-Camera-Server');
  
  if (!fs.existsSync(cameraServerPath)) {
    console.log('❌ Camera server directory not found');
    return null;
  }
  
  const serverProcess = spawn('node', ['server.js'], {
    cwd: cameraServerPath,
    stdio: 'inherit'
  });
  
  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start camera server:', error);
  });
  
  return serverProcess;
}

function startDisplayServer() {
  console.log('\n🖥️  Starting Display Server...');
  
  const displayProcess = spawn('python3', ['start-server.py'], {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  displayProcess.on('error', (error) => {
    console.error('❌ Failed to start display server:', error);
  });
  
  return displayProcess;
}

function testSystem() {
  console.log('\n🧪 Testing System...');
  
  // Test if camera server is running
  exec('curl -s http://localhost:8000', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Camera server not responding');
    } else {
      console.log('✅ Camera server is running');
    }
  });
  
  // Test if display server is running
  exec('curl -s http://localhost:8080', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Display server not responding');
    } else {
      console.log('✅ Display server is running');
    }
  });
  
  console.log('\n📋 Test URLs:');
  console.log('Camera server: http://localhost:8000');
  console.log('Display server: http://localhost:8080');
  console.log('Test stream: http://localhost:8000/test-stream.html');
  console.log('Conference display: http://localhost:8080/display2-conference.html');
}

async function runSetup() {
  const choice = await askQuestion('\nChoose setup option (1-7): ');
  
  switch (choice) {
    case '1':
      console.log('\n🎥 Starting Camera Server...');
      const cameraProcess = startCameraServer();
      if (cameraProcess) {
        console.log('✅ Camera server started');
        console.log('📡 Server running on http://localhost:8000');
        console.log('📺 Stream available at http://localhost:8000/media/live/conference/index.m3u8');
        console.log('🧪 Test page: http://localhost:8000/test-stream.html');
        console.log('\nPress Ctrl+C to stop the server');
      }
      break;
      
    case '2':
      console.log('\n🖥️  Starting Display System...');
      const displayProcess = startDisplayServer();
      console.log('✅ Display server started');
      console.log('📡 Server running on http://localhost:8080');
      console.log('📺 Conference display: http://localhost:8080/display2-conference.html');
      console.log('🧪 Test display: http://localhost:8080/display2-test-simple.html');
      console.log('\nPress Ctrl+C to stop the server');
      break;
      
    case '3':
      console.log('\n🚀 Starting Both Servers...');
      const cameraProc = startCameraServer();
      setTimeout(() => {
        const displayProc = startDisplayServer();
        console.log('✅ Both servers started');
        console.log('📡 Camera server: http://localhost:8000');
        console.log('📡 Display server: http://localhost:8080');
        console.log('📺 Conference display: http://localhost:8080/display2-conference.html');
        console.log('\nPress Ctrl+C to stop all servers');
      }, 2000);
      break;
      
    case '4':
      console.log('\n🔧 Setting up Camera Server...');
      const setupCamera = spawn('node', ['setup.js'], {
        cwd: path.join(__dirname, '..', 'NITC-Camera-Server'),
        stdio: 'inherit'
      });
      break;
      
    case '5':
      console.log('\n🔧 Setting up Display System...');
      const setupDisplay = spawn('node', ['setup-display.js'], {
        cwd: __dirname,
        stdio: 'inherit'
      });
      break;
      
    case '6':
      testSystem();
      break;
      
    case '7':
      console.log('\n👋 Goodbye!');
      rl.close();
      process.exit(0);
      break;
      
    default:
      console.log('\n❌ Invalid choice. Please try again.');
      await runSetup();
  }
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down servers...');
  rl.close();
  process.exit(0);
});

// Main execution
async function main() {
  console.log('Welcome to the NITC 2025 Conference System!');
  console.log('This script helps you start and configure the camera streaming system.');
  
  while (true) {
    showMenu();
    await runSetup();
    
    const continueChoice = await askQuestion('\nWould you like to continue? (y/n): ');
    if (continueChoice.toLowerCase() !== 'y') {
      console.log('\n👋 Goodbye!');
      break;
    }
  }
  
  rl.close();
}

main().catch(error => {
  console.error('❌ Error:', error);
  rl.close();
  process.exit(1);
});
