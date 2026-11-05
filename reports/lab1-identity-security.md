# Lab 1 Identity and Security

Course: CPS 3498  
Student: [Name]  
Instructor: Dr. Bin Hu  
Date: [Date]

## Description

This lab examines how a computer uses IP settings to communicate on a local network and beyond it. It includes IP address and subnet information, gateway and DNS settings, ping and traceroute results, and ARP entries.

Computer and operating system: [Device and OS version]  
Location: [Campus building or town]  
Connection and ISP: [Wi-Fi or Ethernet; provider]

## Procedure and Notes

### 1. IP configuration

- Commands or settings used: [Windows: `ipconfig`, `ipconfig /all`; macOS: Network settings, `ifconfig`, `route -n get default`, `scutil --dns`]
- IP address: [Observed value]
- Subnet mask or prefix: [Observed value]
- Default gateway: [Observed value]
- DNS server: [Observed value]
- MAC address: [Observed value]
- DHCP status: [Automatic or manual]
- Change and restoration: [Original value, approved change, result, and how original settings were restored]

The subnet mask identifies network and host bits. On Windows, `ipconfig /all` gives detailed settings and `ipconfig /renew` requests a DHCP configuration.

### 2. Ping and traceroute

- Ping target: [Gateway or DNS address]
- Four reply times: [Observed values]
- TTL: [Observed value]
- Result or error: [Replies, timeout, or other message]
- Kean traceroute intermediate hops: [Observed count]
- Kean slowest responding hop: [Hop and time]
- Google traceroute intermediate hops: [Observed count]
- Google slowest responding hop: [Hop and time]
- Comparison of five traces to each target: [Route changes and possible reasons]
- Network topology: [List or draw the observed hop order]

Ping checks reachability and round-trip time. TTL limits how many hops a packet can traverse. A reply alone does not prove that the expected computer sent it.

### 3. ARP cache

- Entry before clearing: [IP and MAC]
- Command and result: [What was used and what appeared]
- Entry after new traffic: [IP and MAC]

`arp -a` shows local IPv4-to-MAC mappings. New traffic can repopulate a cleared entry.

## Results and Report

[Summarize what was observed, any problems, and how they were resolved. State any campus or off-campus limits. Do not substitute example values for actual measurements.]

## Reference and Acknowledgement

- CPS 3498, *Lab 1 Identity and Security* course handout.
- [Add other sources and assistance used.]
