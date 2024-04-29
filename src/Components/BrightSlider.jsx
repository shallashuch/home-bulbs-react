import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
// import { model, bulbs, apiKey } from "./config";
import { model, bulbs, apiKey } from "./data";

function BrightSlider(props) {
  const [positionBright, setPositionBright] = useState(props.brightness);

  useEffect(() => {
    // Questo aggiornerà positionBright ogni volta che props.brightness cambia
    setPositionBright(props.brightness);
  }, [props.brightness]);

  // handle change in bright
  function handleBrightChange(event) {
    const brightnessValue = parseInt(event.target.value);
    setPositionBright(brightnessValue);

    const lampId = props.lampId;

    const lampBrightData = {
      device: bulbs[lampId].device,
      model: model,
      cmd: {
        name: "brightness",
        value: brightnessValue,
      },
    };

    const apiURL = `https://developer-api.govee.com/v1/devices/control`;
    const headers = {
      "Content-Type": "application/json",
      "Govee-API-Key": apiKey,
    };

    axios
      .put(apiURL, lampBrightData, { headers })
      .then((response) => {
        console.log(
          `Brightness updated successfully for lamp ${props.lampId}:`,
          response.data
        );
      })
      .catch((error) => {
        console.error("Error updating brightness:", error);
      });
  }

  return (
    <div className="Slider">
      <div className="brightness-Slider">
        <FontAwesomeIcon icon={faMoon} aria-hidden="true" className="icons" />
        <input
          type="range"
          id="range"
          min="0"
          max="100"
          value={positionBright}
          onChange={handleBrightChange}
        ></input>
        <FontAwesomeIcon icon={faSun} aria-hidden="true" className="icons" />
      </div>
    </div>
  );
}

export default BrightSlider;
