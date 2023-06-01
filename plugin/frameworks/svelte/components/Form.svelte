<script>
  export let styles
  export let variables
</script>

<form
  style="display: flex; flex-direction: column; gap: {variables.space}px; {styles}"
  on:submit|preventDefault
  {...$$restProps}
>
  <slot />
</form>
