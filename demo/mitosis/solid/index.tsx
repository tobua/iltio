import { render } from "solid-js/web";
import Authentication from "iltio/solid";

render(
  () => (
    <div>
      <h1>iltio Solid Demo</h1>
      <Authentication token="123" />
    </div>
  ),
  document.body
);
