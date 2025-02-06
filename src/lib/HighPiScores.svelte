<script>

</script>

<div id='high-scores'>
  <div class='title'>
    <h2>Masters of <span class='pi'>π</span></h2>
  </div>
  <div class='list'>
    <table>
      <tbody>
        <tr>
          <td>Anastasia</td>
          <td>14:35.956</td>
        </tr>
        <tr>
          <td>Dara</td>
          <td>17:21.731</td>
        </tr>
        <tr>
          <td>Mickey</td>
          <td>20:44.739</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<style>
  #high-scores {
    width: 100%;
    height: 100%;
    font-family: Helvetica, sans-serif;
  } 

  .title {
    width: 100%;
    height: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title h2 {
    color: gold;
    font-size: 4.5dvh;
  }

  .pi {
    font-family: Times New Roman; 
    font-size: 7dvh;
  }

  .list {
    width: 100%;
    height: 70%;
  }

  table {
    table-layout: fixed;
    width: 100%;
    font-size: 6vw;
  }

  tr {
    height: 40px;
    vertical-align: middle;
  }

  tr td:first-child {
    color: lightgray;
    text-align: right;
    padding-right: 5%;
  }
  
  tr td:last-child {
    color: white;
    font-family: 'digital';
    text-align: center;
  }

</style>