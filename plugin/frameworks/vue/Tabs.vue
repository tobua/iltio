<template>
  <component
    :is="TabWrapper"
    :aria-label="Label.tabWrapper"
    v-if="multipleInputs"
    :style="style.tabWrapper"
    :variables="variables"
  >
    <component
      :is="Tab"
      :aria-label="Label.tabMail"
      :active="tab === 'mail'"
      @click.prevent="setTab('mail')"
      :variables="variables"
      :style="style.tab"
    >
      {{ labels.tabMail }}
    </component>
    <component
      :is="Tab"
      :aria-label="Label.tabPhone"
      :active="tab === 'phone'"
      @click.prevent="setTab('phone')"
      :variables="variables"
      :style="style.tab"
    >
      {{ labels.tabPhone }}
    </component>
  </component>
</template>

<script>
import { Label } from 'iltio'

export default {
  props: {
    multipleInputs: Boolean,
    tab: String,
    setTab: Function,
    style: Object,
    variables: Object,
    labels: Object,
    TabWrapper: Object,
    Tab: Object,
  },
  data() {
    return {
      Label,
    }
  },
}
</script>
