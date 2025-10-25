<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  let biography = $state(data.user?.biography || '');
  let handle = $state(data.user?.handle || '');
</script>

<div class="profile">
  <h2>Your Profile</h2>

  {#if form?.success}
    <p class="message success bordered bordered-hover">{form.message}</p>
  {/if}

  {#if form?.error}
    <p class="message error bordered bordered-hover">{form.error}</p>
  {/if}

  <form method="post" action="?/update" use:enhance>
    <fieldset>
      <label for="email">Email</label>
      <input
        name="email"
        type="email"
        value={data.user?.email || ''}
        disabled
      />
      <p class="text-helper">Email cannot be changed (managed by Supabase Auth)</p>
    </fieldset>

    <fieldset>
      <label for="handle">Handle</label>
      <input
        name="handle"
        type="text"
        bind:value={handle}
        maxlength="20"
        required
      />
      <p class="text-helper">You must use only letters, numbers, and underscores. Max 20 characters.</p>
    </fieldset>

    <fieldset>
      <label for="biography">Biography</label>
      <textarea
        bind:value={biography}
        name="biography"
        maxlength="500"
      ></textarea>
      <p class="text-helper">You have {500 - biography.length} character(s) remaining.</p>
    </fieldset>

    <fieldset>
      <button type="submit">Update Profile</button>
    </fieldset>
  </form>
</div>

<style>
  .profile {
    width: 100%;
  }

  h2 {
    font-size: calc(var(--unit) * 1.25);
    margin-bottom: var(--unit);
  }

  .message {
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
    font-weight: 700;
    margin-bottom: var(--unit);
    padding: var(--unit);
  }

  .message.success {
    background-color: var(--color-bg);
    color: black;
  }

  .message.error {
    background-color: white;
    color: black;
  }

  input:disabled {
    background-color: #ddd;
    color: #666;
    cursor: not-allowed;
  }
</style>
