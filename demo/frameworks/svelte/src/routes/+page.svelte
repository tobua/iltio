<script>
  import Authentication from 'iltio/svelte'
</script>

<h1>iltio Svelte Demo</h1>
<div id="base" style="display: flex; justify-content: center;">
  <Authentication
    configuration={{ token: 'demo' }}
    onSuccess={(name, token, registration) => console.log('success', name, token, registration)}
  />
</div>
