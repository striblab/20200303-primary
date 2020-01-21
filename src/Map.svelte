<script>


export let iowa;
  // export let mn;
export let county;

// let test_data = [{"officename":"President","statepostal":"IA","first":"Elizabeth","last":"Warren","party":"Dem","votecount":189,"votepct":0.3375,"winner":false,"level":"county","fipscode":"19001","reportingunitname":"Adair","lastupdated":"2020-01-16T15:10:29.233Z"},{"officename":"President","statepostal":"IA","first":"Joe","last":"Biden","party":"Dem","votecount":149,"votepct":0.266071,"winner":false,"level":"county","fipscode":"19001","reportingunitname":"Adair","lastupdated":"2020-01-16T15:10:29.233Z"},{"officename":"President","statepostal":"IA","first":"Amy","last":"Klobuchar","party":"Dem","votecount":131,"votepct":0.233929,"winner":false,"level":"county","fipscode":"19001","reportingunitname":"Adair","lastupdated":"2020-01-16T15:10:29.233Z"},{"officename":"President","statepostal":"IA","first":"Deval","last":"Patrick","party":"Dem","votecount":15,"votepct":0.026786,"winner":false,"level":"county","fipscode":"19001","reportingunitname":"Adair","lastupdated":"2020-01-16T15:10:29.233Z"},{"officename":"President","statepostal":"IA","first":"Andrew","last":"Yang","party":"Dem","votecount":13,"votepct":0.023214,"winner":false,"level":"county","fipscode":"19001","reportingunitname":"Adair","lastupdated":"2020-01-16T15:10:29.233Z"},{"officename":"President","statepostal":"IA","first":null,"last":"Other","party":"Dem","votecount":10,"votepct":0.017857,"winner":false,"level":"county","fipscode":"19001","reportingunitname":"Adair","lastupdated":"2020-01-16T15:10:29.233Z"},{"officename":"President","statepostal":"IA","first":"Bernie","last":"Sanders","party":"Dem","votecount":10,"votepct":0.017857,"winner":false,"level":"county","fipscode":"19001","reportingunitname":"Adair","lastupdated":"2020-01-16T15:10:29.233Z"},{"officename":"President","statepostal":"IA","first":"Cory","last":"Booker","party":"Dem","votecount":9,"votepct":0.016071,"winner":false,"level":"county","fipscode":"19001","reportingunitname":"Adair","lastupdated":"2020-01-16T15:10:29.233Z"},{"officename":"President","statepostal":"IA","first":"Tulsi","last":"Gabbard","party":"Dem","votecount":9,"votepct":0.016071,"winner":false,"level":"county","fipscode":"19001","reportingunitname":"Adair","lastupdated":"2020-01-16T15:10:29.233Z"},{"officename":"President","statepostal":"IA","first":"Julian","last":"Castro","party":"Dem","votecount":8,"votepct":0.014286,"winner":false,"level":"county","fipscode":"19001","reportingunitname":"Adair","lastupdated":"2020-01-16T15:10:29.233Z"},{"officename":"President","statepostal":"IA","first":"Pete","last":"Buttigieg","party":"Dem","votecount":7,"votepct":0.0125,"winner":false,"level":"county","fipscode":"19001","reportingunitname":"Adair","lastupdated":"2020-01-16T15:10:29.233Z"},{"officename":"President","statepostal":"IA","first":"Tom","last":"Steyer","party":"Dem","votecount":6,"votepct":0.010714,"winner":false,"level":"county","fipscode":"19001","reportingunitname":"Adair","lastupdated":"2020-01-16T15:10:29.233Z"},{"officename":"President","statepostal":"IA","first":null,"last":"Uncommitted","party":"Dem","votecount":4,"votepct":0.007143,"winner":false,"level":"county","fipscode":"19001","reportingunitname":"Adair","lastupdated":"2020-01-16T15:10:29.233Z"}]

// $: county_data = county;
$: county_data = _.groupBy(county, "fipscode")

import { geoAlbers, geoPath, geoMercator } from "d3-geo";
import { scaleOrdinal } from 'd3-scale';
import { feature } from 'topojson';
import _ from 'lodash';
// import { onMount } from 'svelte';
let data;
let width = 400;
let height = 400;
let center = width / 2;


// var utmZone = d3.scaleLinear()
//     .domain([-177, 177])
//     .rangeRound([1, 60])
//     .clamp(true);

// export let map_data = mn;
const projection = geoAlbers()
            // .center([width, height])
            .scale(4500)
            // .translate([0, height]);
            // iowa translation
            .translate([0, height + (width / 8)])

            //mn translation
            // .translate([0, height * 2])

const colorScale = scaleOrdinal()
  .domain(['Biden', 'Warren', 'Klobuchar'])
  .range(['green', 'blue', 'red'])
// const projection = geoMercator()
//         // .center([0,center])
//         .rotate([91.8318,0])
//         .scale(500)
//         .translate([width * 2, height * 2]);

let path = geoPath().projection(projection);

const land = feature(iowa, iowa.objects.cb_2015_iowa_county_20m)

// function fillCounty(feature) {
//   var fips = feature.properties.GEOID;
//   var county_data = county[fips];
//   var leader = county_data[0].last;
//
//   return colorScale(leader)
//
// }
// const land = feature(mn, mn.objects.cb_2015_minnesota_county_20m);
data = land.features;

// test_data = county["19097"]

function test(feature) {

  if (feature) {
    console.log(feature.properties.GEOID)
    console.log(feature.properties.NAME + ' County')
    console.log(county_data[feature.properties.GEOID])
  }
}



// onMount(async function() {
//
//   const response = await fetch("https://static.startribune.com.s3.amazonaws.com/staging/news/projects/all/2020-election-results/json/results-test-latest.json");
//   const json = await response.json()
//   data = json;
//   county = data.filter(function(d) {
//     return d.level == "county";
//   })
//
// });

</script>


<style>
  .county-map {
    max-width: 650px;
    /* width: 100%; */
    background-color: "#eeeeee";
    margin: 0 auto;
    position: relative;
  }
   .provinceShape {
    /* fill: #f5f5f5; */
    /* fill: grey; */
    stroke: white;
    stroke-width: 0.5;
  }
</style>

<slot>

</slot>

<div class="county-map">
  <svg viewbox="0 0 400 400" style="width: 100%; height: 100%;" >
    <g class="counties">
      {#each data as feature}
        <path d={path(feature)} class="provinceShape" on:mouseover="{test(feature)}"  />
      {/each}
    </g>

  </svg>


  <!-- <p>
      {test_data}
  </p> -->

<!-- fill="{fillCounty(feature)}" -->
  <!-- <ul>
    {#each county[test_fip] as county}
    <li>
      {county.votecount}
    </li>
    {/each}
  </ul> -->


<table>
	{#each county_data as state}
		<tr>
			<td>
				{#if state.first}
					{state.first} {state.last}
				{:else}
					{state.last}
				{/if}
			</td>
      <td>
        {state.votecount}
      </td>

		</tr>
	{/each}
</table>


</div>
