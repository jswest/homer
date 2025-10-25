<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  let body = $state(form?.body || '');
</script>

<div class="create-post">
  <h2 class="text-display">Create Post</h2>

  {#if form?.error}
    <p class="message error bordered bordered-hover">{form.error}</p>
  {/if}

  <form method="post" use:enhance>
    <fieldset>
      <label for="body">What's on your mind?</label>
      <textarea
        bind:value={body}
        name="body"
        maxlength="500"
        required
      ></textarea>
      <p class="text-helper">You have {500 - body.length} character(s) remaining.</p>
    </fieldset>

    <fieldset>
      <button type="submit">Post</button>
    </fieldset>
  </form>

  <p class="info bordered bordered-hover">You can post up to 12 times per day.</p>
</div>

<style>
  .create-post {
    width: 100%;
  }

  h2 {
    font-size: calc(var(--unit) * 1.25);
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
