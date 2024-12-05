<script>
  import DropDownMenu from "./DropDownMenu.svelte";
  import FAQ from "./FAQ.svelte";

  export let isVisible = false;
</script>

<DropDownMenu isHidden={ !isVisible }>
  <div id='info'>
    <h2>Instructions</h2>
    <p>Read the poem. Eat the pies. Have a nice time.</p>
    <div id='faq'>
      <h2>Frequently Asked Questions</h2>
      <FAQ />
    </div>
    
  </div>
</DropDownMenu>

<style>
  #info {
    font-family: 'Courier New', Courier, monospace;
    padding: 0 10px;
  } 
</style>