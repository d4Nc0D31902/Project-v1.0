import React, { useState } from "react";
import { useDrop, useDrag, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ItemTypes } from "./ItemTypes";
import { TextField } from "@mui/material";

const DraggableItem = ({ item, index, moveItem }) => {
  const [, drag] = useDrag({
    type: ItemTypes.ELEMENT,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.ELEMENT,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{ margin: "10px", flex: "1 1 45%" }}
    >
      {item.type === "Text" && <TextField label="Text" fullWidth required />}
      {item.type === "Number" && (
        <TextField label="Phone" fullWidth type="number" required />
      )}
      {item.type === "Email" && (
        <TextField label="Email" fullWidth type="email" required />
      )}
    </div>
  );
};

const MyDropArea = () => {
  const [droppedItems, setDroppedItems] = useState([]);

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...droppedItems];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setDroppedItems(updatedItems);
  };

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.ELEMENT,
    drop: (item) => {
      setDroppedItems([...droppedItems, item]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const backgroundColor = isOver ? "rgba(0, 0, 0, 0.1)" : "transparent";

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        ref={drop}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor,
          display: "flex",
          flexWrap: "wrap",
          gap: "2px",
        }}
      >
        {droppedItems.map((item, index) => (
          <DraggableItem
            key={index}
            index={index}
            item={item}
            moveItem={moveItem}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default MyDropArea;
