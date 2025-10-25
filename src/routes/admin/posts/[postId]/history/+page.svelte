<script>
  import Card from '$lib/components/Card.svelte';

  let { data } = $props();

  function formatDate(date) {
    return new Date(date).toLocaleString();
  }
</script>

<div class="history">
  <h1 class="text-display">Post History</h1>

  <Card variant="pink" class="current-post">
    <h2>Current Post</h2>
    <div class="post-info">
      <div class="text-handle">@{data.post.user.handle}</div>
      <div class="text-timestamp">{formatDate(data.post.createdAt)}</div>
    </div>
    <div class="text-body post-body">{data.post.body}</div>
  </Card>

  <Card variant="lime" class="history-section">
    <h2>Body History</h2>
    <p class="info">This shows all versions of the post body, from oldest to newest.</p>

    <div class="history-list">
      {#if data.bodyHistory.length === 0}
        <p class="empty">No history available.</p>
      {:else}
        {#each data.bodyHistory as bodyEntry, index (bodyEntry.id)}
          <Card variant="white" class="history-item">
            <div class="history-header">
              <span class="version">Version {index + 1}</span>
              <span class="text-timestamp">{formatDate(bodyEntry.createdAt)}</span>
              {#if index === data.bodyHistory.length - 1}
                <span class="current-badge bordered">Current</span>
              {/if}
            </div>
            <div class="text-body history-body">{bodyEntry.body}</div>
          </Card>
        {/each}
      {/if}
    </div>
  </Card>

  <a href="/admin" class="back-link">← Back to Admin</a>
</div>

<style>
  .history {
    width: 100%;
  }

  h1 {
    font-size: calc(var(--unit) * 1.5);
    margin-bottom: var(--unit);
  }

  h2 {
    color: black;
    font-family: var(--font-display);
    font-size: calc(var(--unit) * 1.2);
    font-weight: 900;
    margin-bottom: calc(var(--unit) * 0.5);
  }

  :global(.current-post),
  :global(.history-section) {
    margin-bottom: var(--unit);
  }

  .post-info {
    align-items: center;
    display: flex;
    gap: calc(var(--unit) * 0.5);
    margin-bottom: calc(var(--unit) * 0.5);
  }

  .post-body {
    font-size: calc(var(--unit) * 0.75);
  }

  .info {
    color: black;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
    margin-bottom: var(--unit);
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: calc(var(--unit) * 0.5);
  }

  .history-header {
    align-items: center;
    display: flex;
    gap: calc(var(--unit) * 0.5);
    margin-bottom: calc(var(--unit) * 0.5);
  }

  .version {
    color: black;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.7);
    font-weight: 700;
  }

  .current-badge {
    background-color: var(--color-lime);
    color: black;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.5);
    font-weight: 700;
    padding: calc(var(--unit) * 0.1) calc(var(--unit) * 0.3);
  }

  .history-body {
    font-size: calc(var(--unit) * 0.75);
  }

  .empty {
    color: #666;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
    font-style: italic;
    text-align: center;
  }

  .back-link {
    color: black;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
    font-weight: 700;
    text-decoration: none;
  }

  .back-link:hover {
    text-decoration: underline;
  }
</style>
