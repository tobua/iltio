<script>
  export let variables
  export let style
  export let valid = true
</script>

<input
  style="
      border: none;
      border-bottom: 1px solid black;
      border-color: {valid ? 'black' : 'red'};
      padding-bottom: 5px;
      color: {variables.color};
      cursor: pointer;
      outline: none;
      background-color: transparent;
      {style}
    "
  {...$$restProps}
/>
