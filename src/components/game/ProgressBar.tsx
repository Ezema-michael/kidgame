import React from "react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProgressBarProps {
  completedLetters?: string[];
  currentLetter?: string;
  allLetters?: string[];
}

const ProgressBar = ({
  completedLetters = ["A", "B", "C"],
  currentLetter = "D",
  allLetters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
}: ProgressBarProps) => {
  const progress = (completedLetters.length / allLetters.length) * 100;

  return (
    <div className="w-full max-w-[800px] p-4 bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg shadow-md border-2 border-blue-100">
      <div className="mb-4">
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <TooltipProvider>
          {allLetters.map((letter) => {
            const isCompleted = completedLetters.includes(letter);
            const isCurrent = letter === currentLetter;

            return (
              <Tooltip key={letter}>
                <TooltipTrigger>
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-base font-bold
                      ${isCompleted ? "bg-green-500 text-white" : ""}
                      ${isCurrent ? "bg-blue-500 text-white" : ""}
                      ${!isCompleted && !isCurrent ? "bg-gray-200 text-gray-600" : ""}
                      transition-all duration-200
                    `}
                  >
                    {letter}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isCompleted
                      ? "Completed"
                      : isCurrent
                        ? "Current Letter"
                        : "Not Started"}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProgressBar;
