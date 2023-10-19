<script>
    import { currentWord } from '../stores/text.js';
</script>

<p class='word'>{ $currentWord }</p>

<style>
  .word {
    text-align: center;
    position: absolute;
    top: 25%;
    width: 100%;
    font-size: 70px;
  }

</style>