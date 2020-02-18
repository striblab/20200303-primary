<script>
  import * as d3 from 'd3';
  import demographics from './data/mn_demographics_history.json';

  export let candidate;
  export let x_var = 'pop_density_2018';
  export let x_var_label = 'Population density';
  export let x_axis_min = 0;
  export let x_axis_max = 100;
  export let x_min_formatter = '.1r';
  export let x_max_formatter = ',.4r';
  export let x_unit = ' widgets';
  export let verbose_labels = false;

  let min_x = d3.min(demographics.map(i => i[x_var]));
  let max_x = d3.max(demographics.map(i => i[x_var]));
  let median_x = d3.median(demographics.map(i => i[x_var]));
  let candidate_id = '';

  let chart_data;
  const height = 80;
  const min_circle_radius = 0;
  const max_circle_radius = 10;
  const min_circle_area = 0;
  const max_circle_area = 2500;

  const radius_calc = function(area) {
    return Math.sqrt(area / Math.PI)
  }

  const f_min = d3.format(x_min_formatter);
  const f_max = d3.format(x_max_formatter);
  const f_votes = d3.format(',')

  console.log(verbose_labels);

  $: {
    chart_data = demographics.map(function (county) {
      var record = candidate.results.find(element => element.fipscode == county.fips);
      return {
        'name': county.county,
        'votecount': record.votecount,
        // 'votecount': county.dVotes_2016,  // Clinton 2016 test data
        'x_var': county[x_var],
        'x_var_name': x_var_label
      };
    });

    chart_data = chart_data.sort(function(first, second) {
      return second.votecount - first.votecount;
    });

    candidate_id = candidate.results[0].last.toLowerCase();
  }

  const positionScale = d3.scaleLinear()
    .domain([x_axis_min, x_axis_max]) // population or other x var
    .range([0, 100]) // position range

  // const circlescale = d3.scaleLinear()
  //   .domain([0, 75000]) // votecount
  //   .range([min_circle_radius, max_circle_radius]) // radius range

  const circlescalearea = d3.scaleLinear()
    // .domain([0, 100000]) // votecount Clinton 2016 test data
    .domain([0, 17000]) // votecount
    .range([min_circle_area, max_circle_area]) // radius range

  const circle_sizer = function(input) {
    return radius_calc(circlescalearea(input));
  }

  const showDemoTooltips = function(event) {
    d3.selectAll('.votes-tooltip').attr("opacity", "0");
    d3.selectAll('.votes-tooltip-dagger').attr("opacity", "0");

    let svg = d3.select('#' + x_var + '-' + candidate_id + '-chart');
    let current_x = positionScale(d3.select(event.target).attr('data-x')) + '%';

    console.log(current_x, event.target);
    svg.select('.votes-tooltip').attr("x", current_x);
    svg.select('.votes-tooltip-dagger').attr("x1", current_x);
    svg.select('.votes-tooltip-dagger').attr("x2", current_x);
    svg.select('.votes-tooltip').text(event.target.getAttribute('data-display-var'));
    svg.select('.votes-tooltip').attr("opacity", "1");
    svg.select('.votes-tooltip-dagger').attr("opacity", "1");

  }
</script>

<style>

</style>

<div class="demographic-chart">
  <h5 class="chart-label">{x_var_label}</h5>
  <svg id="{x_var}-{candidate_id}-chart" style="width: 100%; height: {height}px;">
    <g class="chart-lines" transform="translate(0, {height/2})">
      <line class="x-axis" x1="0" x2="0" y1="-10" y2="10"/>
      <line class="x-axis" x1="0" x2="100%" y1="0" y2="0"/>
      <line class="x-axis" x1="100%" x2="100%" y1="-10" y2="10"/>
      <line class="median" x1="{positionScale(median_x)}%" x2="{positionScale(median_x)}%" y1="-22" y2="22"/>
    </g>
    <g class="chart-labels" transform="translate(0, {height/2})">
      <text class="axis-label" x="-3" y="23">{f_min(x_axis_min)}{#if verbose_labels == true} {x_unit}{/if}</text>
      <text class="axis-label" text-anchor="end" x="101%" y="23">{f_max(x_axis_max)}{#if verbose_labels == true} {x_unit}{/if}</text>
      {#if verbose_labels == true}<text class="median-label" text-anchor="middle" x="{positionScale(median_x)}%" y="35">median: {f_max(median_x)}</text>{/if}
    </g>
    <g class="county-circles" transform="translate(0, {height/2})">
    {#each chart_data as county}
      {#if county.votecount > 0}
      <circle class="countyCircle circle-{candidate_id}" cx="{positionScale(county.x_var)}%" cy="0" r="{circle_sizer(county.votecount)}" on:mouseover={showDemoTooltips} data-x="{county.x_var}" data-display-var="{county.name}: {f_votes(county.votecount)} votes" />
      <circle class="county-circle-center circle-{candidate_id}" cx="{positionScale(county.x_var)}%" cy="0" r="1"/>
      {/if}
    {/each}
    </g>
    <g class="chart-tooltip-stuff" transform="translate(0, {height/2})">
      <text class="votes-tooltip" text-anchor="middle" x="{positionScale(median_x)}%" y="-30"></text>
      <line class="votes-tooltip-dagger" x1="{positionScale(median_x)}%" x2="{positionScale(median_x)}%" y1="-27" y2="-2"/>
    </g>
  </svg>
</div>
