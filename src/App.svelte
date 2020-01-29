<script>
	import Map from './Map.svelte';
	import VoteDensityMap from './VoteDensityMap.svelte';
	import Statewide from './Statewide.svelte';
	import Autocomplete from './Autocomplete.svelte';
	import County from './County.svelte';
	import iowa from './data/iowa.json';
	import iacities from './data/iacities.json';
	import mn from './data/mncounties.json';
	import { onMount } from 'svelte';
	// import { feature as topojsonFeature } from 'topojson';
	import _ from 'lodash';

	export let title;

	export let data = [];
	export let county_data;
	export let county_data_grouped;

  export let statewide_data;

	export let active_candidates = ['Bennet', 'Biden', 'Bloomberg', 'Buttigieg', 'Delaney', 'Gabbard', 'Klobuchar', 'Patrick', 'Sanders', 'Steyer', 'Warren', 'Yang'];
	export let results_by_candidate = [];

	$ : {
		statewide_data = data.filter(function(d) {
      return d.level == "state";
    });
    county_data = data.filter(function(d) {
      return d.level == "county";
    })
		county_data_grouped = Object.entries(_.groupBy(county_data, "fipscode"));
		// console.log(county_data_grouped)

		results_by_candidate = [];
		active_candidates.forEach(function(candidate){
			let candidate_data = {
				'candidate': candidate,
				'results': county_data.filter(function(d) {
		      return d.last == candidate;
		    })
			}
			results_by_candidate.push(candidate_data)
		});
	}

	let time = 30;
	function countdown() {
		if (time == 0) {
			time = 30
		}
		else {
			time--;
		}
	}

	onMount(async function() {
    const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-latest.json");
    const json = await response.json()
    data = json;
  });


	// old data STATIC
	// onMount(async function() {
  //   const response = await fetch("https://static.startribune.com.s3.amazonaws.com/staging/news/projects/all/2020-election-results/json/results-test-20200127145521.json");
  //   const json = await response.json()
  //   data = json;
  // });

	setInterval(countdown, 1000);

	setInterval(async function() {
    const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-latest.json");
    const json = await response.json()
    data = json;
  }, 15000);


</script>

<style>
	.live {
		font-family: "Benton Sans", sans-serif;
		font-weight: 700;
		color: red;
		text-align: center;
		animation: fadeIn 1s infinite alternate;
		margin-top: 30px;
	}

	.live2 {
		font-family: "Benton Sans", sans-serif;
		font-weight: 700;
		color: red;
		text-align: center;
		margin-top: 30px;
	}

	@keyframes fadeIn {
		from { opacity: 0 }
	}
</style>

<div class="leadin">

	<p class="live2">LIVE <span class="live">&bull;</span></p>

	<h1>{title}</h1>

	<p>Here is some intro text that will go in this space. This will only be one or two paragraphs. Short paragraphs. There are lots of potential candidates in this primary but only a few potential winners.</p>
	<p>Here is some intro text that will go in this space. This will only be one or two paragraphs. Short paragraphs. There are lots of potential candidates in this primary but only a few potential winners.</p>
</div>

<section id="map">
	{#if time < 10}
	<p class="countdown">Checking for updates 0:0{time}</p>
	{:else}
	<p class="countdown">Checking for updates 0:{time}</p>
	{/if}
	<div class="results">
		<Autocomplete {statewide_data} {county_data_grouped} items={county_data_grouped}/>
		<Map topojson={iowa} cityjson={iacities} {county_data_grouped}/>
	</div>

</section>


<section id="candidate-support">
	<h2>Where was each candidate's support strongest?</h2>
  Darker colors show a higher percentage of that county's votes.
	<div id="density-maps">
	{#each results_by_candidate as candidate}
		<VoteDensityMap {candidate} topojson={iowa}/>
	{/each}
	</div>
</section>

<!-- {#each county_data_grouped as county}
	<County {county}/>
{/each} -->
