import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import confetti from "canvas-confetti";

const BLUE = "#0d6efd"
const ORANGE = '#ffa500'

const GROUPS = [
  {
    name: "Test One", // Off by default
    background: "tomato",
    text: "white",
    words: ["one", "two", "three"]
  },
  {
    name: "Test Two", // Off by default
    background: "salmon",
    text: "white",
    words: ["four", "five", "six"]
  },
  {
    name: "Blue",
    background: BLUE,
    text: "white",
    words: [
      "I", "the", "he", "she",
      "me", "we", "be", "was",
      "to", "do", "are", "all"
    ],
  },
  {
    name: "Yellow",
    background: "#ffc107",
    text: "white",
    words: [
      "you", "your", "come", "some",
      "said", "here", "there", "they",
      "go", "no", "so", "my"
    ],
  },
  {
    name: "Red",
    background: "#dc3545",
    text: "white",
    words: [
      "one", "by", "only", "old",
      "like", "have", "live", "give",
      "little", "down", "what", "when"
    ],
  },
  {
    name: "Green",
    background: "#198754",
    text: "white",
    words: [
      "why", "where", "who", "which",
      "any", "many", "more", "before",
      "other", "were", "because", "want"
    ],
  },
  {
    name: "Pink",
    background: "#f472b6", // pink-400 from Tailwind CSS
    text: "white",
    words: [
      "saw", "put", "could", "should",
      "would", "right",  "two" , "four",
      "goes", "does", "made", "their"
    ],
  },
  {
    name: "Brown", // called purple in other groupings
    background: "#a0522d", // sienna brown
    text: "white",
    words: [
      "once", "upon", "always", "also",
      "of", "eight", "love", "cover",
      "after", "every", "mother", "father"
    ],
  },
];

const TRICKY_COLORS = GROUPS
  .filter(group => group.name !== "Brown") // Brown looks bad in the title
  .map(group => group.background);

const WIDTH = '240px'

function shuffleColorsAndTilts(length) {
  const options = [...TRICKY_COLORS];
  const colors = [];
  const tilts = [];

  let lastColor = null;
  for (let i = 0; i < length; i++) {
    const availableColors = options.filter(c => c !== lastColor);
    const color = availableColors[Math.floor(Math.random() * availableColors.length)];
    lastColor = color;
    colors.push(color);

    const tilt = (Math.random() * 10 - 5).toFixed(2); // -5 to +5 degrees
    tilts.push(tilt);
  }

  return { colors, tilts };
}

