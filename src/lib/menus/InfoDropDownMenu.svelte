<script>
  import DropDownMenu from "./DropDownMenu.svelte";

  export let isVisible = false;
</script>

<DropDownMenu isHidden={ !isVisible }>
  <div id='info' class='dd-content'>
    <h1>Instructions</h1>
    <p>Read the poem. Eat the pies. Have a nice time.</p>
    <h1>Score</h1>
    <p>The score is calculated as a function of the number of total reading minutes multiplied by the number of pies eaten.</p>
    <h1>Here I Am</h1>
    <p>This an adaptation of the proen that introduces the book Me & My Shadow, avaiable from Publisher X</p>
    <h1>Playlist</h1>
    <ul>
      <li>Pi - Kate Bush</li>
      <li>Falling Down; Tom Waits</li>
    </ul>
  </div>
</DropDownMenu>

<style>
  #info.dd-content {
    font-family: 'Courier New', Courier, monospace;
    padding: 0 10px;
  } 
</style>