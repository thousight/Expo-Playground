import React, { Component } from 'react'
import {
  View,
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

const animationConfigs = (isPressed: boolean) => ({
  duration: 130,
  easing: Easing.inOut(Easing.linear),
  toValue: isPressed ? 1 : 0,
  useNativeDriver: true,
})

class Switch extends Component<ISwitchProps, ISwitchStates> {
  static defaultProps = defaultProps

  panResponder = null

  boundary = this.props.width - this.props.height

  circleDirection = new Animated.Value(-1 * this.boundary)

  circleSize = new Animated.Value(0)

  prevDirection = -1 * this.boundary

  state = {
    isOn: false,
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () =>
        Animated.timing(this.circleSize, animationConfigs(true)).start(),
      onPanResponderMove: Animated.event([null, { dx: this.circleDirection }]),
      onPanResponderRelease: () => {
        const direction = this.getCircleDirection()
        let toValue = 0

        if (direction === this.prevDirection) {
          toValue = (direction > 0 ? -1 : 1) * this.boundary
          return Animated.parallel([
            Animated.spring(this.circleDirection, {
              toValue,
              overshootClamping: true,
              useNativeDriver: true,
            }),
            Animated.timing(this.circleSize, animationConfigs(false)),
          ]).start(() => this.onAnimationFinished(toValue, !this.state.isOn))
        }

        const isGoingLeft =
          (direction < 0 ? this.boundary : 0) + direction < this.boundary / 2
        toValue = (isGoingLeft ? -1 : 1) * this.boundary

        Animated.parallel([
          Animated.spring(this.circleDirection, {
            toValue,
            overshootClamping: true,
            useNativeDriver: true,
          }),
          Animated.timing(this.circleSize, animationConfigs(false)),
        ]).start(() => this.onAnimationFinished(toValue, !isGoingLeft))
      },
    })
  }

  onAnimationFinished = (toValue: number, isOn: boolean) => {
    this.circleDirection.setValue(toValue)
    this.prevDirection = toValue
    this.setState({ isOn })
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
    const maxCircleSize = height - (circleMargin * 2 + 1)
    const circleSize = this.circleSize.interpolate({
      inputRange: [0, 1],
      outputRange: [
        maxCircleSize / maxCircleSize,
        (height - (circleMargin * 2.5 + 1)) / maxCircleSize,
      ],
      extrapolate: 'clamp',
    })

    const direction = this.getCircleDirection()
    const circlePosition = this.circleDirection.interpolate({
      inputRange: direction < 0 ? [0, this.boundary] : [-1 * this.boundary, 0],
      outputRange: [0, this.boundary],
      extrapolate: 'clamp',
    })

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
              opacity: Animated.divide(
                circlePosition,
                this.boundary,
              ).interpolate({
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
              maxWidth: maxCircleSize,
              maxHeight: maxCircleSize,
              transform: [
                { translateX: circlePosition },
                { scaleX: circleSize },
                { scaleY: circleSize },
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
    margin: 3.5,
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
