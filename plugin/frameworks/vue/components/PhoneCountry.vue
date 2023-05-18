<template>
  <button
    type="button"
    :style="{
      display: 'flex',
      gap: `${variables.smallSpace}px`,
      alignItems: 'center',
      border: 'none',
      background: 'none',
      outline: 'none',
      padding: 0,
      cursor: 'pointer',
      fontSize: `${variables.fontSize}px`,
      fontFamily: variables.fontFamily,
      ...style,
    }"
  >
    <span
      :style="{
        fontSize: `${variables.fontSize}px`,
        fontFamily: variables.fontFamily,
        ...style.flag,
      }"
    >
      {{ flag }}
    </span>
    <span
      :style="{
        fontSize: `${variables.fontSize}px`,
        fontFamily: variables.fontFamily,
        ...style.prefix,
      }"
    >
      {{ prefix }}
    </span>
  </button>
</template>

<script>
export default {
  props: {
    style: Object,
    variables: Object,
    flag: String,
    prefix: String,
  },
}
</script>
