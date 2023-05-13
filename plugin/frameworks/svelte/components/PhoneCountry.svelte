<script>
  export let variables,
    style = '',
    prefix,
    flag
</script>

<button
  on:click
  type="button"
  style="display: flex; gap: {variables.smallSpace}px; align-items: center; border: none; background: none; outline: none; padding: 0; cursor: pointer; font-size: {variables.fontSize}; font-family: {variables.fontFamily}; {style.button}"
  {...$$restProps}
>
  <span style="font-size: {variables.fontSize}; font-family: {variables.fontFamily}; {style.flag}"
    >{flag}</span
  >
  <span style="font-size: {variables.fontSize}; font-family: {variables.fontFamily}; {style.prefix}"
    >{prefix}</span
  >
</button>
