import React, { useState } from "react";
import { useDrop, useDrag, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ItemTypes } from "./ItemTypes";
import { Input } from "antd";

  // MyDropArea.js
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
      hover: (draggedItem, monitor) => {
        if (!monitor.isOver({ shallow: true })) {
          return;
        }
        if (draggedItem.index !== index && item.type !== "Column") {
          moveItem(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });

    return (
      <div
        className="my-2"
        ref={(node) => drag(drop(node))}
        style={{ opacity: isDragging ? 0.1 : 1 }}
      >
        {item.type === "Column" ? (
          <div className="bg-zinc-100 hover:bg-zinc-200 ">
            <div className="flex space-x-4">
              <div className="px-2 w-full rounded">
                <DropZone
                  items={item.contentLeft}
                  onDropItem={(newItem) => {
                    const newItems = [...item.contentLeft, newItem];
                    item.contentLeft = newItems;
                  }}
                  onMoveItem={() => {}}
                  className="px-2 bg-zinc-200 w-full"
                />
              </div>

              <div className="px-2  w-full rounded">
                <DropZone
                  items={item.contentRight}
                  onDropItem={(newItem) => {
                    const newItems = [...item.contentRight, newItem];
                    item.contentRight = newItems;
                  }}
                  onMoveItem={() => {}}
                />
              </div>
            </div>
          </div>
        ) : item.type === "Text" ? (
          <div className="space-y-1 cursor-move hover:bg-zinc-200 p-2">
            <p className="text-xs text-zinc-400">Text</p>
            <Input
              size="large"
              label="Text"
              required
              className="p-3 cursor-move"
            />
          </div>
        ) : item.type === "Number" ? (
          <div className="space-y-1 cursor-move hover:bg-zinc-200 p-2">
            <p className="text-xs text-zinc-400">Phone</p>
            <Input
              size="large"
              label="Text"
              required
              className="p-3 cursor-move"
            />
          </div>
        ) : item.type === "Email" ? (
          <div className="space-y-1 cursor-move hover:bg-zinc-200 p-2">
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

// MyDropArea.js
const DropZone = ({ items, onDropItem, onMoveItem }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.ELEMENT,
    drop: (item, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      onDropItem(item);
    },
  });

  return (
    <div ref={drop} className="w-full min-h-16 ">
      {items.map((item, index) => (
        <DraggableItem
          key={index}
          index={index}
          item={item}
          moveItem={onMoveItem}
          onDropOutside={() => {}}
        />
      ))}
    </div>
  );
};

// MyDropArea.js
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

  const handleDropItem = (newItem) => {
    if (newItem.type === "Column") {
      setDroppedItems([
        ...droppedItems,
        { type: "Column", contentLeft: [], contentRight: [] },
      ]);
    } else {
      setDroppedItems([...droppedItems, newItem]);
    }
  };

  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.ELEMENT, ItemTypes.COLUMN],
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        handleDropItem(item);
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
