<template>
  <form
    :style="{ display: 'flex', flexDirection: 'column', gap: variables.space, ...style }"
    v-bind="$props"
  >
    <slot></slot>
  </form>
</template>

<script>
export default {
  props: {
    style: Object,
    variables: Object,
  },
}
</script>
