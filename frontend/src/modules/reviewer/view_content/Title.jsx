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
    <li className={`px-[1em] ${!isEnumerationContent && 'mb-[1rem]'}`}>
      <div>
        <p>{title.text}</p>
      </div>
      
      <ul>
        {contents.map(content => {
            console.log(title.t_type)
            if (isDefinition || isEnumerationTitleWithDefinition) {
              return <Definition definition={content} />
            }
            
            return (
              <Title title={content} />
            )
        })}
      </ul>
    </li>
  )
}

Title.propTypes = {
  title: PropTypes.shape({
    text: PropTypes.string.isRequired,
  }).isRequired
}

export default Title
