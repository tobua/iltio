<template>
  <input
    :style="{
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: valid ? variables.color : 'red',
      padding: '9px',
      outline: 'none',
      borderRadius: `${variables.borderRadius}px`,
      fontSize: `${variables.fontSize}px`,
      fontFamily: variables.fontFamily,
      backgroundColor: 'inherit',
      ...style,
    }"
  />
</template>

<script>
export default {
  props: {
    variables: Object,
    valid: Boolean,
    style: Object,
  },
}
</script>
