
const instanceId = 'instance157389';
const token = '1dh0cx4esjoshpp7';

async function checkStatus() {
  try {
    const url = `https://api.ultramsg.com/${instanceId}/instance/status?token=${token}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("ULTRAMSG_STATUS_CHECK:");
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("STATUS_CHECK_ERROR:", err.message);
  }
}

checkStatus();
