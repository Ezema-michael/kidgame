import React, { useState } from "react";
import LetterDisplay from "./game/LetterDisplay";
import ProgressBar from "./game/ProgressBar";
import NavigationControls from "./game/NavigationControls";
import CelebrationOverlay from "./game/CelebrationOverlay";
import { soundPlayer } from "@/lib/sounds";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const letterPaths: Record<string, string[]> = {
  A: [
    "M 300,500 L 400,100", // Left to peak
    "M 400,100 L 500,500", // Peak to right
    "M 350,300 L 450,300", // Cross bar
  ],
  B: [
    "M 300,100 L 300,500", // Vertical line
    "M 300,100 L 450,100 Q 500,100 500,200 Q 500,300 300,300", // Top curve
    "M 300,300 L 450,300 Q 500,300 500,400 Q 500,500 300,500", // Bottom curve
  ],
  C: [
    "M 500,150 Q 500,100 450,100 L 350,100 Q 300,100 300,150 L 300,450 Q 300,500 350,500 L 450,500 Q 500,500 500,450",
  ],
  D: [
    "M 300,100 L 300,500", // Vertical line
    "M 300,100 L 400,100 Q 500,100 500,250 L 500,350 Q 500,500 400,500 L 300,500", // Curve
  ],
  E: [
    "M 500,100 L 300,100", // Top line
    "M 300,100 L 300,500", // Vertical line
    "M 300,300 L 450,300", // Middle line
    "M 300,500 L 500,500", // Bottom line
  ],
  F: [
    "M 500,100 L 300,100", // Top line
    "M 300,100 L 300,500", // Vertical line
    "M 300,300 L 450,300", // Middle line
  ],
  G: [
    "M 500,150 Q 500,100 450,100 L 350,100 Q 300,100 300,150 L 300,450 Q 300,500 350,500 L 450,500 Q 500,500 500,450 L 500,300 L 400,300",
  ],
  H: [
    "M 300,100 L 300,500", // Left vertical
    "M 500,100 L 500,500", // Right vertical
    "M 300,300 L 500,300", // Middle line
  ],
  I: [
    "M 400,100 L 400,500", // Single vertical
  ],
  J: ["M 500,100 L 500,400 Q 500,500 400,500 L 350,500 Q 300,500 300,400"],
  K: [
    "M 300,100 L 300,500", // Vertical line
    "M 300,300 L 500,100", // Upper diagonal
    "M 300,300 L 500,500", // Lower diagonal
  ],
  L: [
    "M 300,100 L 300,500", // Vertical line
    "M 300,500 L 500,500", // Bottom line
  ],
  M: [
    "M 200,500 L 200,100", // Left vertical
    "M 200,100 L 350,300", // First diagonal
    "M 350,300 L 500,100", // Second diagonal
    "M 500,100 L 500,500", // Right vertical
  ],
  N: [
    "M 300,500 L 300,100", // Left vertical
    "M 300,100 L 500,500", // Diagonal
    "M 500,500 L 500,100", // Right vertical
  ],
  O: [
    "M 400,100 Q 300,100 300,200 L 300,400 Q 300,500 400,500 Q 500,500 500,400 L 500,200 Q 500,100 400,100",
  ],
  P: [
    "M 300,100 L 300,500", // Vertical line
    "M 300,100 L 450,100 Q 500,100 500,200 Q 500,300 300,300", // Curve
  ],
  Q: [
    "M 400,100 Q 300,100 300,200 L 300,400 Q 300,500 400,500 Q 500,500 500,400 L 500,200 Q 500,100 400,100", // Circle
    "M 400,400 L 500,500", // Tail
  ],
  R: [
    "M 300,100 L 300,500", // Vertical line
    "M 300,100 L 450,100 Q 500,100 500,200 Q 500,300 300,300", // Top curve
    "M 300,300 L 500,500", // Diagonal
  ],
  S: [
    "M 500,150 Q 500,100 450,100 L 350,100 Q 300,100 300,150 Q 300,300 500,300 Q 500,500 350,500 L 350,500 Q 300,500 300,450",
  ],
  T: [
    "M 300,100 L 500,100", // Top line
    "M 400,100 L 400,500", // Vertical line
  ],
  U: ["M 300,100 L 300,400 Q 300,500 400,500 Q 500,500 500,400 L 500,100"],
  V: [
    "M 300,100 L 400,500", // Left diagonal
    "M 400,500 L 500,100", // Right diagonal
  ],
  W: [
    "M 200,100 L 300,500", // First diagonal
    "M 300,500 L 400,300", // Second diagonal
    "M 400,300 L 500,500", // Third diagonal
    "M 500,500 L 600,100", // Fourth diagonal
  ],
  X: [
    "M 300,100 L 500,500", // First diagonal
    "M 500,100 L 300,500", // Second diagonal
  ],
  Y: [
    "M 300,100 L 400,300", // Upper left
    "M 500,100 L 400,300", // Upper right
    "M 400,300 L 400,500", // Lower vertical
  ],
  Z: [
    "M 300,100 L 500,100", // Top line
    "M 500,100 L 300,500", // Diagonal
    "M 300,500 L 500,500", // Bottom line
  ],
};

const getStrokePathsForLetter = (letter: string) => {
  return (
    letterPaths[letter] || [
      // Default pattern for letters without specific paths
      `M 250,100 L 250,500`,
      `M 250,300 L 450,300`,
    ]
  );
};

const HomePage = () => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [completedLetters, setCompletedLetters] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentLetter = alphabet[currentLetterIndex];

  const handlePrevious = () => {
    setCurrentLetterIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentLetterIndex((prev) => Math.min(alphabet.length - 1, prev + 1));
  };

  const handleLetterComplete = () => {
    if (!completedLetters.includes(currentLetter)) {
      setCompletedLetters((prev) => [...prev, currentLetter]);
      setShowCelebration(true);
      soundPlayer.play("celebration");
    }
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    if (currentLetterIndex < alphabet.length - 1) {
      handleNext();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-blue-50 via-pink-50 to-purple-50 flex flex-col items-center justify-between p-4 overflow-hidden">
      <h1 className="text-4xl font-bold text-indigo-600 drop-shadow-sm mt-2">
        Letter Tracing Game
      </h1>

      <ProgressBar
        completedLetters={completedLetters}
        currentLetter={currentLetter}
        allLetters={alphabet}
      />

      <LetterDisplay
        letter={currentLetter}
        strokePaths={getStrokePathsForLetter(currentLetter)}
        onLetterComplete={handleLetterComplete}
        showGuide={showGuide}
      />

      <NavigationControls
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToggleGuide={() => setShowGuide((prev) => !prev)}
        canGoPrevious={currentLetterIndex > 0}
        canGoNext={currentLetterIndex < alphabet.length - 1}
        isGuideActive={showGuide}
      />

      <CelebrationOverlay
        isVisible={showCelebration}
        message={`Great job with letter ${currentLetter}!`}
        onComplete={handleCelebrationComplete}
      />
    </div>
  );
};

export default HomePage;
