// https://www.npmjs.com/package/react-native-phone-number-input
import React, { useState } from 'react'
import { Text, View, TextInput, TouchableOpacity, Platform } from 'react-native'
import { Form } from '../react'
import type { Props } from '../types'

const nativeInputTypeMap = {
  email: 'email-address',
  tel: 'phone-pad',
  number: 'numeric',
}

const NativeComponents = {
  Form: ({ ...props }) => <View {...props} />,
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
        flexDirection: 'row',
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
  PhoneFlag: () => null,
  PhonePrefix: ({ style, variables, ...props }: any) => (
    <Text
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
  // https://github.com/react-native-picker/picker
  PhoneSelect: ({ variables, style, ...props }: any) => {
    const open = useState(false)
    return (
      <View
        style={{
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: 5,
          borderRightWidth: 5,
          borderTopWidth: 10,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: variables.color,
        }}
        {...props}
      />
    )
  },
  PhoneOption: ({ ...props }) => <View />,
  PhoneInput: ({ style, variables, onChange, type, ...props }: any) => (
    <TextInput
      onChangeText={(value: string) => onChange({ target: { value } })}
      style={{
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
