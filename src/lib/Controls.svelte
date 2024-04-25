<script>
  import { Arrow } from 'svelte-konva';
  import { currentChannelFromSefirahCoordsPx, currentChannelToSefirahCoordsPx } from '../stores/treeOfLife';
  import { isLastVerseWord } from '../stores/text';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let backArrowEl, forwardArrowEl;
  let arrowAttrs = {
    y: window.innerHeight / 2,
    fill: 'black',
    pointerLength: 30,
    pointerWidth: 40,
    stroke: 'dimgrey',
    opacity: 0.4,
    strokeWidth: 3
  }

  $: if ($isLastVerseWord) { // & inFlight
    backArrowEl.to({
      duration: Math.PI / 2,
      opacity: 1
    });
    forwardArrowEl.to({
      duration: Math.PI / 2,
      opacity: 1
    });
  }
</script>

<Arrow config={{
  ...arrowAttrs,
  x: $currentChannelFromSefirahCoordsPx[0],
  points: [0, 0, -0, 0]
}}
on:pointerclick={ () => { dispatch('back') } } 
bind:handle={backArrowEl} />

<Arrow config={{
  ...arrowAttrs,
  x: $currentChannelToSefirahCoordsPx[0],
  points: [0, 0, 0, 0]
}}
on:pointerclick={ () => { dispatch('forward') } } 
bind:handle={forwardArrowEl} />