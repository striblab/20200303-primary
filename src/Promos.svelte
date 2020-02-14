<script>

export let wire;
export let local;

</script>

<div class="promos">
  <div class="natWire">
    <h3>Other Super Tuesday Results and this gets the headline to 2 lines</h3>
    <ul>
      {#each wire as result}
      <li><a href="{result.url}">{result.headline}</a></li>
      {/each}
    </ul>
  </div>
  <div class="hot-dish">
    <h3>Morning Hot Dish</h3>
    <p>Minnesota political news and musings, served up every weekday morning.</p>
    <iframe width="300" height="150" src="http://www.startribune.com/weekly-sports-signup/527965271/?c=n" frameborder="0" title="Hot Dish Signup"></iframe>
  </div>
  <div class="otherStories">
    <h3>More Star Tribune political coverage from Super Tuesday</h3>
    <ul>
      {#each local as result}
      <li><a href="{result.url}">{result.headline}</a></li>
      {/each}
    </ul>
  </div>
</div>
