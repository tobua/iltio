<template>
  <button
    :style="{
      backgroundColor: variables.color,
      border: 'none',
      color: variables.contrast,
      // TODO use toPx helper.
      padding: `${variables.smallSpace}px`,
      cursor: 'pointer',
      borderRadius: variables.borderRadius,
      fontSize: variables.fontSize,
      fontFamily: variables.fontFamily,
      ...style,
    }"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    variables: {
      type: Object,
      required: true,
    },
    style: {
      type: Object,
      default: () => ({}),
    },
    children: {
      type: [String, Number],
    },
  },
}
</script>
