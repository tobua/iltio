<template>
  <div
    :style="{
      display: 'flex',
      justifyContent: 'space-around',
      gap: `${variables.space}px`,
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
