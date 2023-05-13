<template>
  <Components.TabWrapper :style="style.tabWrapper" :variables="variables">
    <Components.Tab
      aria-label="Tab Mail"
      :active="tab === 'mail'"
      @click="setTab('mail')"
      :variables="variables"
      :style="style.tab"
    >
      {{ labels.tabMail }}
    </Components.Tab>
    <Components.Tab
      aria-label="Tab Phone"
      :active="tab === 'phone'"
      @click="setTab('phone')"
      :variables="variables"
      :style="style.tab"
    >
      {{ labels.tabPhone }}
    </Components.Tab>
  </Components.TabWrapper>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    multipleInputs: Boolean,
    tab: String,
    Components: Object,
    setTab: Function,
    style: Object,
    variables: Object,
    labels: Object,
  },
}
</script>
