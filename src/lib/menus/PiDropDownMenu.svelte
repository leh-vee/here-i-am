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
  <div id='slices'>
    {#each piCountDown as piSlice, i}
      {#if $currentVerseIndex === i}
        <div id='current' bind:this={piSliceEl}>
          { piSlice }
        </div>
      {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div on:click={ () => { wordIndices.goToVerseIndex(i) } }>
          { piSlice }
        </div>
      {/if}
    {/each}
  </div>
</DropDownMenu>

<style>
  #slices {
    height: inherit;
    font-family: "Wellfleet";
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: scroll;
    font-size: 20vh;
  } 

  #slices #current {
    color: gold;
  }
</style>