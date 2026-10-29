/** Re-mounts on every navigation: replays the ink curtain that lifts to reveal the page. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="curtain" aria-hidden>
        <span className="display">MONOLITH®</span>
      </div>
      {children}
    </>
  );
}
