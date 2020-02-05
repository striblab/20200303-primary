<script>

import {intcomma} from 'journalize';
// import * as jq from 'jquery';

export let county_topojson;
export let cityjson;

export let county_data_grouped;

import { geoAlbers, geoPath, geoMercator } from "d3-geo";
import { scaleOrdinal } from 'd3-scale';
import { feature } from 'topojson';
import _ from 'lodash';
import * as d3 from 'd3';

let data;
let city_points;
let width = 400;
let height = 400;
let center = width / 2;
let tooltipResults;
let top_five;
let rest;
let others;
let tooltipHeight;
let tooltipWidth;

const land = feature(county_topojson, county_topojson.objects.counties)
const cities = cityjson;
data = land.features;
city_points = cities.features;

// Look up likely projection suspects here: https://github.com/veltman/d3-stateplane

// const projection = d3.geoTransverseMercator()
//     .rotate([75, 0]) // Central meridian for EPSG:26918 UTM Zone 18N (New Hampshire)
//     .center([-4, 43]) // Set x to relative longitude degrees from central meridian. Set y coordinate of center to latitude you want centered
//     .fitSize([width, height], land);

// const projection = d3.geoTransverseMercator()
//     .rotate([93, 0]) // Central meridian for EPSG:26915 UTM Zone 15N (Iowa)
//     .center([0, 41.8]) // Set x to relative longitude degrees from central meridian. Set y coordinate of center to latitude you want centered
//     .fitSize([width, height], land);

// NAD83 / Iowa North (EPSG:26975)
const projection = d3.geoConicConformal()
  .parallels([42 + 4 / 60, 43 + 16 / 60])
  .rotate([93 + 30 / 60, 0])
  .fitSize([width, height], land);

let path = d3.geoPath().projection(projection);

function hideTooltip(path, feature) {

  var tooltip = document.getElementById('tooltip')
  if (tooltip.classList.contains('tooltip-active')) {
    tooltip.classList.remove('tooltip-active');
  }
  else {
    tooltip.classList.add('tooltip-active');
  }

  d3.selectAll('.counties path')
    .style('opacity', null)
    .style('stroke-width', null)

}

function buildTooltip(path, feature) {

    if (county_data_grouped.length == 0) {

    }
    else {
      var record = county_data_grouped.find(element => element[0] == feature.properties.GEOID);
      tooltipResults = record[1];
      top_five = tooltipResults.slice(0,5)
      rest = tooltipResults.slice(5, tooltipResults.length)
      // rest.forEach()
      // console.log(top_five)
      // console.log(others)

      let tooltip = document.getElementById('tooltip')
      if (tooltip.classList.contains('tooltip-active')) {
        tooltip.classList.remove('tooltip-active');
      }
      else {
        tooltip.classList.add('tooltip-active');
      }

      tooltipHeight = tooltip.clientHeight;
      tooltipWidth = tooltip.clientWidth;

      d3.selectAll('.counties path')
        .style('opacity', 0.65)

      d3.select(path)
        .style('opacity', 1)
        .style('stroke-width', 1.5)
    }



}

function positionTooltip(event) {
  if (county_data_grouped.length == 0) {

  }
  else {
    let tooltip = d3.select('#tooltip')
    var x = event.layerX ==  event.offsetX ? event.offsetX : event.layerX;
    var y = event.layerY ==  event.offsetY ? event.offsetY : event.layerY;

    let tooltipOffset = 25;
    let cursorOffPage = event.clientY + (tooltipHeight + tooltipOffset) >= window.innerHeight;

    if (!cursorOffPage) {
        tooltip
          .style('left', x - (tooltipWidth / 2) + 'px')
          .style('top', y + tooltipOffset + 'px');
    } else {
        tooltip
          .style('left', x - (tooltipWidth / 2) + 'px')
          .style('top', y - (tooltipHeight + tooltipOffset) + 'px');
    }
  }

}

function countyClass(feature, data) {
  // const data = await results;
  // console.log(data)
  // return 'no-leader';
  if (data.length == 0) {
    return 'no-leader';
  }
  else {
    var record = data.find(element => element[0] == feature.properties.GEOID);
    if (record[1][0].votecount === record[1][1].votecount) {
      return 'no-leader';
    }
    else {
      var leader = record[1][0].last;
      // var county = record[1][0].reportingunitname
      // console.log(leader)
      var leader_class = 'leader-' + leader.toLowerCase()
      // + ' ' + county;
      return leader_class
    }
  }
}

</script>

<style>

.county_map {
  position: relative;
  max-width: 650px;
}

.county-map-tooltip p {
  max-width: 300px;
}

.precincts {
  margin-top: 5px;
}

</style>


<div class="county-map">

  <div class="county-map-tooltip" id="tooltip">
    <h4>{ tooltipResults ? tooltipResults[0].reportingunitname : '' } County</h4>
    <table>
      <thead>
        <tr>
          <th class="cand">Candidate</th>
          <th class="votes">Votes</th>
          <th class="pct">Pct.</th>
        </tr>
      </thead>

      <tbody>
        <!-- {#if tooltipResults}
          {#each tooltipResults as result, i}
            <tr>
              <td class="map-cand">{result.last}</td>
              <td class="map-votes">{intcomma(result.votecount)}</td>
              <td class="map-pct">{Math.round(result.votepct * 100)}%</td>
            </tr>
            {#if i > 5}
              <p>Others receiving votes: {result.last} ({Math.round(result.votepct * 100)}%)</p>
            {/if}
          {/each}
        {/if} -->
        {#if top_five}
          {#each top_five as result}
            <tr>
              <td class="cand">{result.last}</td>
              <td class="votes">{intcomma(result.votecount)}</td>
              <td class="pct">{Math.round(result.votepct * 100)}%</td>
            </tr>
          {/each}
        {/if}

        {#if others}
        <p> Others receiving votes:
          {#each others as result}
            {result.last} ({Math.round(result.votepct * 100)}%),
          {/each}
        </p>
        {/if}
      </tbody>
    </table>

    {#if tooltipResults}
      <div class="precincts">
        { Math.round(tooltipResults[0].precinctsreportingpct * 100) }% precincts reporting in county
      </div>
    {/if}
  </div>
<!-- width="500" height="500"  -->
  <svg viewBox="0 0 {width} {height}" style="width: 100%; height: 100%;">
    <!-- on:mouseout="{hideTooltip(event)}" -->
    <g class="counties">
      {#each data as feature}
        <path d={path(feature)} class="provinceShape {countyClass(feature, county_data_grouped)}" on:mouseover="{buildTooltip(this, feature)}" on:mousemove="{positionTooltip}" on:mouseout="{hideTooltip(this, feature)}" county_name={feature.properties.NAME.replace(/\s/g,'')}/>
      {/each}
    </g>
    <g class="cities">
      {#each city_points as city}
        <circle class="cityDot" cx="{projection(city.geometry.coordinates)[0]}" cy="{projection(city.geometry.coordinates)[1]}" r=2></circle>
        <text class="cityLabel" x="{projection(city.geometry.coordinates)[0]}" y="{projection(city.geometry.coordinates)[1] - 5}">{city.properties.NAME}</text>
      {/each}
    </g>
  </svg>

</div>
