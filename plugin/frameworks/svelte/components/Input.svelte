<script>
  export let variables;
  export let valid = true;
  export let style = '';
</script>

<input style="border-width: 1px; border-style: solid; border-color: {valid ? variables.color : 'red'}; padding: 9px; outline: none; border-radius: {variables.borderRadius}; font-size: {variables.fontSize}; font-family: {variables.fontFamily}; background-color: inherit; {style}" {...$$restProps} />