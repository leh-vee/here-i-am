const API_BASE_URL = "http://192.168.0.128:8000/here-i-am/data";

export async function fetchData(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}/`;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}