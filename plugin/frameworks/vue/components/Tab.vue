<template>
  <button
    type="button"
    :style="{
      cursor: 'pointer',
      color: variables.color,
      background: 'none',
      border: 'none',
      outline: 'none',
      padding: 0,
      fontSize: `${variables.fontSize}px`,
      fontFamily: variables.fontFamily,
      ...(active && { fontWeight: 'bold' }),
      ...style,
    }"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    style: Object,
    variables: Object,
    active: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
