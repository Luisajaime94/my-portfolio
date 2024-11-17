<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import Pie from '$lib/Pie.svelte';

  let svg;
  let brushSelection;

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

  function brushed(evt) {
    brushSelection = evt.selection;
    console.log('Brush Selection:', brushSelection);
  }

  function isCommitSelected(commit) {
    if (!brushSelection) return false;

    const [[x0, y0], [x1, y1]] = brushSelection;
    const x = xScale(commit.datetime);
    const y = yScale(commit.hourFrac);

    return x >= x0 && x <= x1 && y >= y0 && y <= y1;
  }

  $: {
    if (svg) {
      d3.select(svg).call(
        d3.brush()
          .extent([[usableArea.left, usableArea.top], [usableArea.right, usableArea.bottom]])
          .on('start brush end', brushed)
      );
    }
  }

  $: selectedCommits = brushSelection ? commits.filter(isCommitSelected) : [];
  $: hasSelection = brushSelection && selectedCommits.length > 0;
  $: selectedLines = (hasSelection ? selectedCommits : commits).flatMap((d) => d.lines);
  $: console.log('Data for Pie Chart:', Array.from(languageBreakdown).map(([language, lines]) => ({ label: language, value: lines })));

  $: languageBreakdown = d3.rollups(
    selectedLines,
    (lines) => lines.length,
    (line) => line.language
  );

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

  $: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};

  function handleMouseEnter(index, event) {
    hoveredIndex = index;
    const [x, y] = d3.pointer(event);
    tooltipX = Math.min(x + 15, width - 200);
    tooltipY = Math.min(y + 15, height - 100);
  }

  function handleMouseLeave() {
    hoveredIndex = -1;
  }

  $: xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.datetime))
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
</script>

<dl class="stats">
  <dl class="stat">
    <dt>Total <abbr title="Lines of Code">LOC</abbr></dt>
    <dd>{data.length}</dd>
  </dl>
  <dl class="stat">
    <dt>Total Commits</dt>
    <dd>{totalCommits}</dd>
  </dl>
  <dl class="stat">
    <dt>Number of Files</dt>
    <dd>{numFiles}</dd>
  </dl>
  <dl class="stat">
    <dt>Max File Length (Lines)</dt>
    <dd>{maxFileLength}</dd>
  </dl>
  <dl class="stat">
    <dt>Average File Length (Lines)</dt>
    <dd>{avgFileLength.toFixed(2)}</dd>
  </dl>
  <dl class="stat">
    <dt>Most Active Period</dt>
    <dd>{maxPeriod}</dd>
  </dl>
</dl>

<h2>Commits by Time of Day</h2>

<table
  id="commit-tooltip"
  class="tooltip"
  style="left: {tooltipX}px; top: {tooltipY}px; display: {hoveredCommit ? 'block' : 'none'};"
>
  <tbody>
    <tr>
      <th>Commit</th>
      <td><a href="{hoveredCommit?.url}" target="_blank">{hoveredCommit?.id}</a></td>
    </tr>
    <tr>
      <th>Author</th>
      <td>{hoveredCommit?.author}</td>
    </tr>
    <tr>
      <th>Date</th>
      <td>{hoveredCommit?.datetime?.toLocaleString("en", { dateStyle: "full" })}</td>
    </tr>
    <tr>
      <th>Time</th>
      <td>{hoveredCommit?.datetime?.toLocaleTimeString()}</td>
    </tr>
    <tr>
      <th>Lines Edited</th>
      <td>{hoveredCommit?.lines}</td>
    </tr>
  </tbody>
</table>

<svg bind:this={svg} width={width} height={height}>
  <g class="dots">
    {#each commits as commit, index}
      <circle
        cx={xScale(commit.datetime)}
        cy={yScale(commit.hourFrac)}
        r={Math.sqrt(commit.lines) * 2}
        fill="steelblue"
        on:mouseenter={(event) => handleMouseEnter(index, event)}
        on:mouseleave={handleMouseLeave}
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

<h3>Language Breakdown </h3>
<Pie data={Array.from(languageBreakdown).map(([language, lines]) => ({ label: language, value: lines }))} />

<p>{hasSelection ? selectedCommits.length : "No"} commits selected</p>

<h3>Language Breakdown Details</h3>
{#each languageBreakdown as [language, lines]}
  <p>{language}: {(lines / selectedLines.length * 100).toFixed(1)}%</p>
{/each}

<style>
  svg {
    overflow: visible;
  }

  h2 {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  .dots circle:hover {
    cursor: pointer;
    fill: orange;
  }

  .tooltip {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 4px;
    font-size: 0.9rem;
    pointer-events: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  table.tooltip {
    border-collapse: collapse;
    width: 250px;
  }

  table.tooltip th {
    text-align: left;
    padding-right: 8px;
  }

  table.tooltip th,
  table.tooltip td {
    padding: 4px;
  }

  svg :global(.selection) {
    fill: rgba(0, 0, 0, 0.1);
    stroke: black;
    stroke-dasharray: 4 2;
  }

  .stat {
    margin-bottom: 10px;
  }

  .stat dt {
    font-weight: bold;
  }

  .stat dd {
    margin-left: 0;
  }
</style>
