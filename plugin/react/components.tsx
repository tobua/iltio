import { Variables } from 'iltio'
import {
  ButtonProps,
  InputProps,
  FormProps,
  TabWrapperProps,
  TabProps,
  ErrorProps,
  MessageProps,
  ComponentTypes,
  Styles,
} from './types'

type ComponentProps = { style?: Styles; variables: Variables }

export const components = {
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
        borderColor: valid ? variables.color : variables.colorError,
        padding: 9,
        outline: 'none',
        borderRadius: variables.borderRadius,
        fontSize: variables.fontSize,
        fontFamily: variables.fontFamily,
        backgroundColor: 'inherit',
        color: variables.textColor,
        ...style,
      }}
      {...props}
    />
  ),
  Error: ({ style, variables, children, ...props }: ErrorProps) => (
    <p
      style={{
        color: variables.colorError,
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
        color: variables.textColor,
        ...style,
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
        borderColor: valid ? variables.color : variables.colorError,
        borderRadius: variables.borderRadius,
        paddingLeft: variables.smallSpace,
        ...style,
      }}
      {...props}
    />
  ),
  PhoneTop: ({ style, variables, ...props }: any) => (
    <div style={{ display: 'flex', ...style }} {...props} />
  ),
  PhoneCountry: ({
    variables,
    prefix,
    flag,
    togglePicker,
    style,
    ...props
  }: ComponentProps & {
    prefix: string
    flag: string
    togglePicker: () => void
    style: Styles['phoneCountry']
  }) => (
    <button
      style={{
        display: 'flex',
        gap: variables.smallSpace,
        alignItems: 'center',
        border: 'none',
        background: 'none',
        outline: 'none',
        padding: 0,
        cursor: 'pointer',
        fontSize: variables.fontSize,
        fontFamily: variables.fontFamily,
        ...style.button,
      }}
      type="button"
      onClick={togglePicker}
      {...props}
    >
      <span
        style={{ fontSize: variables.fontSize, fontFamily: variables.fontFamily, ...style.flag }}
      >
        {flag}
      </span>
      <span
        style={{
          fontSize: variables.fontSize,
          fontFamily: variables.fontFamily,
          color: variables.textColor,
          ...style.prefix,
        }}
      >
        {prefix}
      </span>
    </button>
  ),
  PhoneInput: ({
    variables,
    valid,
    style,
    ...props
  }: ComponentProps & {
    valid: boolean
    style: Styles['phoneInput']
  }) => (
    <input
      style={{
        background: 'none',
        border: 'none',
        padding: 9,
        outline: 'none',
        width: '100%',
        fontSize: variables.fontSize,
        fontFamily: variables.fontFamily,
        borderColor: valid ? variables.color : variables.colorError,
        color: variables.textColor,
        ...style,
      }}
      {...props}
    />
  ),
  PhoneCountryOptions: ({ style, variables, ...props }: any) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 200,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: variables.smallSpace,
        paddingBottom: variables.smallSpace,
        rowGap: 5,
        ...style,
      }}
      {...props}
    />
  ),
  PhoneCountryOption: ({ variables, style, selected, children, onSelect, ...props }: any) => (
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
        ...style.button,
      }}
      onClick={onSelect}
      type="button"
      {...props}
    >
      <span
        style={{
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          ...style.text,
        }}
      >
        {children}
      </span>
    </button>
  ),
  CodeInputWrapper: ({ style, ...props }: TabWrapperProps) => (
    <div
      style={{ display: 'flex', flexDirection: 'column', position: 'relative', ...style }}
      {...props}
    />
  ),
  Loader: ({ style, variables, rotate = true, ...props }: any) => (
    <svg
      style={{
        width: variables.space,
        height: variables.space,
        position: 'absolute',
        right: variables.space,
        top: '50%',
        transform: 'translateY(-50%)',
        ...style,
      }}
      viewBox="0 0 50 50"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.7915 44.2353C36.0298 43.0573 36.4012 41.4938 37.4959 40.6167C42.0705 36.9515 45 31.3179 45 25C45 13.9543 36.0457 5 25 5C13.9543 5 5 13.9543 5 25C5 31.3179 7.92945 36.9515 12.5041 40.6167C13.5989 41.4938 13.9702 43.0573 13.2085 44.2353V44.2353C12.4716 45.3748 10.9497 45.7256 9.87005 44.9036C3.87179 40.3369 0 33.1206 0 25C0 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25C50 33.1206 46.1282 40.3369 40.1299 44.9036C39.0503 45.7256 37.5284 45.3748 36.7915 44.2353V44.2353Z"
        fill={variables.color}
      >
        <animateTransform
          attributeName="transform"
          attributeType="xml"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1s"
          repeatCount={rotate ? 'indefinite' : 0}
        />
      </path>
    </svg>
  ),
} as ComponentTypes
