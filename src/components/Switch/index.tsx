import React, { Component } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'

import Switch from './Switch'

class SwitchPage extends Component {
  state = {
    isOn: false,
  }
  render() {
    const { isOn } = this.state
    return (
      <View style={styles.container}>
        <Text>Switch: {isOn ? 'on' : 'off'}</Text>
        <Switch
          width={50}
          height={30}
          onValueChange={isOn => this.setState({ isOn })}
          value={isOn}
          disabled={false}
        />
        <Button
          title=" Toggle "
          onPress={() => this.setState({ isOn: !isOn })}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default SwitchPage
