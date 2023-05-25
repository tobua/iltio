<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: 'column',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: valid ? variables.color : 'red',
      borderRadius: `${variables.borderRadius}px`,
      paddingLeft: `${variables.smallSpace}px`,
      ...style,
    }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    style: Object,
    variables: Object,
    valid: Boolean,
  },
}
</script>
