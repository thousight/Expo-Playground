import { ViewStyle, ViewProps } from 'react-native'

export interface ISwitchProps extends ViewProps {
  containerStyle?: ViewStyle
  circleStyle?: ViewStyle
  backgroundColor?: string
  activeColor?: string
  width: number
  height: number
  value: boolean
  disabled?: boolean
  onValueChange(value: boolean): any
}

export const defaultProps = {
  backgroundColor: '#F6F7FA',
  activeColor: '#66D0B1',
}
