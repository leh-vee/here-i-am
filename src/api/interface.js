const API_BASE_URL = "http://127.0.0.1:8000/here-i-am/data";

async function fetchData(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}/`;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export async function fetchSefirot() {
  return fetchData('street-nodes/tree-of-life');
}

export async function fetchChannels(areaCoordinates) {
  return fetchData('street-edges/area', { method: "post", body: JSON.stringify(areaCoordinates) });
}