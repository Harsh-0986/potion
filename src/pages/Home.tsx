import { useLocalStorage } from "../hooks/useLocalStorage";
import { v4 as uuidV4 } from "uuid";
import { NoteType } from "../types";

const Home = () => {
  const { notes, setNotes } = useLocalStorage();

  console.log(notes);

  const handleCreateNote = () => {
    const id = uuidV4();

    setNotes((prev: NoteType[] | null) => {
      const newNote = {
        id: id,
        content: "",
        date: new Date().getTime(),
      };

      if (!prev) return newNote;

      return [...prev, newNote];
    });
  };

  return (
    <main className="p-4">
      <div className="flex justify-end">
        <button
          onClick={() => handleCreateNote()}
          className="border-2 border-black rounded-md px-4 py-2"
        >
          <span className="font-semibold"> + Add a Note</span>
        </button>
      </div>
    </main>
  );
};

export default Home;
