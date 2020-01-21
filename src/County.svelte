<script>

export let county;
let county_fips = county[0];
let candidates = county[1];

</script>

<h2>{county_fips} County</h2>
<table>
  <tr>
      <th>
          Candidate
      </th>
      <th>
          Votes
      </th>
  </tr>
  {#each candidates as candidate}
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
