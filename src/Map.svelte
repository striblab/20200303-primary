<script>

import {intcomma} from 'journalize';
import { fade } from 'svelte/transition';

export let county_topojson;
export let cityjson;
export let roads_topojson;
export let us_county_names;
export let county_data_grouped;

import { geoAlbers, geoPath, geoMercator } from "d3-geo";
import { feature } from 'topojson';
import * as d3 from 'd3';

let county_record;
let county_name;
$: {
  if (record == null) {
    county_name = ''
  }
  else {
    county_record = us_county_names.find(element => element.geoid == tooltipResults[0].fipscode);
    county_name = county_record.name;
  }
}

let viable = ['Biden', 'Sanders', 'Warren', 'Buttigieg', 'Bloomberg', 'Klobuchar']
let county_features;
let city_points;
let road_lines;
let aspect_ratio = 1.3;
export let width = 400;
export let height = width * aspect_ratio;
let center = width / 2;
export let tooltipResults;
let top_six = [];
let rest;
let others;
let tooltipHeight;
let tooltipWidth;
let tooltip;
let record;

const land = feature(county_topojson, county_topojson.objects.counties);
const roads = feature(roads_topojson, roads_topojson.objects.roads);
const cities = cityjson;
county_features = land.features;
city_points = cities.features;
road_lines = roads.features;

// Look up likely projection suspects here: https://github.com/veltman/d3-stateplane

// NAD83 / Minnesota Central (EPSG:26992)
const projection = d3.geoConicConformal()
  .parallels([45 + 37 / 60, 47 + 3 / 60])
  .rotate([94 + 15 / 60, 0])
  .fitSize([width, height], land);

// const projection = d3.geoTransverseMercator()
//     .rotate([75, 0]) // Central meridian for EPSG:26918 UTM Zone 18N (New Hampshire)
//     .center([-4, 43.6]) // Set x to relative longitude degrees from central meridian. Set y coordinate of center to latitude you want centered
//     .fitSize([width, height], land);

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


function hideTooltip(path, feature) {

  tooltip = document.getElementById('tooltip')
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
      var i;
      if (county_data_grouped) {
        record = county_data_grouped.find(element => element[0] == feature.properties.GEOID);
      }
      else {
        return;
      }

      if (record.length > 0) {
        tooltipResults = record[1];

        top_six = [];

        if (tooltipResults[0].precinctsreporting === 0) {
          for (i = 0; i < tooltipResults.length; i++) {
    				if (viable.includes(tooltipResults[i].last)) {
              top_six.push(tooltipResults[i])
            }
    			}
        }
        else {
          top_six = tooltipResults.slice(0,6)
          rest = tooltipResults.slice(6, tooltipResults.length)
        }

        let tooltip =  d3.select('#tooltip')

        // tooltipHeight = tooltip.node().clientHeight;
        // tooltipWidth = tooltip.node().clientWidth;

        if (tooltip.classed('tooltip-active')) {
          tooltip.classed('tooltip-active', false);
        }
        else {
          tooltip.classed('tooltip-active', true);
        }

        d3.selectAll('.counties path')
          .style('opacity', 0.65)

        d3.select(path)
          .style('opacity', 1)
          .style('stroke-width', 1.5)
      }


}

function positionTooltip(event) {
  // if (tooltipResults.length > 0) {
    let tooltip = d3.select('#tooltip')
    let svg = document.getElementById('resultsMap')
    var bounding = svg.getBoundingClientRect()
    var x = event.layerX ==  event.offsetX ? event.offsetX : event.layerX;
    var y = event.layerY ==  event.offsetY ? event.offsetY : event.layerY;

    var cursorX = event.clientX - bounding.left;

    tooltipHeight = tooltip.node().clientHeight;
    tooltipWidth = tooltip.node().clientWidth;

    let tooltipOffset = 25;
    let cursorOffPage = event.clientY + (tooltipHeight + tooltipOffset) >= window.innerHeight;

    if (!cursorOffPage) {
      if (cursorX > width / 2) {
        tooltip
          .style('left', x - (tooltipWidth) + 'px')
          .style('top', y + tooltipOffset + 'px');
      }
      else if (cursorX < width / 2) {
        tooltip
          .style('left', x + 0 + 'px')
          // .style('left', x )
          .style('top', y + tooltipOffset + 'px');
      }
        // tooltip
        //   .style('left', x - (tooltipWidth / 2) + 'px')
        //   .style('top', y + tooltipOffset + 'px');
    }
    else {
      if (cursorX > width / 2) {
        tooltip
          .style('left', x - (tooltipWidth) + 'px')
          .style('top', y - (tooltipHeight + tooltipOffset) + 'px');
      }
      else if (cursorX < width / 2) {
        tooltip
          .style('left', x + 0 + 'px')
          // .style('left', x )
          .style('top', y - (tooltipHeight + tooltipOffset) + 'px');
      }
        // tooltip
        //   .style('left', x - (tooltipWidth / 2) + 'px')
        //   .style('top', y - (tooltipHeight + tooltipOffset) + 'px');
    }
  // }
}

