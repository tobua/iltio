<script>
  import Authentication from 'iltio/svelte'
  import MyPhoneWrapper from '../components/MyPhoneWrapper.svelte'
  import MyButton from '../components/MyButton.svelte'
  import MyInput from '../components/MyInput.svelte'
</script>

<h1>iltio Svelte Demo</h1>
<div
  style="display: flex; justify-content: center; flex-direction: row; flex-wrap: wrap; gap: 40px;"
>
  <div id="base" style="display: flex; justify-content: center;">
    <Authentication
      configuration={{ token: 'demo' }}
      onSuccess={(name, token, registration) => console.log('success', name, token, registration)}
    />
  </div>
  <div id="phone" style="display: flex; justify-content: center;">
    <Authentication allowMail={false} />
  </div>
  <div id="properties" style="display: flex; flex-direction: column; align-items: center;">
    <Authentication
      variables={{
        color: 'blue',
        borderRadius: 10,
      }}
      style={{
        form: 'width: 130px',
      }}
    />
  </div>
  <div id="custom">
    <Authentication
      style={{
        form: 'width: 300px; border: 1px dashed hsl(0, 0%, 78.0%); padding: 20px;',
        tabWrapper: 'background-color: hsl(0, 0%, 80%); border-radius: 10px; padding: 10px;',
      }}
      variables={{ color: 'hsl(0, 0%, 43.5%)' }}
      Components={{
        Button: MyButton,
        Input: MyInput,
        PhoneWrapper: MyPhoneWrapper,
      }}
    />
  </div>
  <div
    id="styles"
    style="display: flex; flex-direction: column; align-items: center; color: green; font-size: 14px; font-family: monospace; background-color: lightgray; padding: 10px;"
  >
    <Authentication
      variables={{ fontSize: 'inherit', color: 'inherit', contrast: 'red' }}
      labels={{ submit: 'Inherited Background??', tabMail: 'E-Mail' }}
    />
  </div>
</div>
