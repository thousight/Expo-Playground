import * as React from 'react'
import { shallow } from 'enzyme'

import App from './App'

describe('App', () => {
  it('smoke test', () => {
    const rendered = shallow(<App />)
    expect(rendered).toBeDefined()
  })
})
