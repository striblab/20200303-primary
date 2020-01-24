<script>
	import Map from './Map.svelte';
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

	$ : {
		statewide_data = data.filter(function(d) {
      return d.level == "state";
    });
    county_data = data.filter(function(d) {
      return d.level == "county";
    })
		county_data_grouped = Object.entries(_.groupBy(county_data, "fipscode"));
		// console.log(county_data_grouped)

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

<Statewide {statewide_data}/>

{#each county_data_grouped as county}
	<County {county}/>
{/each}
