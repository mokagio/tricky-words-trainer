import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

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

const WIDTH = '240px'

function ButtonRow({ children }) {
  return (
    <div className="d-flex gap-3" style={{ width: `${WIDTH}` }}>
      {children}
    </div>
  );
}

function ActionButton({ onClick, icon, label, bg = "#6c757d", color = "white" }) {
  return (
    <button
      className="btn d-flex align-items-center justify-content-center flex-fill"
      style={{
        backgroundColor: bg,
        color,
        height: "64px",
        fontSize: "1.5rem",
        borderRadius: "0.75rem",
      }}
      onClick={onClick}
    >
      {icon && <i className={`bi bi-${icon}`} style={{ fontSize: "1.5rem" }}></i>}
      {label && <span>{label}</span>}
    </button>
  );
}

export default function App() {
  const [group, setGroup] = useState(null);
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [correctWords, setCorrectWords] = useState([]);
  const [skippedWords, setSkippedWords] = useState([]);
  const [isReview, setIsReview] = useState(false);
  const [initialCount, setInitialCount] = useState(0);

  useEffect(() => {
    if (group) {
      const selectedGroup = GROUPS.find((g) => g.name === group);
      if (selectedGroup) {
        const shuffled = [...selectedGroup.words].sort(() => Math.random() - 0.5);
        setWords(shuffled);
        setInitialCount(shuffled.length);
        setCurrentWord(shuffled[0]);
        setCorrectWords([]);
        setSkippedWords([]);
        setIsReview(false);
      }
    }
  }, [group]);

  const goToNextWord = (wordList, updateListFn) => {
    if (currentWord) {
      updateListFn((prev) => [...prev, currentWord]);
    }

    if (words.length > 1) {
      const [, ...rest] = words;
      setWords(rest);
      setCurrentWord(rest[0]);
    } else {
      setWords([]);
      setCurrentWord(null);
    }
  };

  const handleCorrect = () => goToNextWord(correctWords, setCorrectWords);
  const handleSkipped = () => goToNextWord(skippedWords, setSkippedWords);

  const handleReset = () => {
    setGroup(null);
    setWords([]);
    setCurrentWord(null);
    setCorrectWords([]);
    setSkippedWords([]);
    setIsReview(false);
    setInitialCount(0);
  };

  const handleStartReview = () => {
    setWords(skippedWords);
    setCurrentWord(skippedWords[0] || null);
    setInitialCount(skippedWords.length);
    setSkippedWords([]);
    setIsReview(true);
  };

  const selectedGroup = GROUPS.find((g) => g.name === group);
  const progress = ((initialCount - words.length) / initialCount) * 100;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100">
      {!group ? (
        <>
          <h1 className="mb-4 fw-semibold display-5 text-center">Tricky Words</h1>
          <ButtonRow width="auto">
            {GROUPS.map(({ name, background, text }) => (
              <ActionButton
                label={name}
                bg={background}
                onClick={() => setGroup(name)}
              />
            ))}
          </ButtonRow>
        </>
      ) : currentWord ? (
        <>
          <h1 className="mb-5 display-1 fw-bold" style={{ fontSize: "6rem" }}>{currentWord}</h1>
          <div className="progress mb-3" style={{ height: "1.5rem", width: `${WIDTH}` }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%`, backgroundColor: '#ffa500' }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <ButtonRow>
            <ActionButton onClick={handleCorrect} icon="check2" bg="#198754" />
            <ActionButton onClick={handleSkipped} icon="arrow-right" />
          </ButtonRow>
        </>
      ) : skippedWords.length > 0 && !isReview ? (
        <>
          <h1 className="mb-5" style={{ fontSize: "5rem" }}>🎉</h1>
          <ButtonRow>
            <ActionButton onClick={handleStartReview} icon="arrow-repeat" bg="blue" />
            <ActionButton onClick={handleReset} icon="arrow-left" />
          </ButtonRow>
        </>
      ) : (
        <>
          <h1 className="mb-5" style={{ fontSize: "5rem" }}>🎉</h1>
          <ButtonRow>
            <ActionButton onClick={handleReset} icon="arrow-left" />
          </ButtonRow>
        </>
      )}
    </div>
  );
}
