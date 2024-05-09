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

  function onBackButtonClick() {
    backBtnRadius = pressedBtnRadius;
    backBtnStrokeColour = pressedBtnStrokeColour;
    dispatch('back');
    setTimeout(() => {
      backBtnRadius = baseBtnRadius;
      backBtnStrokeColour = baseBtnStrokeColour;
    }, Math.PI * 100);
  }
  
  function onFwdButtonClick() {
    fwdBtnRadius = pressedBtnRadius;
    fwdBtnStrokeColour = pressedBtnStrokeColour;
    dispatch('forward');
    setTimeout(() => {
      fwdBtnRadius = baseBtnRadius;
      fwdBtnStrokeColour = baseBtnStrokeColour;
    }, Math.PI * 100);
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
}} bind:handle={backHitAreaEl}
on:pointerclick={ onBackButtonClick } />
<Circle config={{
  x: xForwardBtn,
  ...hitAreaElAttrs
}} bind:handle={fowardHitAreaEl}
on:pointerclick={ onFwdButtonClick } />