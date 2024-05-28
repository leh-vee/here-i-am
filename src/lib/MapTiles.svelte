<script>
  // @ts-nocheck
  import { Map, View } from 'ol';
  import { fromLonLat } from 'ol/proj.js';
  import VectorTileLayer from 'ol/layer/VectorTile.js';
  import VectorTileSource from 'ol/source/VectorTile.js';
  import MVT from 'ol/format/MVT.js';

  export let highParkLonLat = [-79.466809, 43.657215];
  export let zoom = 13;

  const mapBoxApiKey = import.meta.env.VITE_MAPBOX_API_KEY;
  const tileUrl = `https://api.mapbox.com/v4/le0nl.dd0rj3wo/{z}/{x}/{y}.vector.pbf?access_token=${mapBoxApiKey}`;

  let map;

  function initializeMap(node) {
    map = new Map({
      target: node.id,
      controls: [],
      layers: [
        new VectorTileLayer({
          source: new VectorTileSource({
            format: new MVT(),
            url: tileUrl,
          }),
          style: {
            'stroke-color': 'black',
            'stroke-width': 1
          },
        }),
      ],
      view: new View({
        center: fromLonLat(highParkLonLat),
        zoom,
        minZoom: zoom,
        maxZoom: zoom
      })
    });
    return {
      destroy() {
        if (map) {
          map.setTarget(null);
          map = null;
        }
      }
    }
  }
  
</script>

<div id='map' use:initializeMap />

<style>
  #map {
    width: 100%;
    height: 100%;
    background-color: white;
  }
</style>


