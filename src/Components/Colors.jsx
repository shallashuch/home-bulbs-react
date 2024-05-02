import React from "react";
import { colorsRGB } from "./RGB";

function Colors(props) {
  // handle color change with the props function
  function handleColorSelection(indexColor) {
    const { r, g, b } = colorsRGB[indexColor];
    const newColor = { r, g, b };
    props.onColorChange(props.lampId, newColor);
  }

  //variable for every single color available
  const colorContainers = colorsRGB.map((color, index) => (
    <div
      className="single-color-container"
      key={index}
      id={color.id}
      onClick={() => {
        handleColorSelection(index);
      }}
      style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
    ></div>
  ));

  return (
    <div className={`Colors ${props.visible ? "visible" : "hidden"}`}>
      <div className="colorChoice-container">{colorContainers}</div>
    </div>
  );
}

export default Colors;
