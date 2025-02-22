import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import GuideAnimation from "./GuideAnimation";
import { soundPlayer } from "@/lib/sounds";

interface Point {
  x: number;
  y: number;
}

interface PathSegment {
  start: Point;
  end: Point;
  covered: boolean;
}

interface LetterDisplayProps {
  letter?: string;
  strokePaths?: string[];
  onLetterComplete?: () => void;
  showGuide?: boolean;
}

const LetterDisplay = ({
  letter = "A",
  strokePaths = [
    "M 200,500 L 400,100",
    "M 300,300 L 500,500",
    "M 250,300 L 450,300",
  ],
  onLetterComplete = () => {},
  showGuide = false,
}: LetterDisplayProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [attemptedPaths, setAttemptedPaths] = useState<Point[][]>([]);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [completedStrokes, setCompletedStrokes] = useState<boolean[]>([]);
  const [pathSegments, setPathSegments] = useState<PathSegment[][]>([]);

  useEffect(() => {
    const segments = strokePaths.map((path) => {
      const coords = path.match(/[0-9]+/g)?.map(Number) || [];
      if (coords.length < 4) return [];

      const segments: PathSegment[] = [];
      const start = { x: coords[0], y: coords[1] };
      const end = { x: coords[2], y: coords[3] };
      const distance = Math.hypot(end.x - start.x, end.y - start.y);
      const steps = Math.ceil(distance / 30);

      for (let i = 0; i < steps; i++) {
        const t1 = i / steps;
        const t2 = (i + 1) / steps;
        segments.push({
          start: {
            x: start.x + (end.x - start.x) * t1,
            y: start.y + (end.y - start.y) * t1,
          },
          end: {
            x: start.x + (end.x - start.x) * t2,
            y: start.y + (end.y - start.y) * t2,
          },
          covered: false,
        });
      }
      return segments;
    });
    setPathSegments(segments);
  }, [strokePaths]);

  useEffect(() => {
    setCompletedStrokes(new Array(strokePaths.length).fill(false));
    setCurrentStrokeIndex(0);
  }, [strokePaths]);

  const getRelativeCoordinates = (
    event: React.MouseEvent | React.TouchEvent,
  ): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const clientX =
      "touches" in event ? event.touches[0].clientX : event.clientX;
    const clientY =
      "touches" in event ? event.touches[0].clientY : event.clientY;

    const scaleX = svg.viewBox.baseVal.width / rect.width;
    const scaleY = svg.viewBox.baseVal.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    setIsDrawing(true);
    const coords = getRelativeCoordinates(event);
    setCurrentPath([coords]);
    try {
      soundPlayer.play("trace");
    } catch (e) {
      console.log("Sound play failed", e);
    }
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    if (!isDrawing) return;

    const coords = getRelativeCoordinates(event);
    updatePathCoverage(coords);
    setCurrentPath((prev) => [...prev, coords]);
  };

  const updatePathCoverage = (point: Point) => {
    const threshold = 50;
    const newSegments = [...pathSegments];
    let covered = false;

    if (!newSegments[currentStrokeIndex]) return;

    newSegments[currentStrokeIndex] = newSegments[currentStrokeIndex].map(
      (segment) => {
        if (segment.covered) return segment;

        const distToSegment = pointToLineDistance(
          point,
          segment.start,
          segment.end,
        );
        if (distToSegment < threshold) {
          covered = true;
          return { ...segment, covered: true };
        }
        return segment;
      },
    );

    if (covered) {
      setPathSegments(newSegments);
    }
  };

  const pointToLineDistance = (
    point: Point,
    lineStart: Point,
    lineEnd: Point,
  ) => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  };

  const [showHint, setShowHint] = useState(false);
  const [hintMessage, setHintMessage] = useState("");

  const stopDrawing = () => {
    setIsDrawing(false);

    if (currentPath.length < 2) {
      setCurrentPath([]);
      return;
    }

    const currentSegments = pathSegments[currentStrokeIndex];
    const coveredSegments =
      currentSegments?.filter((segment) => segment.covered).length || 0;
    const totalSegments = currentSegments?.length || 0;
    const isCorrect =
      coveredSegments > 0 && coveredSegments / totalSegments >= 0.7;

    if (isCorrect) {
      const newCompletedStrokes = [...completedStrokes];
      newCompletedStrokes[currentStrokeIndex] = true;
      setCompletedStrokes(newCompletedStrokes);

      setAttemptedPaths([]);
      setHintMessage("✓ Perfect! Keep going!");
      setShowHint(true);
      soundPlayer.play("success");
      setTimeout(() => setShowHint(false), 1500);

      if (currentStrokeIndex < strokePaths.length - 1) {
        setCurrentStrokeIndex((prev) => prev + 1);
      } else if (newCompletedStrokes.every((stroke) => stroke)) {
        onLetterComplete();
      }
    } else {
      setAttemptedPaths((prev) => [...prev, currentPath]);
      setHintMessage("Try again - follow the dotted line");
      setShowHint(true);
      soundPlayer.play("error");
      setTimeout(() => setShowHint(false), 1500);
    }

    setCurrentPath([]);
  };

  return (
    <div className="relative w-full max-w-[800px] aspect-[4/3] bg-gradient-to-br from-indigo-50 to-blue-100 rounded-lg shadow-lg border-4 border-indigo-300">
      {showHint && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full text-white font-bold text-lg z-10 ${hintMessage.includes("✓") ? "bg-green-500" : "bg-blue-600"}`}
        >
          {hintMessage}
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-[300px] font-bold select-none"
          style={{
            background: `linear-gradient(45deg, #1e293b, #334155, #475569)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 8px rgba(30,41,59,0.3))",
          }}
        >
          {letter}
        </span>
      </div>

      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full touch-none"
        viewBox="0 0 800 600"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{ touchAction: "none" }}
      >
        {strokePaths.map((path, index) => (
          <path
            key={index}
            d={path}
            stroke="#6366f1"
            strokeWidth="28"
            strokeLinecap="round"
            strokeDasharray="0 40"
            className="drop-shadow-[0_0_2px_rgba(99,102,241,0.5)]"
            fill="none"
          />
        ))}

        {strokePaths.map(
          (path, index) =>
            completedStrokes[index] && (
              <path
                key={`completed-${index}`}
                d={path}
                stroke="#22c55e"
                strokeWidth="22"
                strokeLinecap="round"
                className="drop-shadow-[0_0_3px_rgba(34,197,94,0.6)]"
                fill="none"
              />
            ),
        )}

        {attemptedPaths.map((path, index) => (
          <motion.path
            key={`attempt-${index}`}
            d={`M ${path.map((p) => `${p.x},${p.y}`).join(" L ")}`}
            stroke="rgba(239, 68, 68, 0.5)"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
          />
        ))}

        {currentPath.length > 1 && (
          <motion.path
            d={`M ${currentPath.map((p) => `${p.x},${p.y}`).join(" L ")}`}
            stroke="white"
            strokeWidth="24"
            strokeLinecap="round"
            className="drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.1 }}
          />
        )}
      </svg>

      {showGuide && (
        <GuideAnimation
          isVisible={true}
          strokePath={strokePaths[currentStrokeIndex]}
          onComplete={() => {}}
        />
      )}
    </div>
  );
};

export default LetterDisplay;
