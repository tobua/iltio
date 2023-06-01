import React from 'react'
import { Label } from 'iltio'

export function Tabs({ multipleInputs, tab, Components, setTab, style, variables, labels }: any) {
  if (!multipleInputs) {
    return null
  }

  return (
    <Components.TabWrapper
      style={style.tabWrapper}
      variables={variables}
      aria-label={Label.tabWrapper}
    >
      <Components.Tab
        aria-label={Label.tabMail}
        active={tab === 'mail'}
        onClick={() => setTab('mail')}
        variables={variables}
        style={style.tab}
      >
        {labels.tabMail}
      </Components.Tab>
      <Components.Tab
        aria-label={Label.tabPhone}
        active={tab === 'phone'}
        onClick={() => setTab('phone')}
        variables={variables}
        style={style.tab}
      >
        {labels.tabPhone}
      </Components.Tab>
    </Components.TabWrapper>
  )
}
