<script>
  import DropDownMenu from "./DropDownMenu.svelte";
  import { fetchFaqText } from '../../api/client.js';
  import { serializeCouplets } from '../../utils/textJson.js';

  export let isVisible = false;

  let faqs = [];
  fetchFaqText().then(lines => {
    faqs = serializeCouplets(lines);
  });
</script>

<DropDownMenu isHidden={ !isVisible }>
  <div id='info'>
    <h3>Instructions</h3>
    <p>Read the poem. Eat the pies. Have a nice time.</p>
    <p>The score is calculated as a function of the number of total reading minutes multiplied by the number of pies eaten.</p>
    <div id='faq'>
      <h3>Frequently Asked Questions</h3>
      {#each faqs as qaPair}
        <h4 class='question'>{ qaPair.a }</h4>
        <p>{ qaPair.b }</p>
      {/each}
    </div>
    
  </div>
</DropDownMenu>

<style>
  #info {
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    padding: 0 10px;
    overflow-y: inherit;
  } 

  h3 {
    color: gold;
  }
  
  .question {
    color: gray;
  }
</style>