<script>
  export let variables
  export let style = ''
  export let selected = false
</script>

<button
  on:click
  type="button"
  style="margin: 0; padding: 0; border: none; background: none; outline: none; display: flex; cursor: pointer; max-width: 100%; font-weight: {selected
    ? 'bold'
    : 'normal'}; font-size: {variables.fontSize}; font-family: {variables.fontFamily}; {style.button}"
  {...$$restProps}
>
  <span style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; {style.text}">
    <slot />
  </span>
</button>
