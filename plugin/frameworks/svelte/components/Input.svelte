<script>
  export let variables
  export let valid = true
  export let style = ''
</script>

<input
  on:input
  style="border-width: 1px; border-style: solid; border-color: {valid
    ? variables.color
    : variables.colorError}; padding: 9px; outline: none; border-radius: {variables.borderRadius}px; font-size: {variables.fontSize}px; font-family: {variables.fontFamily}; background-color: inherit; {style}"
  {...$$restProps}
/>
