<script>
  import { Stage } from 'svelte-konva';
  import Overture from './Overture.svelte';
  import Countdown from './Countdown.svelte';
  import SwanSong from './SwanSong.svelte';
  import VerseNumber from './VerseNumber.svelte';
  import { isDataInitialized } from '../stores/base';

  const movements = ['overture', 'countdown', 'swanSong'];
  let movementIndex = 0;
  $: movement = movements[movementIndex];

  function nextMovement() { movementIndex += 1 }
</script>

<Stage config={{ width: window.innerWidth, height: window.innerHeight }}>
  {#if movement === 'overture' }
    <Overture on:goneNova={ nextMovement } />
  {:else if movement === 'countdown' }
    <Countdown on:groundZero={ nextMovement } />
  {:else if movement === 'swanSong' }
    <SwanSong />
  {/if}
</Stage>
{#if isDataInitialized}
  <VerseNumber />
{/if}