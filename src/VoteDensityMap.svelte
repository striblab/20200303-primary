<script>

import { geoAlbers, geoPath, geoMercator, geoCentroid } from "d3-geo";
import { scaleLinear } from 'd3-scale';
import { feature } from 'topojson';
import _ from 'lodash';
import * as d3 from 'd3';

export let county_topojson;
export let county_centroids;
export let cityjson;
let city_points = cityjson.features;
export let candidate;
let aspect_ratio = 1.3
export let width = 200;
export let height = width * aspect_ratio;
let center = width / 2;
const min_circle_area = 0;
const max_circle_area = 22;

const land = feature(county_topojson, county_topojson.objects.counties).features;

// Look up likely projection suspects here: https://github.com/veltman/d3-stateplane

// NAD83 / Minnesota Central (EPSG:26992)
const projection = d3.geoConicConformal()
  .parallels([45 + 37 / 60, 47 + 3 / 60])
  .rotate([94 + 15 / 60, 0])
  .fitSize([width, height], {type: "FeatureCollection", features: land});

// const projection = d3.geoTransverseMercator()
//     .rotate([75, 0]) // Central meridian for EPSG:26918 UTM Zone 18N (New Hampshire)
//     .center([-4, 43.6]) // Set x to relative longitude degrees from central meridian. Set y coordinate of center to latitude you want centered
//     .fitSize([width, height], {type: "FeatureCollection", features: land});

// const projection = d3.geoTransverseMercator()
//     .rotate([93, 0]) // Central meridian for EPSG:26915 UTM Zone 15N (Iowa)
//     .center([0, 41.8]) // Set x to relative longitude degrees from central meridian. Set y coordinate of center to latitude you want centered
//     .fitSize([width, height], land);

// NAD83 / Iowa North (EPSG:26975)
// const projection = d3.geoConicConformal()
//   .parallels([42 + 4 / 60, 43 + 16 / 60])
//   .rotate([93 + 30 / 60, 0])
//   .fitSize([width, height], land);


let path = d3.geoPath().projection(projection);

$: {
  county_centroids = land.map(function (feature) {
    var record = candidate.results.find(element => element.fipscode == feature.properties.GEOID);
    return {
      'votecount': record.votecount,
      'centroid': path.centroid(feature)
    };
  });
}

const radius_calc = function(area) {
  return Math.sqrt(area / Math.PI)
}

// const circlescale = scaleLinear()
//   .domain([0, 50000]) // votecount
//   .range([0, 80]) // radius range

const circlescalearea = d3.scaleLinear()
  //.domain([0, 75000]) // votecount Clinton 2016 test data
  .domain([0, 17000]) // votecount
  .range([min_circle_area, max_circle_area]); // radius range

const circle_sizer = function(input) {
  return circlescalearea(input);
}

</script>

<style>
  .density-map {
    max-width: 250px;
    margin: 1.5em;
    /* width: 100%; */
    margin: 15px 15px;
    background-color: "#eeeeee";
    /* margin: 0 auto; */
    /* position: relative; */
    /* border: 1px solid #333; */
    /* margin: 0 1em; */
  }

  h4.cand-name {
    font-size: 0.9em;
    margin: 1em 0 0.5em;
  }

  .provinceShape {
    /* fill: #f5f5f5; */
    fill: #FFF;
    stroke: #999;
    stroke-width: 0.5;
  }

  .cityDot,
  .cityLabel {
    fill: #000;
  }
</style>

<div class="density-map">
  <!-- {#if candidate.results.length > 0}
  <h4 class="cand-name">{candidate.results[0].first} {candidate.results[0].last}</h4>
  {/if} -->
  <h4 class="cand-name">{candidate.results[0].first} {candidate.results[0].last}</h4>
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
    <g class="cities">
      {#each city_points as city}
        <circle class="cityDot" cx="{projection(city.geometry.coordinates)[0]}" cy="{projection(city.geometry.coordinates)[1]}" r=2 style="fill:#000;"></circle>
        <text id="{city.properties.NAME.replace(' ', '-')}-label" class="cityLabel" x="{projection(city.geometry.coordinates)[0]}" y="{projection(city.geometry.coordinates)[1] - 5}" style="font-size: 10px; fill: #000; font-weight: 400;font-family:'Benton Sans', sans-serif; text-shadow:none;">{city.properties.NAME}</text>
      {/each}
    </g>
  </svg>

</div>
