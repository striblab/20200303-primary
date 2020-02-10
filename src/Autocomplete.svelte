<script>
		import {intcomma} from 'journalize';
		import * as d3 from 'd3';
		require('@gouch/to-title-case')


		const regExpEscape = (s) => {
			return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&")
		}

		// declare responsive variables

		let county_selector_string;
		let key_no_space;

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
			export let placeholder = 'Search for county-level results';
			export let required= false;
			export let disabled= false;
			export let statewide_data;
			export let county_data_grouped;
			export let active_candidates;

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

					d3.selectAll('.county-map svg .counties path')
						.transition()
						.duration(350)
						.style('stroke-width', 1)
					  .style('opacity', 1)
				}
			}

			function dotColor(candidate, winner) {
				if (!winner) {
					return 'legend-' + candidate.toLowerCase() + 'noWinner';
				}
				else {
					return 'legend-' + candidate.toLowerCase();
				}

			}

			function dotColor2(candidate) {
					return 'legend-' + candidate.toLowerCase();
			}

			function winner(winner) {
				if (winner) {
					return 'winner'
				}
				else {
					return 'no-winner'
				}
			}

			function titleCase (str) {
			  if ((str===null) || (str===''))
			       return false;
			  else
			   str = str.toString();

			 return str.replace(/\w\S*/g,
			function(txt){return txt.charAt(0).toUpperCase() +
			       txt.substr(1).toLowerCase();});
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
					const text = item[1][0].reportingunitname.toUpperCase()
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
						arrowCounter = 0;	// Default select first item of list
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

				d3.selectAll('.county-map svg .counties path')
					.transition()
					.duration(350)
				  .style('opacity', 0.15);

				key_no_space = key.replace(/\s/g, "")
				county_selector_string = '[county_name=' + key_no_space + ']';

				d3.select(county_selector_string)
					.transition()
					.duration(350)
					.style('opacity', 1)
					.style('stroke-width', 1.5)

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
		width: 250px;
    background-color: white;
    box-shadow: 2px 2px 24px rgba(0, 0, 0, 0.1);
    position: absolute;
    z-index: 100;
		font-family: "Benton Sans", sans-serif;
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
</style>
<!-- <svelte:window on:click="{()=>close()}" /> -->
<div class="tableWrapper">

{#if key}
<h2>{titleCase(key)} County results</h2>
{:else}
<h2>Statewide results</h2>
{/if}


<!-- <div class="updates">
	{#if time < 10}
	<p class="countdown">Checking for updates 0:0{time}</p>
	{:else}
	<p class="countdown">Checking for updates 0:{time}</p>
	{/if}
</div> -->

<!-- <h4>{new Date(last_updated).toString("MMM d, yyyy HH:mm")}</h4> -->
<div on:click="{(event)=>event.stopPropagation()}" class="autocomplete">
  <input
    type="text"
    class="{className}"
    {name}
    {placeholder}
    {required}
    {disabled}
    value="{!key ? '' : titleCase(key) }"
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
				{@html titleCase(result.key)}
				</li>
		{/each}
  </ul>
</div>

<!-- {search}
{key} -->
{#if counties.includes(key)}
<table class="tableResults">
	<thead>
		<tr>
	      <th class="cand">Candidate</th>
	      <th class="votes">Votes</th>
				<th class="pct">Pct.</th>
	  </tr>
	</thead>
  <tbody>
		{#each value as candidate}
			{#if active_candidates.includes(candidate.last)}
	    <tr>
	      <td class="cand">
					<span class="{dotColor2(candidate.last)}"></span>
	        {#if candidate.first}
	          {candidate.first} {candidate.last}
	        {:else}
	          {candidate.last}
	        {/if}
	      </td>
	      <td class="votes">
					{#if Math.round(value[1].precinctsreportingpct) == 0}
						-
					{:else}
						{intcomma(candidate.votecount)}
					{/if}
	      </td>
				<td class="pct">
					{#if Math.round(value[1].precinctsreportingpct) == 0}
						-
					{:else}
						{Math.round(candidate.votepct * 100) }%
					{/if}
				</td>
	    </tr>
			{/if}
	  {/each}
	</tbody>
</table>

<p class="precincts">{ Math.round(value[1].precinctsreportingpct * 100) }% of precincts reporting</p>

{:else if search.length <= 2 }

<table class="tableResults">
	<thead>
		<tr>
	      <th class="cand">Candidate</th>
	      <th class="votes">Votes</th>
				<th class="pct">Pct.</th>
	  </tr>
	</thead>
  <tbody>
		{#each statewide_data as candidate}
			{#if active_candidates.includes(candidate.last)}

				{#if statewide_data[0].winner == true}
					<tr class="{winner(candidate.winner)}">
						<td class="cand">
							<span class="{dotColor(candidate.last, candidate.winner)}">&#10004</span>
							{#if candidate.first}
								{candidate.first} {candidate.last}
							{:else}
								{candidate.last}
							{/if}
						</td>
						<td class="votes">
							{intcomma(candidate.votecount)}
						</td>
						<td class="pct">
							{Math.round(candidate.votepct * 100) }%
						</td>
					</tr>
				{:else}

				<tr>
					<td class="cand">
						<span class="{dotColor2(candidate.last)}"></span>
						{#if candidate.first}
							{candidate.first} {candidate.last}
						{:else}
							{candidate.last}
						{/if}
					</td>
					<td class="votes">
						{#if state_precincts == 0}
							-
						{:else}
							{intcomma(candidate.votecount)}
						{/if}
					</td>
					<td class="pct">
						{#if state_precincts == 0}
							-
						{:else}
							{Math.round(candidate.votepct * 100) }%
						{/if}
					</td>
				</tr>

				{/if}
			{/if}
		{/each}
	</tbody>
</table>

<p class="precincts">{ Math.round(state_precincts * 100) }% of precincts reporting</p>

{:else}

<table class="tableResults">
	<thead>
		<tr>
	      <th class="cand">Candidate</th>
	      <th class="votes">Votes</th>
				<th class="pct">Pct.</th>
	  </tr>
	</thead>
	<tbody>
		{#each statewide_data as candidate}
			{#if active_candidates.includes(candidate.last)}
			{#if candidate.winner == true}
			<tr class="winner">
				<td class="cand">
					<span>&#10004</span>
					{#if candidate.first}
						{candidate.first} {candidate.last}
					{:else}
						{candidate.last}
					{/if}
				</td>
				<td class="votes">
	        {intcomma(candidate.votecount)}
	      </td>
				<td class="pct">
					{Math.round(candidate.votepct * 100) }%
				</td>
			</tr>

			{:else}
	    <tr>
				<td class="cand">
					<span class="{dotColor(candidate.last, candidate.winner)}"></span>
	        {#if candidate.first}
	          {candidate.first} {candidate.last}
	        {:else}
	          {candidate.last}
	        {/if}
	      </td>
	      <td class="votes">
	        {intcomma(candidate.votecount)}
	      </td>
				<td class="pct">
					{Math.round(candidate.votepct * 100) }%
				</td>

	    </tr>
			{/if}
			{/if}
	  {/each}
	</tbody>
</table>

<p class="precincts">{ Math.round(state_precincts * 100) }% of precincts reporting</p>
{/if}
</div>
