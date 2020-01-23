<script>

export let geojson;
export let county_data_grouped;

import { geoAlbers, geoPath, geoMercator } from "d3-geo";
import { scaleOrdinal } from 'd3-scale';
import { feature } from 'topojson';
import _ from 'lodash';
import * as d3 from 'd3';

let data;
let width = 400;
let height = 400;
let center = width / 2;



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
// const land = feature(geojson, geojson.objects.cb_2015_minnesota_county_20m);
data = land.features;

function hideTooltip(feature) {
  if (feature) {
    this.set({
      tooltipActive: false,
      toolTipResults: undefined
    });
  }

}

function buildTooltip(feature) {

  if (feature) {

    feature.set({
      tooltipActive: true,
      tooltipResults: results
    })

    var record = county_data_grouped.find(element => element[0] == feature.properties.GEOID);
    var results = record[1]

    console.log(feature.properties.GEOID)
    console.log(feature.properties.NAME + ' County')
    console.log(record)
    console.log(record[1][0].last)
  }
}

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

<slot>

</slot>

<div class="county-map">

  <!-- <div class="county-map-tooltip { tooltipActive ? 'tooltip-active' : '' }">
    <h4>{ toolTipResults ? toolTipResults.countyName : '' } County</h4>
    <table>
      <thead>
        <tr>
          <th class="map-cand">Candidate</th>
          <th class="map-votes">Votes</th>
          <th class="map-pct">Pct.</th>
        </tr>
      </thead>

      <tbody>
        {#if toolTipResults}
          {#each toolTipResults as result}
            <tr>
              <td class="map-cand">{ keyedResults[result.candidate_id].candidate.last }</td>
              <td class="map-votes">{ result.votes.toLocaleString() }</td>
              <td class="map-pct">{ round(result.percent * 100, 1) }%</td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>

    {#if toolTipResults && toolTipResults[0] && toolTipResults[0].resultDetails}
      <div class="reporting">
        { round(toolTipResults[0].resultDetails.totalPrecincts ? toolTipResults[0].resultDetails.reporting / toolTipResults[0].resultDetails.totalPrecincts * 100 : 0, 0) }% precincts reporting in county
      </div>
    {/if}
  </div>
   -->
  <svg viewbox="0 0 400 400" style="width: 100%; height: 100%;" >
    <!-- on:mouseout="{hideTooltip(event)}" -->
    <g class="counties">
      {#each data as feature}
        <path d={path(feature)} class="provinceShape {countyClass(feature, county_data_grouped)}" on:mouseover="{buildTooltip(feature)}" on:mouseout="{hideTooltip(feature)}" />
      {/each}
    </g>
  </svg>

</div>
