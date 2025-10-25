<script>
  import PostCard from '$lib/components/PostCard.svelte';
  import UserCard from '$lib/components/UserCard.svelte';
  import Card from '$lib/components/Card.svelte';

  let { data } = $props();
</script>

<div class="feed">
  {#if data.user}
    <UserCard user={data.user} />
  {/if}

  <Card variant="pink" class="feed-info">
    <h2 class="text-display">Following Feed</h2>
    <p>You're following {data.followingCount} {data.followingCount === 1 ? 'person' : 'people'}</p>
  </Card>

  <div class="posts">
    {#if data.posts.length === 0}
      <Card variant="white" class="empty-state">
        <p>No posts from people you follow yet!</p>
        <p>Start following people from the <a href="/feed">Everyone feed</a>.</p>
      </Card>
    {:else}
      {#each data.posts as post (post.id)}
        <PostCard {post} currentUserId={data.user.id} isAdmin={data.user?.isAdmin || false} />
      {/each}
    {/if}
  </div>

  {#if data.pagination.totalPages > 1}
    <Card variant="lime" class="pagination">
      <div class="pagination-controls">
        {#if data.pagination.page > 1}
          <a href="/feed/following?page={data.pagination.page - 1}" class="page-button bordered bordered-hover">
            ← Previous
          </a>
        {:else}
          <span class="page-button disabled">← Previous</span>
        {/if}

        <span class="page-info">
          Page {data.pagination.page} of {data.pagination.totalPages}
        </span>

        {#if data.pagination.page < data.pagination.totalPages}
          <a href="/feed/following?page={data.pagination.page + 1}" class="page-button bordered bordered-hover">
            Next →
          </a>
        {:else}
          <span class="page-button disabled">Next →</span>
        {/if}
      </div>
    </Card>
  {/if}
</div>

<style>
  .feed {
    width: 100%;
  }

  :global(.feed-info) h2 {
    font-size: calc(var(--unit) * 0.8);
    font-weight: 700;
    margin: 0 0 calc(var(--unit) * 0.3) 0;
  }

  :global(.feed-info) p {
    font-size: calc(var(--unit) * 0.7);
    font-weight: 400;
    margin: 0;
  }

  .posts {
    width: 100%;
  }

  :global(.empty-state) {
    text-align: center;
  }

  :global(.empty-state) p {
    margin-bottom: calc(var(--unit) * 0.5);
  }

  :global(.empty-state) a {
    font-weight: 900;
  }

  .pagination-controls {
    align-items: center;
    display: flex;
    gap: var(--unit);
    justify-content: space-between;
  }

  .page-button {
    background-color: black;
    color: white;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.65);
    font-weight: 700;
    padding: calc(var(--unit) * 0.3) calc(var(--unit) * 0.5);
    text-decoration: none;
    white-space: nowrap;
  }

  .page-button:hover {
    background-color: white;
    color: black;
  }

  .page-button.disabled {
    background-color: #ddd;
    border: 3px solid #999;
    color: #999;
    cursor: not-allowed;
  }

  .page-info {
    color: black;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.7);
    font-weight: 700;
  }
</style>
