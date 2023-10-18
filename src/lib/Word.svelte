<script>
    import { currentWord, isEllipsisWord } from '../stores/text.js';

    $: word = ($isEllipsisWord ? '.' : $currentWord);
</script>

<p class='word'>{ word }</p>

<style>
  .word {
    text-align: center;
    position: absolute;
    top: 25%;
    width: 100%;
    font-size: 70px;
  }

</style>