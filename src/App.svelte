<script>
	import Map from './Map.svelte';
	import VoteDensityMap from './VoteDensityMap.svelte';
	import Autocomplete from './Autocomplete.svelte';
	import VotesByPop from './VotesByPop.svelte';
	import Promos from './Promos.svelte';

	import mn from './data/mn.json';
	import mn_cities from './data/mn_cities.json';
	import mn_roads from './data/mn_roads.json';

	import us_county_names from './data/us_county_names.json'
	import { onMount } from 'svelte';
	import _ from 'lodash';

	export let title;

	export let data = [];
	export let wire = [];
	export let local = [];
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
			// datestring = new Date(statewide_data[0].lastupdated)
			// last_updated = datestring.toLocaleString('en-US', options)
			last_updated = statewide_data[0].lastupdated
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
		const wireResponse = await fetch("https://static.startribune.com/elections/projects/2020-election-results/wire.json");
		const localResponse = await fetch("https://static.startribune.com/elections/projects/2020-election-results/local.json")
    // const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-20200210170906.json");
    const json = await response.json()
		const wireJson = await wireResponse.json()
		const localJson = await localResponse.json()
    data = json;
		wire = wireJson;
		local = localJson;
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

	h4.cand-name {
		font-size: 0.9em;
		margin: 1em 0 0.5em;
	}

	.demographics {
		max-width: 650px;
		width: 100%;
		margin-left: 2em;
	}

	.candidate-breakdown {
		display: flex;
	  flex-direction: row;
	  flex-wrap: wrap;
	  /* justify-content: space-between;*/
	  max-width: 1000px;
	}

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
		<p class="lastUpdated">Last change: {last_updated}</p>
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

	{#each results_by_candidate as candidate, i}
		{#if i < 6 && candidate.results.length > 0}
		<h4 class="cand-name">{candidate.results[0].first} {candidate.results[0].last}</h4>
		<div id="{candidate.last}-breakdown" class="candidate-breakdown">

			<VoteDensityMap {candidate} county_topojson={mn} cityjson={mn_cities} />
			<div class="demographics">
				<VotesByPop {candidate} x_var='median_income' x_var_label='median income' x_min_formatter='$,' x_max_formatter='$,' x_unit='' />
				<VotesByPop {candidate} x_var='rPct_2016' x_var_label='Trump percentage 2016'  x_min_formatter='.0%' x_max_formatter='.0%' x_unit=' voted for Trump' />
				<VotesByPop {candidate} x_var='pop_density_2018' x_var_label='population density' x_min_formatter='.1r' x_max_formatter=',.4r' x_unit=' people per sq mile' />
			</div>
		</div>
		{/if}
	{/each}

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
