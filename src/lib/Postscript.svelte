<script>
  import HeaderMenu from './HeaderMenu.svelte';
  import GameOver from './GameOver.svelte';
  import MastersOfPi from './MastersOfPi.svelte';
  import { swipe } from 'svelte-gestures';

  let isGameOverScreen = true;
  let isGameOverReady = false;

  $: isLeaderBoard = !isGameOverScreen;

  function swiped(event) {
    const direction = event.detail.direction;
    if (direction === 'left') {
      isGameOverScreen = false;
    } else {
      isGameOverScreen = true;
    }
  }

</script>

<div id='postscript'>
  <HeaderMenu isVisible={ isGameOverReady } />
  <div id='slider-container' class:high-scores={ isLeaderBoard }
    use:swipe={{ timeframe: 300, minSwipeDistance: 60 }} on:swipe={(e) => { swiped(e) }}>
    <div class='pane'>
      <GameOver on:visible={ () => { isGameOverReady = true } } />
    </div>
    <div class='pane'>
      <MastersOfPi />
    </div>
  </div> 
  <div class='footer' class:visible={ isGameOverReady }>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span class='bullet' class:selected={ isGameOverScreen }
      on:click={ () => { isGameOverScreen = true } }>
      &bull;
    </span>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span class='bullet' class:selected={ isLeaderBoard }
      on:click={ () => { isGameOverScreen = false } }>
      &bull;
    </span>
  </div>
</div>

<style>
  #postscript {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  #slider-container {
    height: 100%;
    width: 200%;
    display: flex;
    transition: transform 500ms ease-in-out;
  }
  
  #slider-container.high-scores {
    transform: translateX(-50%);
  }

  .pane {
    height: 100%;
    width: 100%;
  }

  .footer {
    position: absolute;
    bottom: 2dvh;
    left: 0;
    right: 0;
    color: white;
    text-align: center;
    font-size: 0dvh;
    transition: font-size 1s ease-in-out 500ms;
  }

  .footer.visible {
    font-size: 5dvh;
  }

  .bullet {
    opacity: 0.5;
    transition: opacity 500ms ease-in-out;
    margin: 0 1px;
  }

  .bullet.selected {
    opacity: 1;
  }
</style>