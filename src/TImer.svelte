<script>
  export let data = [];

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
      // console.log(time)
		}
	}
	let timerInterval = setInterval(countdown, 1000);
</script>

<style>
  .live2 {
    font-family: "Benton Sans", sans-serif;
    font-weight: 700;
    color: red;
    text-align: center;
    /* margin-top: 30px; */
  }
</style>

<div class="updates">
	<p class="live2">&bull; LIVE</p>
  {#if time}
  	{#if typeof(time) == "string"}
  	<p class="countdown">{time}</p>
  	{:else}
  		{#if time < 10}
  		<p class="countdown">Checking for new data 0:0{time}</p>
  		{:else}
  		<p class="countdown">Checking for new data 0:{time}</p>
  		{/if}
  	{/if}
  {/if}
</div>
