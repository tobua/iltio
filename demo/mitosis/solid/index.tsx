import { render } from 'solid-js/web'
import Authentication from 'iltio/solid'

render(
  () => (
    <div style={{ 'font-family': 'sans-serif' }}>
      <h1>iltio Solid Demo</h1>
      <Authentication token="123" allowMail={true} allowPhone={true} />
    </div>
  ),
  document.body
)
