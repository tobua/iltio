<script>
  export let variables
  export let style = ''
</script>

<p
  style="color: {variables.colorError}; margin: 0; font-size: {variables.fontSize}px; font-family: {variables.fontFamily}; {style}"
  {...$$restProps}
>
  <slot />
</p>
