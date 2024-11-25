<script>
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
  
    export let commits = [];
    export let selectedCommits = [];
  
    let svg;
    let xAxis, yAxis, yAxisGridlines;
    let hoveredIndex = -1;
    let tooltipX = 0, tooltipY = 0;
    const width = 1000;
    const height = 600;
  
    const margin = { top: 20, right: 20, bottom: 50, left: 80 };
    const usableArea = {
      top: margin.top,
      right: width - margin.right,
      bottom: height - margin.bottom,
      left: margin.left,
    };
    usableArea.width = usableArea.right - usableArea.left;
    usableArea.height = usableArea.bottom - usableArea.top;
  
    function handleMouseEnter(index, event) {
      hoveredIndex = index;
      const [x, y] = d3.pointer(event);
      tooltipX = Math.min(x + 15, width - 200);
      tooltipY = Math.min(y + 15, height - 100);
    }
  
    function handleMouseLeave() {
      hoveredIndex = -1;
    }
  
    function dotInteraction(evt, index) {
      if (evt.type === "click" || (evt.type === "keyup" && evt.key === "Enter")) {
        selectedCommits = [commits[index]];
      }
    }
  
    $: xScale = d3
      .scaleTime()
      .domain(d3.extent(commits, (d) => d.datetime))
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
  
  <svg bind:this={svg} width={width} height={height}>
    <g class="dots">
      {#each commits as commit, index (commit.id)}
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
          class:selected={selectedCommits.includes(commit)}
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
  
  <style>
    .dots circle {
      transition: cx 0.3s ease, cy 0.3s ease, r 0.3s ease;
    }
  
    .dots circle.selected {
      fill: orange;
      stroke: black;
      stroke-width: 2px;
    }
  </style>
  