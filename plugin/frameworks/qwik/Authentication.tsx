import { Fragment, component$, h, useStore } from '@builder.io/qwik'
import { Label, defaultVariables, defaultLabels, Store, configure, app, Props } from 'iltio'

const components = {
  Form: component$<{ children: any }>(({ children }) => (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: variables.space,
      }}
    >
      {children}
    </form>
  )),
}

export const Authentication = component$(
  ({
    configuration,
    allowPhone = true,
    allowMail = true,
    onSuccess,
    initialCountryCode = 'us',
    style = {},
    variables = defaultVariables,
    labels = {},
    Components = components,
  }: Props) => {
    const state = useStore({
      tab: allowMail ? 'mail' : 'phone',
    })

    Components = { ...components, ...Components }
    variables = { ...defaultVariables, ...variables }
    labels = { ...defaultLabels, ...labels }
    style = { phoneCountry: {}, phoneCountryOption: {}, ...style }

    return (
      <Components.Form aria-label={Label.form}>
        <p>Qwik</p>
      </Components.Form>
    )
  }
)
