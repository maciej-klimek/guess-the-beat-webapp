import React, { useEffect, useState } from "react";

interface PlaybackBarProps {
  playbackDuration: number;
  isPlaying: boolean;
  refreshKey: number;
  addSegmentsKey: number;
}

const PlaybackBar: React.FC<PlaybackBarProps> = ({ playbackDuration, isPlaying, refreshKey, addSegmentsKey }) => {
  const [timeLeft, setTimeLeft] = useState(playbackDuration);
  const [heights, setHeights] = useState<number[]>([]);
  const [prevAddSegmentsKey, setPrevAddSegmentsKey] = useState<number>(addSegmentsKey);

  const initialSegmentCount = 36;

  const generateRandomHeights = (min: number, max: number, count: number) => {
    const heightsArray = [];
    for (let i = 0; i < count; i++) {
      const randomHeight = Math.floor(Math.random() * (max - min + 1)) + min;
      heightsArray.push(randomHeight);
    }
    return heightsArray;
  };

  useEffect(() => {
    setHeights(generateRandomHeights(20, 100, initialSegmentCount));
    setTimeLeft(playbackDuration);
  }, [playbackDuration, refreshKey]);

  useEffect(() => {
    if (addSegmentsKey !== prevAddSegmentsKey) {
      const newSegmentCount = playbackDuration;
      setHeights((prevHeights) => [
        ...prevHeights.filter((_, index) => ((index + 1) % playbackDuration) + 1 !== 0),
        ...generateRandomHeights(20, 100, newSegmentCount),
      ]);
      setPrevAddSegmentsKey(addSegmentsKey);
    }
  }, [addSegmentsKey, playbackDuration, prevAddSegmentsKey]);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number;
    let elapsedTime: number = 0;

    const animate = (timestamp: number) => {
      if (isPlaying) {
        if (!startTime) {
          startTime = timestamp;
        }
        elapsedTime = timestamp - startTime;

        const newTimeLeft = playbackDuration - elapsedTime / 1000;
        if (newTimeLeft > 0) {
          setTimeLeft(newTimeLeft);
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setTimeLeft(0);
        }
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [playbackDuration, isPlaying]);

  const progressPercentage = (1 - timeLeft / playbackDuration) * 100;
  const activeSegments = Math.ceil((progressPercentage / 100) * heights.length);

  return (
    <div className="m-auto w-full pr-6 pl-6 pt-3 pb-3 bg-neutral-900 rounded-2xl h-16 overflow-hidden flex items-center">
      {heights.map((height, index) => (
        <div
          key={index}
          className={`flex-1 ${index < activeSegments ? "bg-green-500" : "bg-neutral-400"} rounded`}
          style={{ height: `${height}%`, margin: "0 1px" }}
        />
      ))}
    </div>
  );
};

export default PlaybackBar;
