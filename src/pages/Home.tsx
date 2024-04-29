import { useLocalStorage } from "../hooks/useLocalStorage";
import { v4 as uuidV4 } from "uuid";
import { NoteType } from "../types";
import quotes from "inspirational-quotes";
import { Header } from "../components";
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
        <section className="my-4 w-full max-h-[85%] justify-center items-center grid grid-cols-3 lg:grid-cols-5 grid-flow-row gap-3 overflow-hidden">
          {notes &&
            notes.map((note) => {
              return (
                <Link
                  key={note.id}
                  className="h-full"
                  state={{ note: note }}
                  to={`edit/${note.id}`}
                >
                  <div className="h-full gap-3 px-4 py-6 border-2 ease-in-out transition-all hover:border-zinc-900 hover:bg-zinc-300 text-center cursor-pointer rounded-md w-full flex flex-col max-h-[28vh]">
                    <h4 className="font-semibold text-xl">{note.title}</h4>
                    <span
                      dangerouslySetInnerHTML={{ __html: note.content }}
                      className="text-wrap overflow-hidden"
                    />
                    <span className="z-10 text-zinc-800/50">
                      Last Edited:{" "}
                      {moment(
                        moment.unix(parseInt(note.date) / 1000)
                      ).fromNow()}
                    </span>
                  </div>
                </Link>
              );
            })}
        </section>
      </main>
    </div>
  );
};

export default Home;
