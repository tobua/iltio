<template>
  <TabWrapper :style="style.tabWrapper" :variables="variables">
    <Tab
      :aria-label="Label.tabMail"
      :active="tab === 'mail'"
      @click.prevent="setTab('mail')"
      :variables="variables"
      :style="style.tab"
    >
      {{ labels.tabMail }}
    </Tab>
    <Tab
      :aria-label="Label.tabPhone"
      :active="tab === 'phone'"
      @click.prevent="setTab('phone')"
      :variables="variables"
      :style="style.tab"
    >
      {{ labels.tabPhone }}
    </Tab>
  </TabWrapper>
</template>

<script>
import { Label } from 'iltio'
import TabWrapper from './components/TabWrapper.vue'
import Tab from './components/Tab.vue'

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
  data() {
    return {
      Label,
    }
  },
  components: {
    TabWrapper,
    Tab,
  },
}
</script>
