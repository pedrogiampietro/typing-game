import React from 'react';

export function Ended({
  ended,
  duration,
  completedWords = [],
  onRestart = () => {},
}) {
  if (!ended) return null;
  return (
    <div className='ended'>
      <h2>Time's up</h2>
      <p>
        {completedWords.length} completed words in {duration} seconds.
      </p>
      <button onClick={onRestart}>Restart</button>
    </div>
  );
}
