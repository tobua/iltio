import React from 'react'
import {
  ButtonProps,
  InputProps,
  FormProps,
  TabWrapperProps,
  TabProps,
  ErrorProps,
  MessageProps,
  ComponentTypes,
} from './types'

export const components = {
  Button: ({ variables, children, style, ...props }: ButtonProps) => (
    <button
      type="submit"
      style={{
        backgroundColor: variables.color,
        border: 'none',
        color: variables.contrast,
        padding: variables.smallSpace,
        cursor: 'pointer',
        borderRadius: variables.borderRadius,
        fontSize: variables.fontSize,
        fontFamily: variables.fontFamily,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  ),
  Input: ({ variables, valid = true, style, ...props }: InputProps) => (
    <input
      style={{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: valid ? variables.color : 'red',
        padding: 9,
        outline: 'none',
        borderRadius: variables.borderRadius,
        fontSize: variables.fontSize,
        fontFamily: variables.fontFamily,
        backgroundColor: 'inherit',
        ...style,
      }}
      {...props}
    />
  ),
  Form: ({ style, children, variables, ...props }: FormProps) => (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: variables.space,
        ...style,
      }}
      {...props}
    >
      {children}
    </form>
  ),
  TabWrapper: ({ style, variables, ...props }: TabWrapperProps) => (
    <div
      style={{ display: 'flex', justifyContent: 'space-around', gap: variables.space, ...style }}
      {...props}
    />
  ),
  Tab: ({ style, variables, active, children, ...props }: TabProps) => (
    <button
      type="button"
      style={{
        cursor: 'pointer',
        color: variables.color,
        background: 'none',
        border: 'none',
        outline: 'none',
        padding: 0,
        fontSize: variables.fontSize,
        fontFamily: variables.fontFamily,
        ...(active && { fontWeight: 'bold' }),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  ),
  Error: ({ style, variables, children, ...props }: ErrorProps) => (
    <p
      style={{
        color: 'red',
        margin: 0,
        fontSize: variables.fontSize,
        fontFamily: variables.fontFamily,
        ...style,
      }}
      {...props}
    >
      {children}
    </p>
  ),
  Message: ({ style, variables, children, ...props }: MessageProps) => (
    <p
      style={{
        backgroundColor: 'lightgray',
        margin: 0,
        padding: variables.smallSpace,
        borderRadius: variables.borderRadius,
        fontSize: variables.fontSize,
        fontFamily: variables.fontFamily,
      }}
      {...props}
    >
      {children}
    </p>
  ),
  PhoneWrapper: ({ style, variables, valid, ...props }: any) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: valid ? variables.color : 'red',
        borderRadius: variables.borderRadius,
        paddingLeft: 10,
        ...style,
      }}
      {...props}
    />
  ),
  PhoneTop: ({ ...props }: any) => <div style={{ display: 'flex' }} {...props} />,
  PhoneCountry: ({ variables, prefix, flag, togglePicker, ...props }: any) => (
    <button
      style={{
        display: 'flex',
        gap: variables.smallSpace,
        alignItems: 'center',
        border: 'none',
        background: 'none',
        outline: 'none',
        padding: 0,
      }}
      type="button"
      onClick={togglePicker}
      {...props}
    >
      <span>{flag}</span>
      <span>{prefix}</span>
    </button>
  ),
  PhoneInput: ({ variables, valid, style, ...props }: any) => (
    <input
      style={{
        background: 'none',
        border: 'none',
        padding: 9,
        outline: 'none',
        width: '100%',
        ...style,
      }}
      {...props}
    />
  ),
  PhoneCountryOptions: ({ variables, ...props }: any) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 200,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: variables.smallSpace,
        rowGap: 5,
      }}
      {...props}
    />
  ),
  PhoneCountryOption: ({ variables, selected, children, onSelect, ...props }: any) => (
    <button
      style={{
        fontWeight: selected ? 'bold' : 'normal',
        margin: 0,
        padding: 0,
        fontFamily: variables.fontFamily,
        fontSize: variables.fontSize,
        border: 'none',
        background: 'none',
        outline: 'none',
        display: 'flex',
        cursor: 'pointer',
        maxWidth: '100%',
      }}
      onClick={onSelect}
      type="button"
      {...props}
    >
      <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
        {children}
      </span>
    </button>
  ),
} as ComponentTypes
