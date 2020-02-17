<script>
	import Map from './Map.svelte';
	import VoteDensityMap from './VoteDensityMap.svelte';
	import Autocomplete from './Autocomplete.svelte';
	import VotesByPop from './VotesByPop.svelte';
	import Promos from './Promos.svelte';

	import mn from './data/mn.json';
	import mn_cities from './data/mn_cities.json';
	import mn_roads from './data/mn_roads.json';

	// import nh from './data/nh.json';
	// import nh_cities from './data/nh_cities.json';
	// import nh_roads from './data/nh_roads.json';

	// import ia from './data/ia.json';
	// import ia_cities from './data/ia_cities.json';
	// import ia_roads from './data/mn_roads.json';  // Not really using

	import us_county_names from './data/us_county_names.json'
	import { onMount } from 'svelte';
	import _ from 'lodash';

	export let title;

	export let data = [];
	export let wire = [];
	export let local = [];
	export let demographic = {};
	export let county_data = [];
	export let county_data_grouped;

  export let statewide_data;

	export let active_candidates = ['Biden', 'Bloomberg', 'Buttigieg', 'Gabbard', 'Klobuchar', 'Sanders', 'Steyer', 'Warren'];
	export let results_by_candidate = [];

	let last_updated;
	let datestring;

	var options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
	$: {
		if (statewide_data.length == 0) {
			last_updated = '';
		}
		else {
			datestring = new Date(statewide_data[0].lastupdated)
			last_updated = datestring.toLocaleString('en-US', options)
			// last_updated = statewide_data[0].lastupdated
		}
	}

	$ : {
		statewide_data = data.filter(function(d) {
      return d.level == "state";
    });
    county_data = data.filter(function(d) {
      return d.level == "county";
    })

		statewide_data = _.orderBy(statewide_data, ["votecount"], ["desc"])
		county_data_grouped = Object.entries(_.chain(county_data).orderBy(["votecount"], ["desc"]).groupBy("fipscode").value());

		// This data used to generate the density maps, in order of biggest vote getters
		results_by_candidate = [];
		if (statewide_data.length > 0) {
			active_candidates.forEach(function(candidate){
				let candidate_data = {
					'candidate': candidate,
					'results': county_data.filter(function(d) {
			      return d.last == candidate;
			    })
				}
				if (candidate_data.results.length > 0) {
					candidate_data.total_votes = statewide_data.filter(function(d) {
			      return d.last == candidate;
			    })[0].votecount
					results_by_candidate.push(candidate_data);
				}
			});
			results_by_candidate = results_by_candidate.sort(function(first, second) {
			 return second.total_votes - first.total_votes;
			})
		}

	}

	// export let id = contentIDGenerator(0, stories)
	let id = 0;
	let length;
	function handleClick(length) {
		if ( id == length - 1 ) {
			id = 0
		}
		else {
			id += 1;
		}
	}

	let getData = async function() {
		const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-latest.json");
		// const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-20200206040222.json"); // iowa
		// const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-20200210170906.json");

		const json = await response.json()
		data = json;
		time = 30;
		timerInterval = setInterval(countdown, 1000);
	}

	let time = 30;
	function countdown() {
		if (time == 0) {
			time = 'Updating...'
			setTimeout(getData, 1000)
			clearInterval(timerInterval);
		}
		else {
			time--;
		}
	}
	let timerInterval = setInterval(countdown, 1000);

	onMount(async function() {
		const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-latest.json");
		// const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-20200206040222.json"); // iowa
		const wireResponse = await fetch("https://static.startribune.com/elections/projects/2020-election-results/wire.json");
		const localResponse = await fetch("https://static.startribune.com/elections/projects/2020-election-results/local.json");
		const demographicResponse = await fetch("https://static.startribune.com/elections/projects/2020-election-results/demographic.json");
    // const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-20200210170906.json");
    const json = await response.json();
		const wireJson = await wireResponse.json();
		const localJson = await localResponse.json();
		const demographicJson = await demographicResponse.json();
    data = json;
		wire = wireJson;
		local = localJson;
		demographic = demographicJson;
  });

</script>

<style>

	.live2 {
		font-family: "Benton Sans", sans-serif;
		font-weight: 700;
		color: red;
		text-align: center;
		/* margin-top: 30px; */
	}

	.small-maps {
		display: flex;
		flex-wrap: wrap;
	}

	#demographics-groups {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-left: 5%;
		margin-right: 5%;
		/* width: 50%;
		display: flex;
		flex-wrap: wrap; */
	}

	.demographics-container {
		/* max-width: 50%; */
		flex: 0 43%;
		margin-bottom: 3em;
	}

	/* .candidate-breakdown {
		display: flex;
	  flex-direction: row;
	  flex-wrap: wrap;
	  max-width: 1000px;
	} */

	@keyframes fadeIn {
		from { opacity: 0 }
	}
</style>

<div class="leadin">

	<div class="elexLogo">
		<div class="text">
			<h3>ELECTION</h3>
		</div>
		<img src="https://static.startribune.com/news/projects/all/20200303-elex-results/build/img/ELEX2020.svg" alt="Election 2020"/>
	</div>

	<h1>{title}</h1>
	<div class="share-block"></div>

	<p>Here is some intro text that will go in this space. This will only be one or two paragraphs. Short paragraphs. There are lots of potential candidates in this primary but only a few potential winners.</p>
	<p>Here is some intro text that will go in this space. This will only be one or two paragraphs. Short paragraphs. There are lots of potential candidates in this primary but only a few potential winners.</p>
</div>

