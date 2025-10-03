#!/usr/bin/env python3
"""
Simple HTTP server to serve the NITC Agenda files
This allows camera access to work properly (requires HTTP/HTTPS)
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow camera access
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

if __name__ == "__main__":
    # Change to the directory containing the HTML files
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print(f"Starting NITC Agenda server on http://localhost:{PORT}")
    print("Camera access requires HTTP/HTTPS, not file:// protocol")
    print("\nAvailable pages:")
    print(f"  - Test Camera: http://localhost:{PORT}/display2-test.html")
    print(f"  - Conference Camera: http://localhost:{PORT}/display2-conference.html")
    print(f"  - Original Display: http://localhost:{PORT}/display2.html")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            # Auto-open the test page
            webbrowser.open(f'http://localhost:{PORT}/display2-test.html')
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"Port {PORT} is already in use. Trying port {PORT + 1}...")
            PORT += 1
            with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
                webbrowser.open(f'http://localhost:{PORT}/display2-test.html')
                httpd.serve_forever()
        else:
            print(f"Error starting server: {e}")
            sys.exit(1)
