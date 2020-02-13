<script>
  import * as d3 from 'd3';
  import mn_demographics from './data/mn_demographics_history.json';

  export let candidate;
  export let x_var = 'pop_density_2018';
  export let x_var_label = 'Population density';
  export let x_min_formatter = '.1r';
  export let x_max_formatter = ',.4r';
  export let x_unit = ' widgets';

  let min_x = d3.min(mn_demographics.map(i => i[x_var]));
  let max_x = d3.max(mn_demographics.map(i => i[x_var]));
  let median_x = d3.median(mn_demographics.map(i => i[x_var]));

  let chart_data;
  const width = 400;
  const height = 80;
  const min_circle_radius = 0;
  const max_circle_radius = 30;

  const f_min = d3.format(x_min_formatter);
  const f_max = d3.format(x_max_formatter);

  $: {
    chart_data = mn_demographics.map(function (county) {
      var record = candidate.results.find(element => element.fipscode == county.fips);
      return {
        'votecount': record.votecount,
        'x_var': county[x_var],
        'x_var_name': x_var_label
      };
    });
  }

  const circle_sizer = function(input) {
    return circlescale(input);
  }

  const positionScale = d3.scaleLinear()
    .domain([min_x, max_x]) // population or other x var
    .range([0, width]) // position range

  const circlescale = d3.scaleLinear()
    .domain([0, 16000]) // votecount
    .range([min_circle_radius, max_circle_radius]) // radius range

</script>

<style>

  .demographic-chart {
    width: 100%;
    height: 100px;
  }

  .county-circle-center {
    fill: #FFF;
    fill-opacity: 1;
  }

  svg {
    overflow: visible;
  }

  svg .chart-labels {
    font-size: 10px;
    font-weight: 500;
    font-family: "Benton Sans", sans-serif;
  }

  svg .x-axis {
    stroke: #000;
    stroke-width: 0.5;
  }

  svg .median {
    stroke: #BBB;
    stroke-width: 1.5;
    stroke-dasharray: 4;
  }

</style>

<div class="demographic-chart">
  <h5>Votes by {chart_data[0].x_var_name}</h5>
  <svg viewBox="0 -{max_circle_radius} {width} {height + max_circle_radius}" style="width: 100%;">
    <g class="chart-lines">
      <line class="x-axis" x1="0" x2="0" y1="-10" y2="10"/>
      <line class="x-axis" x1="0" x2="{width}" y1="0" y2="0"/>
      <line class="x-axis" x1="{width}" x2="{width}" y1="-10" y2="10"/>
      <line class="median" x1="{positionScale(median_x)}" x2="{positionScale(median_x)}" y1="-22" y2="22"/>
    </g>
    <g class="chart-labels">
      <text class="axis-label" x="-3" y="22">{f_min(min_x)} {x_unit}</text>
      <text class="axis-label" text-anchor="end" x="{width + 3}" y="20">{f_max(max_x)}{x_unit}</text>
    </g>
    <g class="county-circles">
    {#each chart_data as county}
      {#if county.votecount > 0}
      <circle class="countyCircle circle-{candidate.results[0].last.toLowerCase()}" cx="{positionScale(county.x_var)}" cy="0" r="{circle_sizer(county.votecount)}"/>
      <circle class="county-circle-center circle-{candidate.results[0].last.toLowerCase()}" cx="{positionScale(county.x_var)}" cy="0" r="1"/>
      {/if}
    {/each}
    </g>
  </svg>

</div>
