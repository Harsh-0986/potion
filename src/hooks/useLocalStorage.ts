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
    const changedNotes = notes;
    changedNotes?.sort((a, b) => {
      return parseInt(b.date) - parseInt(a.date);
    });
    console.log(changedNotes);
    localStorage.setItem("notes", JSON.stringify(changedNotes));
  }, [notes]);

  return { notes, setNotes };
};
