import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import confetti from "canvas-confetti";

const BLUE = "#0d6efd"
const ORANGE = '#ffa500'

const GROUPS = [
  {
    name: "Eight Words", // Off by default
    background: "tomato",
    text: "white",
    words: [
      "one", "two", "three", "four",
      "five", "six", "seven", "eight",
    ]
  },
  {
    name: "Three Words", // Off by default
    background: "salmon",
    text: "white",
    words: ["one", "two", "three"]
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
  const [setsOfFour, setSetsOfFour] = useState(false);
  const [setIndex, setSetIndex] = useState(0);
  const [isSetComplete, setIsSetComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function speakWord(word) {
    return new Promise((resolve) => {
      if (!word) return resolve();

      speechSynthesis.cancel();

      setIsSpeaking(true)

      // toLowerCase to avoid "I" being "capital i"
      const utterance = new SpeechSynthesisUtterance(word.toLowerCase());

      const voices = speechSynthesis.getVoices();
      console.log(voices.map(v => v.name))
      // English-Australian, slightly animated
      const karen = voices.find(v => v.name == 'Karen');
      if (karen != undefined) {
        utterance.voice = karen
      } else {
        utterance.language = 'en-US'
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        resolve();
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        resolve();
      }

      speechSynthesis.speak(utterance);
    });
  }

  useEffect(() => {
    if (group) {
      const selectedGroup = GROUPS.find((g) => g.name === group);

      if (selectedGroup) {
        let selectedWords;

        if (setsOfFour) {
          const start = setIndex * 4;
          const end = start + 4;
          selectedWords = selectedGroup.words.slice(start, end);
        } else {
          selectedWords = [...selectedGroup.words].sort(() => Math.random() - 0.5);
        }

        setWords(selectedWords);
        setInitialCount(selectedWords.length);
        setCurrentWord(selectedWords[0]);
        setSkippedWords([]);
        setIsReview(false);
        setSessionColor(selectedGroup.background)
      }
    }
  }, [group, setIndex, setsOfFour]);

  function playCheerWithFadeOut() {
    const cheer = new Audio('/tricky-words-trainer/cheer.mp3');
    cheer.volume = 1;
    cheer.play().catch(console.error);

    // Wait a few seconds, then start fading out
    setTimeout(() => {
      const fadeOutDuration = 3000;
      const fadeStep = 500;
      const fadeAmount = cheer.volume / (fadeOutDuration / fadeStep);

      const fadeOut = setInterval(() => {
        if (cheer.volume > 0.05) {
          cheer.volume -= fadeAmount;
        } else {
          cheer.volume = 0;
          cheer.pause();
          clearInterval(fadeOut);
        }
      }, fadeStep);
    }, 500);
  };

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
        playCheerWithFadeOut();
      }

      setWords([]);
      setCurrentWord(null);
      setIsSetComplete(true)
    }
  };

  const handleCorrect = () => goToNextWord(correctWords, setCorrectWords);
  const handleSkipped = async () => {
    await speakWord(currentWord);
    await delay(400)
    goToNextWord(skippedWords, setSkippedWords);
  };

  const handleReset = () => {
    setGroup(null);
    setWords([]);
    setCurrentWord(null);
    setCorrectWords([]);
    setSkippedWords([]);
    setIsReview(false);
    setInitialCount(0);
    setSetIndex(0)
    setIsSetComplete(false);
  };

  const handleClose = handleReset

  const handleStartReview = () => {
    setWords(skippedWords);
    setCurrentWord(skippedWords[0] || null);
    setInitialCount(skippedWords.length);
    setSkippedWords([]);
    setIsReview(true);
    setIsSetComplete(false);
  };

  const selectedGroup = GROUPS.find((g) => g.name === group);
  const progress = ((initialCount - words.length) / initialCount) * 100;
  const hasMoreSets = (selectedGroup !== undefined) && setsOfFour && ((setIndex + 1) * 4 < selectedGroup.words.length);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100">
      {isMenuOpen ? (
        <>
          <h2 className="mb-4 text-center">Settings</h2>
          {/* Sets of Four*/}
          <div className="form-check form-switch d-flex justify-content-center align-items-center gap-3 mb-1">
            <label className="form-check-label ms-2" htmlFor="setsOfFourSwitch">
              Sets of Four
            </label>
            <div className="form-check form-switch m-0">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="setsOfFourSwitch"
                checked={setsOfFour}
                onChange={() => setSetsOfFour(!setsOfFour)}
              />
              </div>
          </div>
          <p className="text-center text-muted small mb-4">
            Split each Tricky Words group in three sets of four words to make it easier to learn new groups.
            <br/>
            This also disables shuffling.
          </p>

          {/* Debug Mode */}
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
          <div className="justify-content-center align-items-center gap-3 mt-5 text-muted small">
            <i>Crowd cheering sound effect by <a href="https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=6713">freesound_community</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=6713">Pixabay</a>.</i>
          </div>
        </>
      ) : (
        <>
          {!group ? (
            <>
            <TrickyTitle />
            <div className="d-flex flex-column gap-3" style={{ width: "240px" }}>
            {GROUPS
              .filter(({ name }) => debugMode ? name.endsWith("Words") : !name.endsWith("Words") )
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
            </div>
            </>
          ) : isSetComplete ? (
            <>
              <DancingHeader text={getEmoji(skippedWords.length, initialCount)} />
              <ButtonRow>
                <ActionButton onClick={handleReset} icon="house-door-fill" bg={BLUE} />
                {hasMoreSets ? (
                  <ActionButton
                    onClick={() => {
                      setSetIndex((i) => i + 1);
                      setIsSetComplete(false);
                    }}
                    icon="arrow-right"
                    bg={ORANGE}
                  />
                ) : (
                  !isReview && skippedWords.length > 0 && (
                    <ActionButton
                      onClick={handleStartReview}
                      icon="arrow-repeat"
                      bg={ORANGE}
                    />
                  )
                )}
              </ButtonRow>
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
              <h1
                className={`mb-5 display-1 fw-bold ${isSpeaking ? 'dance' : ''}`}
                style={{ fontSize: "6rem",  color: `${sessionColor}` }}
              >
                {currentWord}
              </h1>
              <div className="progress mb-3" style={{ height: "1.5rem", width: `${WIDTH}` }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${progress}%`, backgroundColor: `${ORANGE}` }}
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                </div>
              </div>
              <ButtonRow>
                <ActionButton onClick={handleCorrect} icon="check2" bg="#198754" />
                <ActionButton onClick={handleSkipped} icon="question-lg" bg={ORANGE} />
              </ButtonRow>
            </>
          ) : (
            <>{/* should be able to remove this? */}</>
          )}
          {!group && (
            <footer className="mt-5 text-muted small text-center">
              <span>© 2025</span>
              <span>&nbsp;·&nbsp;</span>
              <button
                className="btn btn-link p-0 align-baseline"
                onClick={() => setIsMenuOpen(true)}
                style={{ fontSize: '0.875rem' }}
              >
                Parents
              </button>
              <span>&nbsp;·&nbsp;</span>
              <a href="https://github.com/mokagio/tricky-words-trainer" target="_blank">Source</a>
            </footer>
          )}
        </>
      )}
    </div>
  );
}
