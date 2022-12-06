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
type FormProps = {
  style: CSSProperties
  children: JSX.Element | JSX.Element[]
  variables: Variables
}
type TabWrapperProps = { style: CSSProperties; variables: Variables }
type TabProps = {
  style: CSSProperties
  variables: Variables
  active: boolean
  children: string
}
type ErrorProps = { style: CSSProperties; variables: Variables; children: string }
type MessageProps = { style: CSSProperties; variables: Variables; children: string }

export type ComponentTypes = {
  Input?: FunctionComponent<
    (InputProps & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) | any
  >
  Button?: FunctionComponent<
    | (ButtonProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>)
    | any
  >
  Form?: FunctionComponent<
    (FormProps & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) | any
  >
  TabWrapper?: FunctionComponent<TabWrapperProps & any>
  Tab?: FunctionComponent<
    (TabProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) | any
  >
  Error?: FunctionComponent<ErrorProps & any>
  Message?: FunctionComponent<MessageProps & any>
  PhoneWrapper: FunctionComponent<any>
  PhoneFlag: FunctionComponent<any>
  PhonePrefix: FunctionComponent<any>
  PhoneSelect: FunctionComponent<any>
  PhoneOption: FunctionComponent<any>
  PhoneInput: FunctionComponent<any>
}

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
  Input: ({ variables, valid, style, ...props }: InputProps) => (
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
        backgroundColor: 'inherit', // TODO test with background
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
    <div style={{ display: 'flex', justifyContent: 'space-around', ...style }} {...props} />
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
  PhoneFlag: ({ style, variables, ...props }: any) => (
    <span style={{ display: 'flex', justifyContent: 'center', width: 30, ...style }} {...props} />
  ),
  PhonePrefix: ({ style, variables, ...props }: any) => (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 60,
        ...style,
      }}
      {...props}
    />
  ),
  PhoneSelect: ({ style, variables, ...props }: any) => (
    <select
      style={{ border: 'none', outline: 'none', background: 'none', width: 20, ...style }}
      {...props}
    />
  ),
  PhoneOption: ({ style, variables, ...props }: any) => <option style={style} {...props} />,
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
} as ComponentTypes
