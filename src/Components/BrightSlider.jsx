import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { model, bulbs, apiKey } from "./config";
// import { model, bulbs, apiKey } from "./data";

function BrightSlider(props) {
  //current brightness
  const [positionBright, setPositionBright] = useState(props.brightness);
  //set timer to change brightness
  const [sliderTimer, setSliderTimer] = useState(null);

  useEffect(() => {
    // update brightness when props.brightness change
    setPositionBright(props.brightness);
  }, [props.brightness]);

  // handle brightness change
  function handleBrightChange(event) {
    const brightnessValue = parseInt(event.target.value);
    setPositionBright(brightnessValue);

    const lampId = props.lampId;

    //remove previous timer
    if (sliderTimer) {
      clearTimeout(sliderTimer);
    }

    // new timer to update brightness after 1.5 sec
    const newTimeout = setTimeout(() => {

      //API call
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
    }, 1500);
    setSliderTimer(newTimeout);
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
