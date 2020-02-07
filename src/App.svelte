<script>
	import Map from './Map.svelte';
	import VoteDensityMap from './VoteDensityMap.svelte';
	import Statewide from './Statewide.svelte';
	import Autocomplete from './Autocomplete.svelte';
	import County from './County.svelte';
	// import iowa from './data/iowa.json';
	import nh from './data/nh.json';
	import iacities from './data/iacities.json';
	import mn from './data/mncounties.json';
	import content from './data/content.json';
	import { onMount } from 'svelte';
	// import { feature as topojsonFeature } from 'topojson';
	import _ from 'lodash';

	export let title;

	export let data = [];
	export let county_data;
	export let county_data_grouped;

  export let statewide_data;

	export let active_candidates = ['Bennet', 'Biden', 'Bloomberg', 'Buttigieg', 'Gabbard', 'Klobuchar', 'Patrick', 'Sanders', 'Steyer', 'Warren', 'Yang'];
	export let results_by_candidate = [];

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

	let last_updated;
	let datestring;

	var options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};
	$: {
		if (statewide_data.length == 0) {
			last_updated = '';
		}
		else {
			// last_updated = Date.parse(statewide_data[0].lastupdated);

			datestring = new Date(statewide_data[0].lastupdated)
			last_updated = datestring.toLocaleString('en-US', options)
		}
	}

	$ : {
		statewide_data = data.filter(function(d) {
      return d.level == "state";
    });
    county_data = data.filter(function(d) {
      return d.level == "county";
    })
		// county_data_grouped = Object.entries(_.groupBy(county_data, "fipscode"));
		// county_data_grouped = Object.entries(_.orderBy(county_data, "votecount"));
		county_data_grouped = Object.entries(_.chain(county_data).orderBy(["votecount"], ["desc"]).groupBy("fipscode").value());

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
    const json = await response.json()
    data = json;
  });

	// old data STATIC
	// onMount(async function() {
  //   const response = await fetch("https://static.startribune.com.s3.amazonaws.com/staging/news/projects/all/2020-election-results/json/results-test-20200127145521.json");
  //   const json = await response.json()
  //   data = json;
  // });

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

	<p class="live2"><span class="live">&bull;</span> LIVE</p>

	<h1>{title}</h1>

	<p>Here is some intro text that will go in this space. This will only be one or two paragraphs. Short paragraphs. There are lots of potential candidates in this primary but only a few potential winners.</p>
	<p>Here is some intro text that will go in this space. This will only be one or two paragraphs. Short paragraphs. There are lots of potential candidates in this primary but only a few potential winners.</p>
</div>

<p class="lastUpdated">Last updated: {last_updated}</p>

<section id="map">
	<div class="results">
		<Autocomplete {statewide_data} {county_data_grouped} items={county_data_grouped} {active_candidates}/>
		<Map county_topojson={nh} cityjson={iacities} {county_data_grouped} {active_candidates}/>
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
		<VoteDensityMap {candidate} county_topojson={nh}/>
	{/each}
	</div>
</section>

<!-- <div><div class="c016"><header class="c0112"><h2 class="c017">Morning Hot Dish</h2><div class="c018">Minnesota political news and musings, served up every weekday morning.</div></header><form class="c0111"><div class="c0116 c0113"><label class="c0114 c0117">Email<input class="c0115" type="email" placeholder="Please enter your email address" value=""></label><span class="c0122"></span></div><input type="submit" alt="Submit" class="c0123" data-evar44="" data-evar45="Politics Strib Tag" data-evar47="0-1" data-evar48="Submit" data-evar58="button" data-evar75="newsletter" data-linkname="Submit" data-linktype="button" data-modulename="Politics Strib Tag" data-moduletype="newsletter-0-1" data-position="0-1" value="Sign Up"></form><a href="http://www.startribune.com/startribune-com-privacy-policy/218991591/" class="c0124" target="_blank" title="Privacy Policy" data-evar44="" data-evar45="Politics Strib Tag" data-evar47="0-3" data-evar48="Privacy Policy" data-evar58="link" data-evar75="newsletter" data-linkname="Privacy Policy" data-linktype="link" data-modulename="Politics Strib Tag" data-moduletype="newsletter-0-3" data-position="0-3">Privacy Policy</a></div></div> -->

<section id="delegate-tracker">
	<h2>Delegate Tracker</h2>
	<p>Chatter about delegate tracker</p>
	<iframe title="National delegate count [draft]" aria-label="Interactive line chart" id="datawrapper-chart-X8NB4" src="//datawrapper.dwcdn.net/X8NB4/2/" scrolling="no" frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="450"></iframe>
	<script type="text/javascript">!function(){"use strict";window.addEventListener("message",function(a){if(void 0!==a.data["datawrapper-height"])for(var e in a.data["datawrapper-height"]){var t=document.getElementById("datawrapper-chart-"+e)||document.querySelector("iframe[src*='"+e+"']");t&&(t.style.height=a.data["datawrapper-height"][e]+"px")}})}();</script>
</section>

<!-- {#each county_data_grouped as county}
	<County {county}/>
{/each} -->
