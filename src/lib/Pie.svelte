<script>
    import * as d3 from 'd3';
    export let pieData = [];
    export let selectedIndex = -1;

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let sliceGenerator = d3.pie().value(d => d[1]);

    $: arcs = sliceGenerator(pieData).map(d => arcGenerator(d));
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    function toggleWedge(index, event) {
        if (!event.key || event.key === 'Enter') {
            selectedIndex = selectedIndex === index ? -1 : index;
        }
    }
</script>

<svg width="400" height="400" viewBox="-50 -50 100 100">
    {#each arcs as arc, index}
        <path
            d={arc}
            fill={colors(index)}
            class:selected={selectedIndex === index}
            tabindex="0"
            role="button"
            aria-label="Select wedge"
            on:click={e => toggleWedge(index, e)}
            on:keyup={e => toggleWedge(index, e)}
        />
    {/each}
</svg>

<ul class="legend">
    {#each pieData as d, index}
        <li style="--color: {colors(index)}" class:selected={selectedIndex === index}>
            <span class="swatch"></span>
            {d[0]} <em>({d[1]})</em>
        </li>
    {/each}
</ul>

<style>
    path {
        transition: 300ms;
        cursor: pointer;
        outline: none;
    }

    svg:has(path:hover, path:focus-visible) path:not(:hover, :focus-visible) {
        opacity: 50%;
    }

    .legend {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(9em, 1fr));
        gap: 1em;
    }

    .legend li {
        display: flex;
        align-items: center;
        gap: 0.5em;
    }
</style>
