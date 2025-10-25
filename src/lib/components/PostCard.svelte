<script>
  import Card from './Card.svelte';

  let { post, currentUserId } = $props();

  // Format date nicely
  function formatDate(date) {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  }
</script>

<Card variant="white" class="post-card">
  <div class="post-header">
    <a href="/users/{post.user.handle}" class="text-handle link-underline handle">@{post.user.handle}</a>
    <span class="text-timestamp timestamp">{formatDate(post.createdAt)}</span>
  </div>
  <div class="text-body post-body">
    {post.body}
  </div>
  {#if post.summarizationCount > 0}
    <div class="summarization-badge bordered bordered-hover">
      Summarized {post.summarizationCount}x
    </div>
  {/if}
</Card>

<style>
  .post-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: calc(var(--unit) * 0.5);
  }

  .handle {
    font-size: calc(var(--unit) * 0.8);
    text-decoration: none;
  }

  .timestamp {
    font-size: calc(var(--unit) * 0.6);
  }

  .post-body {
    font-size: calc(var(--unit) * 0.75);
    margin-bottom: calc(var(--unit) * 0.5);
  }

  .summarization-badge {
    background-color: var(--color-pink);
    color: black;
    display: inline-block;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.5);
    font-weight: 700;
    padding: calc(var(--unit) * 0.15) calc(var(--unit) * 0.3);
  }
</style>
