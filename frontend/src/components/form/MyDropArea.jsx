import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import { TextField } from "@mui/material";

const MyDropArea = () => {
  const [droppedItems, setDroppedItems] = useState([]);

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.ELEMENT,
    drop: (item) => {
      console.log("Dropped item:", item);
      setDroppedItems([...droppedItems, item]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const backgroundColor = isOver ? "rgba(0, 0, 0, 0.1)" : "transparent";

  return (
    <div
      ref={drop}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor,
      }}
    >
      {droppedItems.map((item, index) => (
        <div key={index} style={{ marginTop: "10px" }}>
          {item.type === "Text" && (
            <TextField label="Text" fullWidth required />
          )}
          {item.type === "Number" && (
            <TextField label="Phone" fullWidth type="number" required />
          )}
          {item.type === "Email" && (
            <TextField label="Email" fullWidth type="email" required />
          )}
        </div>
      ))}
    </div>
  );
};

export default MyDropArea;
