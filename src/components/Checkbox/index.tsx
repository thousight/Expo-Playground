import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import Checkbox from './Checkbox'

const CheckboxPage = () => (
  <View style={styles.container}>
    <Text>Checkbox</Text>
    <Checkbox />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default CheckboxPage
