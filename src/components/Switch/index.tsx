import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import Switch from './Switch'

const SwitchPage = () => (
  <View style={styles.container}>
    <Text>Switch</Text>
    <Switch width={50} height={30} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default SwitchPage
