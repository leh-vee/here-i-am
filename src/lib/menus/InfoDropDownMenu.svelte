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
    <h3>Frequently Asked Questions</h3>
    <div id='faq'>
      {#each faqs as qaPair}
        <span class='question'>{ qaPair.a }</span>
        <br />
        <span class='answer'>{ qaPair.b }</span>
        <br />
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
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    text-align: center;
    color: gold;
  }

  #faq {
    display: inline-flex;
    flex-direction: column;
  }
  
  span {
    font-family: Helvetica, sans-serif;
    font-size: 3vw;
    font-weight: 400;
    color: black;
    background-color: rgb(230	230	232);
    padding: 5px 10px;
    align-self: baseline;
    max-width: 75%;
    border-radius:10px;
  }

  .answer {
    align-self: flex-end;
    background-color: rgb(41, 132, 245);
    color: white;
  }

</style>