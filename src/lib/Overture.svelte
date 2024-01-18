<script>
  import { Layer, Arc } from 'svelte-konva';
  import EllipticalCollapse from './EllipticalCollapse.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const xCentre = window.innerWidth / 2;
  const yCentre = window.innerHeight / 2;
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
  <EllipticalCollapse on:collapsed={ buildVessel } />
</Layer>