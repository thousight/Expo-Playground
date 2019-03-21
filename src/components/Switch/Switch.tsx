import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  ViewStyle,
  PanResponder,
  ViewProps,
} from 'react-native'

interface ISwitchProps extends ViewProps {
  containerStyle?: ViewStyle
  circleStyle?: ViewStyle
  backgroundColor?: string
  activeColor?: string
  width: number
  height: number
  value: boolean
  onValueChange(value: boolean): any
}

const defaultProps = {
  backgroundColor: '#F6F7FA',
  activeColor: '#66D0B1',
}

const animationConfigs = (isPressed: boolean) => ({
  duration: 130,
  easing: Easing.inOut(Easing.linear),
  toValue: isPressed ? 1 : 0,
  useNativeDriver: true,
})

class Switch extends Component<ISwitchProps> {
  static defaultProps = defaultProps

  panResponder = null

  boundary = this.props.width - this.props.height

  circleDirection = new Animated.Value(-1 * this.boundary)

  circleSize = new Animated.Value(0)

  prevDirection = -1 * this.boundary

  debounce = null

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: this.onCircleTapIn,
      onPanResponderMove: Animated.event([null, { dx: this.circleDirection }]),
      onPanResponderRelease: this.onCircleTapOut,
    })
  }

  shouldComponentUpdate(nextProps: ISwitchProps) {
    return nextProps.value !== this.props.value
  }

  componentDidUpdate(prevProps: ISwitchProps) {
    if (prevProps.value !== this.props.value) {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => this.toggle(this.props.value), 150)
    }
  }

  onCircleTapIn = () =>
    Animated.timing(this.circleSize, animationConfigs(true)).start()

  onCircleTapOut = () => {
    const direction = this.getCircleDirection()

    if (
      Platform.select({
        ios: direction === this.prevDirection,
        android: direction === 0,
      })
    ) {
      return this.toggle(!this.props.value)
    }

    const isGoingLeft =
      (direction < 0 ? this.boundary : 0) + direction < this.boundary / 2
    const toValue = (isGoingLeft ? -1 : 1) * this.boundary

    Animated.parallel([
      Animated.spring(this.circleDirection, {
        toValue,
        overshootClamping: true,
        useNativeDriver: true,
      }),
      Animated.timing(this.circleSize, animationConfigs(false)),
    ]).start(this.onAnimationFinished(toValue, !isGoingLeft))
  }

  onAnimationFinished = (animationToValue: number, newValue: boolean) => () => {
    this.circleDirection.setValue(animationToValue)
    this.prevDirection = animationToValue
    this.props.onValueChange(newValue)
  }

  toggle = (newValue: boolean) => {
    const toValue = (newValue ? 1 : -1) * this.boundary
    return Animated.parallel([
      Animated.spring(this.circleDirection, {
        toValue,
        overshootClamping: true,
        useNativeDriver: true,
      }),
      Animated.timing(this.circleSize, animationConfigs(false)),
    ]).start(this.onAnimationFinished(toValue, newValue))
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
      ...viewProps
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
        {...viewProps}
        style={[
          styles.container,
          containerStyle,
          {
            backgroundColor,
            width,
            height,
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
        marginTop: 3,
      },
    }),
  },
})

export default Switch
