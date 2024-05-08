<script>
  import { Circle, RegularPolygon } from 'svelte-konva';
  import { currentChannelFromSefirahCoordsPx, currentChannelToSefirahCoordsPx } from '../stores/treeOfLife';
  import { isLastVerseWord } from '../stores/text';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const y = window.innerHeight / 2;
  const radius = $currentChannelFromSefirahCoordsPx[0] - 2;
  const btnStrokeWidth = 2;

  const buttonAttrs = {
    y,
    radius,
    fill: 'dimgrey',
    stroke: 'gold',
    strokeWidth: btnStrokeWidth
  }

  const triangleAttrs = {
    y,
    sides: 3,
    radius: radius - (btnStrokeWidth * 3),
    fill: 'black',
    strokeWidth: 0
  }

  const hitAreaElAttrs = {
    y,
    opacity: 0,
    radius: radius * 2,
    strokeEnabled: false
  }

  let backHitAreaEl, fowardHitAreaEl;

  $: if ($isLastVerseWord) { // & inFlight

  }
</script>

<Circle config={{
  x: $currentChannelFromSefirahCoordsPx[0],
  ...buttonAttrs
}}/>
<Circle config={{
  x: $currentChannelToSefirahCoordsPx[0],
  ...buttonAttrs
}}/>

<RegularPolygon config={{
  x: $currentChannelFromSefirahCoordsPx[0],
  rotation: -90,
  ...triangleAttrs
}}/>
<RegularPolygon config={{
  x: $currentChannelToSefirahCoordsPx[0],
  rotation: 90,
  ...triangleAttrs
}}/>

<Circle config={{
  x: $currentChannelFromSefirahCoordsPx[0],
  ...hitAreaElAttrs
}} bind:handle={backHitAreaEl}
on:pointerclick={ () => { dispatch('back') } } />

<Circle config={{
  x: $currentChannelToSefirahCoordsPx[0],
  ...hitAreaElAttrs
}} bind:handle={fowardHitAreaEl}
on:pointerclick={ () => { dispatch('forward') } } />