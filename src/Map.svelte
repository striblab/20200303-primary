<script>

export let geojson;
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
let tooltipHeight;
let tooltipWidth;


const projection = geoAlbers()
            // .center([width, height])
            .scale(4500)
            // .translate([0, height]);
            // iowa translation
            .translate([0, height + (width / 8)])
            //mn translation
            // .translate([0, height * 2])

let path = geoPath().projection(projection);

const land = feature(geojson, geojson.objects.cb_2015_iowa_county_20m)
const cities = feature(geojson, geojson.objects.cities)
// const land = feature(geojson, geojson.objects.cb_2015_minnesota_county_20m);
data = land.features;
city_points = cities.features;

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

}

// function buildTooltip(path, feature) {
//
//     var record = county_data_grouped.find(element => element[0] == feature.properties.GEOID);
//     tooltipResults = record[1];
//
//     let tooltip = document.getElementById('tooltip')
//     if (tooltip.classList.contains('tooltip-active')) {
//       tooltip.classList.remove('tooltip-active');
//     }
//     else {
//       tooltip.classList.add('tooltip-active');
//     }
//
//     tooltipHeight = tooltip.clientHeight;
//     tooltipWidth = tooltip.clientWidth;
//
//     d3.selectAll('.counties path')
//       .style('opacity', 0.65)
//
//     d3.select(path)
//       .style('opacity', 1)
//
//     // console.log(feature.properties.GEOID)
//     // console.log(feature.properties.NAME + ' County')
//     // console.log(record)
//     // console.log(record[1][0].last)
//   // }
// }
//
// function positionTooltip(event, feature) {
//   let tooltip = d3.select('#tooltip')
//   var x = event.layerX ==  event.offsetX ? event.offsetX : event.layerX;
//   var y = event.layerY ==  event.offsetY ? event.offsetY : event.layerY;
//
//   let tooltipOffset = 25;
//   let cursorOffPage = event.clientY + (tooltipHeight + tooltipOffset) >= window.innerHeight;
//
//   if (!cursorOffPage) {
//       tooltip
//         .style('left', x - (tooltipWidth / 2) + 'px')
//         .style('top', y + tooltipOffset + 'px');
//   } else {
//       tooltip
//         .style('left', x - (tooltipWidth / 2) + 'px')
//         .style('top', y - (tooltipHeight + tooltipOffset) + 'px');
//     }
// }

function countyClass(feature, data) {
  // const data = await results;
  // console.log(data)
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
      // console.log(leader)
      var leader_class = 'leader-' + leader.toLowerCase();
      return leader_class
    }
  }
}

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

<div class="county-map">

  <div class="county-map-tooltip" id="tooltip">
    <h4>{ tooltipResults ? tooltipResults[0].reportingunitname : '' } County</h4>
    <table>
      <thead>
        <tr>
          <th class="map-cand">Candidate</th>
          <th class="map-votes">Votes</th>
          <th class="map-pct">Pct.</th>
        </tr>
      </thead>

      <tbody>
        {#if tooltipResults}
          {#each tooltipResults as result}
            <tr>
              <td class="map-cand">{result.last}</td>
              <td class="map-votes">{result.votecount}</td>
              <td class="map-pct">{result.votepct}</td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>

    {#if tooltipResults}
      <div class="reporting">
        { tooltipResults[0].precinctsreportingpct * 100 }% precincts reporting in county
      </div>
    {/if}
  </div>

  <svg viewbox="0 0 400 400" style="width: 100%; height: 100%;" >
    <!-- on:mouseout="{hideTooltip(event)}" -->
    <g class="counties">
      {#each data as feature}
        <path d={path(feature)} class="provinceShape {countyClass(feature, county_data_grouped)}" />
      {/each}
    </g>
    <g class="cities">
      <!-- {#if city_points.length != 0} -->
      {#each city_points as city}
        <path d="{path(city)}"></path>
      {/each}
      <!-- {/if} -->
    </g>
  </svg>

</div>
