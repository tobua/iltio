<template>
  <form
    :style="{ display: 'flex', flexDirection: 'column', gap: `${variables.space}px`, ...style }"
  >
    <slot />
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
