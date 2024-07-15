<script>
  export let number;
  export let isVisible = false;

  let isFontLoaded = false;

  const fontSize = Math.round(window.innerWidth / 2);
  const fontFamily = "Wellfleet";
  document.fonts.ready.then((fontFaceSet) => {
    const fontFaces = [...fontFaceSet];
    const wellFleetFontFaces = fontFaces.filter(f => f.family === fontFamily);
    Promise.all(wellFleetFontFaces.map(ff => ff.load())).then(() => { 
      isFontLoaded = true;
    });
  });
</script>

{#if isVisible && isFontLoaded}
<div id='number-wrapper'>
  <span id='verse-number' style='--fontSize:{fontSize};'>
    { number }
  </span>
</div>
{/if}

<style>
#number-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

}

#verse-number {
  color: white;
  font-size: calc( var(--fontSize) * 1px );
  font-family: "Wellfleet";
}
</style>