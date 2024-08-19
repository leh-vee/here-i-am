<script>
  import { Text } from 'svelte-konva';
  import { fetchIntroCouplets } from '../../api/client.js';
  import { serializeCouplets } from '../../utils/textJson.js';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  let couplets, nCouplets; 
  let coupletIndex = 0;
  fetchIntroCouplets().then(lines => { 
    couplets = serializeCouplets(lines);
    nCouplets = couplets.length;
  });

  export let visible = false;
  
  let couplet = { a: "", b: "" };
  let progressiveLines = { a: "", b: "" };
  $: if (visible) revealNextCouplet();

  async function revealNextCouplet() {
    progressiveLines = { a: "", b: "" };
    await buildEllipsis();
    if (coupletIndex < nCouplets) {
      couplet =  structuredClone(couplets[coupletIndex]);
      await buildLine();
      await buildLine('b');
      setTimeout(() => {
        progressiveLines.b += '.';
        coupletIndex += 1;
        setTimeout(() => {
          dispatch('revealed');
        }, 750);
      }, Math.PI * 1000); 
    }
  }

  function buildEllipsis() {
    return new Promise((resolve) => {
      const addDotToLineA = () => { 
        progressiveLines.a += '.';
        setTimeout(()=> {
          if (progressiveLines.a === '...') {
            resolve(true);
          } else {
            addDotToLineA();
          }
        }, 1000);
      }
      setTimeout(addDotToLineA, (Math.PI - 3) * 1000);
    });
  }
  
  function buildLine(line = 'a') {
    return new Promise((resolve) => {
      const lineText = couplet[line];
      const nChars = lineText.length;
      let charIndex = 0;
      const addChar = () => {
        progressiveLines[line] += lineText[charIndex];
        if (charIndex < nChars - 1) {
          charIndex += 1;
        } else {
          clearInterval(addCharIntervalId);
          resolve(true);
        }
      }
      let addCharIntervalId = setInterval(addChar, 60);
    });
  }
  
  const width = window.innerWidth;
  const questionTextAttrs = {
    x: 5,
    width: width - 5,
    fontFamily: '"Homemade Apple", sans-serif',
    fontSize: Math.round(width / 22),
    fill: 'black'
  }
</script>

<Text config={{
  y: 0,
  height: window.innerHeight / 3,
  align: 'center',
  verticalAlign: 'middle',
  text: progressiveLines.a,
  visible,
  ...questionTextAttrs
}} />
<Text config={{
  y: window.innerHeight - window.innerHeight / 3,
  height: window.innerHeight / 3,
  align: 'center',
  verticalAlign: 'middle',
  text: progressiveLines.b,
  visible,
  ...questionTextAttrs
}} />