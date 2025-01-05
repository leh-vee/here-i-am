<script>
  import DropDownMenu from "./DropDownMenu.svelte";

  export let isVisible = false;
</script>

<DropDownMenu isHidden={ !isVisible }>
  <div id='masters'>
    <h2>Masters of Pi</h2>
    <p id='intro'>
      Players who have collected all three pies
    </p>
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
        <tr>
          <td>Susan</td>
          <td>23:10.321</td>
        </tr>
        <tr>
          <td>Cassandra</td>
          <td>30:51.212</td>
        </tr>
        <tr>
          <td>Kevin</td>
          <td>67:50.137</td>
        </tr>
        <tr>
          <td>Dorothy</td>
          <td>103:12.210</td>
        </tr>
        <tr>
          <td>Noah</td>
          <td>121:44.665</td>
        </tr>
        <tr>
          <td>Billie</td>
          <td>150:15.936</td>
        </tr>
        <tr>
          <td>Devandra</td>
          <td>217:29.421</td>
        </tr>
        <tr>
          <td>Felix</td>
          <td>300:30.739</td>
        </tr>
        <tr>
          <td>Sasha</td>
          <td>315:20.019</td>
        </tr>
        <tr>
          <td>Leslie</td>
          <td>320:44.211</td>
        </tr>
        <tr>
          <td>Honey</td>
          <td>337:20.127</td>
        </tr>
        <tr>
          <td>Trish</td>
          <td>401:01.001</td>
        </tr>
        <tr>
          <td>Sam</td>
          <td>403:21.311</td>
        </tr>
      </tbody>
    </table>
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
    color: gold;
    margin-bottom: 0;
  }
  
  #intro {
    margin-top: 2px;
    text-align: center;
    color: lightyellow;
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