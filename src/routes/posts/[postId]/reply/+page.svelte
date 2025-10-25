<script>
  import { enhance } from '$app/forms';
  import Card from '$lib/components/Card.svelte';
  import PostCard from '$lib/components/PostCard.svelte';

  let { data, form } = $props();

  let body = $state(form?.body || '');
</script>

<div class="reply-page">
  <h2 class="text-display">Reply to @{data.parentPost.user.handle}</h2>

  <div class="parent-post">
    <h3>Replying to:</h3>
    <PostCard post={data.parentPost} currentUserId={data.user.id} showReplyButton={false} isAdmin={false} />
  </div>

  {#if form?.error}
    <p class="message error bordered bordered-hover">{form.error}</p>
  {/if}

  <form method="post" use:enhance>
    <fieldset>
      <label for="body">Your reply</label>
      <textarea
        bind:value={body}
        name="body"
        maxlength="500"
        required
      ></textarea>
      <p class="text-helper">You have {500 - body.length} character(s) remaining.</p>
    </fieldset>

    <fieldset>
      <button type="submit">Reply</button>
    </fieldset>
  </form>

  <p class="info bordered bordered-hover">Replies count against your daily limit of 12 posts.</p>
</div>

<style>
  .reply-page {
    width: 100%;
  }

  h2 {
    font-size: calc(var(--unit) * 1.25);
    margin-bottom: var(--unit);
  }

  h3 {
    color: black;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
    font-weight: 700;
    margin-bottom: calc(var(--unit) * 0.5);
  }

  .parent-post {
    margin-bottom: var(--unit);
  }

  .message {
    background-color: white;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
    font-weight: 700;
    margin-bottom: var(--unit);
    padding: var(--unit);
  }

  .message.error {
    color: black;
  }

  .info {
    background-color: var(--color-pink);
    color: black;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.65);
    font-weight: 700;
    margin-top: var(--unit);
    padding: calc(var(--unit) * 0.5);
    text-align: center;
  }
</style>
