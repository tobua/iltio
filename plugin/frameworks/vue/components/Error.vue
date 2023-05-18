<template>
  <p
    :style="{
      color: 'red',
      margin: 0,
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
