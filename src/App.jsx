import { useState } from "react";

export default function App() {
  const [group, setGroup] = useState(null);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100">
      {!group ? (
        <>
          <h1 className="mb-4 fw-semibold display-5 text-center">Pick a tricky word group</h1>
          <div className="d-flex gap-3">
            <button className="btn btn-primary btn-lg" onClick={() => setGroup("Blue")}>
              Blue
            </button>
            <button className="btn btn-warning btn-lg text-white" onClick={() => setGroup("Yellow")}>
              Yellow
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="mb-4">You chose: {group}</h1>
          <button className="btn btn-secondary" onClick={() => setGroup(null)}>
            ← Back
          </button>
        </>
      )}
    </div>
  );
}
