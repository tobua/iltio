<script>
  import Authentication from 'iltio/svelte'
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
</div>
