<script>
  import DropDownMenu from "./DropDownMenu.svelte";
  import { currentVerseIndex, wordIndices } from '../../stores/text.js';
  import { hasVerseNumberMenuOpened, screenWidth } from "../../stores/base";
  import { serializeCountDown } from '../../utils/textJson.js';

  export let isVisible = false;
  const piCountDown = serializeCountDown();
  let piSliceEl;

  $: fontSize = `${Math.round($screenWidth * 0.15)}px`;

  $: if (isVisible) {
    $hasVerseNumberMenuOpened = true;
    setTimeout(()=> {
      piSliceEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 500)
  }

  function goToVerse(index) {
    setTimeout(() => {
      wordIndices.goToVerseIndex(index);
    }, 500);
  }
</script>

<DropDownMenu isHidden={ !isVisible } on:close>
  <div id='countdown' style="--fontSize:{fontSize}">
    {#each piCountDown as piSlice, i}
      {#if $currentVerseIndex === i}
        <div id='current' class='pi-slice' bind:this={ piSliceEl }>
          { piSlice }
        </div>
      {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class='pi-slice' on:click={ () => { goToVerse(i) } }>
          { piSlice }
        </div>
      {/if}
    {/each}
  </div>
</DropDownMenu>

<style>
  #countdown {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: var(--fontSize);
  } 
  
  .pi-slice {
    width: 1lh;
    height: 1lh;
    margin: 20px;
    padding: 20px;
    text-align: center;
    color: black;
    background-color: grey;
    border-radius: 50%;
    border: dimgrey 5px solid;
    transition: border-color 300ms ease;
    transition: color 300ms ease;
  }

  .pi-slice:active {
    border-color: black;
    color: gold;
  }

  .pi-slice#current {
    background-color: gold;
  }
</style>