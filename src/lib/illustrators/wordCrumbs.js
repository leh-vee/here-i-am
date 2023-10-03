import { Circle } from "konva/lib/shapes/Circle";

export async function dropCrumbsOnLayer(crumbsGeoJson, layer, projection) {
  const crumbFeatures = crumbsGeoJson.features;
  const tBetweenDrops = 93;
  let nDropped = 0;
  const dropCrumb = () => {
    const coordsGeo = crumbFeatures[nDropped].geometry.coordinates;
    const coordsPx = projection(coordsGeo);
    layer.add(createCirlce(...coordsPx));
    nDropped += 1;
    if (nDropped < crumbFeatures.length) {
      setTimeout(() => dropCrumb(), tBetweenDrops);
    } else {
      return true;
    }
  }
  dropCrumb();
}

function createCirlce(x, y) {
  const radius = 2;
  const fill = 'black';
  const opacity = 1
  return new Circle({ x, y, radius, fill, opacity });
}