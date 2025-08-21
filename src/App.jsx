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

const comicFont = {
  fontFamily: `'Comic Sans MS', 'Comic Neue', cursive`,
};

function SkipArrowIcon({ color = "white", size = 24 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h13" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

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
    <div
      className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100"
      style={comicFont}
    >
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
          <div className="d-flex gap-3">
            <button
              className="btn d-flex align-items-center justify-content-center"
              style={{ backgroundColor: "#198754", color: "white", width: "64px", height: "64px", fontSize: "1.5rem", borderRadius: "0.75rem" }}
              onClick={handleNext}
            >
              ✓
            </button>
            <button
              className="btn d-flex align-items-center justify-content-center"
              style={{ backgroundColor: "#6c757d", color: "white", width: "64px", height: "64px", borderRadius: "0.75rem" }}
              onClick={handleNext}
            >
              <SkipArrowIcon size={28} color="white" />
            </button>
          </div>
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
