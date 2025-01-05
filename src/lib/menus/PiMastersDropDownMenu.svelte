<script>
  import DropDownMenu from "./DropDownMenu.svelte";

  export let isVisible = false;
</script>

<DropDownMenu isHidden={ !isVisible }>
  <div id='masters'>
    <h2>Masters of Pi</h2>
  </div>
</DropDownMenu>

<style>
  #masters {
    padding: 0 10px;
    font-family: Helvetica, sans-serif;
    overflow-y: inherit;
  } 

  h2 {
    text-align: center;
    color: white;
  }
</style>