import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button';

const Hello = props => (
  <Button variant="primary">Hello {props.name}!</Button>
)

Hello.defaultProps = {
  name: 'David'
}

Hello.propTypes = {
  name: PropTypes.string
}

document.addEventListener('DOMContentLoaded', () => {
  render(
    <Hello name="React" />,
    document.body.appendChild(document.createElement('main')),
  )
})
