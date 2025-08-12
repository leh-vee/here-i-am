const HOST = import.meta.env.VITE_HOST_URL;
const API_BASE_URL = `${HOST}/here-i-am/data`;


async function fetchWithRetry(url, options, retries, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      if (!navigator.onLine) {
        await new Promise(resolve => {
          window.addEventListener('online', resolve, { once: true });
        });
      }
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    } catch (error) {
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

export async function fetchData(endpoint, options = {}, retries = 3) {
  const url = `${API_BASE_URL}/${endpoint}/`;
  return fetchWithRetry(url, options, retries);
}