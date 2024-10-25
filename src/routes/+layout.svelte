<script>
  import { page } from '$app/stores'; // To access current page info

  let pages = [
    { url: './', title: 'Home' },
    { url: './projects', title: 'Projects' },
    { url: './CV', title: 'CV' },
    { url: './contact', title: 'Contact' },
    { url: 'https://github.com/Luisajaime94', title: 'GitHub' }
  ];
</script>

<svelte:head>
  <title>Welcome </title>
</svelte:head>

<!-- Navigation Bar -->
<nav>
  {#each pages as p}
    <a href={p.url} class:current={'.' + $page.route.id === p.url} target={p.url.startsWith('http') ? '_blank' : null}>
      {p.title}
    </a>
  {/each}
</nav>

<slot /> <!-- This will display the page content -->

<style>
  nav {
    display: flex;
    justify-content: space-around; /* Adjusts spacing */
    margin-bottom: 1em; /* Space below the nav */
    background-color: #f8f9fa; /* Optional background color */
    padding: 1em; /* Add some padding */
  }

  nav a {
    text-decoration: none; /* Remove underline */
    color: inherit; /* Use the same color as parent */
    padding: 0.5em; /* Add padding */
    transition: color 0.3s ease; /* Smooth transition for hover effect */
  }

  nav a:hover {
    color: #007bff; /* Change color on hover */
  }

  .current {
    font-weight: bold; /* Makes the current link bold */
    color: #007bff; /* Accent color for current page */
  }
</style>
