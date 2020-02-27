<script>
		import LastUpdated from './LastUpdated.svelte';
		import Precincts from './Precincts.svelte';

		import {intcomma} from 'journalize';
		import * as d3 from 'd3';

		const regExpEscape = (s) => {
			return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&")
		}

		// $: {
		// 	console.log(statewide_data)
		// 	console.log('statewide')
		// }
		//
		// console.log(statewide_data)
		// console.log('statewide outside reactive')


		// declare responsive variables
		let county_selector_string;
		let key_no_space;


		let counties = [];
		var i;

		// export let search_timeout;
		// export let previous_search_term = '';

		let last_updated = '';
		let state_precincts_pct;
		let datestring;
		var options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
		$: {
			for (i = 0; i < county_data_grouped.length; i++) {
				counties.push(county_data_grouped[i][1][0].reportingunitname.toUpperCase());
				// counties.push(county_data_grouped[i][1][0].reportingunitname);
			}
			// console.log('setting statwide data')
			if (statewide_data.length > 0) {
				datestring = new Date(statewide_data[0].lastupdated)
				last_updated = datestring.toLocaleString('en-US', options)
				// console.log('changing date')
				// console.log(last_updated)
				// console.log('inside if')
			}

			if (statewide_data.length > 0) {
				state_precincts_pct = statewide_data[0].precinctsreportingpct;
				// console.log('changing precinct pct')
				// console.log(state_precincts_pct)
			}
		}

		// expanding table variables
		let expand_cands = '+ See all candidates';
		let expanded = false;

		function handleClick() {
			if (expanded === false) {
				expanded = true;
				expand_cands = '\u2013 See active candidates';
				window.gtag("event", "Candidate list click", {'event_category': '2020 Primary results', 'event_label': 'Show all candidates'});
			}
			else {
				expanded = false;
				expand_cands = '+ See all candidates';
				window.gtag("event", "Candidate list click", {'event_category': '2020 Primary results', 'event_label': 'Show only top candidates'});
			}

		}

		let county_record;
		let county_name;
		$: {
			if (fips == null) {
				county_name = ''
			}
			else {
				county_record = us_county_names.find(element => element.geoid === fips);
				// console.log(county_record)
				// console.log(fips)
				county_name = county_record.name;
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
			export let us_county_names;

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
			let fips;

			async function onChange (event) {
			  if (search.length >= Number(minChar)) {
					filterResults()
					isOpen = true;
				}
				else {
					isOpen = false;
					key = null;
					fips = null;

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

			function winner(winner, manual_winner) {
					if (winner || manual_winner) {
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
					const fips = item[1][0].fipscode
					return {
						key: text,
						fips: +fips,
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
				fips = results[index].fips;

				d3.selectAll('.county-map svg .counties path')
					.transition()
					.duration(350)
				  .style('opacity', 0.25);

				key_no_space = key.replace(/\s/g, "").replace(/\./g,'')
				county_selector_string = '[county_name=' + key_no_space + ']';

				d3.select(county_selector_string)
					.transition()
					.duration(350)
					.style('opacity', 1)
					.style('stroke-width', 1.5)

			// send Google analytics event
			logSearch(key);

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

	const logSearch = function (search_string) {
		window.gtag("event", "County search", {'event_category': '2020 Primary results', 'event_label': search_string});
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
		font-size: 16px !important;
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

	.filtered {
		font-family: "Benton Sans", sans-serif;
		font-size: 12px;
		font-style: italic;
		color: #989898;
		margin-top: 6px;
		margin-bottom: 6px;
	}
</style>
<!-- <svelte:window on:click="{()=>close()}" /> -->
<div class="tableWrapper">

{#if key}
<h2>{county_name} County results</h2>
{:else}
<h2>Statewide results</h2>
{/if}

<!-- <slot>

</slot> -->
<!-- <div class="updates">
	{#if time < 10}
	<p class="countdown">Checking for updates 0:0{time}</p>
	{:else}
	<p class="countdown">Checking for updates 0:{time}</p>
	{/if}
</div> -->
{#if statewide_data.length > 0}
<LastUpdated timestamp={last_updated}></LastUpdated>
{/if}
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
<p class="filtered">Results are filtered</p>
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
			{#if expanded == false}
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
						{#if Math.round(value[1].precinctsreporting) == 0}
							-
						{:else}
							{intcomma(candidate.votecount)}
						{/if}
		      </td>
					<td class="pct">
						{#if Math.round(value[1].precinctsreporting) == 0}
							-
						{:else}
							{Math.round(candidate.votepct * 1000) / 10 }%
						{/if}
					</td>
		    </tr>
				{/if}
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
					{#if Math.round(value[1].precinctsreporting) == 0}
						-
					{:else}
						{intcomma(candidate.votecount)}
					{/if}
				</td>
				<td class="pct">
					{#if Math.round(value[1].precinctsreporting) == 0}
						-
					{:else}
						{Math.round(candidate.votepct * 1000) / 10 }%
					{/if}
				</td>
			</tr>
			{/if}
	  {/each}
		<tr on:click={handleClick}><td class="expand" colspan="3">{expand_cands}</td></tr>
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
		{#if expanded === false}
			{#if active_candidates.includes(candidate.last)}
				{#if statewide_data.filter(e => e.manual_winner == true).length > 0 }
					<tr class="{winner(candidate.winner, candidate.manual_winner)}">
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
							{Math.round(candidate.votepct * 1000) / 10 }%
						</td>
					</tr>
				{:else if statewide_data.filter(e => e.winner == true).length > 0}
					<tr class="{winner(candidate.winner, candidate.manual_winner)}">
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
							{Math.round(candidate.votepct * 1000) / 10 }%
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
						{#if state_precincts_pct == 0}
							-
						{:else}
							{intcomma(candidate.votecount)}
						{/if}
					</td>
					<td class="pct">
						{#if state_precincts_pct == 0}
							-
						{:else}
							{Math.round(candidate.votepct * 1000) / 10 }%
						{/if}
					</td>
				</tr>
				{/if}
			{/if}
		{:else}
		{#if statewide_data.filter(e => e.manual_winner == true).length > 0 }
			<tr class="{winner(candidate.winner, candidate.manual_winner)}">
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
					{Math.round(candidate.votepct * 1000) / 10 }%
				</td>
			</tr>
		{:else if statewide_data.filter(e => e.winner == true).length > 0}
			<tr class="{winner(candidate.winner, candidate.manual_winner)}">
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
					{Math.round(candidate.votepct * 1000) / 10 }%
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
				{#if state_precincts_pct == 0}
					-
				{:else}
					{intcomma(candidate.votecount)}
				{/if}
			</td>
			<td class="pct">
				{#if state_precincts_pct == 0}
					-
				{:else}
					{Math.round(candidate.votepct * 1000) / 10 }%
				{/if}
			</td>
		</tr>
		{/if}
		{/if}
		{/each}
		<tr on:click={handleClick}><td class="expand" colspan="3">{expand_cands}</td></tr>
	</tbody>
</table>

{#if statewide_data.length > 0}
<Precincts {state_precincts_pct}/>
{/if}

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
				{#if statewide_data.filter(e => e.manual_winner == true).length > 0 }
					<tr class="{winner(candidate.winner, candidate.manual_winner)}">
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
							{Math.round(candidate.votepct * 1000) / 10 }%
						</td>
					</tr>
				{:else if statewide_data.filter(e => e.winner == true).length > 0}
					<tr class="{winner(candidate.winner, candidate.manual_winner)}">
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
							{Math.round(candidate.votepct * 1000) / 10 }%
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
						{#if state_precincts_pct == 0}
							-
						{:else}
							{intcomma(candidate.votecount)}
						{/if}
					</td>
					<td class="pct">
						{#if state_precincts_pct == 0}
							-
						{:else}
							{Math.round(candidate.votepct * 1000) / 10 }%
						{/if}
					</td>
				</tr>
				{/if}
			{/if}
		{/each}
		<tr on:click={handleClick}><td class="expand" colspan="3">{expand_cands}</td></tr>
	</tbody>
</table>

{#if statewide_data.length > 0}
<Precincts {state_precincts_pct}/>
{/if}
{/if}
</div>
