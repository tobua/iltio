<script>
  import { onMount, setContext } from 'svelte';
  import { Label, Text, defaultVariables, defaultLabels, Store } from 'iltio';
  import Phone from './Phone.svelte';
  import Tabs from './Tabs.svelte';
  import Code from './Code.svelte';
  import Tab from './components/Tab.svelte'
  import TabWrapper from './components/TabWrapper.svelte'
  import Input from './components/Input.svelte'
  import Button from './components/Button.svelte'
  import Form from './components/Form.svelte'
  import Message from './components/Message.svelte'
  import Error from './components/Error.svelte'

  export let token = ''
  export let allowPhone = true;
  export let allowMail = true;
  export let initialCountryCode = 'us';
  export let style = {phoneCountry: {}, phoneCountryOption: {}};
  export let variables = defaultVariables;
  export let labels = defaultLabels;

  let tab = allowMail ? 'mail' : 'phone';
  let mail = '';
  let phone = '';
  let countryCode = initialCountryCode.toLowerCase();
  let mailValid = true;
  let phoneValid = true;
  const multipleInputs = allowMail && allowPhone;
  let loading = false;
  let submitted = Store.codeToken !== '';
  let registration = false;
  let error = '';
  let codeValid = true;
  let Components = {
    TabWrapper,
    Tab,
    Input,
    Button,
    Form,
    Message,
    Error
  }

  setContext('variables', variables);
  setContext('labels', labels);

  const handleSubmit = () => {
    loading = true
  };

  const handleCode = (code) => {
    console.log(code);
  };

  const setTab = (newTab) => {
    tab = newTab
  }

  const setCountryCode = () => {
    //
  }

  const setPhone = () => {
    //
  }

  onMount(() => {
    console.log('effect');
  });
</script>

{#if !submitted}
  <Components.Form
    aria-label={Label.form}
    on:submit={handleSubmit}
    style={style.form}
    variables={variables}
  >
    <Tabs
      multipleInputs={multipleInputs}
      tab={tab}
      setTab={setTab}
      style={style}
      labels={labels}
      variables={variables}
      Components={Components}
    />
    {#if allowMail && (!multipleInputs || tab === 'mail')}
      <Components.Input
        aria-label={Label.inputMail}
        aria-invalid={!mailValid}
        bind:value={mail}
        on:change={() => setMail(mail)}
        required
        valid={mailValid}
        style={style.inputMail}
        placeholder={Text.MailInputPlaceholder}
        type="email"
        variables={variables}
      />
    {/if}
    {#if allowPhone && (!multipleInputs || tab === 'phone')}
      <Phone
        countryCode={countryCode}
        setCountryCode={setCountryCode}
        phone={phone}
        setPhone={setPhone}
        variables={variables}
        style={style}
      />
    {/if}
    {#if error}
      <Components.Error style={style.error} variables={variables}>
        {error}
      </Components.Error>
    {/if}
    <Components.Button
      aria-label={Label.submit}
      on:click={handleSubmit}
      type="submit"
      variables={variables}
      style={style.button}
    >
      {loading ? Text.LoadingButton : labels.submit}
    </Components.Button>
  </Components.Form>
{/if}

{#if submitted}
  <Code
    style={style}
    variables={variables}
    labels={labels}
    registration={registration}
    codeValid={codeValid}
    handleCode={handleCode}
  />
{/if}
