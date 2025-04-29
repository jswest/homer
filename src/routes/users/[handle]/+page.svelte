<script>
  import {marked} from "marked";

  const { data } = $props();
  const { user } = data;
</script>

<h1>@{user.handle}</h1>
<div class="markdown">
  {@html marked.parse(user.biography)}
</div>

<style>
  h1 {
    font-weight: 900;
  }
  .markdown {
    margin-top: var(--unit);
  }
</style>