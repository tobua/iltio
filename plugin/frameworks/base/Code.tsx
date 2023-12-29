import React from 'react'
import { Label, Text } from 'iltio'
import { Resend } from './Resend'

export function Code({
  Components,
  style,
  variables,
  labels,
  registration,
  codeValid,
  handleCode,
  tab,
}: any) {
  return (
    <>
      {registration && (
        <Components.Message
          aria-label={Label.registration}
          style={style.message}
          variables={variables}
        >
          {Text.RegistrationMessage}
        </Components.Message>
      )}
      <Components.Message
        aria-label={Label.messageConfirm}
        style={style.message}
        variables={variables}
      >
        {tab === 'mail' ? Text.CodeSentMessage : Text.CodeSentMessagePhone}
      </Components.Message>
      <Components.Input
        aria-label={Label.inputCode}
        onChange={(event) => handleCode(event.target.value)}
        valid={codeValid}
        required
        placeholder={Text.CodeInputPlaceholder}
        type="number"
        maxLength={4}
        style={{ textAlign: 'center', ...style.inputCode }}
        variables={variables}
      />
      <Resend Components={Components} labels={labels} variables={variables} style={style} />
    </>
  )
}
