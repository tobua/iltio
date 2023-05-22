<script>
  export let style
  export let variables
  export let active = false
</script>

<button
  type="button"
  style="cursor: pointer; background: none; outline: none; border: none; padding: 0; color: {variables.color}; font-size: {variables.fontSize}px; font-family: {variables.fontFamily}; font-weight: {active
    ? 'bold'
    : 'normal'}; {style}"
  on:click
  {...$$restProps}
>
  <slot />
</button>
