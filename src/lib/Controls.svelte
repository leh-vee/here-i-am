<script>
  import { Circle, RegularPolygon } from 'svelte-konva';
  import { currentChannelFromSefirahCoordsPx } from '../stores/treeOfLife';
  import { isLastVerseWord } from '../stores/text';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const y = window.innerHeight / 2;
  const baseBtnRadius = Math.round(window.innerWidth / 50);
  const pressedBtnRadius = Math.round(window.innerWidth / 55);
  const xBackBtn = $currentChannelFromSefirahCoordsPx[0] + baseBtnRadius;
  const xForwardBtn = window.innerWidth - xBackBtn;

  let backBtnRadius = baseBtnRadius;
  let fwdBtnRadius = baseBtnRadius;
  
  const baseBtnStrokeColour = '#989898';
  const pressedBtnStrokeColour = '#808080';
  let backBtnStrokeColour = baseBtnStrokeColour;
  let fwdBtnStrokeColour = baseBtnStrokeColour;

  const buttonAttrs = {
    y,
    fill: 'dimgrey',
    strokeWidth: 1
  }

  const triangleAttrs = {
    y,
    sides: 3,
    fill: 'black',
    enableStroke: false
  }

  const hitAreaElAttrs = {
    y,
    opacity: 0,
    radius: baseBtnRadius**2,
    strokeEnabled: false
  }

  let backHitAreaEl, fowardHitAreaEl;

  function backBtnStickyDown() {
    backBtnRadius = pressedBtnRadius;
    backBtnStrokeColour = pressedBtnStrokeColour;
    setTimeout(unstickBckBtn, Math.PI * 100);
  }

  function unstickBckBtn() {
    backBtnRadius = baseBtnRadius;
    backBtnStrokeColour = baseBtnStrokeColour;
    dispatch('back');
  }

  function fwdBtnStickyDown() {
    fwdBtnRadius = pressedBtnRadius;
    fwdBtnStrokeColour = pressedBtnStrokeColour;
    setTimeout(unstickFwdBtn, Math.PI * 100);
  }

  function unstickFwdBtn() {
    fwdBtnRadius = baseBtnRadius;
    fwdBtnStrokeColour = baseBtnStrokeColour;
    dispatch('forward');
  }

  $: if ($isLastVerseWord) { // & inFlight

  }
</script>

<Circle config={{
  x: xBackBtn,
  radius: backBtnRadius * 1.5,
  stroke: backBtnStrokeColour,
  ...buttonAttrs
}}/>
<Circle config={{
  x: xForwardBtn,
  radius: fwdBtnRadius * 1.5,
  stroke: fwdBtnStrokeColour,
  ...buttonAttrs
}}/>

<RegularPolygon config={{
  x: xBackBtn,
  rotation: -90,
  radius: backBtnRadius,
  ...triangleAttrs
}}/>
<RegularPolygon config={{
  x: xForwardBtn,
  rotation: 90,
  radius: fwdBtnRadius,
  ...triangleAttrs
}}/>

<Circle config={{
  x: xBackBtn,
  ...hitAreaElAttrs
  }} 
  bind:handle={ backHitAreaEl }
  on:pointerdown={ backBtnStickyDown }
/>
<Circle config={{
  x: xForwardBtn,
  ...hitAreaElAttrs
  }} 
  bind:handle={fowardHitAreaEl}
  on:pointerdown={ fwdBtnStickyDown } 
/>