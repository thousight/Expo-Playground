import { createDrawerNavigator, createAppContainer } from 'react-navigation'

import CheckboxPage from './Checkbox'

export default createAppContainer(
  createDrawerNavigator({
    CheckboxPage,
  }),
)
