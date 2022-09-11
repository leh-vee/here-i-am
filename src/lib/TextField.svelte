<script>
  import Couplet from "./Couplet.svelte"
  export let couplets;
  export let currentWordIndex;
</script>

<div class='text-field'>
  {#each couplets as text}
    <Couplet {text} />
  {/each}
</div>

<style>
  .text-field {
    /* border-top: 1px black solid; */
    height: 100px;
  }
</style>