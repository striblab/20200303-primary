<script>
	import Map from './Map.svelte';
	import VoteDensityMap from './VoteDensityMap.svelte';
	import Autocomplete from './Autocomplete.svelte';
	import VotesByPop from './VotesByPop.svelte';
	import Promos from './Promos.svelte';

	import * as d3 from 'd3';
	const queryString = require('query-string');
	const scrollToElement = require('scroll-to-element');

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
	import { onMount, afterUpdate } from 'svelte';
	import _ from 'lodash';

	export let title;

	export let data = [];
	export let elex_controls = {
		"local": [],
		"wire": [],
		"demographic": {}
	};
	export let county_data = [];
	export let county_data_grouped;

  export let statewide_data = [];

	export let active_candidates = ['Biden', 'Bloomberg', 'Buttigieg', 'Gabbard', 'Klobuchar', 'Sanders', 'Warren'];
	export let dropped_candidates = ['Bennet', 'Booker', 'Buttigieg', 'Castro', 'Delaney', 'Klobuchar', 'Patrick', 'Steyer', 'Williamson', 'Yang'];
	export let results_by_candidate = [];

	let last_updated;
	let datestring;
	let timerInterval;
	let time = 30;
	let backup_timer;
	let backup_timer_controls;
	const zero = d3.format("02d");

	let locked_to_map = false;
	const parsed = queryString.parse(location.search);
	if (parsed.lock_to_map == 'true') {
		locked_to_map = true;
	}

	const dropped_asterisk = function (candidate) {
		if (dropped_candidates.includes(candidate)) {
			return '*';
		}
		return '';
	}

	var options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'};

	const format_timer_remaining_nuclear = function (input) {
		document.getElementById('countdown-container').innerHTML = 'Checking for new data in 0:' + zero(input);
	}

	$ : {
		if (statewide_data.length == 0) {
			last_updated = '';
		}
		else {
			datestring = new Date(statewide_data[0].lastupdated)
			last_updated = datestring.toLocaleString('en-US', options)
			// last_updated = statewide_data[0].lastupdated
			format_timer_remaining_nuclear(time);
		}

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

	let getData = async function() {
		document.getElementById('countdown-container').innerHTML = 'Updating...';
		const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-latest.json");

		if (response.ok) {
			time = 30;
			format_timer_remaining_nuclear(time);
			timerInterval = setInterval(countdown, 1000);
			data = await response.json();
      return data;
    } else {
			document.getElementById('countdown-container').innerHTML = "Couldn't load data. Trying again in 5 seconds...";
			backup_timer = setTimeout(getData, 5000);
			// data = [];  // Don't do this so you don't overwrite good results with a temporary 404
			return [];
    }
	}

	let getElexControls = async function() {
		const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/elex_controls.json");
		// const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/test_controls.json");

		if (response.ok) {
			elex_controls = await response.json()
      return elex_controls;
    } else {
			throw new Error(todo);
    }
	}

	function countdown() {
		if (time == 0) {
			clearInterval(timerInterval);
			getData();
		}
		else {
			format_timer_remaining_nuclear(time);
			time--;
		}
	}

	onMount(async function() {
		getData();
		getElexControls();

		// Connect to Google analytics so you can send events
		window.dataLayer = window.dataLayer || [];
	  function gtag(){dataLayer.push(arguments);}
		window.gtag = gtag;
	  gtag('js', new Date());
	  gtag('config', 'UA-114906116-1');
  });

	// Primarily for showing on a TV in the newsroom
	if(locked_to_map === true) {
		afterUpdate(() => {
			scrollToElement('#maptop');
		});
	}

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
		/* width: 50%;
		display: flex;
		flex-wrap: wrap; */
	}

	.demographics-container {
		/* max-width: 50%; */
		flex: 0 43%;
		margin-bottom: 3em;
	}

	.demographics-container {
		font-size: 0.8em;
	}

	.demographic-arrows {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		font-family: "Benton Sans", sans-serif;
		color: #BBB;
		padding-top: 7px !important;
		font-size: 13px !important;
	}

	/* .candidate-breakdown {
		display: flex;
	  flex-direction: row;
	  flex-wrap: wrap;
	  max-width: 1000px;
	} */

	/* @keyframes fadeIn {
		from { opacity: 0 }
	} */
</style>

