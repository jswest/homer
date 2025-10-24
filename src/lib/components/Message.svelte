<script>
  let { type = 'info', children } = $props();
</script>

<div class="message message-{type}">
  {@render children()}
</div>

<style>
  .message {
    border: 3px solid black;
    box-sizing: border-box;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
    font-weight: 700;
    margin-bottom: var(--unit);
    padding: var(--unit);
  }

  .message-success {
    background-color: var(--color-bg);
    color: black;
  }

  .message-error {
    background-color: white;
    color: black;
  }

  .message-info {
    background-color: var(--color-bg);
    color: black;
  }
</style>