<div class="updates">
	<p class="live2">&bull; LIVE</p>
	{#if typeof(time) == "string"}
	<p class="countdown">{time}</p>
	{:else}
		{#if time < 10}
		<p class="countdown">Checking for new data 0:0{time}</p>
		{:else}
		<p class="countdown">Checking for new data 0:{time}</p>
		{/if}
	{/if}
		<!-- <p class="lastUpdated">Last change: {last_updated}</p> -->
		<!-- <span class="updatedTime">{last_updated}</span> -->
</div>


<section id="map">
	<div class="results">
		<Autocomplete {statewide_data} {county_data_grouped} items={county_data_grouped} {active_candidates} {us_county_names}>
			<p class="lastUpdated">Last change: <span class="updatedTime">{last_updated}</span></p>
		</Autocomplete>
		<Map county_topojson={mn} cityjson={mn_cities} roads_topojson={mn_roads} {county_data_grouped} {us_county_names}/>
	</div>
</section>


<section id="related">
	<Promos {wire} {local}/>
</section>

<section id="candidate-support">
	<h2>Where was each candidate's support strongest?</h2>
	<p>Larger circles show a larger share of each candidate's votes.</p>

	<div id="geography" class="demographics-container">
		<div class="small-maps">
		{#each results_by_candidate as candidate, i}
			{#if i < 6 && candidate.results.length > 0}
				<VoteDensityMap {candidate} county_topojson={mn} cityjson={mn_cities} />
			{/if}
		{/each}
		</div>
	</div>

	{#if demographic.show_charts == true}
	<div id="demographics-groups">
		<div id="trump-2016" class="demographics-container">
		<h3>By county percentage who voted for Trump 2016</h3>
		{#each results_by_candidate as candidate, i}
			{#if i < 4 && candidate.results.length > 0}
				<!-- <h5 class="cand-name">{candidate.results[0].first} {candidate.results[0].last}</h5> -->
				<VotesByPop
					{candidate}
					x_var='rPct_2016'
					x_var_label='{candidate.results[0].first} {candidate.results[0].last}'
					x_axis_min=0.25

					x_axis_max=0.75
					x_min_formatter='.0%'
					x_max_formatter='.0%'
					x_unit=' voted for Trump'
				/><!-- x_axis_max=0.75 -->
				<!-- <VotesByPop {candidate} x_var='pop_density_2018' x_var_label='population density' x_min_formatter='.1r' x_max_formatter=',.4r' x_unit=' people per sq mile' /> -->
			{/if}
		{/each}
		</div>


		<div id="nonwhite" class="demographics-container">
		<h3>By percentage of county population that is non-white</h3>
		{#each results_by_candidate as candidate, i}
			{#if i < 4 && candidate.results.length > 0}
				<!-- <h5 class="cand-name">{candidate.results[0].first} {candidate.results[0].last}</h5> -->
				<VotesByPop
					{candidate}
					x_var='pct_nonwhite'
					x_var_label='{candidate.results[0].first} {candidate.results[0].last}'
					x_axis_min=0
					x_axis_max=0.6
					x_min_formatter='.0%'
					x_max_formatter='.0%'
					x_unit=' non-white'
				/><!-- x_axis_max=0.6 -->
			{/if}
		{/each}
		</div>

		<div id="income" class="demographics-container">
		<h3>By county average income</h3>
		{#each results_by_candidate as candidate, i}
			{#if i < 4 && candidate.results.length > 0}
				<!-- <h5 class="cand-name">{candidate.results[0].first} {candidate.results[0].last}</h5> -->
				<VotesByPop
					{candidate}
					x_var='median_income'
					x_var_label='{candidate.results[0].first} {candidate.results[0].last}'
					x_axis_min=44000
					x_axis_max=100000
					x_min_formatter='$,'
					x_max_formatter='$,'
					x_unit=''
				/>
				<!-- x_axis_min=44000
				x_axis_max=100000 -->
			{/if}
		{/each}
		</div>


		<div id="age" class="demographics-container">
		<h3>By county average age</h3>
		{#each results_by_candidate as candidate, i}
			{#if i < 4 && candidate.results.length > 0}
				<VotesByPop
					{candidate}
					x_var='median_age'
					x_var_label='{candidate.results[0].first} {candidate.results[0].last}'
					x_axis_min=30
					x_axis_max=56
					x_min_formatter='.2r'
					x_max_formatter='.2r'
					x_unit=' years old'
				/>
			{/if}
		{/each}


		</div>
	</div>
	{/if}
</section>

<div class="otherStoriesMobile">
	<h3>More Star Tribune political coverage from Super Tuesday</h3>
	<ul>
		{#each local as result}
		<li><a href="{result.url}">{result.headline}</a></li>
		{/each}
	</ul>
</div>

<section id="delegate-tracker">
	<h2>Delegate Tracker</h2>
	<p>Chatter about delegate tracker</p>
	<iframe title="National delegate count [draft]" aria-label="Interactive line chart" id="datawrapper-chart-X8NB4" src="//datawrapper.dwcdn.net/X8NB4/2/" scrolling="no" frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="450"></iframe>
	<script type="text/javascript">!function(){"use strict";window.addEventListener("message",function(a){if(void 0!==a.data["datawrapper-height"])for(var e in a.data["datawrapper-height"]){var t=document.getElementById("datawrapper-chart-"+e)||document.querySelector("iframe[src*='"+e+"']");t&&(t.style.height=a.data["datawrapper-height"][e]+"px")}})}();</script>
</section>

<section id="credits">
		<p>Design and development by Michael Corey and Thomas Oide</p>
</section>
