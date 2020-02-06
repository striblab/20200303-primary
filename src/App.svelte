<script>
	import Map from './Map.svelte';
	import VoteDensityMap from './VoteDensityMap.svelte';
	import Statewide from './Statewide.svelte';
	import Autocomplete from './Autocomplete.svelte';
	import County from './County.svelte';
	import iowa from './data/iowa.json';
	// import nh from './data/nh.json';
	import iacities from './data/iacities.json';
	import mn from './data/mncounties.json';
	import content from './data/content.json';
	import { onMount } from 'svelte';
	import { data, last_updated } from './stores.js';
	// import { feature as topojsonFeature } from 'topojson';
	import _ from 'lodash';

	export let title;

	// export let data = [];
	export let statewide_data = [];
	export let county_data = [];
	export let county_data_grouped = [];

  // export let statewide_data;
	// export let last_updated = '';

	export let active_candidates = ['Bennet', 'Biden', 'Bloomberg', 'Buttigieg', 'Gabbard', 'Klobuchar', 'Patrick', 'Sanders', 'Steyer', 'Warren', 'Yang'];
	export let results_by_candidate = [];
	//
	export let stories = content.data;

	// function contentIDGenerator(previous, object) {
	// 	id = Math.floor((Math.random() * object.length))
	// 	if (id == previous) {
	// 		id = Math.floor((Math.random() * object.length));
	// 		return id;
	// 	}
	// 	else {
	// 		return id;
	// 	}
	// }

	// const get_last_updated = function (data) {
	// 	console.log(data);
	// 	if (data.length > 0) {
	// 		var options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
	// 		return new Date(data[0].lastupdated).toLocaleString('en-US', options);
	// 	}
	// 	return '';
	// }

	const unsubscribe = data.subscribe(all_data => {
		if (all_data.length > 0) {
			var options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
			last_updated.set(new Date(all_data[0].lastupdated).toLocaleString('en-US', options));
			console.log($last_updated);

			statewide_data = all_data.filter(function(d) {
	      return d.level == "state";
	    });

			county_data = all_data.filter(function(d) {
	      return d.level == "county";
	    });

			county_data_grouped = Object.entries(_.groupBy(county_data, "fipscode"));

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
	});

	// $:last_updated = get_last_updated(statewide_data);
	// $ : {
	//
	// 	// statewide_data.update(data.filter(function(d) {
  //   //   return d.level == "state";
  //   // });
	// 	// statewide_data = data.filter(function(d) {
  //   //   return d.level == "state";
  //   // });
  //   // county_data = data.filter(function(d) {
  //   //   return d.level == "county";
  //   // })
	// 	county_data_grouped = Object.entries(_.groupBy(county_data, "fipscode"));
	//
	//
	//
	// 	// console.log(datestring);
	// 	// last_updated = datestring.toLocaleString('en-US', options) + ' ' +  counter;
	// 	// console.log(last_updated);
	// 	// counter += 1
	//
	// 	// results_by_candidate = [];
	// 	// active_candidates.forEach(function(candidate){
	// 	// 	let candidate_data = {
	// 	// 		'candidate': candidate,
	// 	// 		'results': county_data.filter(function(d) {
	// 	//       return d.last == candidate;
	// 	//     })
	// 	// 	}
	// 	// 	results_by_candidate.push(candidate_data)
	// 	// });
	// }

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

	onMount(async function() {
    const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-latest.json");
    const json = await response.json();
    // data = json;
		data.set(json);
		// console.log($data[0]);
		// statewide_data.update(data.filter(function(d) {
    //   return d.level == "state";
    // });
		// statewide_data.update(data => data.filter(todo=>todo.id!==id);
		// last_updated = get_last_updated(data);
  });

	// old data STATIC
	// setInterval(async function() {
	// 	const response = await fetch("https://static.startribune.com.s3.amazonaws.com/staging/news/projects/all/2020-election-results/json/results-test-20200127145521.json");
	// 	const json = await response.json();
	// 	data.set(json);
	// 	// data = json;
	// 	// last_updated = get_last_updated(data);
	// }, 15000);

	setInterval(async function() {
    const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-latest.json");
    const json = await response.json();
		data.set(json);
    // data = json;
		// last_updated = get_last_updated(data);
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

	<p class="live2"><span class="live">&bull;</span> LIVE</p>

	<h1>{title}</h1>

	<p>Here is some intro text that will go in this space. This will only be one or two paragraphs. Short paragraphs. There are lots of potential candidates in this primary but only a few potential winners.</p>
	<p>Here is some intro text that will go in this space. This will only be one or two paragraphs. Short paragraphs. There are lots of potential candidates in this primary but only a few potential winners.</p>
	{$last_updated}
</div>

<section id="map">
	<div class="results">
		<Autocomplete {statewide_data} {county_data_grouped} items={county_data_grouped} {active_candidates}/>
		<Map county_topojson={iowa} cityjson={iacities} {county_data_grouped} {active_candidates}/>
	</div>
</section>

<section id="related">
	{#if stories.length == 0}
	<div class="relatedContainer"></div>
	{:else}
	<div class="relatedContainer">
		<a href="{stories[id].url}" class="relatedLink" target="_blank"><h2 on:click={handleClick(stories.length)}>{stories[id].headline}</h2></a>
		<p>{stories[id].summary}</p>
	</div>
	{/if}

</section>

<section id="candidate-support">
	<h2>Where was each candidate's support strongest?</h2>
  <p>Darker colors show a higher percentage of that county's votes.</p>
	<div id="density-maps">
	{#each results_by_candidate as candidate}
		<VoteDensityMap {candidate} county_topojson={iowa}/>
	{/each}
	</div>
</section>

<section id="delegate-tracker">
	<h2>Delegate Tracker</h2>
	<p>Chatter about delegate tracker</p>
	<iframe title="National delegate count [draft]" aria-label="Interactive line chart" id="datawrapper-chart-X8NB4" src="//datawrapper.dwcdn.net/X8NB4/2/" scrolling="no" frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="450"></iframe>
	<script type="text/javascript">!function(){"use strict";window.addEventListener("message",function(a){if(void 0!==a.data["datawrapper-height"])for(var e in a.data["datawrapper-height"]){var t=document.getElementById("datawrapper-chart-"+e)||document.querySelector("iframe[src*='"+e+"']");t&&(t.style.height=a.data["datawrapper-height"][e]+"px")}})}();</script>
</section>
