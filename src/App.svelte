<script>
	import Map from './Map.svelte';
	import State from './State.svelte';
	import { onMount } from 'svelte';
	import mn from './data/mncounties.json';
	import _ from 'lodash';

	export let title;

	export let data = [];
  // export let county = [];
  export let state = [];

	// load data
  onMount(async function() {
    const response = await fetch("https://static.startribune.com.s3.amazonaws.com/staging/news/projects/all/2020-election-results/json/results-test-latest.json");
    const json = await response.json()
    data = json;

    state = data.filter(function(d) {
      return d.level == "state";
    });

    var county = data.filter(d => d.level == "county")

    county = _.groupBy(county, "fipscode")
  });


</script>

<h1>{title}</h1>

<State state={state}/>
