import React, { useState } from "react";
import { useDrop, useDrag, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ItemTypes } from "./ItemTypes";
import { Input } from "antd";

const DraggableItem = ({ item, index, moveItem, onDropOutside }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ELEMENT,
    item: { index },
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        onDropOutside(item.index);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
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
    <div className="my-4" ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.1 : 1 }}>
      {item.type === "Text" ? (
        <div className="space-y-1 cursor-move">
          <p className="text-xs text-zinc-400">Text</p>
          <Input size="large" label="Text" required className="p-3 cursor-move" />
        </div>
      ) : item.type === "Number" ? (
        <div className="space-y-1 cursor-move">
          <p className="text-xs text-zinc-400">Phone</p>
          <Input size="large" label="Text" required className="p-3 cursor-move" />
        </div>
      ) : item.type === "Email" ? (
        <div className="space-y-1 cursor-move">
          <p className="text-xs text-zinc-400">Email</p>
          <Input
            size="large"
            label="Text"
            required
            className="p-3 cursor-move"
            rules={[
              {
                type: "email",
              },
            ]}
          />
        </div>
      ) : null}
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

  const removeItem = (index) => {
    const updatedItems = droppedItems.filter((_, i) => i !== index);
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

  const backgroundColor = isOver ? "rgba(0, 0, 0, 0.05)" : "transparent";

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        ref={drop}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor,
        }}
        className="p-3"
      >
        {droppedItems.map((item, index) => (
          <DraggableItem
            key={index}
            index={index}
            item={item}
            moveItem={moveItem}
            onDropOutside={removeItem}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default MyDropArea;
