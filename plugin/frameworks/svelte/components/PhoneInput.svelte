<script>
  export let variables
  export let valid = true
  export let style = ''
</script>

<input
  on:input
  style="border: none; border-color: {valid
    ? variables.color
    : 'red'}; padding: 9px; width: 100%; outline: none; font-size: {variables.fontSize}px; font-family: {variables.fontFamily}; background: none; {style}"
  {...$$restProps}
/>
