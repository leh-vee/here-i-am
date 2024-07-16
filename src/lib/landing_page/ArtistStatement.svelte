<script>
  import { Text } from 'svelte-konva';
  import { fetchArtistStatements } from '../../api/client.js';
  import { serializeCouplets } from '../../utils/textJson.js';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  let statements, nStatements; 
  let statementIndex = 0;
  fetchArtistStatements().then(lines => { 
    statements = serializeCouplets(lines);
    nStatements = statements.length;
  });

  export let visible = false;
  
  let statement = { a: "", b: "" };
  let progressiveLines = { a: "", b: "" };
  $: if (visible) revealNextStatement();

  async function revealNextStatement() {
    progressiveLines = { a: "", b: "" };
    await buildEllipsis();
    if (statementIndex < nStatements) {
      statement =  structuredClone(statements[statementIndex]);
      await buildLine();
      await buildLine('b');
      setTimeout(() => {
        progressiveLines.b += '.';
        statementIndex += 1;
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
      const lineText = statement[line];
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