'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { lyrics } from '@/lib/lyrics-data';
import { cn } from '@/lib/utils';

export function LyricsGame() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [lastCorrectLine, setLastCorrectLine] = useState('');
  const [partialMatch, setPartialMatch] = useState('');

  const checkPartialMatch = (input: string) => {
    const currentLine = lyrics[currentLineIndex].text.toLowerCase();
    const words = currentLine.split(' ');
    const inputWords = input.toLowerCase().trim().split(' ');
    
    let matchedWords = [];
    for (let i = 0; i < inputWords.length; i++) {
      if (inputWords[i] === words[i]) {
        matchedWords.push(words[i]);
      } else {
        break;
      }
    }
    
    setPartialMatch(matchedWords.join(' '));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setUserInput(newInput);
    checkPartialMatch(newInput);
  };

  const checkLine = () => {
    const currentLine = lyrics[currentLineIndex];
    const normalizedInput = userInput.toLowerCase().trim();
    const normalizedCorrect = currentLine.text.toLowerCase();

    if (normalizedInput === normalizedCorrect) {
      setScore(score + 1);
      setFeedback('Correct! 🎵');
      setLastCorrectLine(currentLine.text);
      setUserInput('');
      setPartialMatch('');
      if (currentLineIndex < lyrics.length - 1) {
        setCurrentLineIndex(currentLineIndex + 1);
      } else {
        setGameStarted(false);
        setFeedback(`Game Over! Final Score: ${score + 1}/${lyrics.length}`);
      }
    } else {
      setFeedback('Try again! 🎤');
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentLineIndex(0);
    setScore(0);
    setUserInput('');
    setFeedback('');
    setLastCorrectLine('');
    setPartialMatch('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Learn &quot;Shake Ya Ass&quot;</h2>
        {!gameStarted && (
          <Button onClick={startGame} size="lg">
            Start Game
          </Button>
        )}
      </div>

      <div className="text-sm text-gray-600 text-center mb-4">
        &quot;Shake Ya Ass&quot; was written and performed by Mystikal
        © [Year] [Rights Holders]. All rights reserved.
        <a 
          href="https://genius.com/Mystikal-shake-ya-ass-lyrics" 
          className="text-blue-600 hover:underline ml-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Official Lyrics
        </a>
      </div>

      {gameStarted && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-xl mb-2">Current Score: {score}</p>
            <p className="text-lg">Line {currentLineIndex + 1} of {lyrics.length}</p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            {lastCorrectLine && (
              <p className="text-lg text-gray-600 italic">
                "{lastCorrectLine}"
              </p>
            )}
            {partialMatch && (
              <p className="text-lg text-green-600">
                {partialMatch}
              </p>
            )}
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && checkLine()}
              className="w-full p-3 border rounded-lg text-lg"
              placeholder="Type the next line..."
              autoFocus
            />
            <Button onClick={checkLine} size="lg">
              Submit
            </Button>
          </div>

          {feedback && (
            <div className={cn(
              "p-4 rounded-lg text-center",
              feedback.includes('Correct') ? 'bg-green-100' : 'bg-yellow-100'
            )}>
              {feedback}
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">How to Play:</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Type the lyrics as they appear</li>
          <li>Press Enter or click Submit to check your answer</li>
          <li>Try to get all the lines correct!</li>
        </ul>
      </div>
    </div>
  );
} 