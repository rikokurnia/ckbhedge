/** Dark Veil-inspired green light folds; CSS gradient remains available without animation or JS. */
export function Background() {
  return (
    <div className="app-background" aria-hidden="true">
      <div className="aurora aurora-left" />
      <div className="aurora aurora-right" />
    </div>
  );
}
