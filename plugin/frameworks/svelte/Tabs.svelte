<script>
  import { Label } from 'iltio';

  export let multipleInputs = false;
  export let tab = '';
  export let style;
  export let variables;
  export let labels;
  export let Components;
  export let setTab;
</script>

{#if multipleInputs}
  <Components.TabWrapper style={style.tabWrapper} variables={variables}>
    <Components.Tab
      aria-label={Label.tabMail}
      active={tab === 'mail'}
      on:click={() => setTab('mail')}
      variables={variables}
      style={style.tab}
    >
      {labels.tabMail}
    </Components.Tab>
    <Components.Tab
      aria-label={Label.tabPhone}
      active={tab === 'phone'}
      on:click={() => setTab('phone')}
      variables={variables}
      style={style.tab}
    >
      {labels.tabPhone}
    </Components.Tab>
  </Components.TabWrapper>
{/if}
