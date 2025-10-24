<script>
  let { variant = 'white', children, class: className = '' } = $props();
</script>

<div class="card card-{variant} {className}">
  {@render children()}
</div>

<style>
  .card {
    border: 3px solid black;
    box-sizing: border-box;
    margin-bottom: var(--unit);
    padding: var(--unit);
    width: 100%;
  }

  .card-white {
    background-color: white;
  }

  .card-pink {
    background-color: var(--color-bg);
  }
</style>
