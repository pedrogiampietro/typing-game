export function Word({ word }) {
  return (
    <>
      <span className='matched'></span>
      <span className='remainder'>{word}</span>
    </>
  );
}
