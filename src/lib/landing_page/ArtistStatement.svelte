<script>
  import { Text } from 'svelte-konva';
  import { fetchArtistStatements } from '../../api/client.js';
  import { serializeCouplets } from '../../utils/textJson.js';

  let statements, nStatements, statementIndex;
  fetchArtistStatements().then(lines => { 
    statements = serializeCouplets(lines);
    nStatements = statements.length;
    statementIndex = nStatements;
  });

  export let visible = false;

  let statement = { a: "", b: "" };
  $: if (visible) {
    if (statementIndex >= nStatements - 1) {
      statementIndex = 0; 
    } else {
      statementIndex += 1;
    }
    statement = statements[statementIndex];
  }
  
  let progressiveLineA;
  let progressiveLineB;
  
  const width = window.innerWidth;
  const questionTextAttrs = {
    x: 5,
    width: width - 5,
    fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
    fontSize: Math.round(width / 30),
    fill: 'black'
  }
</script>

<Text config={{
  y: 0,
  height: window.innerHeight / 3,
  align: 'center',
  verticalAlign: 'middle',
  text: `...${statement.a}`,
  visible,
  ...questionTextAttrs
}} />
<Text config={{
  y: window.innerHeight - window.innerHeight / 3,
  height: window.innerHeight / 3,
  align: 'center',
  verticalAlign: 'middle',
  text: statement.b,
  visible,
  ...questionTextAttrs
}} />