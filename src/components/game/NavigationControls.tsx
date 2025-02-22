import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Hand } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavigationControlsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onToggleGuide?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  isGuideActive?: boolean;
}

const NavigationControls = ({
  onPrevious = () => {},
  onNext = () => {},
  onToggleGuide = () => {},
  canGoPrevious = true,
  canGoNext = true,
  isGuideActive = false,
}: NavigationControlsProps) => {
  return (
    <div className="flex items-center justify-center gap-6 p-4 bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg shadow-md w-full max-w-[400px] mb-2 border-2 border-blue-100">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="h-16 w-16 rounded-full"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Previous Letter</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isGuideActive ? "secondary" : "outline"}
              size="lg"
              onClick={onToggleGuide}
              className="h-16 w-16 rounded-full"
            >
              <Hand className="h-8 w-8" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Guide Mode</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              onClick={onNext}
              disabled={!canGoNext}
              className="h-16 w-16 rounded-full"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Next Letter</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default NavigationControls;
