<script>
  import Card from './Card.svelte';

  let { user, clickable = true } = $props();
</script>

{#if clickable}
  <a href="/users/{user.handle}" class="user-card-link">
    <Card variant="lime" class="user-card">
      <div class="text-display user-handle">@{user.handle}</div>
      {#if user.biography}
        <div class="text-body user-bio">{user.biography}</div>
      {/if}
    </Card>
  </a>
{:else}
  <Card variant="lime" class="user-card">
    <div class="text-display user-handle">@{user.handle}</div>
    {#if user.biography}
      <div class="text-body user-bio">{user.biography}</div>
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
    font-size: var(--unit);
    margin-bottom: calc(var(--unit) * 0.5);
  }

  .user-bio {
    font-size: calc(var(--unit) * 0.75);
  }
</style>
