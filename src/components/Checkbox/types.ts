export interface ICheckboxProps {
  checked: boolean
  disabled?: boolean
  activeColor: string
  onPress?(): void
}

export const defaultProps = {
  onPress: () => null,
  activeColor: '#15CBF2',
  checked: false,
  disabled: false,
}
