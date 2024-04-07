import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

function LampButton(props) {
  let rgbColor = `rgb(${props.color.r}, ${props.color.g}, ${props.color.b})`;

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
