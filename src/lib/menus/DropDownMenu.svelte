<script>
  import { screenWidth } from '../../stores/base'; 
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let isHidden = true;

  $: clsBtnSize = `${Math.round($screenWidth * 0.06)}px`;
  $: gameMargin = (window.innerWidth - $screenWidth) / 2;
  $: clsBtnRightPosition = `${gameMargin + Math.round($screenWidth * 0.02)}px`;

  function closeMenu() {
    isHidden = true;
    dispatch('close');
  }
</script>

<div class='drop-down menu' class:hide={ isHidden }>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span id='close-button' on:click={ closeMenu } 
    style="--clsBtnSize:{clsBtnSize}; --clsBtnRightPosition:{clsBtnRightPosition}">
    &times;
  </span>
  <slot></slot>
</div>

<style>
  .drop-down.menu {
    position: absolute;
    top: 27px;
    left: 0;
    bottom: 0;
    right: 0;
    color: darkgray;
    background-color: black;
    z-index: 2;
    transition: bottom 500ms ease;
    overflow-y: scroll;
  }
  
  .drop-down.menu.hide {
    overflow: hidden;
    bottom: 100%;
  }

  .drop-down.menu #close-button {
    position: fixed;
    right: var(--clsBtnRightPosition);
    font-family: monospace;
    font-size: var(--clsBtnSize);
  }

  .drop-down.menu.hide #close-button {
    visibility: hidden;
  }
</style>