import React, { CSSProperties } from 'react'
import { Text, View, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { Form } from '../react'
import type { Props, NativeStyles, Variables, Styles } from '../types'

const nativeInputTypeMap = {
  email: 'email-address',
  tel: 'phone-pad',
  number: 'numeric',
}

type ComponentProps = { style?: CSSProperties; variables: Variables }

const NativeComponents = {
  Form: ({ style, ...props }: ComponentProps) => (
    <View style={{ alignSelf: 'stretch', ...style }} {...props} />
  ),
  TabWrapper: ({ variables, style, ...props }: ComponentProps) => (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: variables.space,
        justifyContent: 'center',
        ...style,
      }}
      {...props}
    />
  ),
  Tab: ({
    variables,
    style,
    active,
    onClick,
    ...props
  }: ComponentProps & {
    style?: { touchable?: CSSProperties; text?: CSSProperties }
    active: boolean
    onClick: () => void
  }) => (
    <TouchableOpacity onPress={onClick} style={style.touchable}>
      <Text
        style={{
          paddingHorizontal: variables.smallSpace,
          fontWeight: active ? 'bold' : 'normal',
          ...style.text,
        }}
        {...props}
      />
    </TouchableOpacity>
  ),
  Input: ({
    variables,
    style,
    onChange,
    type,
    ...props
  }: ComponentProps & {
    style?: { view?: CSSProperties; input?: CSSProperties }
    type: string
    onChange: ({ target: { value } }: { target: { value: string } }) => void
  }) => (
    <View
      style={{
        borderWidth: 1,
        borderColor: variables.color,
        borderRadius: variables.borderRadius,
        marginBottom: variables.space,
        paddingVertical: Platform.OS === 'android' ? 5 : variables.smallSpace,
        paddingHorizontal: variables.smallSpace,
        ...style.view,
      }}
    >
      <TextInput
        onChangeText={(value: string) => onChange({ target: { value } })}
        style={{
          minWidth: 100,
          padding: 0, // Android
          ...style.input,
        }}
        keyboardType={nativeInputTypeMap[type]}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
    </View>
  ),
  Button: ({
    variables,
    style,
    onClick,
    children,
    ...props
  }: ComponentProps & {
    style?: { touchable?: CSSProperties; text?: CSSProperties }
    children: string
    onClick: () => void
  }) => (
    <TouchableOpacity
      style={{
        backgroundColor: variables.color,
        borderRadius: variables.borderRadius,
        ...style.touchable,
      }}
      {...props}
      onPress={onClick}
    >
      <Text
        style={{
          textAlign: 'center',
          color: variables.contrast,
          padding: variables.smallSpace,
          borderRadius: variables.borderRadius,
          ...style.text,
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  ),
  Error: ({
    style,
    variables,
    children,
    ...props
  }: ComponentProps & {
    children: string
  }) => (
    <Text style={{ color: 'red', marginBottom: variables.space, ...style }} {...props}>
      {children}
    </Text>
  ),
  Message: ({
    style,
    variables,
    children,
    ...props
  }: ComponentProps & {
    children: string
  }) => (
    <Text style={{ marginBottom: variables.space, ...style }} {...props}>
      {children}
    </Text>
  ),
  PhoneWrapper: ({ style, variables, ...props }: ComponentProps) => (
    <View
      style={{
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: variables.color,
        borderRadius: variables.borderRadius,
        marginBottom: variables.space,
        padding: variables.smallSpace,
        ...style,
      }}
      {...props}
    />
  ),
  PhoneTop: ({ style, variables, ...props }: ComponentProps) => (
    <View style={{ flexDirection: 'row' }} {...props} />
  ),
  PhoneCountry: ({
    variables,
    style,
    prefix,
    flag,
    togglePicker,
    ...props
  }: ComponentProps & {
    style?: { touchable?: CSSProperties; flag?: CSSProperties; prefix?: CSSProperties }
    prefix: string
    flag: string
    togglePicker: () => void
  }) => (
    <TouchableOpacity
      style={{
        display: 'flex',
        flexDirection: 'row',
        marginRight: variables.smallSpace,
        ...style.touchable,
      }}
      onPress={togglePicker}
      {...props}
    >
      <Text style={{ marginRight: variables.smallSpace, ...style.flag }}>{flag}</Text>
      <Text style={style.prefix}>{prefix}</Text>
    </TouchableOpacity>
  ),
  PhoneCountryOptions: ({
    variables,
    style,
    ...props
  }: ComponentProps & {
    style?: { wrapper?: CSSProperties; content?: any }
  }) => (
    <ScrollView
      style={{ height: 200, ...style.wrapper }}
      contentContainerStyle={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: variables.smallSpace,
        ...style.content,
      }}
      {...props}
    />
  ),
  PhoneCountryOption: ({
    variables,
    style,
    selected,
    children,
    onSelect,
    ...props
  }: ComponentProps & {
    style?: { touchable?: CSSProperties; text?: CSSProperties }
    selected: boolean
    children: string
    onSelect: () => void
  }) => (
    <TouchableOpacity
      style={{
        marginBottom: variables.smallSpace,
        ...style.touchable,
      }}
      onPress={onSelect}
      {...props}
    >
      <Text style={{ fontWeight: selected ? 'bold' : 'normal', ...style.text }} numberOfLines={1}>
        {children}
      </Text>
    </TouchableOpacity>
  ),
  PhoneInput: ({
    style,
    variables,
    onChange,
    type,
    ...props
  }: ComponentProps & {
    style?: CSSProperties
    type: string
    onChange: ({ target: { value } }: { target: { value: string } }) => void
  }) => (
    <TextInput
      onChangeText={(value: string) => onChange({ target: { value } })}
      style={{
        minWidth: 100,
        ...style,
      }}
      keyboardType={nativeInputTypeMap[type]}
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
    />
  ),
}

export function NativeForm({
  Components,
  style,
  ...props
}: Omit<Props, 'style'> & { style?: NativeStyles }) {
  // The only difference to the regular form is the UI, for which we use native components.
  Object.assign(NativeComponents, Components)
  // eslint-disable-next-line no-param-reassign
  style = {
    tab: {},
    button: {},
    phoneCountry: {},
    phoneCountryOptions: {},
    phoneCountryOption: {},
    inputMail: {},
    inputCode: {},
    phoneInputCountrySearch: {},
    ...style,
  }

  return <Form Components={NativeComponents} style={style as Styles} {...props} />
}
