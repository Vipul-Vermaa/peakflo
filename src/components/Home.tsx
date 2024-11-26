import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiPlus } from "react-icons/fi";

const ItemType = {
  CARD: "card",
};

interface CardProps {
  id: number;
  title: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed";
  moveCard: (draggedId: number, newStatus: string) => void;
}

interface DraggedItem {
  id: number;
}

const Card: React.FC<CardProps> = ({ id, title, description }) => {
  const navigate = useNavigate();

  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType.CARD,
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className={`p-4 mb-2 bg-white shadow-md rounded-md border ${isDragging ? "opacity-50" : "opacity-100"
        }`}
      onClick={() => navigate(`/page/${id}`)}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

const Home: React.FC = () => {
  const [cards, setCards] = useState(() => {
    const storedCards = JSON.parse(localStorage.getItem("cards") || "[]");
    return storedCards;
  });

  const moveCard = (draggedId: number, newStatus: string) => {
    setCards((prevCards: any) => {
      const updatedCards = prevCards.map((card: any) =>
        card.id === draggedId ? { ...card, status: newStatus } : card
      );
      localStorage.setItem("cards", JSON.stringify(updatedCards));
      return updatedCards;
    });
  };

  useEffect(() => {
    const storedCards = JSON.parse(localStorage.getItem('cards') || '[]')
    setCards(storedCards)
  }, [])

  const getCardsByStatus = (status: string) =>
    cards.filter((card: any) => card.status === status);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 flex space-x-4">
        {["Not Started", "In Progress", "Completed"].map((status) => {
          const headerColor =
            status === "Not Started"
              ? "bg-orange-500 text-white"
              : status === "In Progress"
                ? "bg-yellow-500 text-white"
                : "bg-green-500 text-white";

          const cardCount = getCardsByStatus(status).length

          return (
            <div
              key={status}
              className="flex-1 p-4 rounded-lg shadow-md "
            >
              <div className="flex items-center">
                <div className={`px-2 py-1 rounded ${headerColor}`}>
                  <span>{status}</span>
                </div>
                <span className="ml-2 text-sm text-gray-700">({cardCount})</span>
                <Link to={"/create"} className="ml-auto text-gray-500 hover:text-gray-700">
                  <FiPlus className="text-xl" />
                </Link>
              </div>



              <div className="space-y-4 mt-4">
                {getCardsByStatus(status).map((card: any) => (
                  <Card key={card.id} {...card} moveCard={moveCard} />
                ))}
              </div>

              <DropZone
                onDrop={(draggedId) => moveCard(draggedId, status)}
                className="flex items-center p-2 mt-4"
              >
                <Link to={'/create'} className="flex items-center p-2 mt-4" >
                  <FiPlus className="mr-2  text-lg" />
                  <span className="text-sm text-gray-500 font-medium cursor-pointer">New</span>
                </Link>
              </DropZone>
            </div>
          );
        })}
      </div>
    </DndProvider>
  );
};

interface DropZoneProps {
  onDrop: (draggedId: number) => void;
  className: string;
  children: React.ReactNode;
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop, className, children }) => {
  const [, dropRef] = useDrop({
    accept: ItemType.CARD,
    drop: (item: DraggedItem) => {
      onDrop(item.id);
    },
  });

  return (
    <div ref={dropRef} className={className}>
      {children}
    </div>
  );
};

export default Home;
