<script>
    import projects from '$lib/projects.json';
    import Pie from '$lib/Pie.svelte';
    import Project from '$lib/Project.svelte';
    import * as d3 from 'd3';
  
    let query = '';
    let selectedYearIndex = -1;
    let selectedYear;
    let filteredProjects = [];
    let pieData = [];
  
    // Reactively filter projects based on search query
    $: filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join(' ').toLowerCase();
        return values.includes(query.toLowerCase());
    });
  
    // Prepare data for pie chart based on filtered projects
    $: pieData = d3.rollups(filteredProjects, v => v.length, d => d.year);
  
    // Get the selected year from the pie chart
    $: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex][0] : null;
  
    // Filter projects by selected year
    $: filteredProjectsByYear = selectedYear 
        ? filteredProjects.filter(project => project.year === selectedYear) 
        : filteredProjects;
</script>
  
<input 
    type="search" 
    bind:value={query} 
    placeholder="Search projects..." 
    aria-label="Search projects"
/>
  
<h1>Projects</h1>
  
<!-- Display the Pie chart with filtered data -->
<Pie {pieData} bind:selectedIndex={selectedYearIndex} />
  
<!-- Display filtered projects based on selected year -->
<div class="projects">
    {#each filteredProjectsByYear as p}
        <Project data={p} hLevel={2} />
    {/each}
</div>
  
<style>
    .projects {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
        gap: 1em;
        margin: 1em 0;
    }
    
    h1 {
        margin-bottom: 0.5em;
    }

    input {
        margin-bottom: 1em;
        padding: 0.5em;
        font-size: 1em;
        width: 100%;
        max-width: 400px;
        box-sizing: border-box;
    }
</style>
