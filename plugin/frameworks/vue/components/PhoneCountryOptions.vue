<template>
  <div
    :style="{
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '200px',
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingRight: `${variables.smallSpace}px`,
      paddingBottom: `${variables.smallSpace}px`,
      rowGap: '5px',
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
