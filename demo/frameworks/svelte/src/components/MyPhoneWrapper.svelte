<script>
  export let variables
  export let style
  export let valid = true
</script>

<div
  style="border-bottom: 1px solid black; display: flex; flex-direction: column; border-color: {valid
    ? variables.color
    : 'red'}; {style}"
  {...$$restProps}
>
  <slot />
</div>
