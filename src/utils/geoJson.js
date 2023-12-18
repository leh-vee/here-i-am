const GEO_JSON_TEMPLATES = {
  collection: {
    type: "FeatureCollection", 
    crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    features: []
  },
  lineStringFeature: { 
    type: "Feature",
    properties: {}, 
    geometry: { "type": "LineString", "coordinates": [] } 
  }
} 

export function channelFeatures(sefirot) {
  const channels = new Array(10);
  for (let fromSefirahIndex = 0; fromSefirahIndex < 10; fromSefirahIndex++) {
    channels[fromSefirahIndex] = structuredClone(GEO_JSON_TEMPLATES.collection);
    for (let toSefirahIndex = 0; toSefirahIndex < 10; toSefirahIndex++) {
      let feature = structuredClone(GEO_JSON_TEMPLATES.lineStringFeature);
      feature.geometry.coordinates[0] = 
        sefirot.features[fromSefirahIndex].geometry.coordinates;
      feature.geometry.coordinates[1] =
        sefirot.features[toSefirahIndex].geometry.coordinates;
      channels[fromSefirahIndex].features[toSefirahIndex] = feature;
    }
  } 
  return channels; 
}