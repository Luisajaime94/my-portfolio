<!-- src/routes/+page.svelte -->
<script>
    import projects from '$lib/projects.json'; // Importing the JSON data
    import Project from '$lib/Project.svelte'; // Import the Project component

    // Fetching data from GitHub API for the profile
    let profileData = fetch('https://api.github.com/users/Luisajaime94');
</script>

<svelte:head>
    <title>Welcome</title>
</svelte:head>

<!-- Introduction Section -->
<h1>Luisa Jaime</h1>
<p>My name is Luisa Jaime, and I was born and raised in Guadalajara, Mexico. I studied Bioengineering and have been working in that field since 2018. I decided to start this master's to get new career opportunities.</p>
<img src="/images/IMG_3637.JPEG" alt="A photo of Luisa in CDMX" style="width: 300px; height: auto;">

<!-- Latest Projects Section -->
<h2>Latest Projects</h2>
<div class="projects">
    {#each projects.slice(0, 3) as p}
        <Project data={p} hLevel={3} /> <!-- Pass the data for the first three projects -->
    {/each}
</div>

<!-- GitHub Profile Stats Section -->
<section>
    <h2>GitHub Profile Stats</h2>
    {#await profileData}
        <p>Loading GitHub profile...</p>
    {:then response}
        {#await response.json()}
            <p>Decoding profile data...</p>
        {:then data}
            <!-- Display profile data in a structured format -->
            <img src="{data.avatar_url}" alt="Profile picture of {data.login}" width="100" height="100">
            <h3>{data.name}</h3>
            <p>{data.bio}</p>
            
            <dl>
                <dt>Username</dt>
                <dd>{data.login}</dd>

                <dt>Followers</dt>
                <dd>{data.followers}</dd>

                <dt>Following</dt>
                <dd>{data.following}</dd>

                <dt>Public Repositories</dt>
                <dd>{data.public_repos}</dd>

                <dt>Account Created</dt>
                <dd>{new Date(data.created_at).toLocaleDateString()}</dd>
            </dl>

            <p>
                <a href="{data.html_url}" target="_blank">View GitHub Profile</a>
            </p>
        {:catch error}
            <p class="error">Something went wrong: {error.message}</p>
        {/await}
    {:catch error}
        <p class="error">Something went wrong: {error.message}</p>
    {/await}
</section>

<style>
    /* Include necessary styles for this specific page or use global styles */
    .projects {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
        gap: 1em;
        margin: 1em 0;
    }

    section {
        margin-top: 2em;
        text-align: center;
    }

    img {
        border-radius: 50%;
        margin-bottom: 1em;
    }

    dl {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1em;
        margin-top: 1em;
        text-align: left;
    }

    dt {
        font-weight: bold;
    }

    dd {
        margin: 0;
    }

    .error {
        color: red;
    }
</style>
