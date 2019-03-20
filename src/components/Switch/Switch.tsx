import React, { Component } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  ViewStyle,
  PanResponder,
} from 'react-native'

interface ISwitchProps {
  containerStyle?: ViewStyle
  circleStyle?: ViewStyle
  backgroundColor?: string
  activeColor?: string
  width: number
  height: number
}

const defaultProps = {
  backgroundColor: '#F6F7FA',
  activeColor: '#66D0B1',
}

interface ISwitchStates {
  isOn: boolean
}

const animationConfigs = (isOn: boolean) => ({
  duration: 130,
  easing: Easing.inOut(Easing.linear),
  toValue: isOn ? 1 : 0,
  isInteraction: false,
  useNativeDriver: true,
})

class Switch extends Component<ISwitchProps, ISwitchStates> {
  static defaultProps = defaultProps

  panResponder = null

  circleDirection = new Animated.Value(0)

  state = {
    isOn: false,
  }

  componentWillMount() {
    const { width, height } = this.props
    const boundary = width - height
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => console.log('onPanResponderGrant'),
      onPanResponderMove: Animated.event([null, { dx: this.circleDirection }]),
      onPanResponderRelease: () => {
        const direction = this.getCircleDirection()
        const position = boundary + direction
        let toValue = position < boundary / 2 ? 0 : boundary

        if (direction < 0) {
          toValue = position < boundary / 2 ? -1 * boundary : 0
        }

        Animated.spring(this.circleDirection, {
          toValue,
          friction: 10,
          useNativeDriver: true,
        }).start(() => this.setState({ isOn: toValue === boundary }))
      },
    })
  }

  getCircleDirection = (): number => (this.circleDirection as any)._value

  render() {
    const {
      containerStyle,
      circleStyle = {},
      backgroundColor,
      activeColor,
      width,
      height,
    } = this.props
    const circleMargin = circleStyle.margin
      ? parseFloat(circleStyle.margin.toString())
      : styles.circle.margin
    const circleHeight = height - (circleMargin * 2 + 1)

    const boundary = width - height
    const circlePosition = this.circleDirection.interpolate({
      inputRange:
        this.getCircleDirection() >= 0 ? [0, boundary] : [-1 * boundary, 0],
      outputRange: [0, boundary],
      extrapolate: 'clamp',
    })
    const backgroundOpacity = Animated.divide(circlePosition, boundary)

    return (
      <View
        style={[
          styles.container,
          containerStyle,
          {
            backgroundColor,
            width,
            maxHeight: height,
            borderRadius: height,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.activeBackground,
            {
              backgroundColor: activeColor,
              borderRadius: height,
              opacity: backgroundOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />

        <Animated.View
          {...this.panResponder.panHandlers}
          style={[
            styles.circle,
            circleStyle,
            {
              maxWidth: circleHeight,
              maxHeight: circleHeight,
              transform: [
                {
                  translateX: circlePosition,
                },
              ],
            },
          ]}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#EFEEF0',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  activeBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  circle: {
    margin: 3,
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#333333',
        shadowOpacity: 0.25,
        shadowRadius: 1,
        shadowOffset: {
          height: 1,
          width: 0,
        },
      },
      android: {
        elevation: 2,
      },
    }),
  },
})

export default Switch
