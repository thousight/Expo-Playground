import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { ICheckboxProps, defaultProps } from './types'

class Checkbox extends PureComponent<ICheckboxProps> {
  static defaultProps = defaultProps

  render() {
    const { activeColor, onPress, checked, disabled } = this.props
    const color = disabled ? '#BEBEBE' : checked ? activeColor : '#808080'
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Animated.View
          style={[
            styles.container,
            {
              borderColor: color,
              backgroundColor: color,
            },
          ]}
        >
          <Ionicons name="md-checkmark" size={25} color="#FFFFFF" />
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderWidth: 1.5,
    borderRadius: 5,
  },
})

export default Checkbox
