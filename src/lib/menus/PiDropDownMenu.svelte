<script>
  import DropDownMenu from "./DropDownMenu.svelte";
  import { currentVerseIndex, wordIndices } from '../../stores/text.js';
  import { serializeCountDown } from '../../utils/textJson.js';

  export let isVisible = false;
  const piCountDown = serializeCountDown();
  let isPiMenuVisible = false;
  let piSliceEl;

  $: if (isPiMenuVisible) piSliceEl.scrollIntoView({ behavior: "smooth", block: "start" });
</script>

<DropDownMenu isHidden={ !isVisible }>
  <div id='pi' class='dd-content'>
    {#each piCountDown as piSlice, i}
      {#if $currentVerseIndex === i}
        <div class='current slice' bind:this={piSliceEl}>{ piSlice }</div>
      {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class='slice' on:click={ () => { wordIndices.goToVerseIndex(i) } }>
          { piSlice }
        </div>
      {/if}
    {/each}
  </div>
</DropDownMenu>

<style>
  #pi.dd-content {
    height: inherit;
    font-family: "Wellfleet";
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: scroll;
    font-size: 20vh;
  } 

  #pi.dd-content .current.slice {
    color: gold;
  }
</style>