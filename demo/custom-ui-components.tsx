import React, { useState } from 'react'
import { Form } from '../plugin/index'

const MyButton = ({ variables, style, ...props }) => {
  const [active, setActive] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <div
      style={{ display: 'flex', position: 'relative' }}
      className="my-button"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: 'black',
          borderRadius: 5,
          transition: 'all 0.2s ease-out 0s',
          transform: active ? 'translate(2px, 2px)' : 'none',
        }}
      />
      <button
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontFamily: 'ui-serif, Georgia, serif',
          fontSize: 18,
          flex: 1,
          background: active
            ? 'linear-gradient(-45deg, hsl(209, 81.2%, 84.5%), hsl(210, 98.8%, 94.0%))'
            : 'black',
          border: '1px solid black',
          color: active ? 'black' : variables.contrast,
          padding: 10,
          cursor: 'pointer',
          borderRadius: 5,
          zIndex: 1,
          transform: pressed ? 'translateX(2px) translateY(2px)' : 'none',
          transition: 'all 0.2s ease-out 0s',
          ...style,
        }}
        {...props}
      />
    </div>
  )
}

const MyInput = ({ variables, style, valid, ...props }) => (
  <input
    style={{
      border: 'none',
      borderBottom: '1px solid black',
      borderColor: valid ? 'black' : 'red',
      paddingBottom: 5,
      color: variables.color,
      cursor: 'pointer',
      outline: 'none',
      backgroundColor: 'transparent',
      ...style,
    }}
    {...props}
  />
)

const MyPhoneWrapper = ({ variables, style, valid, ...props }) => (
  <div
    style={{
      borderBottom: '1px solid black',
      display: 'flex',
      borderColor: valid ? variables.color : 'red',
      ...style,
    }}
    {...props}
  />
)

export const CustomUIComponents = ({ onSuccess }: any) => (
  <Form
    style={{
      form: { width: 300, border: '1px dashed hsl(0, 0%, 78.0%)', padding: 20 },
      tabWrapper: { color: 'hsl(0, 0%, 43.5%)' },
    }}
    variables={{ color: 'hsl(0, 0%, 43.5%)' }}
    Components={{
      Button: MyButton,
      Input: MyInput,
      PhoneWrapper: MyPhoneWrapper,
    }}
    onSuccess={onSuccess}
  />
)
