<script>
  import EllipticalCollapse from './EllipticalCollapse.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function dilateLeader() {
    console.log('dilate leader...');
    dispatch('dilated');
  }
</script>

<EllipticalCollapse on:collapsed={ dilateLeader } />