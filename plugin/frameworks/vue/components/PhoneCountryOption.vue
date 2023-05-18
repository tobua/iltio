<template>
  <button
    type="button"
    :style="{
      fontWeight: selected ? 'bold' : 'normal',
      margin: 0,
      padding: 0,
      fontSize: `${variables.fontSize}px`,
      fontFamily: variables.fontFamily,
      border: 'none',
      background: 'none',
      outline: 'none',
      display: 'flex',
      cursor: 'pointer',
      maxWidth: '100%',
      ...style,
    }"
  >
    <span
      :style="{
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        ...style.text,
      }"
    >
      <slot />
    </span>
  </button>
</template>

<script>
export default {
  props: {
    style: Object,
    variables: Object,
    selected: Boolean,
  },
}
</script>
