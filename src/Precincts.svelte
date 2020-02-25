<script>
  export let state_precincts_pct;

  let pct;

  $: {
    pct = state_precincts_pct;
  }
</script>

<p class="precincts">{ Math.round(pct * 100) }% of precincts reporting</p>
