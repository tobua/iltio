// This file will be copied over to the demo app when running create-native-app.js.
import React, { useMemo } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { getCountry } from 'react-native-localize'
import { NativeForm, configure } from 'iltio/dist/native/index.js'

configure({ token: 'demo' })

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginVertical: 20,
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  description: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 20,
  },
  inputElement: {
    padding: 0, // Android
  },
})

const inputWrapperStyles = (variables: any) => ({
  borderWidth: 0,
  borderBottomWidth: 1,
  borderColor: variables.color,
  borderRadius: variables.borderRadius,
  marginBottom: variables.space,
  paddingVertical: variables.smallSpace,
})

const CustomInput = ({ variables, style, onChange, type, ...props }: any) => (
  <View style={inputWrapperStyles(variables)}>
    <TextInput
      onChangeText={(value: string) => onChange({ target: { value } })}
      style={{
        ...styles.inputElement,
        ...style,
      }}
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
    />
  </View>
)

const CustomButton = ({ variables, style, onClick, children, ...props }: any) => (
  <TouchableOpacity
    style={{
      backgroundColor: variables.color,
      borderRadius: 5,
      ...style,
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
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'android' ? 'serif' : 'Times New Roman',
      }}
    >
      {children}
    </Text>
  </TouchableOpacity>
)

const CustomPhoneWrapper = ({ style, variables, ...props }: any) => (
  <View
    style={{
      flexDirection: 'column',
      borderWidth: 0,
      borderColor: variables.color,
      borderRadius: variables.borderRadius,
      marginBottom: variables.space,
      ...style,
    }}
    {...props}
  />
)

const CustomPhoneTop = ({ style, variables, ...props }: any) => (
  <View
    style={{
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: variables.color,
      paddingVertical: variables.smallSpace,
    }}
    {...props}
  />
)

const handleSuccess = (_: string, name: string) =>
  Alert.alert(`Successfully authenticated ${name}.`)

export default () => {
  const country = useMemo(() => getCountry() ?? 'us', [])

  return (
    <SafeAreaView style={styles.wrapper}>
      <Text style={styles.title}>iltio Native Authentication</Text>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.description}>Without Customization</Text>
        <NativeForm onSuccess={handleSuccess} />
        <Text style={styles.description}>Various Customizations</Text>
        <NativeForm
          allowMail={false}
          variables={{ color: 'blue', borderRadius: 10 }}
          labels={{ submit: 'Register or Login' }}
          initialCountryCode={country}
          onSuccess={handleSuccess}
        />
        <Text style={styles.description}>Custom UI Components</Text>
        <NativeForm
          onSuccess={handleSuccess}
          Components={{
            Input: CustomInput,
            Button: CustomButton,
            PhoneWrapper: CustomPhoneWrapper,
            PhoneTop: CustomPhoneTop,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
