<!-- src/routes/+page.svelte -->
<script>
    import projects from '$lib/projects.json'; // Importing the JSON data
    import Project from '$lib/Project.svelte'; // Import the Project component
</script>

<svelte:head>
    <title>Welcome</title>
</svelte:head>

<div class="color-scheme">
    <label for="theme-select">Theme:</label>
    <select id="theme-select">
        <option value="auto">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
</div>

<nav>
    <ul>
        <!-- Dynamic menu will be inserted here by JavaScript -->
    </ul>
</nav>

<h1>Luisa Jaime</h1>
<p>My name is Luisa Jaime, and I was born and raised in Guadalajara, Mexico...</p>
<img src="/images/IMG_3637.JPEG" alt="A photo of Luisa in CDMX" style="width: 300px; height: auto;">

<h2>Latest Projects</h2>
<div class="projects">
    {#each projects.slice(0, 3) as p}
        <Project data={p} hLevel={3} /> <!-- Pass the data for the first three projects -->
    {/each}
</div>

<style>
    /* Include necessary styles for this specific page or use global styles */
    .projects {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
        gap: 1em;
        margin: 1em 0;
    }
</style>
