<script>
  export let variables
  export let style = ''
</script>

<div
  style="display: flex; flex-direction: column; max-height: 200px; overflow-y: auto; overflow-x: hidden; padding-right: {variables.smallSpace}px; padding-bottom: {variables.smallSpace}px; row-gap: 5px; {style}"
  {...$$restProps}
>
  <slot />
</div>
