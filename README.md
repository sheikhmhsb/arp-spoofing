npm install raw-socket pcap node-net-ping

**Explanation:**
Get Local IP Address: Determines the IP address of the local machine on the specified network interface.
Scan Network: Uses node-net-ping to perform a ping sweep across the network and identify active hosts.
Create ARP Packet: Constructs an ARP reply packet.
Send ARP Packet: Sends the ARP packet to each identified host, tricking them into associating the attacker's MAC address with the gateway's IP address.
Capture and Log Packets: Uses pcap to capture and log the packets received by the attacker's machine.

**Notes:**
Permissions: Running a packet spoofing script usually requires administrative or root permissions.
Ethics and Legality: Ensure you have explicit permission to perform ARP spoofing and packet capturing. Unauthorized ARP spoofing and packet capturing are illegal and unethical.

**Conclusion**
This script demonstrates how to scan a network to identify active hosts, perform ARP spoofing on them, and capture and log the packets using Node.js. Use this knowledge responsibly and only in environments where you have explicit authorization to conduct such activities. If you are interested in learning more about network security, consider using ethical hacking platforms or participating in cybersecurity courses and competitions.
