<template>
  <input
    :style="{
      border: 'none',
      borderBottom: '1px solid black',
      borderColor: valid ? 'black' : 'red',
      paddingBottom: '5px',
      color: variables.color,
      cursor: 'pointer',
      outline: 'none',
      backgroundColor: 'transparent',
      ...style,
    }"
  />
</template>

<script>
export default {
  name: 'MyInput',
  props: {
    variables: Object,
    style: Object,
    valid: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
