// This file will be copied over to the demo app when running create-native-app.js.
import React from 'react'
import { SafeAreaView, StyleSheet, Text, View, Alert, TextInput, ScrollView } from 'react-native'
import { NativeForm, configure } from 'iltio'

configure({ token: 'demo' })

// const Section: React.FC<
//   PropsWithChildren<{
//     title: string;
//   }>
// > = ({children, title}) => {};

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
  borderWidth: 2,
  borderColor: variables.color,
  borderRadius: variables.borderRadius,
  marginBottom: variables.space,
  padding: variables.smallSpace,
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

const handleSuccess = (_: string, name: string) =>
  Alert.alert(`Successfully authenticated ${name}.`)

export default () => {
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
          onSuccess={handleSuccess}
        />
        <Text style={styles.description}>Custom UI Components</Text>
        <NativeForm onSuccess={handleSuccess} Components={{ Input: CustomInput }} />
      </ScrollView>
    </SafeAreaView>
  )
}
