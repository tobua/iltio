<template>
  <p
    :style="{
      backgroundColor: 'lightgray',
      margin: 0,
      padding: `${variables.smallSpace}px`,
      borderRadius: `${variables.borderRadius}px`,
      fontSize: `${variables.fontSize}px`,
      fontFamily: variables.fontFamily,
      ...style,
    }"
  >
    <slot />
  </p>
</template>

<script>
export default {
  props: {
    style: Object,
    variables: Object,
  },
}
</script>
