<template>
  <div
    :style="{
      display: 'flex',
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
  },
}
</script>
