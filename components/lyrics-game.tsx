'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { lyrics } from '@/lib/lyrics-data';
import { cn } from '@/lib/utils';
import YouTube from 'react-youtube';
import { Music, Play, Pause } from 'lucide-react';
import type { YouTubePlayer } from 'react-youtube';

export function LyricsGame() {
  const [currentLineIndex, setCurrentLineIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('currentLineIndex')) || 0;
    }
    return 0;
  });
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(() => {
    if (typeof window !== 'undefined') {
      return Number(localStorage.getItem('score')) || 0;
    }
    return 0;
  });
  const [gameStarted, setGameStarted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gameStarted') === 'true';
    }
    return false;
  });
  const [feedback, setFeedback] = useState('');
  const [partialMatch, setPartialMatch] = useState('');
  const [matchedLines, setMatchedLines] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('matchedLines');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [bgPlayer, setBgPlayer] = useState<YouTubePlayer | null>(null);
  const [isBgPlaying, setIsBgPlaying] = useState(true);

  useEffect(() => {
    localStorage.setItem('currentLineIndex', currentLineIndex.toString());
    localStorage.setItem('score', score.toString());
    localStorage.setItem('gameStarted', gameStarted.toString());
    localStorage.setItem('matchedLines', JSON.stringify(matchedLines));
  }, [currentLineIndex, score, gameStarted, matchedLines]);

  useEffect(() => {
    // Cleanup when victory screen is closed
    return () => {
      if (!isGameComplete) {
        // The YouTube iframe will be removed automatically
        // when the component unmounts
      }
    };
  }, [isGameComplete]);

  useEffect(() => {
    if (isGameComplete && bgPlayer) {
      bgPlayer.pauseVideo();
      setIsBgPlaying(false);
    }
  }, [isGameComplete, bgPlayer]);

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
    
    const matchedWords = [];
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
    // Early game praises
    const earlyPraises = [
      "Nice! 🎵",
      "Great job! 🎤",
      "Perfect! 🎸"
    ];

    // Later game praises (after getting several correct)
    const laterPraises = [
      "You're on a roll! 🎵",
      "Whoa! 🎸",
      "You really know this song! 🎤"
    ];

    // Use later praises after 5 correct lines
    const praises = score > 5 ? laterPraises : earlyPraises;
    return praises[Math.floor(Math.random() * praises.length)];
  };

  const checkLine = () => {
    const currentLine = lyrics[currentLineIndex];
    
    setScore(score + 1);
    setFeedback(getRandomPraise());
    setMatchedLines(prev => [...prev, currentLine.text]);
    setUserInput('');
    setPartialMatch('');
    
    if (currentLineIndex < lyrics.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
    } else {
      setGameStarted(false);
      setIsGameComplete(true);
      setFeedback(`Game Over! Final Score: ${score + 1}/${lyrics.length}`);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentLineIndex(0);
    setScore(0);
    setUserInput('');
    setFeedback('');
    setMatchedLines([]);
    localStorage.clear();
  };

  const isChunkBreakNeeded = (currentLine: string, nextLine: string) => {
    const currentLyric = lyrics[matchedLines.indexOf(currentLine)];
    const nextLyric = lyrics[matchedLines.indexOf(nextLine)];
    
    // Check if either line is part of a special section (chorus or bridge)
    const currentIsSection = currentLyric?.chorus || currentLyric?.bridge;
    const nextIsSection = nextLyric?.chorus || nextLyric?.bridge;
    
    // Check if they're in different sections
    if (currentIsSection !== nextIsSection) return true;
    
    // If they're both in sections, check if they're in the same type
    if (currentIsSection && nextIsSection) {
      return (currentLyric?.chorus !== nextLyric?.chorus) || 
             (currentLyric?.bridge !== nextLyric?.bridge);
    }
    
    return false;
  };

  const getNextCharacterHint = () => {
    const currentLine = lyrics[currentLineIndex].text;
    const normalizedInput = stripPunctuation(userInput);
    const normalizedTarget = stripPunctuation(currentLine);
    
    // If input is longer than target, no hint needed
    if (normalizedInput.length >= normalizedTarget.length) return;
    
    // Get the next character from the original line
    const nextChar = currentLine[userInput.length] || '';
    setUserInput(userInput + nextChar);
  };

  const getNextWordHint = () => {
    const currentLine = lyrics[currentLineIndex].text;
    const words = currentLine.split(' ');
    const inputWords = userInput.split(' ');
    
    // Find the next incomplete word
    const nextWordIndex = inputWords.length;
    if (nextWordIndex < words.length) {
      const nextWord = words[nextWordIndex];
      setUserInput((userInput + ' ' + nextWord).trim());
    }
  };

  // Add reset function
  const resetGame = () => {
    setCurrentLineIndex(0);
    setScore(0);
    setUserInput('');
    setFeedback('');
    setPartialMatch('');
    setMatchedLines([]);
    localStorage.clear();
  };

  const VICTORY_GIF = "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDNwNGoyM2Y0cDJidmhrcjltODg5Z2RtNHAxOXVrOGVxcHdrb3RrOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/djDeJ5hlJ3Q25QVWIc/giphy.gif";

  const onReady = (event: { target: YouTubePlayer }) => {
    setPlayer(event.target);
  };

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onBgVideoReady = (event: { target: YouTubePlayer }) => {
    setBgPlayer(event.target);
  };

  const toggleBgVideo = () => {
    if (bgPlayer) {
      if (isBgPlaying) {
        bgPlayer.pauseVideo();
      } else {
        bgPlayer.playVideo();
      }
      setIsBgPlaying(!isBgPlaying);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleBgVideo}
          className="bg-white/90"
        >
          {isBgPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="fixed inset-0 -z-10 invisible">
        <div className="h-0">
          <YouTube
            videoId="BwpdHjVYIcU"
            opts={{
              playerVars: {
                autoplay: 1,
                controls: 0,
                loop: 1,
                playlist: "BwpdHjVYIcU",
                modestbranding: 1,
              },
            }}
            onReady={onBgVideoReady}
            className="w-screen h-screen"
          />
        </div>
      </div>

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
            <div className="flex items-center justify-center gap-4 mb-2">
              <p className="text-xl">Current Score: {score}</p>
              <Button 
                onClick={resetGame}
                variant="outline"
                size="sm"
              >
                Reset
              </Button>
            </div>
            <p className="text-lg">Line {currentLineIndex + 1} of {lyrics.length}</p>
          </div>

          <div className="flex flex-col items-center">
            {matchedLines.map((line, index) => (
              <div key={index}>
                <p className="text-lg text-gray-600 italic leading-tight">
                  &quot;{line}&quot;
                </p>
                {index < matchedLines.length - 1 && 
                 isChunkBreakNeeded(line, matchedLines[index + 1]) && (
                  <div className="h-6" /> // Keep larger space between sections
                )}
              </div>
            ))}
            {partialMatch && (
              <p className="text-lg text-green-600 mt-4">
                {partialMatch}
              </p>
            )}
            <div className="w-full flex flex-col gap-2">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg text-lg"
                placeholder="Type the next line..."
                autoFocus
              />
              <div className="flex gap-2 self-center">
                <Button 
                  onClick={getNextCharacterHint}
                  variant="outline"
                  size="sm"
                >
                  Hint
                </Button>
                <Button 
                  onClick={getNextWordHint}
                  variant="outline"
                  size="sm"
                >
                  Big Hint
                </Button>
              </div>
            </div>
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

      {isGameComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-xl w-full">
            <div className="flex justify-center">
              <img 
                src={VICTORY_GIF} 
                alt="Victory celebration"
                className="w-64 h-auto rounded-lg mb-4"
              />
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Music className="w-6 h-6" />
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="w-8 h-8 p-1"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </Button>
            </div>
            <div className="h-0 overflow-hidden">
              <YouTube
                videoId="4e7JA7cgYY0"
                opts={{
                  playerVars: {
                    autoplay: 1,
                    controls: 1,
                    height: '1',
                    width: '1',
                  },
                }}
                onReady={onReady}
              />
            </div>
            <Button 
              onClick={() => setIsGameComplete(false)} 
              className="mt-4 w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 