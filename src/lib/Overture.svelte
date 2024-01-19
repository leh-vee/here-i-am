<script>
  import { Layer, Arc } from 'svelte-konva';
  import EllipticalCollapse from './EllipticalCollapse.svelte';
  import { createEventDispatcher } from 'svelte';
  import CountdownLeader from './CountdownLeader.svelte';

  const dispatch = createEventDispatcher();
  const xCentre = window.innerWidth / 2;
  const yCentre = window.innerHeight / 2;
  const diagonalRadius = Math.hypot(xCentre, yCentre);

  const initialToSefirahRadius = Math.round(xCentre * 0.7);
  let vessel;
  let singularity;

  function buildVessel(event) {
    singularity = event.detail;
    vessel.to({
      duration: Math.PI,
      angle: 360,
      outerRadius: initialToSefirahRadius + 3,
      innerRadius: initialToSefirahRadius - 3
    });
    singularity.to({
      duration: Math.PI,
      radius: 1,
      onFinish: () => {
        setTimeout(() => {
          dispatch('vesselBuilt'); 
        }, 100);
      }
    });
  }
  
  let isCollapsed = false;
  function drain(event) {
    singularity = event.detail;
    singularity.to({
      duration: Math.PI,
      radius: 1,
      opacity: 0.5,
      onFinish: () => {
        nova();
      }
    });
  }

  let startSearch = false;
  function nova() {
    isCollapsed = true;
    singularity.to({
      duration: Math.PI / 10,
      radius: diagonalRadius,
      opacity: 0,
      onFinish: () => {
        singularity.destroy(); 
        startSearch = true;
      }
    });
  }

</script>

<Layer>
  <Arc config={{
    x: xCentre,
    y: yCentre,
    innerRadius: 0,
    outerRadius: 0,
    angle: 0,
    rotation: -90,
    fill: 'dimgrey',
    strokeEnabled: false
  }} bind:handle={vessel} />
  <EllipticalCollapse on:collapsed={ drain } />
  {#if isCollapsed}
    <CountdownLeader search={ startSearch } />
  {/if}
</Layer>