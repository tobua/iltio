<script>
  export let variables
  export let style

  let active = false
  let pressed = false

  const setActive = (value) => {
    active = value
  }

  const setPressed = (value) => {
    pressed = value
  }
</script>

<div
  on:mouseenter={() => setActive(true)}
  on:mouseleave={() => setActive(false)}
  style="display: flex; position: relative;"
  class="my-button"
>
  <span
    style="
        position: absolute;
        inset: 0;
        background: black;
        border-radius: 5px;
        transition: all 0.2s ease-out 0s;
        transform: {active ? 'translate(2px, 2px)' : 'none'};
      "
  />
  <button
    on:mousedown={() => setPressed(true)}
    on:mouseup={() => setPressed(false)}
    style="
        display: flex;
        justify-content: center;
        font-family: ui-serif, Georgia, serif;
        font-size: 18px;
        flex: 1;
        background: {active
      ? 'linear-gradient(-45deg, hsl(209, 81.2%, 84.5%), hsl(210, 98.8%, 94.0%))'
      : 'black'};
        border: 1px solid black;
        color: {active ? 'black' : variables.contrast};
        padding: 10px;
        cursor: pointer;
        border-radius: 5px;
        z-index: 1;
        transform: {pressed ? 'translateX(2px) translateY(2px)' : 'none'};
        transition: all 0.2s ease-out 0s;
        {style}
      "
    {...$$restProps}
  >
    <slot />
  </button>
</div>
