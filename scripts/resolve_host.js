
const dns = require('dns');
dns.lookup('ep-tiny-lab-a1hzd77s-pooler.ap-southeast-1.aws.neon.tech', (err, address, family) => {
    console.log('address: %j family: IPv%s', address, family);
    if (err) console.error('Error:', err);
});
