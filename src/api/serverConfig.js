const HOST = import.meta.env.VITE_HOST_URL;
const API_BASE_URL = `${HOST}/here-i-am/data`;


export async function fetchData(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}/`;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}