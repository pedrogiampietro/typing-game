import React from 'react';
import { Word } from './components/Word';
import wordList from './resources/words.json';

const MAX_TYPED_KEYS = 30;

const getWord = () => {
  const index = Math.floor(Math.random() * wordList.length);
  const word = wordList[index];
  return word.toLowerCase();
};

const isValidKey = (key, word) => {
  if (!word) return false;

  const result = word.split('').includes(key);
  return result;
};

export function App() {
  const [typedKeys, setTypedKeys] = React.useState([]);
  const [validKeys, setValidKeys] = React.useState([]);
  const [completedWords, setCompletedWords] = React.useState([]);
  const [word, setWord] = React.useState('');

  React.useEffect(() => {
    setWord(getWord());
  }, []);

  React.useEffect(() => {
    const wordFromValidKeys = validKeys.join('').toLowerCase();

    if (word && word === wordFromValidKeys) {
      let newWord = null;
      do {
        newWord = getWord();
      } while (completedWords.includes(newWord));

      setWord(newWord);
      setValidKeys([]);
      setCompletedWords(prev => [...prev, word]);
    }
  }, [word, validKeys, completedWords]);

  const handleKeyDown = evt => {
    evt.preventDefault();
    const { key } = evt;
    setTypedKeys(prevTypedKeys =>
      [...prevTypedKeys, key].slice(MAX_TYPED_KEYS * -1)
    );

    if (isValidKey(key, word)) {
      setValidKeys(prev => {
        const isValidLength = prev.length <= word.length;
        const isNextChar = isValidLength && word[prev.length] === key;

        return isNextChar ? [...prev, key] : prev;
      });
    }
  };

  return (
    <div className='container' tabIndex={0} onKeyDown={handleKeyDown}>
      <div className='valid-keys'>
        <Word word={word} validKeys={validKeys} />
      </div>
      <div className='typed-keys'>{typedKeys ? typedKeys.join(' ') : null}</div>
      <div className='completed-words'>
        <ol>
          {completedWords.map(word => (
            <li key={word}>{word}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
