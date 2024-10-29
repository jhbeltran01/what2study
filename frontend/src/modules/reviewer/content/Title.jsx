import PropTypes from 'prop-types'
import React from 'react'
import * as constants from './constants'
import Definition from './Definition'

function Title({title}) {
  const content = title.content;
  const isEnumerationAnswer = title.type === constants.ENUMERATION_TITLE

  return (
    <li className={`${!isEnumerationAnswer && 'm-[1rem]'}`}>
      <p>{title.text}</p>
      <ul className='px-[1em]'>
        {content.map((content, index) => {
          switch(title.type) {
            case constants.DEFINITION:
            case constants.ENUMERATION_TITLE:
              return <Definition definition={content} key={index}/>
            case constants.ENUMERATION:
              return <Title title={content} key={index} />
          }
        })}
      </ul>
    </li>
  )
}

Title.propTypes = {
  title: PropTypes.shape({
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    content: PropTypes.array.isRequired,
  }).isRequired
}
export default Title
