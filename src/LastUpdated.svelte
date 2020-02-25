<script>

  export let timestamp;
  let last_updated;
  let options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};

  $: {
    let datestring = new Date(timestamp)
    last_updated = datestring.toLocaleString('en-US', options)
  }

</script>

<p class="lastUpdated">Last change: <span class="updatedTime">{last_updated}</span></p>
