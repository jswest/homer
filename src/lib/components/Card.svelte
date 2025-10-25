<script>
  let { variant = 'white', children, class: className = '' } = $props();
</script>

<div class="card card-{variant} bordered bordered-hover {className}">
  {@render children()}
</div>

<style>
  .card {
    box-sizing: border-box;
    margin-bottom: var(--unit);
    padding: var(--unit);
    width: 100%;
  }

  .card-white {
    background-color: white;
  }

  .card-lime {
    background-color: var(--color-lime);
  }

  .card-pink {
    background-color: var(--color-pink);
  }

  .card-purple {
    background-color: var(--color-purple);
  }
</style>