<!-- {#if statewide_data.length > 0} -->
<div class="leadin">

	<div class="elexLogo">
		<div class="text">
			<h3>ELECTION</h3>
		</div>
		<img src="https://static.startribune.com/news/projects/all/20200303-elex-results/build/img/ELEX2020.svg" alt="Election 2020"/>
	</div>

	<h1>{title}</h1>
	<div class="share-block"></div>

	<p>
		Super Tuesday, when voters in Minnesota and 13 other states help choose their party's presidential nominee, is March 3. Nearly one-third of the Democratic Party delegates will be up for grabs. Although Republicans also have a primary, President Trump is <a href="http://www.startribune.com/justices-reject-challenge-to-minnesota-gop-s-trump-only-primary-ballot/566856442/">running unopposed</a> in Minnesota.
	</p>
	<p class="leadinDesktop">With candidates in flux for the Democratic contest, the results could go several different ways. It will be former New York City Mayor Mike Bloomberg’s first test after sitting out four states' primaries and caucuses, but Sen. Bernie Sanders, who won Minnesota’s caucus in 2016 over Hillary Clinton, could do well again, especially with Amy Klobuchar now out of the race.</p>
</div>

<div id="maptop" class="updates" style="display: none;">
	<p class="live2">&bull; LIVE</p>
	<p id="countdown-container" class="countdown">Loading data ...</p>
	<p class="lastUpdatedIe">Results update about every 30 seconds</p>
</div>


<section id="map">
	<div id="results_top" class="results">
		<!-- {#if statewide_data.length > 0} -->
		<Autocomplete {statewide_data} {county_data_grouped} items={county_data_grouped} {active_candidates} {dropped_candidates} {us_county_names} />
		<!-- {/if} -->
			<!-- <p class="lastUpdated">Last change: <span class="updatedTime">{last_updated}</span></p> -->
		<!-- </Autocomplete> -->
		<Map county_topojson={mn} cityjson={mn_cities} roads_topojson={mn_roads} {county_data_grouped} {dropped_candidates} {us_county_names}/>
	</div>
</section>


<section id="related">
	<Promos {elex_controls}/>
</section>

<!-- {#if elex_controls} -->
<section id="candidate-support">
	{#if elex_controls.demographic.show_maps == true}
	<h2>Where was each candidate's support strongest?</h2>
	<p>Larger circles show a larger share of each candidate's votes.</p>

	<div id="geography" class="demographics-container">
		<div class="small-maps">
		{#each results_by_candidate as candidate, i}
			{#if i < 6 && candidate.results.length > 0}
				<VoteDensityMap {candidate} dropped_asterisk={dropped_asterisk(candidate.results[0].last)} county_topojson={mn} cityjson={mn_cities} />
			{/if}
		{/each}
		</div>
	</div>
	{/if}

	{#if elex_controls.demographic.show_bubbles == true}
	<div id="demographics-groups">

		{#if elex_controls.demographic.show_trump == true}
		<div id="trump-2016" class="demographics-container">
		<h3>Who did better in counties where Trump did well?</h3>
		<!-- <p>Vote totals from Minnesota counties, arranged in order from least supportive of Donald Trump in the 2016 election (Ramsey County) to the most supportive (Morrison County).</p> -->
		<p>{elex_controls.demographic.trump_text}</p>
		<div class="demographic-arrows">
			<div class="arrow-less">&#8592; Liberal counties</div>
			<div class="arrow-more">Conservative counties &#8594;</div>
		</div>
		{#each results_by_candidate as candidate, i}
			{#if i < 4 && candidate.results.length > 0}
				<VotesByPop
					{candidate}
					x_var='rPct_2016'
					x_var_label='{candidate.results[0].first} {candidate.results[0].last}{dropped_asterisk(candidate.results[0].last)}'
					x_axis_min=0.25

					x_axis_max=0.75
					x_min_formatter='.0%'
					x_max_formatter='.0%'
					x_unit=' voted for Trump'
					verbose_labels={i==0}
				/>
			{/if}
		{/each}
		</div>
		{/if}

		{#if elex_controls.demographic.show_nonwhite}
		<div id="nonwhite" class="demographics-container">
		<h3>Who did better in more diverse counties?</h3>
		<!-- <p>Vote totals from Minnesota counties, arranged in order from smallest percentage of non-white residents (Big Stone County) to the largest percentage (Mahnomen County).</p> -->
		<p>{elex_controls.demographic.nonwhite_text}</p>
		<div class="demographic-arrows">
			<div class="arrow-less">&#8592; Less diverse counties</div>
			<div class="arrow-more">More diverse counties &#8594;</div>
		</div>
		{#each results_by_candidate as candidate, i}
			{#if i < 4 && candidate.results.length > 0}
				<VotesByPop
					{candidate}
					x_var='pct_nonwhite'
					x_var_label='{candidate.results[0].first} {candidate.results[0].last}{dropped_asterisk(candidate.results[0].last)}'
					x_axis_min=0
					x_axis_max=0.6
					x_min_formatter='.0%'
					x_max_formatter='.0%'
					x_unit=' non-white'
					verbose_labels={i==0}
				/>
			{/if}
		{/each}
		</div>
		{/if}

		{#if elex_controls.demographic.show_income}
		<div id="income" class="demographics-container">
			<h3>Who did better in more affluent counties?</h3>
			<!-- <p>Vote totals from Minnesota counties, arranged in order from smallest median income (Mahnomen County) to the largest (Carver County).</p> -->
			<p>{elex_controls.demographic.income_text}</p>
			<div class="demographic-arrows">
				<div class="arrow-less">&#8592; Less affluent counties</div>
				<div class="arrow-more">More affluent counties &#8594;</div>
			</div>
		{#each results_by_candidate as candidate, i}
			{#if i < 4 && candidate.results.length > 0}
				<VotesByPop
					{candidate}
					x_var='median_income'
					x_var_label='{candidate.results[0].first} {candidate.results[0].last}{dropped_asterisk(candidate.results[0].last)}'
					x_axis_min=44000
					x_axis_max=100000
					x_min_formatter='$,'
					x_max_formatter='$,'
					x_unit=''
					verbose_labels={i==0}
				/>
			{/if}
		{/each}
		</div>
		{/if}

		{#if elex_controls.demographic.show_age}
		<div id="age" class="demographics-container">
			<h3>Who did better in counties with older residents?</h3>
			<!-- <p>Vote totals from Minnesota counties, arranged in order from lowest median age (Blue Earth County) to the highest (Aitkin County).</p> -->
			<p>{elex_controls.demographic.age_text}</p>
			<div class="demographic-arrows">
				<div class="arrow-less">&#8592; Younger counties</div>
				<div class="arrow-more">Older counties &#8594;</div>
			</div>
		{#each results_by_candidate as candidate, i}
			{#if i < 4 && candidate.results.length > 0}
				<VotesByPop
					{candidate}
					x_var='median_age'
					x_var_label='{candidate.results[0].first} {candidate.results[0].last}{dropped_asterisk(candidate.results[0].last)}'
					x_axis_min=30
					x_axis_max=56
					x_min_formatter='.2r'
					x_max_formatter='.2r'
					x_unit=' years old'
					verbose_labels={i==0}
				/>
			{/if}
		{/each}
		</div>
		{/if}
	</div>
	{/if}
</section>


<div class="mobileRelated">

	<div class="otherStoriesMobile">
		<h3>Minnesota primary updates</h3>
		<ul>
			{#each elex_controls.local as result}
			<li><a href="{result.url}">{result.headline}</a></li>
			{/each}
		</ul>
	</div>

	<div class="hot-dish-mobile">
		<h3>Morning Hot Dish</h3>
		<p>Minnesota political news and musings, served up every weekday morning.</p>
		<div>
			<iframe width="250" height="150" src="http://www.startribune.com/hot-dish-signup/567799381/?c=n" frameborder="0" title="Hot Dish Signup"></iframe>
		</div>

	</div>

</div>
<!-- {/if} -->

<section id="delegate-tracker">
	<h2>Committed delegates by candidate</h2>
	<p>Heading into Super Tuesday, Sanders has the most delegates among all candidates, a lead that could potentially widen on March 3. More than 1,300 delegates will be at stake, the most of any single day of the primary season.</p>
	<iframe title="National delegate count [draft]" aria-label="Interactive line chart" id="datawrapper-chart-X8NB4" src="//datawrapper.dwcdn.net/X8NB4/2/" scrolling="no" frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="500"></iframe>
	<script type="text/javascript">!function(){"use strict";window.addEventListener("message",function(a){if(void 0!==a.data["datawrapper-height"])for(var e in a.data["datawrapper-height"]){var t=document.getElementById("datawrapper-chart-"+e)||document.querySelector("iframe[src*='"+e+"']");t&&(t.style.height=a.data["datawrapper-height"][e]+"px")}})}();</script>
</section>

<section id="credits">
		<p>Data sources: Associated Press, US Census Bureau. Winner calls made by the Associated Press.</p>
		<p>Credits: Michael Corey, Thomas Oide and C.J. Sinner</p>
</section>
<!-- {/if} -->
