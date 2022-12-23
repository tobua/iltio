// https://www.npmjs.com/package/react-native-phone-number-input
import React from 'react'
import { Text, View, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { Form } from '../react'
import type { Props } from '../types'

const nativeInputTypeMap = {
  email: 'email-address',
  tel: 'phone-pad',
  number: 'numeric',
}

const NativeComponents = {
  Form: ({ style, ...props }) => <View style={{ alignSelf: 'stretch', ...style }} {...props} />,
  TabWrapper: ({ variables, style, ...props }: any) => (
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
  Tab: ({ variables, style, active, onClick, ...props }: any) => (
    <TouchableOpacity onPress={onClick}>
      <Text
        style={{
          paddingHorizontal: variables.smallSpace,
          fontWeight: active ? 'bold' : 'normal',
          ...style,
        }}
        {...props}
      />
    </TouchableOpacity>
  ),
  Input: ({ variables, style, onChange, type, ...props }: any) => (
    <View
      style={{
        borderWidth: 1,
        borderColor: variables.color,
        borderRadius: variables.borderRadius,
        marginBottom: variables.space,
        paddingVertical: Platform.OS === 'android' ? 5 : variables.smallSpace,
        paddingHorizontal: variables.smallSpace,
      }}
    >
      <TextInput
        onChangeText={(value: string) => onChange({ target: { value } })}
        style={{
          minWidth: 100,
          padding: 0, // Android
          ...style,
        }}
        keyboardType={nativeInputTypeMap[type]}
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
    </View>
  ),
  Button: ({ variables, style, onClick, children, ...props }: any) => (
    <TouchableOpacity
      style={{ backgroundColor: variables.color, ...style }}
      {...props}
      onPress={onClick}
    >
      <Text
        style={{
          textAlign: 'center',
          color: variables.contrast,
          padding: variables.smallSpace,
          borderRadius: variables.borderRadius,
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  ),
  Error: ({ style, variables, children, ...props }: any) => (
    <Text style={{ color: 'red', marginBottom: variables.space, ...style }} {...props}>
      {children}
    </Text>
  ),
  Message: ({ style, variables, children, ...props }: any) => (
    <Text style={{ marginBottom: variables.space, ...style }} {...props}>
      {children}
    </Text>
  ),
  PhoneWrapper: ({ style, variables, ...props }: any) => (
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
  PhoneTop: ({ style, variables, ...props }: any) => (
    <View style={{ flexDirection: 'row' }} {...props} />
  ),
  PhoneCountry: ({ variables, prefix, flag, togglePicker, ...props }: any) => (
    <TouchableOpacity
      style={{
        display: 'flex',
        flexDirection: 'row',
        marginRight: variables.smallSpace,
      }}
      onPress={togglePicker}
      {...props}
    >
      <Text style={{ marginRight: variables.smallSpace }}>{flag}</Text>
      <Text>{prefix}</Text>
    </TouchableOpacity>
  ),
  PhoneCountryOptions: ({ variables, ...props }: any) => (
    <View style={{ height: 200 }}>
      <ScrollView
        contentContainerStyle={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: variables.smallSpace,
        }}
        {...props}
      />
    </View>
  ),
  PhoneCountryOption: ({ variables, selected, children, onSelect, ...props }: any) => (
    <TouchableOpacity
      style={{
        marginBottom: variables.smallSpace,
      }}
      onPress={onSelect}
      {...props}
    >
      <Text style={{ fontWeight: selected ? 'bold' : 'normal' }} numberOfLines={1}>
        {children}
      </Text>
    </TouchableOpacity>
  ),
  PhoneInput: ({ style, variables, onChange, type, ...props }: any) => (
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

const getCountryLocation = (initialCountryCode?: string) => {
  if (initialCountryCode) {
    return initialCountryCode
  }

  // https://www.npmjs.com/package/react-native-device-country

  return 'us'
}

export function NativeForm({ Components, initialCountryCode, ...props }: Props) {
  // The only difference to the regular form is the UI, for which we use native components.
  Object.assign(NativeComponents, Components)

  return (
    <Form
      Components={NativeComponents}
      initialCountryCode={getCountryLocation(initialCountryCode)}
      {...props}
    />
  )
}
