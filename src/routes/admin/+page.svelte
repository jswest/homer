<script>
  import { enhance } from '$app/forms';
  import Card from '$lib/components/Card.svelte';

  let { data, form } = $props();

  let newEmail = $state('');
</script>

<div class="admin">
  <h1 class="text-display">Admin Panel</h1>

  {#if form?.error}
    <p class="message error bordered bordered-hover">{form.error}</p>
  {/if}

  {#if form?.success}
    <p class="message success bordered bordered-hover">{form.message}</p>
  {/if}

  <!-- Email Whitelist Section -->
  <Card variant="pink" class="section">
    <h2 class="text-display">Email Whitelist</h2>
    <p>Add emails to allow users to sign up for the platform.</p>

    <form method="post" action="?/addEmail" use:enhance>
      <fieldset>
        <label for="email">Add Email</label>
        <input
          bind:value={newEmail}
          name="email"
          type="email"
          placeholder="user@example.com"
          required
        />
      </fieldset>
      <fieldset>
        <button type="submit">Add to Whitelist</button>
      </fieldset>
    </form>

    <div class="list">
      <h3>Whitelisted Emails ({data.whitelistedEmails.length})</h3>
      {#if data.whitelistedEmails.length === 0}
        <p class="empty">No emails whitelisted yet.</p>
      {:else}
        {#each data.whitelistedEmails as email (email.id)}
          <Card variant="white" class="list-item">
            <div class="list-item-content">
              <div>
                <div class="email">{email.email}</div>
                <div class="text-timestamp">Added {new Date(email.createdAt).toLocaleDateString()}</div>
              </div>
              <form method="post" action="?/removeEmail" use:enhance>
                <input type="hidden" name="emailId" value={email.id} />
                <button type="submit" class="btn-danger">Remove</button>
              </form>
            </div>
          </Card>
        {/each}
      {/if}
    </div>
  </Card>

  <!-- Users Section -->
  <Card variant="lime" class="section">
    <h2 class="text-display">Users</h2>
    <p>Manage all users on the platform.</p>

    <div class="list">
      <h3>All Users ({data.users.length})</h3>
      {#if data.users.length === 0}
        <p class="empty">No users yet.</p>
      {:else}
        {#each data.users as user (user.id)}
          <Card variant="white" class="list-item">
            <div class="list-item-content">
              <div>
                <div class="user-info">
                  <span class="text-handle">@{user.handle}</span>
                  {#if user.isAdmin}
                    <span class="admin-badge bordered">Admin</span>
                  {/if}
                </div>
                <div class="user-email">{user.email}</div>
                <div class="user-stats text-timestamp">
                  {user._count.posts} posts · {user._count.followers} followers · Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
              {#if !user.isAdmin}
                <form method="post" action="?/deleteUser" use:enhance>
                  <input type="hidden" name="userId" value={user.id} />
                  <button
                    type="submit"
                    class="btn-danger"
                    onclick={(e) => {
                      if (!confirm(`Are you sure you want to delete @${user.handle}? This will permanently delete all their posts and data.`)) {
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
        {/each}
      {/if}
    </div>
  </Card>
</div>

<style>
  .admin {
    width: 100%;
  }

  h1 {
    font-size: calc(var(--unit) * 1.5);
    margin-bottom: var(--unit);
  }

  h2 {
    font-size: calc(var(--unit) * 1.2);
    margin-bottom: calc(var(--unit) * 0.5);
  }

  h3 {
    color: black;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.85);
    font-weight: 700;
    margin: var(--unit) 0 calc(var(--unit) * 0.5) 0;
  }

  :global(.section) {
    margin-bottom: var(--unit);
  }

  :global(.section) p {
    color: black;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
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
    background-color: var(--color-lime);
    color: black;
  }

  .message.error {
    background-color: white;
    color: black;
  }

  .list {
    margin-top: var(--unit);
  }

  :global(.list-item) {
    margin-bottom: calc(var(--unit) * 0.5);
  }

  .list-item-content {
    align-items: center;
    display: flex;
    gap: var(--unit);
    justify-content: space-between;
  }

  .email {
    color: black;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
    font-weight: 700;
    margin-bottom: calc(var(--unit) * 0.25);
  }

  .user-info {
    align-items: center;
    display: flex;
    gap: calc(var(--unit) * 0.5);
    margin-bottom: calc(var(--unit) * 0.25);
  }

  .user-email {
    color: #666;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.65);
    margin-bottom: calc(var(--unit) * 0.25);
  }

  .user-stats {
    font-size: calc(var(--unit) * 0.6);
  }

  .admin-badge {
    background-color: var(--color-purple);
    color: white;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.5);
    font-weight: 700;
    padding: calc(var(--unit) * 0.1) calc(var(--unit) * 0.3);
  }

  .btn-danger {
    background-color: white;
    border: 3px solid black;
    color: black;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.65);
    font-weight: 700;
    padding: calc(var(--unit) * 0.3) calc(var(--unit) * 0.5);
    white-space: nowrap;
  }

  .btn-danger:hover {
    background-color: black;
    color: white;
  }

  .empty {
    color: #666;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
    font-style: italic;
    text-align: center;
  }
</style>
