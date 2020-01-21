<script>

export let state;

</script>

<table>
  <tr>
      <th>
          Candidate
      </th>
      <th>
          Votes
      </th>
  </tr>
  {#each state as state}
    <tr>
      <td>
        {#if state.first}
          {state.first} {state.last}
        {:else}
          {state.last}
        {/if}
      </td>
      <td>
        {state.votecount}
      </td>
    </tr>
  {/each}
</table>

<!-- <p>
  {state}
</p> -->