function countyClass(feature, county_data) {
  var record = county_data.find(element => element[0] == feature.properties.GEOID);

  if (county_data.length == 0 || record[1][0].precinctsreportingpct == 0) {
    return 'no-results';
  }
  else {
    var record = county_data.find(element => element[0] == feature.properties.GEOID);
    if (record[1][0].votecount === record[1][1].votecount) {
      return 'tie';
    }
    else {
      var leader = record[1][0].last;
      var leader_class = 'leader-' + leader.toLowerCase()
      return leader_class
    }
  }
}

</script>

<style>

.county_map {
  position: relative;
  max-width: 550px;
}

.county-map-tooltip {
  max-width: 170px;
}

.precincts {
  margin-top: 5px;
}

.roadLine {
  fill: none;
  stroke-width: 1;
  stroke: #FFF;
  stroke-opacity: 0.6;
  pointer-events: none;
}

</style>


<div class="county-map">
  <div class="county-map-tooltip" id="tooltip">
    <h4>{ county_name } County</h4>
    {#if tooltipResults}
    <table>
      <thead>
        <tr>
          <th class="cand">Candidate</th>
          <th class="votes">Votes</th>
          <th class="pct">Pct.</th>
        </tr>
      </thead>

      <tbody>
        {#if top_six}
          {#each top_six as result}
            <tr>
              <td class="cand">{result.last}</td>
              <td class="votes">
                {#if Math.round(top_six[0].precinctsreporting) === 0}
                  -
                {:else}
                  {intcomma(result.votecount)}
                {/if}
              </td>
              <td class="pct">
                {#if Math.round(top_six[0].precinctsreporting) === 0}
                  -
                {:else}
                  {Math.round(result.votepct * 100)}%
                {/if}
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>

      <div class="precincts">
        { Math.round(tooltipResults[0].precinctsreportingpct * 100) }% precincts reporting in county
      </div>
      {/if}
  </div>

<!-- width="500" height="500"  -->
  <svg viewBox="0 0 {width} {height}" style="width: 100%; height: 100%;" id="resultsMap">
    <!-- on:mouseout="{hideTooltip(event)}" -->
    <g class="counties">
      {#each county_features as feature}
        <path d={path(feature)} class="provinceShape {countyClass(feature, county_data_grouped)}" in:fade out:fade on:mouseover="{buildTooltip(this, feature)}" on:mousemove="{positionTooltip}" on:mouseout="{hideTooltip(this, feature)}" county_name={feature.properties.NAME.replace(/\s/g,'').replace(/\./g,' ').toUpperCase()}/>
      {/each}
    </g>
    <!-- <g class="roads">
      {#each road_lines as feature}
        <path d={path(feature)} class="roadLine"/>
      {/each}
    </g> -->
    <g class="cities">
      {#each city_points as city}
        <circle class="cityDot" cx="{projection(city.geometry.coordinates)[0]}" cy="{projection(city.geometry.coordinates)[1]}" r=2></circle>
        <text id="{city.properties.NAME.replace(' ', '-')}-label" class="cityLabel" x="{projection(city.geometry.coordinates)[0]}" y="{projection(city.geometry.coordinates)[1] - 5}">{city.properties.NAME}</text>
      {/each}
    </g>
  </svg>

</div>
