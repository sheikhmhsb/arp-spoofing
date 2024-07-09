npm install raw-socket pcap node-net-ping

**Step 1: Install mitmproxy**

Download mitmproxy: Go to the mitmproxy releases page and download the Windows installer.

Run the Installer: Run the downloaded installer and follow the instructions to install mitmproxy.

Add mitmproxy to PATH: Ensure that the installer adds mitmproxy to your system's PATH. If it does not, you can add it manually:

Right-click on 'This PC' or 'My Computer' and select 'Properties'.
Click on 'Advanced system settings'.
Click on the 'Environment Variables' button.
In the 'System variables' section, find the 'Path' variable and click 'Edit'.
Add the path to the mitmproxy installation directory (e.g., C:\Program Files\mitmproxy).

Verify Installation:
Open a new Command Prompt or PowerShell window and run:
mitmproxy --version
You should see version information if mitmproxy is installed correctly.

**Step 2: Run mitmproxy**
Once mitmproxy is installed and accessible from the command line, you can run it with the following command:

mitmproxy -T --host -p 8080

**Step 3: Configure Your Node.js Script**

Now, ensure your Node.js script is set up to redirect traffic to mitmproxy. Here is a complete script for scanning the network, performing ARP spoofing, and redirecting traffic:

**Notes:**
Replace Placeholders: Replace YOUR_INTERFACE_NAME, YOUR_GATEWAY_IP, and YOUR_MAC_ADDRESS with actual values corresponding to your network interface, gateway IP, and MAC address.

Run with Administrator Privileges: You need to run the script with administrator privileges to perform ARP spoofing and packet capturing.

**Configuring Your Browser**
To view the decrypted HTTPS traffic, configure your browser to use the mitmproxy:

**Open Browser Settings:**
For Chrome: Settings > Advanced > System > Open your computer's proxy settings.
For Firefox: Settings > General > Network Settings > Settings.
Set Manual Proxy Configuration:
HTTP Proxy: localhost
Port: 8080
HTTPS Proxy: localhost
Port: 8080
Install mitmproxy Certificate:

Access http://mitm.it in your browser and follow the instructions to install the mitmproxy CA certificate.

Run mitmproxy:

mitmproxy -T --host -p 8080

Run the Node.js Script:

node arp_spoof.js

Browse the Web: Open your browser and navigate to any website. The traffic will be intercepted and displayed by mitmproxy
