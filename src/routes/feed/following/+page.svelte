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
    <h2>Following Feed</h2>
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
        <PostCard {post} currentUserId={data.user.id} />
      {/each}
    {/if}
  </div>
</div>

<style>
  .feed {
    width: 100%;
  }

  :global(.feed-info) h2 {
    color: black;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.8);
    font-weight: 700;
    margin: 0 0 calc(var(--unit) * 0.3) 0;
  }

  :global(.feed-info) p {
    color: black;
    font-family: var(--font-sans);
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
    color: #666;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
    margin-bottom: calc(var(--unit) * 0.5);
  }

  :global(.empty-state) a {
    color: black;
    font-weight: 900;
  }
</style>
