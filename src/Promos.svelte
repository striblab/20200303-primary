<script>

export let elex_controls;

</script>

{#if elex_controls}
<div class="promos">
  <div class="natWire">
    <h3>Other Super Tuesday Results and this gets the headline to 2 lines</h3>
    <ul>
      {#each elex_controls.wire as result}
      <li><a href="{result.url}">{result.headline}</a></li>
      {/each}
    </ul>
  </div>
  <!-- <div class="hot-dish">
    <h3>Morning Hot Dish</h3>
    <p>Minnesota political news and musings, served up every weekday morning.</p>
    <iframe width="300" height="150" src="http://www.startribune.com/hot-dish-signup/567799381/?c=n" frameborder="0" title="Hot Dish Signup"></iframe>
  </div> -->
  <div class="otherStories">
    <h3>More Star Tribune political coverage from Super Tuesday</h3>
    <ul>
      {#each elex_controls.local as result}
      <li><a href="{result.url}">{result.headline}</a></li>
      {/each}
    </ul>
  </div>
</div>
{/if}
