<script>
  import { Circle, RegularPolygon } from 'svelte-konva';
  import { currentChannelFromSefirahCoordsPx } from '../stores/treeOfLife';
  import { isLastVerseWord, isInBetweenWords } from '../stores/text';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let inFlight;

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

  const btnStickDurationMs = Math.PI * 100;

  let btnOpacity = 0.3;

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

  let hitAreaElAttrs = {
    y,
    opacity: 0,
    fill: 'white',
    radius: baseBtnRadius**2,
    strokeEnabled: false
  }

  let backHitAreaEl, forwardHitAreaEl;

  function backBtnStickyDown() {
    backBtnRadius = pressedBtnRadius;
    backBtnStrokeColour = pressedBtnStrokeColour;
    setTimeout(unstickBckBtn, btnStickDurationMs);
  }

  function unstickBckBtn() {
    backBtnRadius = baseBtnRadius;
    backBtnStrokeColour = baseBtnStrokeColour;
    dispatch('back');
  }

  function fwdBtnStickyDown() {
    fwdBtnRadius = pressedBtnRadius;
    fwdBtnStrokeColour = pressedBtnStrokeColour;
    setTimeout(unstickFwdBtn, btnStickDurationMs);
  }

  function unstickFwdBtn() {
    fwdBtnRadius = baseBtnRadius;
    fwdBtnStrokeColour = baseBtnStrokeColour;
    dispatch('forward');
  }

  $: if ($isLastVerseWord && inFlight && !$isInBetweenWords) {
    btnOpacity = 1;
    setTimeout(() => {
      if (inFlight) fwdBtnTutorial()
    }, Math.PI * 1000);
  }

  function fwdBtnTutorial() {
    forwardHitAreaEl.to({
      duration: 1,
      radius: fwdBtnRadius * 2,
      opacity: 0.5,
      onFinish: () => {
        if (inFlight) fwdBtnStickyDown();
        resetHitAreaAttrs();
      }
    });
  }

  $: if (inFlight === false) resetHitAreaAttrs();

  function resetHitAreaAttrs() {
    hitAreaElAttrs = hitAreaElAttrs;
  }
</script>

<Circle config={{
  x: xBackBtn,
  radius: backBtnRadius * 1.5,
  stroke: backBtnStrokeColour,
  opacity: btnOpacity,
  ...buttonAttrs
}}/>
<Circle config={{
  x: xForwardBtn,
  radius: fwdBtnRadius * 1.5,
  stroke: fwdBtnStrokeColour,
  opacity: btnOpacity,
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
  bind:handle={forwardHitAreaEl}
  on:pointerdown={ fwdBtnStickyDown } 
/>