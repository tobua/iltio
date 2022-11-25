import React from 'react'

export const Components = {
  button: ({ variables, children, style, ...props }) => (
    <button
      style={{
        backgroundColor: variables.color,
        border: 'none',
        color: variables.contrast,
        padding: 10,
        cursor: 'pointer',
        borderRadius: variables.borderRadius,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  ),
  input: ({ variables, valid, style, ...props }) => (
    <input
      style={{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: valid ? variables.color : 'red',
        padding: 9,
        outline: 'none',
        borderRadius: variables.borderRadius,
        ...style,
      }}
      {...props}
    />
  ),
  form: ({ style, children, ...props }) => (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        ...style,
      }}
      {...props}
    >
      {children}
    </form>
  ),
}
