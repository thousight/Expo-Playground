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

  circleX = new Animated.ValueXY()

  circleAnimation = new Animated.Value(0)

  backgroundAnimation = new Animated.Value(0)

  state = {
    isOn: false,
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        { dx: this.circleX.x, dy: this.circleX.y },
      ]),
    })
  }

  toggle = () =>
    this.setState(
      ({ isOn }) => ({ isOn: !isOn }),
      () => {
        const { isOn } = this.state

        Animated.parallel([
          Animated.timing(this.backgroundAnimation, animationConfigs(isOn)),
          Animated.timing(this.circleAnimation, animationConfigs(isOn)),
        ]).start()
      },
    )

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
    const circleTransofrm = this.circleX.getTranslateTransform()

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
              opacity: this.backgroundAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
        />

        <TouchableWithoutFeedback onPress={this.toggle}>
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[
              styles.circle,
              circleStyle,
              {
                maxWidth: circleHeight,
                maxHeight: circleHeight,
                transform: circleTransofrm,
              },
            ]}
          />
        </TouchableWithoutFeedback>
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
