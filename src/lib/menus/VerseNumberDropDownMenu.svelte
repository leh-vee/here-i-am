<script>
  import DropDownMenu from "./DropDownMenu.svelte";
  import { currentVerseIndex, wordIndices } from '../../stores/text.js';
  import { hasVerseNumberMenuOpened, screenWidth } from "../../stores/base";
  import { serializeCountDown } from '../../utils/textJson.js';

  export let isVisible = false;
  const piCountDown = serializeCountDown();
  let piSliceEl;

  $: fontSize = `${Math.round($screenWidth * 0.3)}px`;

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
          <p class='number'>{ piSlice }</p>
        </div>
      {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class='pi-slice' on:click={ () => { goToVerse(i) } }>
          <p class='number'>{ piSlice }</p>
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
  } 
  
  .pi-slice {
    width: 40dvw;
    height: 40dvw;
    margin: 3dvh;
    background-color: grey;
    border-radius: 50%;
    border: dimgrey 5px solid;
    transition: border-color 300ms ease;
    transition: color 300ms ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .pi-slice:active {
    border-color: black;
    color: gold;
  }

  .pi-slice#current {
    background-color: gold;
  }

  .pi-slice p.number {
    color: black;
    margin: 0;
    padding: 0;
    font-size: var(--fontSize);
  }
</style>