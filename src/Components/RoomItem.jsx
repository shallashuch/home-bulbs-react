import React from "react";

const RoomItem = (props) => {
  return (
    <div
      className="room-item"
      onClick={() => props.toggleRoom(props.roomId)}
      style={props.getRoomStyle(props.roomId)}
    >
      {props.roomName}
    </div>
  );
};

export default RoomItem;
