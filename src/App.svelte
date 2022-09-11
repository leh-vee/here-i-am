<script>
  import TextField from "./lib/TextField.svelte";
  const couplets = [
    {
      piSlice: 3,
      a: "Here I am a wet, market smile on you absent face still",
      b: "delivering that neighbourly something to our hood" 
    },
    // {
    //   piSlice: 2,
    //   a: "Here I am all together chinked by the overhearing",
    //   b: "of a featherweight junction’s heavy breathing" 
    // },
    // {
    //   piSlice: 1,
    //   a: "Here I am the other white people, a new Israelite vector",
    //   b: "starting from the horrible reach of her empty touch" 
    // }
  ]

  const currentWordIndex = {
    couplet: 0,
    line: 'a',
    word: '3'
  }
  const cwi = currentWordIndex;

  function wordsByLine(coupletIndex, line = 'a') {
    return couplets[coupletIndex][line].split(' ');
  }
</script>

<div class='reader'>
  <div class='focus'>
    <h1 class='word'>{ wordsByLine(cwi.couplet, cwi.line)[cwi.word] }</h1>
  </div>
  <TextField {couplets} {currentWordIndex} />
</div>

<style>
  .reader {
    height: 100%;
    display: flex;
		flex-direction: column;
    text-align: center;
  }
  
  .focus {
    flex-grow: 1;
  }

  .word {
    font-size: 100px;
    margin-top: 50%;
  }

</style>