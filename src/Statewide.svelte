<script>

export let statewide_data;
let last_updated;
$: {
  if (statewide_data.length == 0) {
    last_updated = ''
  }
  else {
    last_updated = statewide_data[0].lastupdated;
  }
}
</script>


<h1>Statewide results</h1>
<h4>{last_updated}</h4>
<table>
  <tr>
      <th>
          Candidate
      </th>
      <th>
          Votes
      </th>
  </tr>
  {#each statewide_data as candidate}
    <tr>
      <td>
        {#if candidate.first}
          {candidate.first} {candidate.last}
        {:else}
          {candidate.last}
        {/if}
      </td>
      <td>
        {candidate.votecount}
      </td>
    </tr>
  {/each}
</table>
