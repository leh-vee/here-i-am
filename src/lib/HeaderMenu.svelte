<script>
  import { nPiesScored, isScoreCallout, isVerseCallout } from '../stores/base';
  import { isMenuVisible } from '../stores/verseState';
  import { currentPiSliceRomanized } from '../stores/text';
  import VerseNumberDropDownMenu from './menus/VerseNumberDropDownMenu.svelte';
  import UserDropDownMenu from './menus/UserDropDownMenu.svelte';

  export let isVisible = false;

  $: isHeaderVisible = $isMenuVisible || isVisible;

  let isVerseIndexMenuVisible = false;
  function toggleVerseIndexMenu() {
    if (isUserMenuVisible && !isVerseIndexMenuVisible) isUserMenuVisible = false;
    isVerseIndexMenuVisible = !isVerseIndexMenuVisible;
  }
  let isUserMenuVisible = false;
  function toggleUserMenu() {
    if (isVerseIndexMenuVisible && !isUserMenuVisible) isVerseIndexMenuVisible = false;
    isUserMenuVisible = !isUserMenuVisible 
  }

  let cyclePiesIntervalId;
  let isPieEaten = [false, false, false];
  $: {
    if ($isScoreCallout) {
      pieBlink();
    } else {
      clearInterval(cyclePiesIntervalId);
      for (let i = 0; i < 3; i++) isPieEaten[i] = $nPiesScored > i;
    }
  }
  
  function pieBlink() {
    cyclePiesIntervalId = setInterval(() => {
      const indexOfLastPieFilling = isPieEaten.lastIndexOf(true);
      if (indexOfLastPieFilling === 2) {
        isPieEaten = [false, false, false];
      } else {
        isPieEaten[indexOfLastPieFilling + 1] = true;
      }
    }, 750);
  }

</script>

<div id='header' class='menu' class:hide={!isHeaderVisible}>
  <div id='pies'>
    {#each isPieEaten as eaten}
      <span class:eaten>&#129383;</span>
    {/each}
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id='verse-number' class:callout={ $isVerseCallout } on:click={ toggleVerseIndexMenu }>
    { $currentPiSliceRomanized }
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div id='user' on:click={ toggleUserMenu }>&#128578;</div>
</div>
<VerseNumberDropDownMenu isVisible={ isVerseIndexMenuVisible }
  on:close={ () => isVerseIndexMenuVisible = false } />
{#if isUserMenuVisible}
  <UserDropDownMenu isVisible={ isUserMenuVisible } 
    on:close={ () => isUserMenuVisible = false } />
{/if}

<style>
  #header.menu {
    position: absolute;
    top: 0;
    left: 0;
    height: 4dvh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
    border-bottom: 0.3dvh dimgrey solid;
    z-index: 2;
    transition: top 1s ease-in-out;
  }

  #header.menu.hide {
    top: calc(-4.3dvh);
  }
  
  #header.menu #pies {
    position: absolute;
    bottom: -2px;
    left: 5px;
    font-size: 4.3dvh;
  }

  #header.menu #pies span {
    vertical-align: bottom;
  }

  #header.menu #verse-number {
    font-size: 3dvh;
    color: gold;
    font-weight: bold;
    font-family: monospace;
  }
  
  #header.menu #verse-number.callout {
    animation: 1s ease-in-out 0s infinite alternate flash;
  }

  @keyframes flash {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  
  #header.menu #user {
    font-size: 3.5dvh;
    position: absolute;
    right: 5px;
  }

  #pies span {
    padding-left: 1px;
  }

  #pies span:not(.eaten) {
    opacity: 0.3;
  }
</style>