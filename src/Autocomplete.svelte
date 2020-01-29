<script>

		const regExpEscape = (s) => {
			return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&")
		}

		// declare responsive variables
		let last_updated;
		$: {
			if (statewide_data.length == 0) {
				last_updated = '';
			}
			else {
				// last_updated = Date.parse(statewide_data[0].lastupdated);
				last_updated = new Date(statewide_data[0].lastupdated).toString("MMM d, yyyy HH:mm")
			}
		}
		let counties = [];
		var i;
		$: {
			for (i = 0; i < county_data_grouped.length; i++) {
				// counties.push(county_data_grouped[i][1][0].reportingunitname.toUpperCase());
				counties.push(county_data_grouped[i][1][0].reportingunitname);
			}
		}

		let state_precincts
		$: {
			if (statewide_data.length == 0) {
				state_precincts = '';
			}
			else {
				state_precincts = statewide_data[0].precinctsreportingpct;
			}
		}

			export let name= '';
			export let value= '';
			export let placeholder = 'Search for county results';
			export let required= false;
			export let disabled= false;
			export let statewide_data;
			export let county_data_grouped;

			// autocomplete props
			export let items= [];
			export let isOpen= false;
			export let results= [];
			export let search= '';
			export let isLoading= false;
			export let arrowCounter= 0;


      let className= 'county_input';
      let isAsync= false;
      let minChar= 1;
      let maxItems= 10;
      let fromStart= true; // Default type ahead
			let list;
			let input;
      let key;

			async function onChange (event) {
				// Is the data given by an outside ajax request?
			  if (search.length >= Number(minChar)) {
					filterResults()
					isOpen = true;
				}
				else {
					isOpen = false;
					key = null;
				}
			}
			function filterResults () {
        // console.log(items)
				results = items.filter(item => {
					if (items.length == 0) {
						item = item.key || '' // Silent fail
					}
          else {
            return fromStart ? item[1][0].reportingunitname.toUpperCase().startsWith(search.toUpperCase())
  													 : item[1][0].reportingunitname.toUpperCase().includes(search.toUpperCase())
          }

				})
				.map(item => {
					const text = item[1][0].reportingunitname
					return {
						key: text,
						value: item[1],
						label: search.trim() === '' ? text : text.replace(RegExp(regExpEscape(search.trim()), 'i'), "<span>$&</span>")
					}
				});

				const height = results.length > maxItems ? maxItems : results.length
				list.style.height = `${height * 2.25}rem`
			}
    function onKeyDown (event) {
      if (event.keyCode === 40 && arrowCounter < results.length) {
        // ArrowDown
        arrowCounter =  arrowCounter + 1
      } else if (event.keyCode === 38 && arrowCounter > 0) {
        // ArrowUp
        arrowCounter =  arrowCounter - 1;
      } else if (event.keyCode === 13) {
        // Enter
        event.preventDefault()

        if (arrowCounter === -1) {
					if (search.length < 2) {

					}
					else {
						arrowCounter = 0;	// Default select first item of list
					}
        }
        close(arrowCounter)
      } else if (event.keyCode === 27) {
        // Escape
        event.preventDefault()
        close()
      }
    }
    function close (index = -1) {
      isOpen = false;
			arrowCounter = -1;
     	input.blur();
      if (index > -1) {
      	value = results[index].value;
				key = results[index].key;

      } else if (!value) {
        search = null;
      }
    }
  function onupdate ({ changed, current }) {
    if (isAsync && changed.items && current.items.length) {
       items = current.items;
       isLoading = false;
       isOpen = true;
       filterResults();
    }
	}
</script>

<style>
  * {
    box-sizing: border-box;
  }

  input {
    height: 2rem;
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
  }

  .autocomplete {
    position: relative;
  }

  .hide-results {
    display: none;
  }

  .autocomplete-results {
    padding: 0;
    margin: 0;
    border: 1px solid #dbdbdb;
    height: 6rem;
    overflow: auto;
    width: inherit;

    background-color: white;
    box-shadow: 2px 2px 24px rgba(0, 0, 0, 0.1);
    position: absolute;
    z-index: 100;
  }

  .autocomplete-result {
    color: #7a7a7a;
    list-style: none;
    text-align: left;
    height: 2rem;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
  }

  .autocomplete-result > :global(span) {
    background-color: none;
    color: #242424;
    font-weight: bold;
  }

  .autocomplete-result.is-active,
  .autocomplete-result:hover {
    background-color: #dbdbdb;
  }

	/* .tableWrapper {
		text-align: center;
	} */
</style>
<!-- <svelte:window on:click="{()=>close()}" /> -->
<div class="tableWrapper">

{#if key}
<h2>{key} County results</h2>
{:else}
<h2>Statewide results</h2>
{/if}

<h4>{last_updated}</h4>
<!-- <h4>{new Date(last_updated).toString("MMM d, yyyy HH:mm")}</h4> -->
<div on:click="{(event)=>event.stopPropagation()}" class="autocomplete">
  <input
    type="text"
    class="{className}"
    {name}
    {placeholder}
    {required}
    {disabled}
    value="{key || ''}"
    autocomplete="{name}"
    bind:value="{search}"
    on:input="{(event)=>onChange(event)}"
    on:focus
    on:blur
    on:keydown="{(event)=>onKeyDown(event)}"
    bind:this={input}
  >
  <ul class="autocomplete-results{!isOpen ? ' hide-results' : ''}" bind:this={list}>
		{#each results as result, i}
				<li on:click="{()=>close(i)}" class="autocomplete-result{ i === arrowCounter ? ' is-active' : '' }">
				{@html result.label}
				</li>
		{/each}
  </ul>
</div>

<!-- {search}
{key} -->
{#if search.length > 2 && counties.includes(key)}
<table>
  <tr>
      <th>
          Candidate
      </th>
      <th>
          Votes
      </th>
  </tr>
  {#each value as candidate}
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

<!-- <div class="reporting">
	{ Math.round(tooltipResults[0].precinctsreportingpct * 100) }% precincts reporting in county
</div> -->

{:else if search.length <= 2 }

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

<p>{ Math.round(state_precincts * 100) }% of precincts reporting</p>

{:else}

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

{/if}
</div>
