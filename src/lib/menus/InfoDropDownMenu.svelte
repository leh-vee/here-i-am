<script>
  import DropDownMenu from "./DropDownMenu.svelte";
  import { fetchFaqText } from '../../api/client.js';
  import { serializeFaqText } from '../../utils/textJson.js';

  export let isVisible = false;

  let faqs = [];
  fetchFaqText().then(lines => {
    faqs = serializeFaqText(lines);
  });
</script>

<DropDownMenu isHidden={ !isVisible }>
  <div id='info'>
    <h2>Instructions</h2>
    <p>Read the poem. Eat the pies. Have a nice time.</p>
    <p>The score is calculated as a function of the number of total reading minutes multiplied by the number of pies eaten.</p>
    <div id='faq'>
      <h2>Frequently Asked Questions</h2>
      {#each faqs as qaPair}
        <h4>{ qaPair.q }</h4>
        <p>{ qaPair.a }</p>
      {/each}
    </div>
    
  </div>
</DropDownMenu>

<style>
  #info {
    font-family: 'Courier New', Courier, monospace;
    padding: 0 10px;
  } 
</style>