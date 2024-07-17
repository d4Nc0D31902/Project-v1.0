import React, { useState } from "react";
import { useDrop, useDrag, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ItemTypes } from "./ItemTypes";
import { Input } from "antd";

const DraggableItem = ({ item, index, moveItem, onDropOutside }) => {
  console.log("DraggableItem - item:", item);

  if (!item) {
    return null; 
  }

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
    <div
      className="my-4"
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.1 : 1,
      }}
    >
      {item && (
        <>
          {item.type === "Text" ? (
            <div className="space-y-1 cursor-move">
              <p className="text-xs text-zinc-400">Text</p>
              <Input
                size="large"
                label="Text"
                required
                className="p-3 cursor-move"
              />
            </div>
          ) : item.type === "Number" ? (
            <div className="space-y-1 cursor-move">
              <p className="text-xs text-zinc-400">Phone</p>
              <Input
                size="large"
                label="Text"
                required
                className="p-3 cursor-move"
              />
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
          ) : item.type === "Column" ? (
            <DroppableColumn />
          ) : null}
        </>
      )}
    </div>
  );
};

const DroppableColumn = () => {
  const [columnItems, setColumnItems] = useState([]);

  const [, drop] = useDrop({
    accept: ItemTypes.ELEMENT,
    drop: (item) => {
      if (item && item.type && item.type !== "Column") {
        console.log("DroppableColumn - dropped item:", item);
        setColumnItems([...columnItems, item]);
      } else {
        console.error("DroppableColumn - dropped item is invalid:", item);
      }
    },
  });

  return (
    <div
      className="grid grid-cols-2 gap-4 cursor-move p-3 border border-dashed border-gray-300 rounded-3xl max-h-fit"
      ref={drop}
    >
      <div className="p-3">
        <p className="text-xs text-zinc-400">Column 1</p>
        {columnItems.map((item, index) => (
          <DraggableItem
            key={index}
            index={index}
            item={item}
            moveItem={(fromIndex, toIndex) => {
              const updatedItems = [...columnItems];
              const [movedItem] = updatedItems.splice(fromIndex, 1);
              updatedItems.splice(toIndex, 0, movedItem);
              setColumnItems(updatedItems);
            }}
            onDropOutside={(index) => {
              setColumnItems(columnItems.filter((_, i) => i !== index));
            }}
          />
        ))}
      </div>
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
      if (item.type === "Column") {
        setDroppedItems([...droppedItems, item]);
      }
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
