// https://www.npmjs.com/package/react-native-phone-number-input
import React from 'react'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'
import { Form, Props } from '../index'

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
        padding: variables.smallSpace,
      }}
    >
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
  PhoneWrapper: ({ ...props }) => <View {...props} />,
  PhoneFlag: ({ ...props }) => <View {...props} />,
  PhonePrefix: ({ ...props }) => <View {...props} />,
  PhoneSelect: ({ ...props }) => <View {...props} />,
  PhoneOption: ({ ...props }) => <View {...props} />,
  PhoneInput: ({ ...props }) => <View {...props} />,
}

export function NativeForm({ Components, ...props }: Props) {
  // The only difference to the regular form is the UI, for which we use native components.
  Object.assign(NativeComponents, Components)

  return <Form Components={NativeComponents} {...props} />
}
