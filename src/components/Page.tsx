import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface FormState {
  id: number;
  title: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed";
}

const Page: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState | null>(null);

  useEffect(() => {
    const storedCards = JSON.parse(localStorage.getItem("cards") || "[]");
    console.log("Stored Cards:", storedCards);
    console.log("Current ID:", id);

    const card = storedCards.find((card: { id: number }) => card.id === Number(id));

    if (card) {
      setFormState(card);
    } else {
      console.error(`Card with ID ${id} not found`);
      navigate("/");
    }
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleStatusChange = (status: FormState["status"]) => {
    setFormState((prev) => (prev ? { ...prev, status } : null));
  };

  const handleSave = () => {
    if (!formState) return;
    const storedCards = JSON.parse(localStorage.getItem("cards") || "[]");
    const updatedCards = storedCards.map((card: FormState) =>
      card.id === Number(id) ? { ...card, ...formState } : card
    );

    localStorage.setItem("cards", JSON.stringify(updatedCards));
    console.log("Card updated", formState);
    navigate("/");
  };

  const handleDelete = () => {
    const storedCards = JSON.parse(localStorage.getItem("cards") || "[]");

    const updatedCards = storedCards.filter((card: FormState) => card.id !== Number(id));

    localStorage.setItem("cards", JSON.stringify(updatedCards));
    console.log(`Card with ID ${id} deleted`);

    navigate("/");
  };

  if (!formState) {
    return null;
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Edit Card {id}</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formState.title}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter card title"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            value={formState.description}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter card description"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <div className="space-y-2">
            {["Not Started", "In Progress", "Completed"].map((status) => (
              <div key={status} className="flex items-center">
                <input
                  id={status}
                  name="status"
                  type="radio"
                  value={status}
                  checked={formState.status === status}
                  onChange={() => handleStatusChange(status as FormState["status"])}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor={status} className="ml-2 block text-sm text-gray-800">
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>
      </form>
      <div className="flex justify-between mt-6">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 focus:outline-none"
        >
          Save
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md shadow hover:bg-red-700 focus:outline-none"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Page;
