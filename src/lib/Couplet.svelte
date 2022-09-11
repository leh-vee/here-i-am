<script>
  export let text;

  function wordsByLine(line) {
    return line.split(' ');
  }
</script>

<div class='couplet'>
  <div class='a-line'>
    {#each wordsByLine(text.a) as word}
      <span class='marker'></span>
    {/each}
  </div>
  <div class='b-line'>
    {#each wordsByLine(text.b) as word}
      <span class='marker'></span>
    {/each}
  </div>
</div>

<style>
  .couplet {
    margin: 10px auto;
    height: 80%;
  }

  .couplet .marker {
    background-color: black;
    opacity: 0.3;
    border-radius: 50%;
    display: inline-block;
    margin: 0 4px;
    height: 10px;
    width: 10px;
  }
</style>