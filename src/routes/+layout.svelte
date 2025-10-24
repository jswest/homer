<script>
  import { enhance } from '$app/forms';

  let { data, children } = $props();
</script>

<div class="container">
  <div class="header-card">
    <header>
      <h1><span class="title">HOMER</span> is a social media experiment.</h1>
      {#if data.session}
        <nav>
          <a href="/feed">Everyone</a>
          <a href="/feed/following">Following</a>
          <a href="/posts/create">New Post</a>
          <a href="/profile">Profile</a>
          <form method="post" action="/signout" use:enhance>
            <button type="submit">Sign Out</button>
          </form>
        </nav>
      {/if}
    </header>
  </div>

  <div class="content-card">
    {@render children()}
  </div>
</div>

<style>
  .container {
    box-sizing: border-box;
    margin: 0 auto;
    max-width: 600px;
    padding: var(--unit);
    width: 100%;
  }

  .header-card,
  .content-card {
    background-color: var(--color-bg);
    border: 3px solid black;
    box-sizing: border-box;
    margin-bottom: var(--unit);
    padding: var(--unit);
  }

  header {
    display: flex;
    flex-direction: column;
    gap: var(--unit);
  }

  header h1 {
    font-size: calc(var(--unit) * 1.5);
    line-height: 1.2;
    margin: 0;
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--unit) * 0.4);
  }

  nav a,
  nav button {
    background-color: white;
    border: 3px solid black;
    color: black;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.6);
    font-weight: 700;
    padding: calc(var(--unit) * 0.3) calc(var(--unit) * 0.5);
    text-decoration: none;
  }

  nav a:hover,
  nav button:hover {
    background-color: black;
    color: white;
  }

  nav form {
    display: inline;
    margin: 0;
  }

  /* Global form styles */
  :global(form) {
    width: 100%;
  }

  :global(fieldset) {
    border: none;
    margin: 0 0 var(--unit) 0;
    padding: 0;
  }

  :global(label) {
    color: black;
    display: block;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.7);
    font-weight: 700;
    margin-bottom: calc(var(--unit) * 0.3);
  }

  :global(input),
  :global(textarea) {
    border: 3px solid black;
    box-sizing: border-box;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
    line-height: calc(var(--unit) * 1);
    padding: calc(var(--unit) * 0.4);
    width: 100%;
  }

  :global(textarea) {
    height: calc(var(--unit) * 10);
    resize: vertical;
  }

  :global(button) {
    background-color: black;
    border: 3px solid black;
    box-sizing: border-box;
    color: white;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
    font-weight: 700;
    padding: calc(var(--unit) * 0.4);
    width: 100%;
  }

  :global(button:hover) {
    background-color: white;
    color: black;
  }

  :global(.helper) {
    color: #666;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.55);
    font-style: italic;
    margin-top: calc(var(--unit) * 0.2);
  }
</style>
