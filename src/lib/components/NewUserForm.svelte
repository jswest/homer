<script>
  import { enhance } from '$app/forms';

  let biography = $state("");
</script>

<div class="NewUserForm">
  <form action="/users/create" method="post" use:enhance={() => {}}>
    <fieldset>
      <label for="handle">Choose a handle.</label>
      <input name="handle" type="text" />
      <p class="helper">You must use only letters, numbers, and underscores.</p>
    </fieldset>
    <fieldset>
      <label for="email">Enter your email.</label>
      <input name="email" type="text" />
      <p class="helper">You will need this to create your account.</p>
    </fieldset>
    <fieldset>
      <label for="biography">What is your deal?</label>
      <textarea bind:value={biography} name="biography" maxlength="500"></textarea>
      <p class="helper">You have {500 - biography.length} character(s) remaining.</p>
    </fieldset>
    <fieldset>
      <button type="submit">Save.</button>
    </fieldset>
  </form>
</div>