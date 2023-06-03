import React, {useEffect, useRef} from 'react'

export default function File(props) {

  const btn = useRef();

  useEffect(() => {
      const rightClick = (e) => {
        //check for right click
        if (e.button === 2) {
          //check if within ref
          if (btn.current.contains(e.target)) {
            props.setId(props.id)
          }
        }
      }

      window.addEventListener("mousedown", rightClick);

      return () => {
        window.removeEventListener("mousedown", rightClick)
      };

  })

  return (
    <>
      <a
          href={props.url}
          target="_blank"
          rel='noreferrer'
          className='file'
          ref={btn}
          onContextMenu={(e) => e.preventDefault()}
      >
          {props.name}
      </a>
    </>
  )
}
