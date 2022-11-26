import React, {
  FunctionComponent,
  CSSProperties,
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  FormHTMLAttributes,
} from 'react'
import { Variables } from './types'

export type ComponentTypes = {
  Input?: FunctionComponent<
    { valid: boolean; style?: CSSProperties; variables?: Variables } & DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
  >
  Button?: FunctionComponent<
    { children: string; style?: CSSProperties; variables?: Variables } & DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  >
  Form?: FunctionComponent<
    { style?: CSSProperties; children: JSX.Element | JSX.Element[] } & DetailedHTMLProps<
      FormHTMLAttributes<HTMLFormElement>,
      HTMLFormElement
    >
  >
  Tab?: FunctionComponent<
    {
      style?: CSSProperties
      variables?: Variables
      active: boolean
      children: string
    } & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
  >
}

const test = <span />

export const components: ComponentTypes = {
  Button: ({ variables, children, style, ...props }) => (
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
  Input: ({ variables, valid, style, ...props }) => (
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
  Form: ({ style, children, ...props }) => (
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
  Tab: ({ style, variables, active, children, ...props }) => (
    <button
      style={{
        cursor: 'pointer',
        color: variables.color,
        background: 'none',
        border: 'none',
        outline: 'none',
        fontSize: '100%',
        padding: 0,
        ...(active && { fontWeight: 'bold' }),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  ),
}
