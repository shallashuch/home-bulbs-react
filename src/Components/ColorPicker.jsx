import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import Colors from "./Colors";

function ColorPicker(props) {
  return (
    <div className="colorPicker">
      <FontAwesomeIcon icon={faPalette} aria-hidden="true" id="paletteIcon" />
      <Colors
        lampId={props.lampId}
        color={props.color}
        isTimerActive={props.isTimerActive}
        activateTimer={props.activateTimer}
        onColorChange={props.onColorChange}
      />
    </div>
  );
}

export default ColorPicker;
