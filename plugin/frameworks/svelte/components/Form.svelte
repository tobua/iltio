<script>
  export let style;
  export let variables;
</script>

<form
  style="display: flex; flex-direction: column; gap: {variables.space}px; {style}"
  on:submit|preventDefault
  {...$$restProps}
>
  <slot />
</form>