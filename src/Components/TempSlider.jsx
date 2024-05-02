import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureEmpty,
  faTemperatureFull,
} from "@fortawesome/free-solid-svg-icons";
import { model, bulbs, apiKey } from "./config";
// import { model, bulbs, apiKey } from "./data";

function TempSlider(props) {
  //current temperature
  const [positionTemp, setPositionTemp] = useState(6500);
  //set timer to change temperature
  const [sliderTimer, setSliderTimer] = useState(null);

  //handle temperature change
  function handleTempChange(event) {
    const temperatureValue = parseInt(event.target.value);
    setPositionTemp(temperatureValue);

    const lampId = props.lampId;

    //remove previous timer
    if (sliderTimer) {
      clearTimeout(sliderTimer);
    }

    // new timer to update brightness after 1.5 sec
    const newTimeout = setTimeout(() => {
      //API call
      const lampTempData = {
        device: bulbs[lampId].device,
        model: model,
        cmd: {
          name: "colorTem",
          value: temperatureValue,
        },
      };

      const apiURL = `https://developer-api.govee.com/v1/devices/control`;
      const headers = {
        "Content-Type": "application/json",
        "Govee-API-Key": apiKey,
      };

      axios
        .put(apiURL, lampTempData, { headers })
        .then((response) => {
          console.log(
            `Temperature updated successfully for lamp ${props.lampId}:`,
            response.data
          );
        })
        .catch((error) => {
          console.error("Error updating temperature:", error);
        });
    }, 1500);
    setSliderTimer(newTimeout);
  }

  return (
    <div className="Slider">
      <div className="temperature-Slider">
        <FontAwesomeIcon
          icon={faTemperatureFull}
          aria-hidden="true"
          className="icons"
        />
        <input
          type="range"
          id="range"
          min="2700"
          max="6500"
          value={positionTemp}
          onChange={handleTempChange}
        ></input>
        <FontAwesomeIcon
          icon={faTemperatureEmpty}
          aria-hidden="true"
          className="icons"
        />
      </div>
    </div>
  );
}

export default TempSlider;
