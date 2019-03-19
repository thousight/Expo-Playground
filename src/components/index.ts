import { createDrawerNavigator, createAppContainer } from 'react-navigation'

import CheckboxPage from './Checkbox'
import SwitchPage from './Switch'

export default createAppContainer(
  createDrawerNavigator({
    SwitchPage,
    CheckboxPage,
  }),
)
