<template>
  <div
    :style="{
      borderBottom: '1px solid black',
      display: 'flex',
      flexDirection: 'column',
      borderColor: valid ? variables.color : 'red',
      ...style,
    }"
  >
    <slot />
  </div>
</template>

<script>
export default {
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
