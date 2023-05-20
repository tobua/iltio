<script>
  export let variables
  export let style = ''
</script>

<p
  style="background-color: lightgray; margin: 0; padding: {variables.smallSpace}px; border-radius: {variables.borderRadius}px; font-size: {variables.fontSize}px; font-family: {variables.fontFamily}; {style}"
  {...$$restProps}
>
  <slot />
</p>
