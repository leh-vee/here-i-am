<script>
  // @ts-nocheck
  import { Map, View } from 'ol';
  import { fromLonLat } from 'ol/proj.js';
  import VectorTileLayer from 'ol/layer/VectorTile.js';
  import VectorTileSource from 'ol/source/VectorTile.js';
  import MVT from 'ol/format/MVT.js';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  export let centreCoordsGcs;
  export let zoom = 13;

  const mapBoxApiKey = import.meta.env.VITE_MAPBOX_API_KEY;
  const mvtId = 'le0nl.dd0rj3wo';
  const tileUrl = `https://api.mapbox.com/v4/${mvtId}/` +
   `{z}/{x}/{y}.vector.pbf?access_token=${mapBoxApiKey}`;
  const vectorTileSource = new VectorTileSource({
    format: new MVT(), url: tileUrl 
  });

  let map;
  function initializeMap(node, coords) {
    map = new Map({
      target: node.id,
      controls: [],
      layers: [
        new VectorTileLayer({
          source: vectorTileSource,
          style: {
            'stroke-color': 'black',
            'stroke-width': 1
          },
        }),
      ],
      view: new View({
        center: fromLonLat(coords),
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

  let tilesLoading = 0;
  let tilesLoaded= 0;
  vectorTileSource.on('tileloadstart', () => {
    tilesLoading += 1;
  });
  vectorTileSource.on(['tileloadend', 'tileloaderror'], () => { tilesLoaded += 1 });
  $: if (tilesLoading > 1 && tilesLoaded === tilesLoading) {
    dispatch('loaded');
  }
  
</script>

<div id='map' use:initializeMap={centreCoordsGcs} />

<style>
  #map {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    z-index: 0;
  }
</style>


