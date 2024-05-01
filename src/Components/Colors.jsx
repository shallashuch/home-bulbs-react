import React, {useState} from "react";
import axios from "axios";
import { colorsRGB } from "./RGB";
import { model, bulbs, apiKey } from "./config";
// import { model, bulbs, apiKey } from "./data";

function Colors(props) {
  // set timer to avoid many requests
  const [isTimerActive, setIsTimerActive] = useState(false);

  // set timer with timeout
  function activateTimer() {
    setIsTimerActive(true);
    setTimeout(() => setIsTimerActive(false), 4000);
  }

  // handle color change
  function handleColorSelection(indexColor) {
    const { r, g, b } = colorsRGB[indexColor];

    const lampId = props.lampId;

    if (!isTimerActive) {
      //API call to change lamp color
      const lampColorsData = {
        device: bulbs[lampId].device,
        model: model,
        cmd: {
          name: "color",
          value: { r, g, b },
        },
      };

      const apiURL = `https://developer-api.govee.com/v1/devices/control`;
      const headers = {
        "Content-Type": "application/json",
        "Govee-API-Key": apiKey,
      };

      axios
        .put(apiURL, lampColorsData, { headers })
        .then((response) => console.log("Color set successfully:", response))
        .catch((error) => console.log("Error setting color:", error));

      activateTimer();
    } else {
      console.log("Too many requests. Please wait before toggling again.");
      alert("Please wait few seconds before trying again..");
    }
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
