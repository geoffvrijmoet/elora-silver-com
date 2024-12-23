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

  const stripPunctuation = (text: string) => {
    const normalized = text.toLowerCase().trim();
    return normalized.replace(/[.,!?;'"()]/g, '');
  };

  const parseAlternatives = (text: string) => {
    // Convert "[you're]" into array ["you", "you're"]
    const alternatives: string[] = [];
    const regex = /\[(.*?)\]/g;
    let cleanText = text;
    
    let match;
    while ((match = regex.exec(text)) !== null) {
      const bracketContent = match[1];
      const beforeBracket = text.slice(0, match.index).trim();
      alternatives.push(beforeBracket + bracketContent);
      cleanText = cleanText.replace(`[${bracketContent}]`, '');
    }
    
    if (alternatives.length === 0) {
      return { text: cleanText, alternatives: [cleanText] };
    }
    
    return { text: cleanText, alternatives };
  };

  const isMatch = (input: string, target: string) => {
    const { alternatives } = parseAlternatives(target);
    const normalizedInput = stripPunctuation(input);
    
    return alternatives.some(alt => {
      const normalizedAlt = stripPunctuation(alt);
      // Ensure we're matching complete words by comparing word counts
      const inputWords = normalizedInput.split(' ');
      const targetWords = normalizedAlt.split(' ');
      
      // Only match if we have the same number of words
      if (inputWords.length !== targetWords.length) {
        return false;
      }
      // Compare each word
      return normalizedInput === normalizedAlt;
    });
  };

  const checkPartialMatch = (input: string) => {
    const currentLine = lyrics[currentLineIndex].text;
    const words = currentLine.split(' ');
    const inputWords = input.split(' ');
    const lastInputWord = inputWords[inputWords.length - 1];
    
    let matchedWords = [];
    let isFullMatch = false;

    for (let i = 0; i < inputWords.length && i < words.length; i++) {
      const targetWord = words[i];
      const inputWord = inputWords[i];
      
      if (isMatch(inputWord, targetWord)) {
        matchedWords.push(targetWord);
        // Check if we've matched all words
        if (i === words.length - 1) {
          isFullMatch = true;
        }
      } else if (targetWord.toLowerCase().startsWith(lastInputWord.toLowerCase()) || 
                stripPunctuation(targetWord).startsWith(stripPunctuation(lastInputWord))) {
        matchedWords.push(targetWord.slice(0, lastInputWord.length));
        break;
      } else {
        break;
      }
    }
    
    setPartialMatch(matchedWords.join(' '));
    
    if (isFullMatch) {
        console.log('full match')
      checkLine();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setUserInput(newInput);
    checkPartialMatch(newInput);
  };

  const getRandomPraise = () => {
    const praises = [
      "Nice! 🎵",
      "Great job! 🎤",
      "Nailed it! 🎶",
      "Perfect! 🎸",
      "You got it! 🎼",
      "Awesome! 🎶"
    ];
    return praises[Math.floor(Math.random() * praises.length)];
  };

  const checkLine = () => {
    const currentLine = lyrics[currentLineIndex];
    
    // if (isMatch(userInput, currentLine.text)) {
      setScore(score + 1);
      setFeedback(getRandomPraise());
      setLastCorrectLine(currentLine.text);
      setUserInput('');
      setPartialMatch('');
      if (currentLineIndex < lyrics.length - 1) {
        setCurrentLineIndex(currentLineIndex + 1);
      } else {
        setGameStarted(false);
        setFeedback(`Game Over! Final Score: ${score + 1}/${lyrics.length}`);
      }
    // } else {
    //   setFeedback('Try again! 🎤');
    // }
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
              className="w-full p-3 border rounded-lg text-lg"
              placeholder="Type the next line..."
              autoFocus
            />
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