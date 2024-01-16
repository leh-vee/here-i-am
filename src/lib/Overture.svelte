<script>
  import { Layer } from 'svelte-konva';
  import EllipticalCollapse from './EllipticalCollapse.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const xCentre = window.innerWidth / 2;
  const yCentre = window.innerHeight / 2;

  function theBreakage(event) {
    const singularity = event.detail;
    singularity.to({
      duration: Math.PI / 10,
      fill: 'black',
      radius: Math.hypot(xCentre, yCentre),
      onFinish: () => { dispatch('vesselBroken') }
    });
  }
</script>

<Layer>
  <EllipticalCollapse on:collapsed={ theBreakage } />
</Layer>