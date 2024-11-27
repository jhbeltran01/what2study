import PropTypes from 'prop-types'
import React from 'react'
import * as constants from '@modules/reviewer/content/constants'
import Definition from './Definition'

function Title({title}) {
  const contents = title.content
  const isEnumerationTitle = title.t_type == constants.ENUMERATION_TITLE
  const isDefinition = title.t_type == constants.DEFINITION
  const isEnumerationContent = contents.length == 0 && isEnumerationTitle
  const isEnumerationTitleWithDefinition =  contents.length > 0 && isEnumerationTitle

  return (
<li
  className={`reviewer-title-item ${
    !isEnumerationContent ? '' : 'reviewer-title-item-no-margin'
  }`}
>
  <div>
    <p>{title.text}</p>
  </div>
  <ul className="reviewer-title-content">
    {contents.map(content => {
      if (isDefinition || isEnumerationTitleWithDefinition) {
        return <Definition definition={content} key={content.slug} />
      }
      return <Title title={content} key={content.slug} />
    })}
  </ul>
</li>


  )
}

Title.propTypes = {
  title: PropTypes.shape({
    text: PropTypes.string.isRequired,
    content: PropTypes.array.isRequired,
    t_type: PropTypes.string.isRequired
  }).isRequired
}

export default Title
