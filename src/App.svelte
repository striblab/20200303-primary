<script>
	import Map from './Map.svelte';
	import State from './State.svelte';
	import iowa from './data/iowa.json';
	import mn from './data/mncounties.json';
	import { onMount } from 'svelte';
	// import { feature as topojsonFeature } from 'topojson';
	import _ from 'lodash';

	export let title;

	export let data = [];
  export let county = [];
  export let state = [];

	// async function getData() {
  //   const response = await fetch("https://static.startribune.com.s3.amazonaws.com/staging/news/projects/all/2020-election-results/json/results-test-latest.json");
  //   const json = await response.json()
  //   data = json;
	//
  //   state = data.filter(function(d) {
  //     return d.level == "state";
  //   });
	//
  //   var county = data.filter(d => d.level == "county")
	//
  //   county = _.groupBy(county, "fipscode")
	//
	// 	console.log("function ran!")
  // }
	//
	// // load data
  // onMount(
	// 	getData()
	// );

	onMount(async function() {
    const response = await fetch("https://static.startribune.com.s3.amazonaws.com/staging/news/projects/all/2020-election-results/json/results-test-latest.json");
    const json = await response.json()
    data = json;
    state = data.filter(function(d) {
      return d.level == "state";
    });
    county = data.filter(function(d) {
      return d.level == "county";
    })
			// .groupBy(county, "fipscode");
		// county = _.groupBy(county, "fipscode")

    // console.log(county["19097"])

		// var test_code = 19097

		console.log(county)

		return state, county;
  });

	// setInterval(async function() {
  //   const response = await fetch("https://static.startribune.com.s3.amazonaws.com/staging/news/projects/all/2020-election-results/json/results-test-latest.json");
  //   const json = await response.json()
  //   data = json;
  //   state = data.filter(function(d) {
  //     return d.level == "state";
  //   });
  //   var county = data.filter(d => d.level == "county")
  //   county = _.groupBy(county, "fipscode")
	// 	console.log(state)
  // }, 15000)


</script>

<h1>{title}</h1>

<State state={state}/>

<Map iowa={iowa} mn={mn} county={county}>

</Map>

<!-- <Map iowa={iowa} mn={mn} /> -->
