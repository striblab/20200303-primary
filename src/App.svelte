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

  export let statewide_data = [];

	export let active_candidates = ['Biden', 'Bloomberg', 'Buttigieg', 'Gabbard', 'Klobuchar', 'Sanders', 'Steyer', 'Warren'];
	export let results_by_candidate = [];

	// export let statewide_data = [{"officename":"President","statepostal":"MN","first":"Elizabeth","last":"Warren","party":"Dem","votecount":347122,"votepct":0.478538,"winner":true,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false},{"officename":"President","statepostal":"MN","first":"Joe","last":"Biden","party":"Dem","votecount":250317,"votepct":0.345084,"winner":false,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false},{"officename":"President","statepostal":"MN","first":"Bernie","last":"Sanders","party":"Dem","votecount":67417,"votepct":0.09294,"winner":false,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false},{"officename":"President","statepostal":"MN","first":"Pete","last":"Buttigieg","party":"Dem","votecount":9141,"votepct":0.012602,"winner":false,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false},{"officename":"President","statepostal":"MN","first":null,"last":"Uncommitted","party":"Dem","votecount":7299,"votepct":0.010062,"winner":false,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false},{"officename":"President","statepostal":"MN","first":"Michael","last":"Bloomberg","party":"Dem","votecount":7190,"votepct":0.009912,"winner":false,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false},{"officename":"President","statepostal":"MN","first":"Deval","last":"Patrick","party":"Dem","votecount":5377,"votepct":0.007413,"winner":false,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false},{"officename":"President","statepostal":"MN","first":"Tom","last":"Steyer","party":"Dem","votecount":4653,"votepct":0.006415,"winner":false,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false},{"officename":"President","statepostal":"MN","first":"Amy","last":"Klobuchar","party":"Dem","votecount":4511,"votepct":0.006219,"winner":false,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false},{"officename":"President","statepostal":"MN","first":"Andrew","last":"Yang","party":"Dem","votecount":3790,"votepct":0.005225,"winner":false,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false},{"officename":"President","statepostal":"MN","first":"Michael","last":"Bennet","party":"Dem","votecount":3600,"votepct":0.004963,"winner":false,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false},{"officename":"President","statepostal":"MN","first":"Julian","last":"Castro","party":"Dem","votecount":3454,"votepct":0.004762,"winner":false,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false},{"officename":"President","statepostal":"MN","first":"John","last":"Delaney","party":"Dem","votecount":3081,"votepct":0.004247,"winner":false,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false},{"officename":"President","statepostal":"MN","first":"Cory","last":"Booker","party":"Dem","votecount":2983,"votepct":0.004112,"winner":false,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false},{"officename":"President","statepostal":"MN","first":"Tulsi","last":"Gabbard","party":"Dem","votecount":2855,"votepct":0.003936,"winner":false,"level":"state","precinctsreporting":4110,"precinctstotal":4110,"precinctsreportingpct":1,"seatname":null,"fipscode":null,"reportingunitid":"state-MN-1","reportingunitname":null,"lastupdated":"1988-01-01 00:00:00","manual_winner":false}]

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
		if (data){
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
	}

	let getData = async function() {
		// const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-20200206040222.json"); // iowa
		const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-latest.json");
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
		// const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-20200206040222.json"); // iowa
		const response = await fetch("https://static.startribune.com/elections/projects/2020-election-results/json/results-latest.json");
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

	<p>Super Tuesday is around the corner, and nearly one-third of this presidential cycle’s delegates will be up for grabs from 14 states, including Minnesota. Though Republicans also have a primary tonight, Pres. Donald Trump is <a href="http://www.startribune.com/justices-reject-challenge-to-minnesota-gop-s-trump-only-primary-ballot/566856442/">running unopposed</a> here.</p>
	<p class="leadinDesktop">Eight major candidates remain in the nomination fight, and it will be former New York City Mayor Mike Bloomberg’s first test for votes after sitting out the first four states. Hometown Sen. Amy Klobuchar will be looking to garner big support here, but it could be tight between her and national leader Sen. Bernie Sanders, who  won Minnesota’s presidential caucus fight in 2016 against Hillary Clinton.</p>
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
		<!-- {#if statewide_data.length > 0} -->
		<Autocomplete {statewide_data} {county_data_grouped} items={county_data_grouped} {active_candidates} {us_county_names} />
		<!-- {/if} -->
			<!-- <p class="lastUpdated">Last change: <span class="updatedTime">{last_updated}</span></p> -->
		<!-- </Autocomplete> -->
		<Map county_topojson={mn} cityjson={mn_cities} roads_topojson={mn_roads} {county_data_grouped} {us_county_names}/>
	</div>
</section>


<section id="related">
	<Promos {wire} {local}/>
</section>


<section id="candidate-support">
	{#if demographic.show_maps == true}
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
	{/if}

	{#if demographic.show_bubbles == true}
	<div id="demographics-groups">

		{#if demographic.show_trump == true}
		<div id="trump-2016" class="demographics-container">
		<h3>Who did better in counties where Trump did well?</h3>
		<!-- <p>Vote totals from Minnesota counties, arranged in order from least supportive of Donald Trump in the 2016 election (Ramsey County) to the most supportive (Morrison County).</p> -->
		<p>{demographic.trump_text}</p>
		<div class="demographic-arrows">
			<div class="arrow-less">&#8592; Liberal counties</div>
			<div class="arrow-more">Conservative counties &#8594;</div>
		</div>
		{#each results_by_candidate as candidate, i}
			{#if i < 4 && candidate.results.length > 0}
				<VotesByPop
					{candidate}
					x_var='rPct_2016'
					x_var_label='{candidate.results[0].first} {candidate.results[0].last}'
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

		{#if demographic.show_nonwhite}
		<div id="nonwhite" class="demographics-container">
		<h3>Who did better in more diverse counties?</h3>
		<!-- <p>Vote totals from Minnesota counties, arranged in order from smallest percentage of non-white residents (Big Stone County) to the largest percentage (Mahnomen County).</p> -->
		<p>{demographic.nonwhite_text}</p>
		<div class="demographic-arrows">
			<div class="arrow-less">&#8592; Less diverse counties</div>
			<div class="arrow-more">More diverse counties &#8594;</div>
		</div>
		{#each results_by_candidate as candidate, i}
			{#if i < 4 && candidate.results.length > 0}
				<VotesByPop
					{candidate}
					x_var='pct_nonwhite'
					x_var_label='{candidate.results[0].first} {candidate.results[0].last}'
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

		{#if demographic.show_income}
		<div id="income" class="demographics-container">
			<h3>Who did better in more affluent counties?</h3>
			<!-- <p>Vote totals from Minnesota counties, arranged in order from smallest median income (Mahnomen County) to the largest (Carver County).</p> -->
			<p>{demographic.income_text}</p>
			<div class="demographic-arrows">
				<div class="arrow-less">&#8592; Less affluent counties</div>
				<div class="arrow-more">More affluent counties &#8594;</div>
			</div>
		{#each results_by_candidate as candidate, i}
			{#if i < 4 && candidate.results.length > 0}
				<VotesByPop
					{candidate}
					x_var='median_income'
					x_var_label='{candidate.results[0].first} {candidate.results[0].last}'
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

		{#if demographic.show_age}
		<div id="age" class="demographics-container">
			<h3>Who did better in counties with older residents?</h3>
			<!-- <p>Vote totals from Minnesota counties, arranged in order from lowest median age (Blue Earth County) to the highest (Aitkin County).</p> -->
			<p>{demographic.age_text}</p>
			<div class="demographic-arrows">
				<div class="arrow-less">&#8592; Younger counties</div>
				<div class="arrow-more">Older counties &#8594;</div>
			</div>
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
		<h3>More Star Tribune political coverage from Super Tuesday</h3>
		<ul>
			{#each local as result}
			<li><a href="{result.url}">{result.headline}</a></li>
			{/each}
		</ul>
	</div>

	<div class="hot-dish-mobile">
		<h3>Morning Hot Dish</h3>
		<p>Minnesota political news and musings, served up every weekday morning.</p>
		<iframe width="250" height="150" src="http://www.startribune.com/hot-dish-signup/567799381/?c=n" frameborder="0" title="Hot Dish Signup"></iframe>
	</div>

</div>


<section id="delegate-tracker">
	<h2>Delegate Tracker</h2>
	<p>Chatter about delegate tracker</p>
	<iframe title="National delegate count [draft]" aria-label="Interactive line chart" id="datawrapper-chart-X8NB4" src="//datawrapper.dwcdn.net/X8NB4/2/" scrolling="no" frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="450"></iframe>
	<script type="text/javascript">!function(){"use strict";window.addEventListener("message",function(a){if(void 0!==a.data["datawrapper-height"])for(var e in a.data["datawrapper-height"]){var t=document.getElementById("datawrapper-chart-"+e)||document.querySelector("iframe[src*='"+e+"']");t&&(t.style.height=a.data["datawrapper-height"][e]+"px")}})}();</script>
</section>

<section id="credits">
		<p>Data sources: Associated Press, US Census Bureau. Winner calls made by the Associated Press.</p>
		<p>Credits: Michael Corey, Thomas Oide and C.J. Sinner</p>
</section>
<!-- {/if} -->
