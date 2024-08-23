<script>
  export let number;
  export let isVisible = false;
</script>

{#if isVisible}
<div id='number-wrapper'>
  <span id='verse-number'>
    { number }
  </span>
</div>
{/if}

<style>
#number-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

}

#verse-number {
  color: white;
  font-size: 25vh;
  font-family: Helvetica, sans-serif;
}
</style>