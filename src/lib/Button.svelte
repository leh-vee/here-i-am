<script>
  import { Circle, RegularPolygon } from 'svelte-konva';
  import { currentChannelFromSefirahCoordsPx } from '../stores/treeOfLife';
  import { isTutorialMode } from '../stores/base.js'; 
  import { createEventDispatcher } from 'svelte';

  export let isBackBtn;
  const isFwdBtn = !isBackBtn;
  
  export let isDisabled = true;
  $: isEnabled = !isDisabled;
  
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
  
  $: btnOpacity = isDisabled ? 0.3 : 1;

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
    if ($isTutorialMode && cancelTutorialMode) isTutorialMode.set(false);
    btnRadius = pressedBtnRadius;
    btnStrokeColour = pressedBtnStrokeColour;
    setTimeout(unstickBtn, 500);
  }

  function unstickBtn() {
    btnRadius = baseBtnRadius;
    btnStrokeColour = baseBtnStrokeColour;
    dispatch(dispatchCode);
  }

  $: if (isFwdBtn && $isTutorialMode && isEnabled) {
    setTimeout(btnTutorial, Math.PI * 1000);
  }

  function btnTutorial() {
    if (!$isTutorialMode) return null;
    hitAreaEl.to({
      duration: 1,
      radius: btnRadius * 2,
      opacity: 0.5,
      onFinish: () => {
        if ($isTutorialMode) btnStickyDown(false);
        resetHitAreaAttrs();
      }
    });
  }

  $: if (!$isTutorialMode) resetHitAreaAttrs();

  function resetHitAreaAttrs() {
    hitAreaElAttrs = hitAreaElAttrs;
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