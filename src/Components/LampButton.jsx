import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

function LampButton(props) {
  const [rgbColor, setRgbColor] = useState(getRgbColor(props.color));

  // update rbg when props.color changes
  useEffect(() => {
    if (props.color) {
      setRgbColor(getRgbColor(props.color));
    }
  }, [props.color]);

  function getRgbColor(color) {
    return `rgb(${color?.r ?? 255}, ${color?.g?? 255}, ${color?.b?? 255})`;
  }
  
  return (
    <div className="LampButton">
      <button
        className="button-light"
        style={{
          backgroundImage: props.isToggle
            ? `radial-gradient(circle, ${rgbColor} 30%, rgba(234, 215, 187, 0.8) 80%)`
            : "radial-gradient(circle, #EAD7BB 30%, rgba(234, 215, 187, 0.8) 80%)",
        }}
        onClick={() => {
          props.toggleButton();
        }}
      >
        <FontAwesomeIcon icon={faLightbulb} aria-hidden="true" />
      </button>
    </div>
  );
}

export default LampButton;
