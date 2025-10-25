<script>
  import { enhance } from '$app/forms';

  let { mode = 'signin', form } = $props();
  let email = $state(form?.email || '');
  let password = $state('');
  let handle = $state(form?.handle || '');
  let message = $state('');
  let isSignUp = $state(mode === 'signup');
  let checkingHandle = $state(false);
  let handleAvailable = $state(null);

  function toggleMode() {
    isSignUp = !isSignUp;
    message = '';
    email = '';
    password = '';
    handle = '';
    handleAvailable = null;
  }

  async function checkHandleAvailability() {
    if (!handle || handle.length === 0 || !/^[a-zA-Z0-9_]+$/.test(handle)) {
      handleAvailable = null;
      return;
    }

    checkingHandle = true;
    try {
      const response = await fetch(`/api/check-handle?handle=${encodeURIComponent(handle)}`);
      const data = await response.json();
      handleAvailable = data.available;
    } catch (error) {
      console.error('Error checking handle:', error);
      handleAvailable = null;
    } finally {
      checkingHandle = false;
    }
  }

  let debounceTimer;
  function handleHandleInput() {
    clearTimeout(debounceTimer);
    handleAvailable = null;
    debounceTimer = setTimeout(checkHandleAvailability, 500);
  }
</script>

<div class="AuthForm">
  <h2 class="text-display">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

  {#if form?.error}
    <p class="message error bordered bordered-hover">{form.error}</p>
  {/if}

  {#if form?.success}
    <p class="message success bordered bordered-hover">{form.message}</p>
  {/if}

  {#if message}
    <p class="message bordered bordered-hover">{message}</p>
  {/if}

  <form method="post" action={isSignUp ? '?/signup' : '?/signin'} use:enhance>
    <fieldset>
      <label for="email">Email</label>
      <input
        name="email"
        type="email"
        bind:value={email}
        required
        autocomplete="email"
      />
    </fieldset>

    <fieldset>
      <label for="password">Password</label>
      <input
        name="password"
        type="password"
        bind:value={password}
        required
        autocomplete={isSignUp ? 'new-password' : 'current-password'}
      />
      <p class="text-helper">Must be at least 6 characters</p>
    </fieldset>

    {#if isSignUp}
      <fieldset>
        <label for="handle">Handle</label>
        <input
          name="handle"
          type="text"
          bind:value={handle}
          oninput={handleHandleInput}
          maxlength="20"
          required
        />
        <p class="text-helper">
          Only letters, numbers, and underscores. Max 20 characters.
          {#if checkingHandle}
            <span class="checking">Checking...</span>
          {:else if handleAvailable === true}
            <span class="available">✓ Available</span>
          {:else if handleAvailable === false}
            <span class="unavailable">✗ Already taken</span>
          {/if}
        </p>
      </fieldset>
    {/if}

    <fieldset>
      <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
    </fieldset>
  </form>

  <button class="toggle bordered bordered-hover" onclick={toggleMode}>
    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
  </button>
</div>

<style>
  .AuthForm {
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
    background-color: var(--color-pink);
    color: black;
  }

  .message.error {
    background-color: white;
    color: black;
  }

  .checking {
    color: #666;
    font-style: italic;
  }

  .available {
    color: black;
    font-weight: 900;
  }

  .unavailable {
    color: black;
    font-weight: 900;
  }

  .toggle {
    background-color: var(--color-pink);
    color: black;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.65);
    font-weight: 700;
    margin-top: calc(var(--unit) * 0.5);
    padding: calc(var(--unit) * 0.5);
    text-align: center;
    width: 100%;
  }

  .toggle:hover {
    background-color: var(--color-lime);
  }
</style>
