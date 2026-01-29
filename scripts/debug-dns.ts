
const dns = require('dns');

const hostDirect = 'ep-tiny-lab-a1hzd77s.ap-southeast-1.aws.neon.tech';
const hostPooled = 'ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech';

console.log(`Looking up Direct: ${hostDirect}`);
dns.lookup(hostDirect, (err, address, family) => {
    if (err) console.error("❌ Direct Lookup Failed:", err.code);
    else console.log("✅ Direct IP:", address);
});

console.log(`Looking up Pooled: ${hostPooled}`);
dns.lookup(hostPooled, (err, address, family) => {
    if (err) console.error("❌ Pooled Lookup Failed:", err.code);
    else console.log("✅ Pooled IP:", address);
});
