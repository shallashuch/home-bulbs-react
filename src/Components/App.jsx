import React, { useState, useEffect } from "react";
import axios from "axios";
import LampButton from "./LampButton";
import ColorPicker from "./ColorPicker";
import BrightSlider from "./BrightSlider";
import TempSlider from "./TempSlider";
import RoomItem from "./RoomItem";
import "./scss/App.scss";

import { model, bulbs, apiKey } from "./config";
// import { model, bulbs, apiKey } from "./data";

function App() {
  //bulbs state: active, brightness and color
  let [lampStates, setLampStates] = useState({
    lamp1: { isOn: false, brightness: 100, color: { r: 255, g: 255, b: 255 } },
    lamp2: { isOn: false, brightness: 100, color: { r: 255, g: 255, b: 255 } },
    lamp3: { isOn: false, brightness: 100, color: { r: 255, g: 255, b: 255 } },
  });
  // current active lamp
  const [activeLamp, setActiveLamp] = useState("lamp1");
  //current room selected
  const [selectedRoom, setSelectedRoom] = useState("lamp1");
  // set timer to avoid many requests
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    // asyncronous function to fetch data from API call
    const fetchLampState = async (lampKey) => {
      const deviceId = bulbs[lampKey].device;

      const apiURL = `https://developer-api.govee.com/v1/devices/state?device=${encodeURIComponent(
        deviceId
      )}&model=${model}`;
      try {
        const response = await axios.get(apiURL, {
          headers: { "Govee-API-Key": apiKey },
        });
        // get properties for every bulb in single object
        const { properties } = response.data.data;
        const newState = properties.reduce((acc, property) => {
          return { ...acc, ...property };
        }, {});

        //update specific lamp state
        setLampStates((prevStates) => ({
          ...prevStates,
          [lampKey]: {
            ...prevStates[lampKey],
            isOn: newState.powerState === "on",
            brightness: newState.brightness || prevStates[lampKey].brightness,
            color: newState.color
              ? { ...newState.color }
              : { ...prevStates[lampKey].color },
          },
        }));
      } catch (error) {
        console.error(`Error fetching state for ${lampKey}:`, error);
      }
    };
    // do fetchLampState for each lamp
    Object.keys(bulbs).forEach((bulb) => {
      fetchLampState(bulb);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set timer with timeout
  function activateTimer() {
    setIsTimerActive(true);
    setTimeout(() => setIsTimerActive(false), 4000);
  }

  // toggle lamp-button to set active lamp
  function toggleButton(lampId, newColor) {
    const currentState = lampStates[lampId].isOn;

    //if time is active set lamp status and make API call
    if (!isTimerActive) {
      setActiveLamp(lampId);

      setLampStates((prevStates) => ({
        ...prevStates,
        [lampId]: {
          ...prevStates[lampId],
          isOn: !currentState,
          color: newColor,
        },
      }));

      // API call to update the bulbs: turn them on/off
      const lampData = {
        device: bulbs[lampId].device,
        model: model,
        cmd: {
          name: "turn",
          value: currentState ? "off" : "on",
        },
      };

      const apiURL = `https://developer-api.govee.com/v1/devices/control`;
      const headers = {
        "Content-Type": "application/json",
        "Govee-API-Key": apiKey,
      };

      axios
        .put(apiURL, lampData, { headers })
        .then((response) => {
          console.log(`API call successful for ${lampId}:`, response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      activateTimer();
    } else {
      console.log("Too many requests. Please wait before toggling again.");
      alert("Please wait few seconds before trying again..");
    }
  }

  // button to select room set active his lamp
  function toggleRoom(lampId) {
    setActiveLamp(lampId);
    selectRoom(lampId);
  }
  // change style of the selectedRoom
  const selectRoom = (roomId) => {
    setSelectedRoom(roomId);
  };

  const getRoomStyle = (roomId) => {
    return roomId === selectedRoom
      ? { backgroundColor: "#FFF2D8" }
      : { backgroundColor: "#EAD7BB" };
  };

  //function to update props.color when color selected changes
  const handleColorChange = (lampId, newColor) => {
    if (!isTimerActive) {
      setLampStates((prevStates) => ({
        ...prevStates,
        [lampId]: {
          ...prevStates[lampId],
          color: newColor,
        },
      }));
      updateLampColorInAPI(lampId, newColor);
    } else {
      console.log("Too many requests. Please wait before toggling again.");
      alert("Please wait few seconds before trying again..");
    }
  };
  //API call to change lamp color
  const updateLampColorInAPI = (lampId, { r, g, b }) => {
    const lampData = {
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
      .put(apiURL, lampData, { headers })
      .then((response) => {
        console.log(
          `Color change API call successful for ${lampId}:`,
          response
        );
        activateTimer();
      })
      .catch((error) => console.error("Error updating color:", error));
  };

  return (
    <div className="App">
      <div className="room-container">
        {/* ROOMS */}
        {Object.keys(bulbs).map((lamp) => (
          <RoomItem
            key={lamp}
            roomId={lamp}
            roomName={bulbs[lamp].name}
            toggleRoom={toggleRoom}
            getRoomStyle={getRoomStyle}
          />
        ))}
      </div>
      <div className="folder-container">
        <div className="firstRow-container">
          {/* LAMP ICON-BUTTON */}
          <div className="lampButton-container">
            {activeLamp && lampStates[activeLamp] && (
              <LampButton
                key={activeLamp}
                toggleButton={() => toggleButton(activeLamp)}
                isToggle={lampStates[activeLamp].isOn}
                color={lampStates[activeLamp].color}
              />
            )}
          </div>
          {/* COLOR PICKER */}
          <div className="colorPicker-container">
            <ColorPicker
              lampId={activeLamp}
              key={`${activeLamp}-colorPicker`}
              color={lampStates[activeLamp].color}
              isTimerActive={isTimerActive}
              activateTimer={activateTimer}
              onColorChange={handleColorChange}
            />
          </div>
        </div>
        {/* TEMPERATURE AND BRIGHTNESS SLIDERS */}
        {activeLamp && lampStates[activeLamp] && (
          <div className="settingLights-container">
            <BrightSlider
              lampId={activeLamp}
              key={`${activeLamp}-brightSlider`}
              brightness={lampStates[activeLamp].brightness}
            />
            <TempSlider lampId={activeLamp} key={`${activeLamp}-tempSlider`} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
