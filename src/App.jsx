import { useState, useEffect } from "react";

const GROUPS = [
  {
    name: "Blue",
    background: "blue",
    text: "white",
    words: ["the", "to", "I", "he", "she", "we", "me", "be", "was", "you"],
  },
  {
    name: "Yellow",
    background: "#ffc107",
    text: "black",
    words: ["all", "are", "my", "her", "they", "one", "two", "do", "does", "were"],
  },
];

export default function App() {
  const [group, setGroup] = useState(null);
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);

  useEffect(() => {
    if (group) {
      const selectedGroup = GROUPS.find((g) => g.name === group);
      if (selectedGroup) {
        const shuffled = [...selectedGroup.words].sort(() => Math.random() - 0.5);
        setWords(shuffled);
        setCurrentWord(shuffled[0]);
      }
    }
  }, [group]);

  const handleNext = () => {
    if (words.length > 1) {
      const [, ...rest] = words;
      setWords(rest);
      setCurrentWord(rest[0]);
    } else {
      setWords([]);
      setCurrentWord(null);
    }
  };

  const handleReset = () => {
    setGroup(null);
    setWords([]);
    setCurrentWord(null);
  };

  const selectedGroup = GROUPS.find((g) => g.name === group);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100">
      {!group ? (
        <>
          <h1 className="mb-4 fw-semibold display-5 text-center">Pick a tricky word group</h1>
          <div className="d-flex gap-3">
            {GROUPS.map(({ name, background, text }) => (
              <button
                key={name}
                className="btn btn-lg"
                style={{ backgroundColor: background, color: text }}
                onClick={() => setGroup(name)}
              >
                {name}
              </button>
            ))}
          </div>
        </>
      ) : currentWord ? (
        <>
          <h1 className="mb-4 display-1 fw-bold">{currentWord}</h1>
          <p className="mb-3 text-muted">
            {words.length - 1} word{words.length - 1 !== 1 ? "s" : ""} remaining
          </p>
          <button className="btn btn-outline-primary" onClick={handleNext}>
            Next
          </button>
        </>
      ) : (
        <>
          <h1 className="mb-4">Well done! You finished the {group} group 🎉</h1>
          <button className="btn btn-secondary" onClick={handleReset}>
            ← Go back
          </button>
        </>
      )}
    </div>
  );
}
