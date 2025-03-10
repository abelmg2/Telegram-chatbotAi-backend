import { promises as dns } from 'dns';

// Force Node.js to use Google DNS servers
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function testDNS() {
  try {
    const records = await dns.resolveTxt("chatbot.bqrs2.mongodb.net");
    console.log("TXT records:", records);
  } catch (error) {
    console.error("DNS resolution error:", error);
  }
}

testDNS();

