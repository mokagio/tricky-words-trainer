import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const GROUPS = [
  {
    name: "Red",
    background: "#dc3545", // Bootstrap danger color
    text: "white",
    words: ["I", "the", "he", "she", "me", "we", "be", "was", "to", "do", "of"],
  },
  {
    name: "Yellow",
    background: "#ffc107",
    text: "black",
    words: ["are", "all", "you", "your", "come", "some", "said", "here", "there", "they", "go", "no", "so", "my"],
  },
  {
    name: "Green",
    background: "#198754",
    text: "white",
    words: ["one", "by", "like", "have", "live", "give", "little", "down", "what", "when", "why", "where"],
  },
  {
    name: "Blue",
    background: "#0d6efd",
    text: "white",
    words: ["who", "which", "any", "many", "more", "before", "other", "were", "because", "want", "saw", "two", "put", "could", "should", "would", "right", "their"],
  },
  {
    name: "Purple",
    background: "#6f42c1",
    text: "white",
    words: ["once", "upon", "always", "also", "after", "every", "eight", "mother", "father"],
  },
];

const TRICKY_COLORS = GROUPS.map(group => group.background);

const WIDTH = '240px'

function shuffleColors(length) {
  const result = [];
  while (result.length < length) {
    const options = TRICKY_COLORS.filter(c => c !== result[result.length - 1]);
    const next = options[Math.floor(Math.random() * options.length)];
    result.push(next);
  }
  return result;
}

export function TrickyTitle() {
  const text = 'Tricky Words';
  const [colors, setColors] = useState(() => shuffleColors(text.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setColors(shuffleColors(text.length));
    }, 1000);
    return () => clearInterval(interval);
  }, [text.length]);

  return (
    <h1 className="mb-5 fw-semibold text-center" style={{ fontSize: '4rem' }}>
      {text.split('').map((letter, i) => (
        <span key={i} style={{ color: colors[i] }}>
          {letter}
        </span>
      ))}
    </h1>
  );
}

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
          <TrickyTitle />
          <div className="d-flex flex-column gap-3" style={{ width: "240px" }}>
            {GROUPS.map(({ name, background, text }) => (
              <button
              key={name}
              className="btn d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: background,
                color: text,
                height: "64px",
                fontSize: "1.5rem",
                borderRadius: "0.75rem",
              }}
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
      {!group && (
        <footer className="mt-5 text-muted small text-center">
          © 2025 · <a href="https://github.com/mokagio/tricky-words-trainer" target="_blank">View Source</a>
        </footer>
      )}
    </div>
  );
}
