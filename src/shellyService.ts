const SHELLY_IP = '192.168.1.158';
const SHELLY_RELAY_ON_TIME = 10; // seconds

export const triggerShellyRelay = async () => {
  try {
    const response = await fetch(`http://${SHELLY_IP}/relay/0?turn=on&timer=${SHELLY_RELAY_ON_TIME}`);
    if (!response.ok) {
      console.error(`Failed to trigger Shelly relay: ${response.statusText}`);
    }
    console.log(`Shelly relay triggered for ${SHELLY_RELAY_ON_TIME} seconds.`);
  } catch (error) {
    console.error('Error triggering Shelly relay:', error);
  }
};