export function TrickyTitle() {
  const text = "Tricky Words";
  const visibleChars = text.replaceAll(" ", "").length;

  const [letterColors, setLetterColors] = useState(() =>
    shuffleColorsAndTilts(visibleChars).colors
  );
  const [letterTilts, setLetterTilts] = useState(() =>
    shuffleColorsAndTilts(visibleChars).tilts
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const visibleChars = text.replaceAll(" ", "").length;
      const { colors, tilts } = shuffleColorsAndTilts(visibleChars);
      setLetterColors(colors);
      setLetterTilts(tilts);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  let colorIndex = 0;

  return (
    <h1
      className="mb-5 fw-semibold text-center"
      style={{
        fontSize: 'clamp(3.5rem, 8vw, 4.5rem)',
        wordBreak: 'keep-all',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }}
    >
      {text.split("").map((char, idx) => {
        if (char === " ") {
          return <span key={idx}>&nbsp;</span>;
        }

        const span = (
          <span
            key={idx}
            style={{
              color: letterColors[colorIndex] || "inherit",
              display: "inline-block",
              transform: `rotate(${letterTilts[colorIndex] || 0}deg)`
            }}
          >
            {char}
          </span>
        );

        colorIndex++;
        return span;
      })}
    </h1>
  );
}

function DancingHeader({ text }) {
  return (
    <h1 className="mb-5 shake" style={{ fontSize: "5rem" }}>{text}</h1>
  )
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

function getEmoji(skippedCount, groupSize) {
  if (groupSize === 0) return "🤔"; // fallback

  const skippedPercentage = (skippedCount / groupSize) * 100;

  switch (true) {
    case skippedPercentage <= 10:
      return "🎉";
    case skippedPercentage <= 50:
      return "👏";
    default:
      return "👍";
  }
}

export default function App() {
  const [group, setGroup] = useState(null);
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [correctWords, setCorrectWords] = useState([]);
  const [skippedWords, setSkippedWords] = useState([]);
  const [isReview, setIsReview] = useState(false);
  const [initialCount, setInitialCount] = useState(0);
  const [sessionColor, setSessionColor] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

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
        setSessionColor(selectedGroup.background)
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
      if (skippedWords.length === 0) {
        confetti({
          angle: 90,
          spread: 360,
          startVelocity: 40,
          particleCount: 200,
          origin: { x: 0.5, y: 0.5 },
        });
      }

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

  const handleClose = handleReset

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
      {isMenuOpen ? (
        <>
        <h2 className="mb-4 text-center">Settings</h2>
        <div className="form-check form-switch d-flex justify-content-center align-items-center gap-3 mb-4">
          <label className="form-check-label ms-2" htmlFor="debugModeSwitch">
            Debug Mode
          </label>
          <div className="form-check form-switch m-0">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="debugModeSwitch"
              checked={debugMode}
              onChange={() => setDebugMode(!debugMode)}
            />
          </div>
        </div>
        <div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="btn btn"
          >
            <i className="bi bi-house-door-fill" style={{ color: BLUE }}></i>
          </button>
        </div>
        </>
      ) : (
        <>
          {!group ? (
            <>
            <TrickyTitle />
            <div className="d-flex flex-column gap-3" style={{ width: "240px" }}>
            {GROUPS
              .filter(({ name }) => debugMode ? name.startsWith("Test") : !name.startsWith("Test") )
              .map(({ name, background, text }) => (
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
              <ActionButton icon="list" bg="gray" onClick={() => setIsMenuOpen(true)} />
            </div>
            </>
          ) : currentWord ? (
            <>
            <button
            onClick={handleClose}
            className="position-absolute top-0 end-0 m-3 btn btn-link text-dark fs-4"
            aria-label="Close"
          >
              <i className="bi bi-x-circle-fill" style={{ color: "#6c757d" }}></i>
            </button>
            <h1 className="mb-5 display-1 fw-bold" style={{ fontSize: "6rem",  color: `${sessionColor}` }}>{currentWord}</h1>
            <div className="progress mb-3" style={{ height: "1.5rem", width: `${WIDTH}` }}>
              <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%`, backgroundColor: `${ORANGE}` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
            <ButtonRow>
              <ActionButton onClick={handleCorrect} icon="check2" bg="#198754" />
              <ActionButton onClick={handleSkipped} icon="arrow-right" bg={ORANGE} />
            </ButtonRow>
            </>
          ) : skippedWords.length > 0 && !isReview ? (
            <>
            <DancingHeader text={getEmoji(skippedWords.length, initialCount)} />
            <ButtonRow>
              <ActionButton onClick={handleReset} icon="house-door-fill" bg={BLUE} />
              <ActionButton onClick={handleStartReview} icon="arrow-repeat" bg={ORANGE} />
            </ButtonRow>
            </>
          ) : (
            <>
            <DancingHeader text={getEmoji(skippedWords.length, initialCount)} />
            <ButtonRow>
              <ActionButton onClick={handleReset} icon="house-door-fill" bg={BLUE} />
            </ButtonRow>
            </>
          )}
          {!group && (
            <footer className="mt-5 text-muted small text-center">
              © 2025 · <a href="https://github.com/mokagio/tricky-words-trainer" target="_blank">View Source</a>
            </footer>
          )}
        </>
      )}
    </div>
  );
}
