<script>
	import Map from './Map.svelte';
	import VoteDensityMap from './VoteDensityMap.svelte';
	import Statewide from './Statewide.svelte';
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

	onMount(async function() {
    const response = await fetch("https://static.startribune.com.s3.amazonaws.com/staging/news/projects/all/2020-election-results/json/results-test-latest.json");
    const json = await response.json()
    data = json;
  });

	// setInterval(async function() {
  //   const response = await fetch("https://static.startribune.com.s3.amazonaws.com/staging/news/projects/all/2020-election-results/json/results-test-latest.json");
  //   const json = await response.json()
  //   data = json;
  // }, 15000)


</script>

<h1>{title}</h1>

<Map topojson={iowa} cityjson={iacities} {county_data_grouped}/>

<Statewide {statewide_data} {county_data_grouped}/>

<section id="density-maps">
{#each results_by_candidate as candidate}
	<VoteDensityMap {candidate} topojson={iowa}/>
{/each}
</section>

{#each county_data_grouped as county}
	<County {county}/>
{/each}
