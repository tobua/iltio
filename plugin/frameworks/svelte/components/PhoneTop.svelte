<script>
  export let variables
  export let style = ''
</script>

<div style="display: flex; {style}" {...$$restProps}>
  <slot />
</div>
