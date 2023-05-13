<script>
  export let variables
  export let style = ''
  export let valid = true
</script>

<div
  style="display: flex; flex-direction: column; border: 1px solid {valid
    ? variables.color
    : 'red'}; border-radius: {variables.borderRadius}px; padding-left: {variables.smallSpace}px; {style}"
  {...$$restProps}
>
  <slot />
</div>
