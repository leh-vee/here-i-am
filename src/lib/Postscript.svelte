<script>
  import HeaderMenu from './HeaderMenu.svelte';
  import GameOver from './GameOver.svelte';
  import MastersOfPi from './MastersOfPi.svelte';
  import { swipe } from 'svelte-gestures';

  let isGameOverReady = false;
  
  let slides = ['gameOver', 'leaderBoard', 'credits', 'dedication'];
  const nSlides = slides.length;
  let currentSlideIndex = 0;
  $: currentSlide = slides[currentSlideIndex];

  function swiped(event) {
    const direction = event.detail.direction;
    if (direction === 'left') {
      if (currentSlideIndex < nSlides - 1) currentSlideIndex++; 
    } else {
      if (currentSlideIndex > 0) currentSlideIndex--;
    }
  }

  function scrollToSlide(index) {
    currentSlideIndex = index;
  }

</script>

<div id='postscript'>
  <HeaderMenu isVisible={ isGameOverReady } />
  <div id='slider-container' class={currentSlide}
    use:swipe={{ timeframe: 300, minSwipeDistance: 60 }} on:swipe={(e) => { swiped(e) }}>
    <div class='pane'>
      <GameOver on:visible={ () => { isGameOverReady = true } } />
    </div>
    <div class='pane'>
      <MastersOfPi />
    </div>
    <div class='pane'>
      <p>Designed and developed by Leon Lukashevsky</p>
    </div>
    <div class='pane'>
      <p>For my neighbour</p>
    </div>
  </div> 
  <div class='footer' class:visible={ isGameOverReady }>
    {#each slides as _, i}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span class='bullet' class:selected={ currentSlideIndex === i }
        on:click={ () => scrollToSlide(i) }>
        &bull;
      </span>
    {/each}
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
    width: 400%;
    display: flex;
    transition: transform 500ms ease-in-out;
  }
  
  #slider-container.leaderBoard {
    transform: translateX(-25%);
  }

  #slider-container.credits {
    transform: translateX(-50%);
  }

  #slider-container.dedication {
    transform: translateX(-75%);
  }

  .pane {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .footer {
    position: absolute;
    bottom: 2dvh;
    left: 0;
    right: 0;
    color: white;
    text-align: center;
    font-size: 0dvh;
    transition: font-size 3.14s ease-in-out;
  }

  .footer.visible {
    font-size: 4dvh;
  }

  .bullet {
    opacity: 0.5;
    transition: opacity 500ms ease-in-out;
    margin: 0;
  }

  .bullet.selected {
    opacity: 1;
  }

  .pane p {
    font-family: 'Press Start 2P';
    line-height: 1.5;
    font-size: 4dvw;
    color: lightgray;
    text-align: center;
    padding: 0 5%;
  }
</style>