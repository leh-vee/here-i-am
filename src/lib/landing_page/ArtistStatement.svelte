<script>
  import { Text } from 'svelte-konva';
  import { fetchArtistStatements } from '../../api/client.js';
  import { serializeCouplets } from '../../utils/textJson.js';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let statements, nStatements, statementIndex;
  fetchArtistStatements().then(lines => { 
    statements = serializeCouplets(lines);
    nStatements = statements.length;
    statementIndex = nStatements;
  });

  export let visible = false;
  
  let statement = { a: "", b: "" };
  let progressiveLines = { a: "", b: "" };
  $: if (visible) revealNextStatement();

  async function revealNextStatement() {
    statementIndex = (statementIndex >= nStatements - 1) ? 0 : statementIndex + 1; 
    statement =  structuredClone(statements[statementIndex]);
    statement.a = `...${statement.a}`;
    progressiveLines = { a: "", b: "" };
    await buildLine();
    await buildLine('b');
    dispatch('revealed');
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
    fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
    fontSize: Math.round(width / 20),
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