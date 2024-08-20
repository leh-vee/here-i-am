<script>
  export let isHidden = true;
</script>

<div class='drop-down menu' class:hide={ isHidden }>
  <slot></slot>
</div>

<style>
  .drop-down.menu {
    position: absolute;
    top: 27px;
    left: 0;
    bottom: 0;
    right: 0;
    color: white;
    background-color: black;
    z-index: 2;
    transition: bottom 500ms ease;
    overflow: scroll;
  }
  
  .drop-down.menu.hide {
    overflow: hidden;
    bottom: 100%;
  }
</style>