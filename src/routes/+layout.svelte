<script>
  import { page } from '$app/stores';

  let pages = [
    { url: './', title: 'Home' },
    { url: './projects', title: 'Projects' },
    { url: './CV', title: 'CV' },
    { url: './contact', title: 'Contact' },
    { url: 'https://github.com/Luisajaime94', title: 'GitHub' }
  ];

  let localStorage = globalThis.localStorage ?? {};
  let colorScheme = localStorage.colorScheme ?? 'light';
  let root = globalThis?.document?.documentElement;

  $: root?.style.setProperty('color-scheme', colorScheme);
  $: root?.setAttribute('data-theme', colorScheme);
  $: localStorage.colorScheme = colorScheme;
</script>

<svelte:head>
  <title>Welcome</title>
  <link rel="stylesheet" href="/style.css" />
</svelte:head>

<nav>
  {#each pages as p}
    <a href={p.url} class:current={'.' + $page.route.id === p.url} target={p.url.startsWith('http') ? '_blank' : null}>
      {p.title}
    </a>
  {/each}
</nav>

<div class="theme-switcher">
  <label for="theme-select">Theme:</label>
  <select id="theme-select" bind:value={colorScheme}>
    <option value="auto">Auto</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
</div>

<slot />

<style>
  nav {
    display: flex;
    justify-content: space-around;
    margin-bottom: 1em;
    background-color: var(--background);
    padding: 1em;
  }

  nav a {
    text-decoration: none;
    color: var(--text-color);
    padding: 0.5em;
    transition: color 0.3s ease;
  }

  nav a:hover {
    color: var(--link-hover);
  }

  .current {
    font-weight: bold;
    color: var(--link-hover);
  }

  .theme-switcher {
    margin-left: 1em;
  }
</style>
