<script>
  import { Text } from 'svelte-konva';
  import { fetchIntroCouplets } from '../../api/client.js';
  import { serializeCouplets } from '../../utils/textJson.js';
  import { screenWidth, screenHeight } from '../../stores/base';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  export let visible = false;
  export let headerHeight;

  let couplets; 
  let coupletIndex = 0;
  fetchIntroCouplets().then(lines => { 
    couplets = serializeCouplets(lines);
  });

  
  let couplet = { a: "", b: "" };
  let progressiveLines = { a: "", b: "" };

  $: if (visible) revealNextCouplet();

  async function revealNextCouplet() {
    progressiveLines = { a: "", b: "" };
    await buildEllipsis();
    couplet =  structuredClone(couplets[coupletIndex]);
    await buildLine();
    await buildLine('b');
    progressiveLines.b += '.';
    coupletIndex += 1;
    dispatch('revealed');
  }

  function buildEllipsis() {
    return new Promise((resolve) => {
      const addDotToLineA = () => { 
        progressiveLines.a += '.';
        dispatch('dot');
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
  
  const questionTextAttrs = {
    x: 5,
    width: $screenWidth - 5,
    fontFamily: '"Homemade Apple", sans-serif',
    fontSize: Math.round($screenWidth / 22),
    fill: 'black'
  }
</script>

<Text config={{
  y: 0,
  height: headerHeight,
  align: 'center',
  verticalAlign: 'middle',
  text: progressiveLines.a,
  visible,
  ...questionTextAttrs
}} />
<Text config={{
  y: $screenHeight - headerHeight,
  height: headerHeight,
  align: 'center',
  verticalAlign: 'middle',
  text: progressiveLines.b,
  visible,
  ...questionTextAttrs
}} />