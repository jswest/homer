<script>
  let { type = 'button', variant = 'primary', children, ...props } = $props();
</script>

<button type={type} class="btn btn-{variant}" {...props}>
  {@render children()}
</button>

<style>
  .btn {
    background-color: black;
    border: 3px solid black;
    box-sizing: border-box;
    color: white;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: calc(var(--unit) * 0.75);
    font-weight: 700;
    line-height: var(--unit);
    padding: calc(var(--unit) * 0.4);
    text-align: center;
    width: 100%;
  }

  .btn:hover {
    background-color: white;
    color: black;
  }

  .btn-secondary {
    background-color: white;
    color: black;
  }

  .btn-secondary:hover {
    background-color: var(--color-bg);
  }

  .btn-small {
    font-size: calc(var(--unit) * 0.6);
    padding: calc(var(--unit) * 0.3) calc(var(--unit) * 0.5);
    width: auto;
  }
</style>
