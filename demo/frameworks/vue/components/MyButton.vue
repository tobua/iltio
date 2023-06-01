<template>
  <div
    :style="{ display: 'flex', position: 'relative' }"
    class="my-button"
    @mouseenter="setActive(true)"
    @mouseleave="setActive(false)"
  >
    <span
      :style="{
        position: 'absolute',
        inset: 0,
        background: 'black',
        borderRadius: '5px',
        transition: 'all 0.2s ease-out 0s',
        transform: active ? 'translate(2px, 2px)' : 'none',
      }"
    />
    <button
      @mousedown="setPressed(true)"
      @mouseup="setPressed(false)"
      :style="{
        display: 'flex',
        justifyContent: 'center',
        fontFamily: 'ui-serif, Georgia, serif',
        fontSize: '18px',
        flex: 1,
        background: active
          ? 'linear-gradient(-45deg, hsl(209, 81.2%, 84.5%), hsl(210, 98.8%, 94.0%))'
          : 'black',
        border: '1px solid black',
        color: active ? 'black' : variables.contrast,
        padding: '10px',
        cursor: 'pointer',
        borderRadius: '5px',
        zIndex: 1,
        transform: pressed ? 'translateX(2px) translateY(2px)' : 'none',
        transition: 'all 0.2s ease-out 0s',
        ...style,
      }"
    >
      <slot />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    variables: Object,
    style: Object,
  },
  data() {
    return {
      active: false,
      pressed: false,
    }
  },
  methods: {
    setActive(value) {
      this.active = value
    },
    setPressed(value) {
      this.pressed = value
    },
  },
}
</script>
