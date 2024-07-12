import React from 'react'

const Input = ({type,value,onChange,placeholder,name}) => {
  return (
    <input
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    
    />
  )
}

export default Input
