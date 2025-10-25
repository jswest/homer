<script>
  import Card from './Card.svelte';
  import { enhance } from '$app/forms';

  let { post, currentUserId, showReplyButton = true, isAdmin = false } = $props();

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

<div class="post-container">
  <Card variant="white" class="post-card">
    <div class="post-header">
      <a href="/users/{post.user.handle}" class="text-handle link-underline handle">@{post.user.handle}</a>
      <span class="text-timestamp timestamp">{formatDate(post.createdAt)}</span>
    </div>
    <div class="text-body post-body">
      {post.body}
    </div>
    <div class="post-footer">
      {#if post.summarizationCount > 0}
        <div class="summarization-badge bordered bordered-hover">
          Summarized {post.summarizationCount}x
        </div>
      {/if}
      {#if showReplyButton && !post.parentId}
        <a href="/posts/{post.id}/reply" class="reply-link">
          <button class="reply-button bordered bordered-hover">Reply</button>
        </a>
      {/if}
      {#if isAdmin}
        <form method="post" action="?/deletePost" use:enhance>
          <input type="hidden" name="postId" value={post.id} />
          <button
            type="submit"
            class="delete-button bordered bordered-hover"
            onclick={(e) => {
              if (!confirm(`Are you sure you want to delete this post by @${post.user.handle}?`)) {
                e.preventDefault();
              }
            }}
          >
            Delete
          </button>
        </form>
      {/if}
    </div>
  </Card>

  {#if post.replies && post.replies.length > 0}
    <div class="replies">
      {#each post.replies as reply (reply.id)}
        <div class="reply-indent">
          <svelte:self post={reply} currentUserId={currentUserId} showReplyButton={false} isAdmin={isAdmin} />
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .post-container {
    width: 100%;
  }

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

  .post-footer {
    align-items: center;
    display: flex;
    gap: calc(var(--unit) * 0.5);
  }

  .post-footer form {
    margin: 0;
  }

  .summarization-badge {
    background-color: var(--color-pink);
    color: black;
    display: inline-block;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.5);
    font-weight: 700;
    padding: calc(var(--unit) * 0.15) calc(var(--unit) * 0.3);
    white-space: nowrap;
  }

  .reply-link {
    text-decoration: none;
  }

  .reply-button {
    background-color: var(--color-lime);
    color: black;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.5);
    font-weight: 700;
    padding: calc(var(--unit) * 0.15) calc(var(--unit) * 0.3);
  }

  .reply-button:hover {
    background-color: white;
  }

  .delete-button {
    background-color: white;
    color: black;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.5);
    font-weight: 700;
    padding: calc(var(--unit) * 0.15) calc(var(--unit) * 0.3);
    white-space: nowrap;
    width: auto;
  }

  .delete-button:hover {
    background-color: black;
    color: white;
  }

  .replies {
    width: 100%;
  }

  .reply-indent {
    margin-left: calc(var(--unit) * 2);
  }
</style>
