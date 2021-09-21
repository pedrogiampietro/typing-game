import React from 'react';

export function CompletedWords({ data }) {
  if (!data) return null;

  return (
    <ol>
      {data.map(word => (
        <li key={word}>{word}</li>
      ))}
    </ol>
  );
}
