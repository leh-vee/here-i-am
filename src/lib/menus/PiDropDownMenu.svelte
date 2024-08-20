<script>
  import DropDownMenu from "./DropDownMenu.svelte";
  import { currentVerseIndex, wordIndices } from '../../stores/text.js';
  import { serializeCountDown } from '../../utils/textJson.js';

  export let isVisible = false;
  const piCountDown = serializeCountDown();
  let piSliceEl;

  $: if (isVisible) piSliceEl.scrollIntoView({ behavior: "smooth", block: "start" });
</script>

<DropDownMenu isHidden={ !isVisible }>
  <div id='countdown'>
    {#each piCountDown as piSlice, i}
      {#if $currentVerseIndex === i}
        <div id='current' class='pi-slice' bind:this={ piSliceEl }>
          { piSlice }
        </div>
      {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class='pi-slice' on:click={ () => { wordIndices.goToVerseIndex(i) } }>
          { piSlice }
        </div>
      {/if}
    {/each}
  </div>
</DropDownMenu>

<style>
  #countdown {
    font-family: "Wellfleet";
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 14vh;
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
  }

  .pi-slice:active {
    color: gold;
    border: black 1px solid;
  }

  .pi-slice#current {
    background-color: gold;
  }
</style>