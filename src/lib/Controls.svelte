<script>
  import { Circle, RegularPolygon } from 'svelte-konva';
  import { currentChannelFromSefirahCoordsPx, currentChannelToSefirahCoordsPx } from '../stores/treeOfLife';
  import { isLastVerseWord } from '../stores/text';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const y = window.innerHeight / 2;
  const btnMargin = 0;
  const xBackBtn = $currentChannelFromSefirahCoordsPx[0] + btnMargin;
  const xForwardBtn = $currentChannelToSefirahCoordsPx[0] - btnMargin;
  const radius = Math.round(window.innerWidth / 50);

  const buttonAttrs = {
    y,
    radius: radius * 1.5,
    fill: 'dimgrey',
    stroke: 'silver',
    strokeWidth: 1
  }

  const triangleAttrs = {
    y,
    sides: 3,
    radius,
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
  x: xBackBtn,
  ...buttonAttrs
}}/>
<Circle config={{
  x: xForwardBtn,
  ...buttonAttrs
}}/>

<RegularPolygon config={{
  x: xBackBtn,
  rotation: -90,
  ...triangleAttrs
}}/>
<RegularPolygon config={{
  x: xForwardBtn,
  rotation: 90,
  ...triangleAttrs
}}/>

<Circle config={{
  x: xBackBtn,
  ...hitAreaElAttrs
}} bind:handle={backHitAreaEl}
on:pointerclick={ () => { dispatch('back') } } />
<Circle config={{
  x: xForwardBtn,
  ...hitAreaElAttrs
}} bind:handle={fowardHitAreaEl}
on:pointerclick={ () => { dispatch('forward') } } />