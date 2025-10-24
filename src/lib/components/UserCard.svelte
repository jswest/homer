<script>
  import Card from './Card.svelte';

  let { user, clickable = true } = $props();
</script>

{#if clickable}
  <a href="/users/{user.handle}" class="user-card-link">
    <Card variant="pink" class="user-card">
      <div class="user-handle">@{user.handle}</div>
      {#if user.biography}
        <div class="user-bio">{user.biography}</div>
      {/if}
    </Card>
  </a>
{:else}
  <Card variant="pink" class="user-card">
    <div class="user-handle">@{user.handle}</div>
    {#if user.biography}
      <div class="user-bio">{user.biography}</div>
    {/if}
  </Card>
{/if}

<style>
  .user-card-link {
    display: block;
    text-decoration: none;
  }

  .user-card-link:hover :global(.card) {
    opacity: 0.9;
  }

  .user-handle {
    color: black;
    font-family: var(--font-display);
    font-size: var(--unit);
    font-weight: 900;
    margin-bottom: calc(var(--unit) * 0.5);
  }

  .user-bio {
    color: black;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
    line-height: calc(var(--unit) * 1);
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
