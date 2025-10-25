<script>
  import PostCard from '$lib/components/PostCard.svelte';
  import Card from '$lib/components/Card.svelte';
  import { enhance } from '$app/forms';

  let { data } = $props();

  const isOwnProfile = data.currentUser?.id === data.profileUser.id;
</script>

<div class="user-feed">
  <Card variant="lime" class="user-info">
    <div class="user-header">
      <div>
        <h2 class="text-display">@{data.profileUser.handle}</h2>
        {#if data.profileUser.biography}
          <p class="text-body bio">{data.profileUser.biography}</p>
        {/if}
        <div class="stats">
          <span>{data.followerCount} follower{data.followerCount !== 1 ? 's' : ''}</span>
          <span>·</span>
          <span>{data.followingCount} following</span>
        </div>
      </div>

      {#if !isOwnProfile}
        <div class="follow-actions">
          {#if data.isFollowing}
            <form method="post" action="?/unfollow" use:enhance>
              <button type="submit" class="btn-unfollow bordered bordered-hover">Unfollow</button>
            </form>
          {:else}
            <form method="post" action="?/follow" use:enhance>
              <button type="submit" class="btn-follow bordered bordered-hover">Follow</button>
            </form>
          {/if}
        </div>
      {/if}
    </div>
  </Card>

  <div class="posts">
    {#if data.posts.length === 0}
      <Card variant="white" class="empty-state">
        <p>No posts yet!</p>
      </Card>
    {:else}
      {#each data.posts as post (post.id)}
        <PostCard {post} currentUserId={data.currentUser?.id} isAdmin={data.currentUser?.isAdmin || false} />
      {/each}
    {/if}
  </div>

  {#if data.pagination.totalPages > 1}
    <Card variant="lime" class="pagination">
      <div class="pagination-controls">
        {#if data.pagination.page > 1}
          <a href="/users/{data.profileUser.handle}?page={data.pagination.page - 1}" class="page-button bordered bordered-hover">
            ← Previous
          </a>
        {:else}
          <span class="page-button disabled">← Previous</span>
        {/if}

        <span class="page-info">
          Page {data.pagination.page} of {data.pagination.totalPages}
        </span>

        {#if data.pagination.page < data.pagination.totalPages}
          <a href="/users/{data.profileUser.handle}?page={data.pagination.page + 1}" class="page-button bordered bordered-hover">
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
  .user-feed {
    width: 100%;
  }

  .user-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--unit);
  }

  h2 {
    font-size: calc(var(--unit) * 1.2);
    margin-bottom: calc(var(--unit) * 0.3);
  }

  .bio {
    font-size: calc(var(--unit) * 0.75);
    margin-bottom: calc(var(--unit) * 0.5);
  }

  .stats {
    color: black;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.65);
    font-weight: 700;
  }

  .stats span {
    margin-right: calc(var(--unit) * 0.3);
  }

  .follow-actions form {
    margin: 0;
    width: auto;
  }

  .btn-follow,
  .btn-unfollow {
    background-color: black;
    color: white;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.65);
    font-weight: 700;
    padding: calc(var(--unit) * 0.3) calc(var(--unit) * 0.6);
    white-space: nowrap;
    width: auto;
  }

  .btn-follow:hover {
    background-color: white;
    color: black;
  }

  .btn-unfollow {
    background-color: white;
    color: black;
  }

  .btn-unfollow:hover {
    background-color: black;
    color: white;
  }

  .posts {
    width: 100%;
  }

  :global(.empty-state) {
    text-align: center;
  }

  :global(.empty-state) p {
    color: #666;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
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
