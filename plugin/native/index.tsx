import React from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { Authentication, Props, Styles, ComponentTypes } from 'iltio/react'
import type { NativeStyles, NativeVariables } from './types.js'

export { configure, Store, MemoryStorage } from '../store.js'
export { authenticate, poll, confirm, resend, authorize, logout, remove } from '../route.js'

export { NativeVariables as Variables, Styles, NativeStyles, ComponentTypes }

export { getNameType } from '../helper.js'

const nativeInputTypeMap = {
  email: 'email-address',
  tel: 'phone-pad',
  number: 'numeric',
}

type ComponentProps = { style?: StyleProp<ViewStyle & TextStyle>; variables: NativeVariables }

const NativeComponents = {
  Form: ({ style, ...props }: ComponentProps) => (
    <View style={[{ alignSelf: 'stretch' }, style]} {...props} />
  ),
  TabWrapper: ({ variables, style, ...props }: ComponentProps) => (
    <View
      style={[
        {
          flexDirection: 'row',
          marginBottom: variables.space,
          justifyContent: 'center',
        },
        style,
      ]}
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
    style?: { touchable?: StyleProp<ViewStyle>; text?: StyleProp<TextStyle> }
    active: boolean
    onClick: () => void
  }) => (
    <TouchableOpacity onPress={onClick} style={style.touchable}>
      <Text
        style={[
          {
            paddingHorizontal: variables.smallSpace,
            fontWeight: active ? 'bold' : 'normal',
          },
          style.text,
        ]}
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
    style?: { view?: StyleProp<ViewStyle>; input?: StyleProp<TextStyle> }
    type: string
    onChange: ({ target: { value } }: { target: { value: string } }) => void
  }) => (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: variables.color,
          borderRadius: variables.borderRadius,
          marginBottom: variables.space,
          paddingVertical: Platform.OS === 'android' ? 5 : variables.smallSpace,
          paddingHorizontal: variables.smallSpace,
          padding: 0,
        },
        style.view,
      ]}
    >
      <TextInput
        onChangeText={(value: string) => onChange({ target: { value } })}
        style={[
          {
            minWidth: 100,
            padding: 0, // Android
          },
          style.input,
        ]}
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
    style?: { touchable?: StyleProp<ViewStyle>; text?: StyleProp<TextStyle> }
    children: string
    onClick: () => void
  }) => (
    <TouchableOpacity
      style={[
        {
          backgroundColor: variables.color,
          borderRadius: variables.borderRadius,
        },
        style.touchable,
      ]}
      {...props}
      onPress={onClick}
    >
      <Text
        style={[
          {
            textAlign: 'center',
            color: variables.contrast,
            padding: variables.smallSpace,
          },
          style.text,
        ]}
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
    <Text style={[{ color: 'red', marginBottom: variables.space }, style]} {...props}>
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
    <Text
      style={[
        {
          backgroundColor: 'lightgray',
          padding: variables.smallSpace,
          marginBottom: variables.space,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  ),
  PhoneWrapper: ({ style, variables, ...props }: ComponentProps) => (
    <View
      style={[
        {
          flexDirection: 'column',
          borderWidth: 1,
          borderColor: variables.color,
          borderRadius: variables.borderRadius,
          marginBottom: variables.space,
          paddingHorizontal: variables.smallSpace,
        },
        style,
      ]}
      {...props}
    />
  ),
  PhoneTop: ({ style, variables, ...props }: ComponentProps) => (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
        },
        style,
      ]}
      {...props}
    />
  ),
  PhoneCountry: ({
    variables,
    style,
    prefix,
    flag,
    togglePicker,
    ...props
  }: ComponentProps & {
    style?: {
      touchable?: StyleProp<ViewStyle>
      flag?: StyleProp<TextStyle>
      prefix?: StyleProp<TextStyle>
    }
    prefix: string
    flag: string
    togglePicker: () => void
  }) => (
    <TouchableOpacity
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
        },
        style.touchable,
      ]}
      onPress={togglePicker}
      {...props}
    >
      <Text style={[{ marginRight: variables.smallSpace }, style.flag]}>{flag}</Text>
      <Text style={style.prefix}>{prefix}</Text>
    </TouchableOpacity>
  ),
  PhoneCountryOptions: ({
    variables,
    style,
    ...props
  }: ComponentProps & {
    style?: { wrapper?: StyleProp<ViewStyle>; content?: StyleProp<ViewStyle> }
  }) => (
    <ScrollView
      style={[{ height: 200, marginBottom: variables.smallSpace }, style.wrapper]}
      contentContainerStyle={[
        {
          display: 'flex',
          flexDirection: 'column',
          marginTop: variables.smallSpace,
        },
        style.content,
      ]}
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
    style?: { touchable?: StyleProp<ViewStyle>; text?: StyleProp<TextStyle> }
    selected: boolean
    children: string
    onSelect: () => void
  }) => (
    <TouchableOpacity
      style={[
        {
          marginBottom: variables.smallSpace,
        },
        style.touchable,
      ]}
      onPress={onSelect}
      {...props}
    >
      <Text style={[{ fontWeight: selected ? 'bold' : 'normal' }, style.text]} numberOfLines={1}>
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
    style?: StyleProp<TextStyle>
    type: string
    onChange: ({ target: { value } }: { target: { value: string } }) => void
  }) => (
    <TextInput
      onChangeText={(value: string) => onChange({ target: { value } })}
      style={[
        {
          minWidth: 100,
          paddingHorizontal: variables.smallSpace,
          paddingVertical: Platform.OS === 'android' ? 5 : variables.smallSpace,
        },
        style,
      ]}
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

  return <Authentication Components={NativeComponents} style={style as Styles} {...props} />
}
