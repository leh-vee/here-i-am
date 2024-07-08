<script>
  import { Circle, RegularPolygon } from 'svelte-konva';
  import { currentChannelFromSefirahCoordsPx } from '../stores/treeOfLife';
  import { createEventDispatcher } from 'svelte';

  export let isBackBtn;
  export let isDisabled = false;
  
  const dispatch = createEventDispatcher();
  const dispatchCode = isBackBtn ? 'back' : 'forward';

  const baseBtnRadius = Math.round(window.innerWidth / 50);
  const pressedBtnRadius = Math.round(window.innerWidth / 55);
  let btnRadius = baseBtnRadius;

  const y = window.innerHeight / 2;
  const xBackBtn = $currentChannelFromSefirahCoordsPx[0] + baseBtnRadius;
  const xFwdBtn = window.innerWidth - xBackBtn;
  const x = isBackBtn ? xBackBtn : xFwdBtn;

  const baseBtnStrokeColour = '#989898';
  const pressedBtnStrokeColour = '#808080';
  let btnStrokeColour = baseBtnStrokeColour;

  const rotation = isBackBtn ? -90 : 90;
  
  $: btnOpacity = isDisabled ? 0.5 : 1;

  let hitAreaEl;

  const baseAttrs = { x, y };

  const buttonAttrs = {
    ...baseAttrs,
    fill: 'dimgrey',
    strokeWidth: 1
  };

  const triangleAttrs = {
    ...baseAttrs,
    sides: 3,
    fill: 'black',
    strokeEnabled: false
  };

  let hitAreaElAttrs = {
    ...baseAttrs,
    opacity: 0,
    fill: 'white',
    radius: baseBtnRadius**2,
    strokeEnabled: false
  };

  function btnStickyDown(cancelTutorialMode=true) {
    if (isDisabled) return null;
    btnRadius = pressedBtnRadius;
    btnStrokeColour = pressedBtnStrokeColour;
    setTimeout(unstickBtn, 500);
  }

  function unstickBtn() {
    btnRadius = baseBtnRadius;
    btnStrokeColour = baseBtnStrokeColour;
    dispatch(dispatchCode);
  }
</script>

<Circle config={{
  radius: btnRadius * 1.5,
  stroke: btnStrokeColour,
  opacity: btnOpacity,
  ...buttonAttrs
}}/>
<RegularPolygon config={{
  rotation,
  radius: btnRadius,
  ...triangleAttrs
}}/>
<Circle config={{
  ...hitAreaElAttrs
  }} 
  bind:handle={ hitAreaEl }
  on:pointerdown={ () => { btnStickyDown() } }
/>