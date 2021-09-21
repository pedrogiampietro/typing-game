import React from 'react';
import { Word } from './components/Word';
import wordList from './resources/words.json';

const MAX_TYPED_KEYS = 30;
const WORD_ANIMATION_INTERVAL = 200;
const TIMER_DURATION = 10;

const secondsToTime = total => {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = Math.round(total % 60);

  const data = hours ? [hours, minutes, seconds] : [minutes, seconds];

  return data.map(v => `0${v}`.slice(-2)).join(':');
};

const Timer = ({ duration, isRunning, getValue = v => v }) => {
  const [startDate, setStartDate] = React.useState(null);
  const [currentDate, setCurrentDate] = React.useState(null);
  const [time, setTime] = React.useState(null);

  React.useEffect(() => {
    let interval = null;

    if (isRunning) {
      setStartDate(new Date());
      interval = setInterval(() => {
        setCurrentDate(new Date());
      }, 1000);
    } else {
      setStartDate(null);
      setCurrentDate(null);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  React.useEffect(() => {
    if (!startDate || !currentDate) return;

    const currentTime = currentDate.getTime();
    const startTime = startDate.getTime();
    const time = Number.parseInt((currentTime - startTime) / 1000, 10);
    getValue(duration - time);
    setTime(time);
  }, [startDate, currentDate, duration, getValue]);

  if (!startDate || !currentDate)
    return <div className='timer'>{secondsToTime(duration)}</div>;

  return <div className='timer'>{secondsToTime(duration - time)}</div>;
};

const Ended = ({ ended, completedWords = [], onRestart = () => {} }) => {
  if (!ended) return null;
  return (
    <div className='ended'>
      <h2>Time's up</h2>
      <p>{completedWords.length} completed words.</p>
      <button onClick={onRestart}>Restart</button>
    </div>
  );
};

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
  const [typedKeys, setTypedKeys] = React.useState(['']);
  const [validKeys, setValidKeys] = React.useState([]);
  const [completedWords, setCompletedWords] = React.useState([]);
  const [word, setWord] = React.useState('');
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [ended, setEnded] = React.useState(false);

  const containerRef = React.useRef(null);

  React.useEffect(() => {
    setWord(getWord());

    if (containerRef) containerRef.current.focus();
  }, []);

  React.useEffect(() => {
    const wordFromValidKeys = validKeys.join('').toLowerCase();

    let timeout = null;
    if (word && word === wordFromValidKeys) {
      let newWord = null;
      do {
        newWord = getWord();
      } while (completedWords.includes(newWord));

      setWord(newWord);
      setValidKeys([]);
      setCompletedWords(prev => [...prev, word]);
      timeout = setTimeout(() => {
        let newWord = null;
        do {
          newWord = getWord();
        } while (completedWords.includes(newWord));

        setWord(newWord);
        setValidKeys([]);
        setCompletedWords(prev => [...prev, word]);
      }, WORD_ANIMATION_INTERVAL);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [word, validKeys, completedWords]);

  const getTimerValue = v => {
    if (v > 0) return;
    setTimerRunning(false);
    setEnded(true);
  };

  const onRestart = e => {
    e.preventDefault();
    setTypedKeys(['']);
    setValidKeys([]);
    setCompletedWords([]);
    setTimerRunning(false);
    setEnded(false);

    setWord(getWord());
  };

  const handleKeyDown = evt => {
    evt.preventDefault();

    if (ended) return;

    const { key } = evt;
    if (!timerRunning) setTimerRunning(true);
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
    <div
      className='container'
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={containerRef}
    >
      <Timer
        duration={TIMER_DURATION}
        isRunning={timerRunning}
        getValue={getTimerValue}
      />
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
      <Ended
        ended={ended}
        completedWords={completedWords}
        onRestart={onRestart}
      />
    </div>
  );
}
