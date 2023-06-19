<template>
  <input
    :style="{
      background: 'none',
      border: 'none',
      padding: '9px',
      outline: 'none',
      width: '100%',
      borderColor: valid ? variables.color : variables.colorError,
      fontSize: `${variables.fontSize}px`,
      fontFamily: variables.fontFamily,
      ...style,
    }"
  />
</template>

<script>
export default {
  props: {
    style: Object,
    variables: Object,
    valid: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
