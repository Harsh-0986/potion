import { Link, useLocation } from "react-router-dom";
import { MDEditor } from "../components";

const Editor = () => {
  const { state } = useLocation();

  if (state === null)
    return (
      <h3>
        An error occurred. <br /> Go to <Link to="/">Home</Link>
      </h3>
    );

  console.log(state.note);
  return (
    <div className="bg-white">
      <MDEditor noteId={state.note.id} />
    </div>
  );
};

export default Editor;
