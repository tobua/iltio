<script>
  export let variables
  export let style = ''
</script>

<button
  on:click
  type="submit"
  style="background-color: {variables.color}; border: none; color: {variables.contrast}; padding: {variables.smallSpace}px; cursor: pointer; border-radius: {variables.borderRadius}; font-size: {variables.fontSize}; font-family: {variables.fontFamily}; {style}"
  {...$$restProps}
>
  <slot />
</button>
