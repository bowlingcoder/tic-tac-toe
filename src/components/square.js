import React from 'react';
import Button from "react-bootstrap/Button";

export default function Square(props) {
  return (
    <Button variant="outline-info" className={props.flag} onClick={props.onClick}>
      {props.value}
    </Button>
  )
} 