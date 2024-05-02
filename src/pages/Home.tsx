import { useLocalStorage } from "../hooks/useLocalStorage";
import { v4 as uuidV4 } from "uuid";
import { NoteType } from "../types";
import quotes from "inspirational-quotes";
import { DeleteButton, Header } from "../components";
import { Link } from "react-router-dom";
import moment from "moment";

const Home = () => {
  const { notes, setNotes } = useLocalStorage();

  const handleCreateNote = async () => {
    const id = uuidV4();
    const quote = quotes.getQuote();
    const content = `${quote.text} - ${quote.author}`;

    setNotes((prev: NoteType[] | null) => {
      const newNote = {
        id: id,
        content: content,
        date: new Date().getTime().toString(),
        title: "My Awesome Note!",
      };

      if (!prev) return [newNote];

      return [newNote].concat(prev);
    });
  };

  const handleDelete = (noteId: string) => {
    setNotes((prev) => {
      if (prev === null) return null;
      const notes = prev.filter((note) => note.id != noteId);

      return notes;
    });
  };

  return (
    <div className="max-h-screen overflow-y-scroll">
      <Header />
      <main className="p-4 max-h-[90%]">
        <div className="flex justify-end">
          <button
            onClick={() => handleCreateNote()}
            className="border-2 border-black rounded-md px-4 py-2"
          >
            <span className="font-semibold"> + Add a Note</span>
          </button>
        </div>
        <section className="my-4 w-full max-h-[85%] justify-center items-center grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 grid-flow-row gap-3 overflow-hidden">
          {notes &&
            notes.map((note) => {
              return (
                <div key={note.id} className="relative h-full">
                  <div className="absolute left-0 bottom-0 right-0 rounded-md mt-1 mb-0.5 mx-0.5 py-1 px-2 bg-zinc-100 z-50">
                    <div className="w-full flex items-center justify-between">
                      <div className="z-50 text-zinc-800/50 truncate bg-zinc-100">
                        Last Edited:{" "}
                        {moment(
                          moment.unix(parseInt(note.date) / 1000)
                        ).fromNow()}
                      </div>
                      <DeleteButton
                        handleDelete={handleDelete}
                        noteId={note.id}
                        className="transition-all duration-300 bg-red-100 text-red-500 hover:bg-red-400 hover:text-red-100 font-semibold"
                      />
                    </div>
                  </div>
                  <Link
                    key={note.id}
                    className="h-full"
                    state={{ note: note }}
                    to={`edit/${note.id}`}
                  >
                    <div className="overflow-hidden duration-300 h-full pb-6 hover:border-zinc-900 hover:bg-zinc-300 gap-3 px-4 py-6 border-2 ease-in-out transition-all text-center cursor-pointer rounded-md w-full flex flex-col max-h-[28vh]">
                      <h4 className="font-semibold text-2xl">{note.title}</h4>
                      <span
                        dangerouslySetInnerHTML={{ __html: note.content }}
                        className="pb-72 text-wrap overflow-hidden"
                      />
                    </div>
                  </Link>
                </div>
              );
            })}
        </section>
      </main>
    </div>
  );
};

export default Home;
