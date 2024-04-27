import { useEffect, useState } from "react";

export const useLocalStorage = () => {
  const [notes, setNotes] = useState(() => {
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
