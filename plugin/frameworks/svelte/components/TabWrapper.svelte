<script>
  export let style
  export let variables
</script>

<div
  style="display: flex; justify-content: space-around; gap: {variables.space}px; {style}"
  {...$$restProps}
>
  <slot />
</div>
