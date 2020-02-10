<script>

import { geoAlbers, geoPath, geoMercator, geoCentroid } from "d3-geo";
import { scaleLinear } from 'd3-scale';
import { feature } from 'topojson';
import _ from 'lodash';
import * as d3 from 'd3';

export let county_topojson;
export let candidate;
export let candidate_total_votes;
export let votecounts;
export let votepcts;
export let county_percentiles;

// const z_scores = function (values) {
//   const mean = (...values) => values.reduce((acc, val) => acc + val, 0) / values.length;
//   const mean_value = mean(...values);
//
//   var squareDiffs = values.map(function(value){
//     var diff = value - mean_value;
//     var sqr = diff * diff;
//     return sqr;
//   });
//
//   var avgSquareDiff = mean(...squareDiffs);
//   var stdDev = Math.sqrt(avgSquareDiff);
//
//   var z_scores = values.map(function(value){
//     var z = (value - mean_value) / stdDev;
//     return z;
//   });
//
//   return z_scores;
// }

const percentiles = function (values) {
  // This is not necessarily the canonical calculation of percentile -- we're trying to gauge where in the range of vote totals this candidate got is this number
  let distinct_values = [...new Set(values)];
  let distinct_values_sorted = distinct_values.slice().sort(function (a, b) {
    return a - b;
  });
  let results = {}
  for (var value of values) {
    var position = 0;
    for (var s of distinct_values_sorted) {
      // console.log(copy.sort());
      if (s > value) {
        break;
      }
      position += 1;
    }
    // console.log(position);
    results[value] = position/distinct_values_sorted.length;
  }
  return results;
}

// console.log(z_scores([1, 2, 3, 4, 5, 6]));
// console.log(percentile(3, [1, 2, 3, 4, 5, 6]));
// console.log(percentiles([6, 2, 3, 6, 1, 6, 2, 3, 4, 5, 10]));

$: {
  candidate_total_votes = 0


  votecounts = candidate.results.map(function(county){
    return county.votecount;
  });

  votepcts = candidate.results.map(function(county){
    return county.votepct;
  });

  // To calculate percentiles based on vote count (change in map below as well)
  county_percentiles = percentiles(votecounts);

  // To calculate percentiles based on vote pct (change in map below as well)
  // county_percentiles = percentiles(votepcts);

  candidate.results.forEach(function(county){
    candidate_total_votes += county.votecount;
  });
}

let aspect_ratio = 1.3
export let width = 120;
export let height = width * aspect_ratio;
let center = width / 2;

const land = feature(county_topojson, county_topojson.objects.counties).features;

const projection = d3.geoTransverseMercator()
    .rotate([75, 0]) // Central meridian for EPSG:26918 UTM Zone 18N (New Hampshire)
    .center([-4, 43.6]) // Set x to relative longitude degrees from central meridian. Set y coordinate of center to latitude you want centered
    .fitSize([width, height], {type: "FeatureCollection", features: land});

let path = d3.geoPath().projection(projection);


var county_centroids = land.map(function (feature) {
  var record = candidate.results.find(element => element.fipscode == feature.properties.GEOID);
  return {
    'votecount': record.votecount,
    'centroid': path.centroid(feature)
  };
});

// Look up likely projection suspects here: https://github.com/veltman/d3-stateplane



// const projection = d3.geoTransverseMercator()
//     .rotate([93, 0]) // Central meridian for EPSG:26915 UTM Zone 15N (Iowa)
//     .center([0, 41.8]) // Set x to relative longitude degrees from central meridian. Set y coordinate of center to latitude you want centered
//     .fitSize([width, height], land);

// NAD83 / Iowa North (EPSG:26975)
// const projection = d3.geoConicConformal()
//   .parallels([42 + 4 / 60, 43 + 16 / 60])
//   .rotate([93 + 30 / 60, 0])
//   .fitSize([width, height], land);



// let county_centroid = geoCentroid().projection(projection);

const circle_sizer = function(input) {
  return circlescale(input);
}

const circlescale = scaleLinear()
  .domain([0, 50000]) // votecount
  .range([0, 80]) // radius range

const densityscale = scaleLinear()
  .domain([0.05, 0.40]) // vote pctage
  .range([0.01, 1]) // opacity range

function setOpacity(feature, results_data) {
  if (results_data.length == 0) {
    return 'fill-opacity: 0.5'
  } else {
    var record = results_data.find(element => element.fipscode == feature.properties.GEOID);

    if (record.votecount > 0) {
      // opacity set by d3 scale
      var opacity = densityscale(record.votepct);

      // opacity based on share of total votes received statewide
      // var opacity = (record.votecount / candidate_total_votes) * 8;

      // opacity based on county percentage
      // var opacity = 0.1 + (record.votepct * 2);
    } else {
      var opacity = 0;
    }

    // opacity based on percentiles
    // var opacity = county_percentiles[record.votecount];
    // var opacity = county_percentiles[record.votepct];

    // console.log(opacity);
    return 'fill-opacity: ' + opacity;
  }
}

function countyClass(feature, results_data) {
  if (results_data.length == 0) {
    return 'no-leader';
  }
  else {
    var record = results_data.find(element => element.fipscode == feature.properties.GEOID);
    // console.log(record);
    if (record.votecount > 0) {
      let candidate_class = 'density-' + record.last.toLowerCase();
      return candidate_class;
    }
    return 'no-votes';
  }
}

</script>


<style>
  .density-map {
    max-width: 120px;
    /* width: 100%; */
    background-color: "#eeeeee";
    /* margin: 0 auto; */
    /* position: relative; */
    /* border: 1px solid #333; */
    margin: 0 1em;
  }
   .provinceShape {
    /* fill: #f5f5f5; */
    fill: #FFF;
    stroke: #999;
    stroke-width: 0.5;
  }

  h4.cand-name {
    font-size: 0.7em;
    margin: 1em 0 0.5em;
  }
</style>

<div class="density-map">
  {#if candidate.results.length > 0}
  <h4 class="cand-name">{candidate.results[0].first} {candidate.results[0].last}</h4>
  {/if}
  <svg viewBox="0 15 {width} {height + 15}" style="width: 100%; height: 100%;">
    <!-- on:mouseout="{hideTooltip(event)}" -->
    <g class="counties">
      {#each land as feature}
        <path d={path(feature)} class="provinceShape" />
      {/each}
    </g>
    <g class="centroids">
    {#each county_centroids as feature}
      {feature}
      <circle class="countyCircle circle-{candidate.results[0].last.toLowerCase()}" cx="{feature.centroid[0]}" cy="{feature.centroid[1]}" r="{circle_sizer(feature.votecount)}"/>
    {/each}
    </g>
  </svg>

</div>
