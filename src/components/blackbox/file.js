import React from 'react'

export default function File(props) {
  return (
    <a
        href={props.url}
        target="_blank"
        className='file'
    >
        {props.name}
    </a>
  )
}
