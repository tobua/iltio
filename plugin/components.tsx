import React, {
  FunctionComponent,
  CSSProperties,
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  FormHTMLAttributes,
} from 'react'
import { Variables } from './types'

type InputProps = { valid: boolean; style: CSSProperties; variables: Variables }
type ButtonProps = { children: string; style: CSSProperties; variables: Variables }
type FormProps = { style: CSSProperties; children: JSX.Element | JSX.Element[] }
type TabProps = {
  style: CSSProperties
  variables: Variables
  active: boolean
  children: string
}

export type ComponentTypes = {
  Input?: FunctionComponent<
    (InputProps & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) | any
  > &
    FunctionComponent
  Button?: FunctionComponent<
    | (ButtonProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>)
    | any
  >
  Form?: FunctionComponent<
    (FormProps & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) | any
  >
  Tab?: FunctionComponent<
    (TabProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) | any
  >
}

export const components = {
  Button: ({ variables, children, style, ...props }: ButtonProps) => (
    <button
      type="submit"
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
  Input: ({ variables, valid, style, ...props }: InputProps) => (
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
  Form: ({ style, children, ...props }: FormProps) => (
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
  Tab: ({ style, variables, active, children, ...props }: TabProps) => (
    <button
      type="button"
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
} as ComponentTypes
