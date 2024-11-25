<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import Pie from '$lib/Pie.svelte';

  let svg;

  let data = [];
  let commits = [];
  let totalCommits = 0;
  let numFiles = 0;
  let maxPeriod = '';
  let maxFileLength = 0;
  let avgFileLength = 0;
  let width = 1000;
  let height = 600;

  let margin = { top: 20, right: 20, bottom: 50, left: 80 };
  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
  };
  usableArea.width = usableArea.right - usableArea.left;
  usableArea.height = usableArea.bottom - usableArea.top;

  let selectedCommits = [];
  let commitProgress = 100;

  function brushed(evt) {
    let brushSelection = evt.selection;
    selectedCommits = !brushSelection
      ? []
      : filteredCommits.filter((commit) => {
          let min = { x: brushSelection[0][0], y: brushSelection[0][1] };
          let max = { x: brushSelection[1][0], y: brushSelection[1][1] };
          let x = xScale(commit.datetime);
          let y = yScale(commit.hourFrac);

          return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
        });
  }

  function isCommitSelected(commit) {
    return selectedCommits.includes(commit);
  }

  function dotInteraction(evt, index) {
    if (evt.type === "click" || (evt.type === "keyup" && evt.key === "Enter")) {
      selectedCommits = [filteredCommits[index]];
    }
  }

  let xAxis, yAxis, yAxisGridlines;

  let hoveredIndex = -1;
  let tooltipX = 0, tooltipY = 0;

  onMount(async () => {
    data = await d3.csv('/loc.csv', (row) => ({
      ...row,
      line: Number(row.line),
      depth: Number(row.depth),
      length: Number(row.length),
      datetime: new Date(row.datetime),
    }));

    commits = d3.groups(data, (d) => d.commit).map(([commit, lines]) => ({
      id: commit,
      datetime: lines[0].datetime,
      hourFrac: lines[0].datetime.getHours() + lines[0].datetime.getMinutes() / 60,
      author: lines[0]?.author || 'Unknown',
      url: `https://github.com/your-repo/commit/${commit}`,
      lines: lines.length,
    }));

    totalCommits = commits.length;
  });

  $: hoveredCommit = filteredCommits[hoveredIndex] ?? hoveredCommit ?? {};

  function handleMouseEnter(index, event) {
    hoveredIndex = index;
    const [x, y] = d3.pointer(event);
    tooltipX = Math.min(x + 15, width - 200);
    tooltipY = Math.min(y + 15, height - 100);
  }

  function handleMouseLeave() {
    hoveredIndex = -1;
  }

  $: timeScale = d3
    .scaleLinear()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([0, 100]);

  $: commitMaxTime = timeScale.invert(commitProgress);

  $: filteredCommits = commits.filter((commit) => commit.datetime <= commitMaxTime);
  $: filteredLines = data.filter((line) => line.datetime <= commitMaxTime);

  $: xScale = d3
    .scaleTime()
    .domain(d3.extent(filteredLines, (d) => d.datetime))
    .range([usableArea.left, usableArea.right]);

  $: yScale = d3
    .scaleLinear()
    .domain([0, 24])
    .range([usableArea.bottom, usableArea.top]);

  $: {
    if (xAxis) {
      d3.select(xAxis).call(d3.axisBottom(xScale));
    }
    if (yAxis) {
      d3.select(yAxis).call(
        d3.axisLeft(yScale).tickFormat((d) => String(d % 24).padStart(2, '0') + ':00')
      );
    }
  }

  $: {
    d3.select(yAxisGridlines).call(
      d3.axisLeft(yScale)
        .tickSize(-usableArea.width)
        .tickFormat("")
    );
  }

  $: selectedLines = (selectedCommits.length > 0 ? selectedCommits : filteredCommits).flatMap((d) => d.lines);
  $: languageBreakdown = d3.rollups(
    selectedLines,
    (lines) => lines.length,
    (line) => line.language
  );
</script>

<!-- SVG Visualization -->
<svg bind:this={svg} width={width} height={height}>
  <g class="dots">
    {#each filteredCommits as commit, index (commit.id)}
      <circle
        cx={xScale(commit.datetime)}
        cy={yScale(commit.hourFrac)}
        r={Math.sqrt(commit.lines) * 2}
        fill="steelblue"
        on:mouseenter={(event) => handleMouseEnter(index, event)}
        on:mouseleave={handleMouseLeave}
        on:click={(evt) => dotInteraction(evt, index)}
        on:keyup={(evt) => dotInteraction(evt, index)}
        tabindex="0"
        class:selected={isCommitSelected(commit)}
      />
    {/each}
  </g>

  <!-- X Axis -->
  <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis}></g>

  <!-- Y Axis -->
  <g transform="translate({usableArea.left}, 0)" bind:this={yAxis}></g>

  <!-- Gridlines -->
  <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
</svg>

<!-- Filtering Slider -->
<div class="slider-container">
  <label>
    <input
      type="range"
      min="0"
      max="100"
      step="1"
      bind:value={commitProgress}
      class="slider"
    />
    <time>{commitMaxTime.toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" })}</time>
  </label>
</div>

<!-- Pie Chart -->
<h3>Language Breakdown</h3>
{#if languageBreakdown.length > 0}
  <Pie pieData={Array.from(languageBreakdown).map(([language, lines]) => [language, lines])} />
{:else}
  <p>No data available for the pie chart.</p>
{/if}

<style>
  .slider-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
  .slider {
    width: 100%;
    max-width: 600px;
    margin: 10px 0;
  }
</style>
