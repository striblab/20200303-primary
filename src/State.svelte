<script>

export let state;

</script>

<table>
  {#each state as state}
    <tr>
      <td>
        <!-- check for Uncommitted -->
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
