import { useEffect, useState } from "react";
import { NoteType } from "../types";

export const useLocalStorage = () => {
  const [notes, setNotes] = useState<NoteType[] | null>(() => {
    const data = localStorage.getItem("notes");

    if (!data) return null;

    const parsedData = JSON.parse(data);

    return parsedData;
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  return { notes, setNotes };
};
