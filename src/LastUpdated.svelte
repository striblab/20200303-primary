<script>

import * as moment from 'moment';

  export let timestamp;
  export let raw_timestamp;
  export let statewide_data;
  let timestampIE;
  let last_updated;
  let last_updatedIE;
  let options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};

  let results = false

  moment.defaultFormat = "DD.MM.YYYY HH:mm";

  $: {
    let datestring = new Date(timestamp)
    last_updated = datestring.toLocaleString('en-US', options)

    timestampIE = raw_timestamp;
    let datestringIE = new Date(timestampIE)
    last_updatedIE = moment(datestringIE).format('MMM D YYYY, h:mm a')

    if (statewide_data[0].precinctsreporting === 0) {
      results = false;
    }
    else {
      results = true;
    }
  }

</script>

{#if results}
<p class="lastUpdated">Last change: <span class="updatedTime">{last_updated}</span></p>
<p class="lastUpdatedIe">Last change: <span class="updatedTime">{last_updatedIE}</span></p>
{:else}
<p class="lastUpdated">Last change: <span class="updatedTime">&#8211</span></p>
<p class="lastUpdatedIe">Last change: <span class="updatedTime">&#8211</span></p>
{/if}
