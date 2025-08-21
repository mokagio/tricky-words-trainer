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

function ReviewArrowIcon({ color = "white", size = 24 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 1 3 6.7" />
      <path d="M3 12V6" />
      <path d="M3 6h6" />
    </svg>
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
    <div
      className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100"
    >
      {!group ? (
        <>
          <h1 className="mb-4 fw-semibold display-5 text-center">Tricky Words</h1>
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
          <h1 className="mb-5 display-1 fw-bold" style={{ fontSize: "6rem" }}>{currentWord}</h1>
          <div className="progress mb-3" style={{ height: "1.5rem", width: "240px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%`, backgroundColor: '#ffa500' }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
            </div>
          </div>
          <div className="d-flex gap-3" style={{ width: "240px" }}>
            <button
              className="btn d-flex align-items-center justify-content-center flex-fill"
              style={{ backgroundColor: "#198754", color: "white", height: "64px", fontSize: "1.5rem", borderRadius: "0.75rem" }}
              onClick={handleCorrect}
            >
              ✓
            </button>
            <button
              className="btn d-flex align-items-center justify-content-center flex-fill"
              style={{ backgroundColor: "#6c757d", color: "white", height: "64px", borderRadius: "0.75rem" }}
              onClick={handleSkipped}
            >
              <SkipArrowIcon size={28} color="white" />
            </button>
          </div>
        </>
      ) : skippedWords.length > 0 && !isReview ? (
        <>
          <h1 className="mb-5" style={{ fontSize: "5rem" }}>🎉</h1>
          <div className="d-flex gap-3">
            <button
              className="btn btn-primary d-flex align-items-center justify-content-center"
              onClick={handleStartReview}
              style={{ width: "64px", height: "64px", borderRadius: "0.75rem" }}
            >
              <ReviewArrowIcon size={32} color="white" />
            </button>
            <button
              className="btn btn-secondary d-flex align-items-center justify-content-center"
              onClick={handleReset}
              style={{ width: "64px", height: "64px", borderRadius: "0.75rem" }}
            >
              ←
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="mb-5" style={{ fontSize: "5rem" }}>🎉</h1>
          <button
            className="btn btn-secondary d-flex align-items-center justify-content-center"
            onClick={handleReset}
            style={{ width: "64px", height: "64px", borderRadius: "0.75rem" }}
          >
            ←
          </button>
        </>
      )}
    </div>
  );
}
