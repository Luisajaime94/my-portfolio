<script>
    import * as d3 from 'd3';
  
    export let lines = [];
  
    let files = [];
    $: {
      files = d3
        .groups(lines, (d) => d.file)
        .map(([name, lines]) => ({ name, lines }));
    }
  </script>
  
  <dl class="files">
    {#each files as file (file.name)}
      <div>
        <dt>
          <code>{file.name}</code>
          <small>{file.lines.length} lines</small>
        </dt>
        <dd>
          {#each file.lines as line (line.line)}
            <div class="line"></div>
          {/each}
        </dd>
      </div>
    {/each}
  </dl>
  
  <style>
    .files {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem 1rem;
      margin: 1rem 5%;
      width: 90%;
      font-family: Arial, sans-serif;
    }
  
    .files > div {
      display: grid;
      grid-template-columns: 1fr auto; /* Two columns: file name and line visualization */
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e0e0e0; /* Subtle line to separate rows */
    }
  
    .files dt {
      grid-column: 1;
      font-weight: bold;
      color: #333;
      word-wrap: break-word; /* Break long file names into multiple lines */
    }
  
    .files dt small {
      display: block;
      font-size: 0.8rem;
      color: #666;
      margin-top: 0.2em;
    }
  
    .files dd {
      grid-column: 2;
      display: flex;
      flex-wrap: wrap;
      align-items: start;
      align-content: start;
      gap: 0.15em;
      padding-top: 0.6em;
      margin-left: 0; /* Remove default margin for better alignment */
    }
  
    .line {
      display: flex;
      width: 0.5em;
      aspect-ratio: 1;
      background: steelblue;
      border-radius: 50%; /* Make dots circular */
    }
  
    code {
      font-family: monospace;
      background: #f9f9f9;
      padding: 2px 4px;
      border-radius: 3px;
      font-size: 0.9rem;
    }
  </style>
  