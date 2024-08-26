import React, { useEffect, useState } from "react";

interface SongTimerProps {
    playbackDuration: number;
    isPlaying: boolean;
    refreshKey: number; // Trigger full re-render
    addSegmentsKey: number; // Trigger adding new segments
}

const SongTimer: React.FC<SongTimerProps> = ({ playbackDuration, isPlaying, refreshKey, addSegmentsKey }) => {
    const [timeLeft, setTimeLeft] = useState(playbackDuration);
    const [heights, setHeights] = useState<number[]>([]);

    const initialSegmentCount = 40 + playbackDuration * 2;

    const generateRandomHeights = (min: number, max: number, count: number) => {
        const heightsArray = [];
        for (let i = 0; i < count; i++) {
            const randomHeight = Math.floor(Math.random() * (max - min + 1)) + min;
            heightsArray.push(randomHeight);
        }
        return heightsArray;
    };

    // Effect to reset heights on new track
    useEffect(() => {
        setHeights(generateRandomHeights(20, 100, initialSegmentCount));
        setTimeLeft(playbackDuration);
    }, [refreshKey]);

    // Effect to add segments on submit guess
    useEffect(() => {
        const newSegmentCount = playbackDuration * 2;
        setHeights(prevHeights => [
            ...prevHeights,
            ...generateRandomHeights(20, 100, newSegmentCount),
        ]);
    }, [addSegmentsKey, playbackDuration]);

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
        <div className="m-auto mr-6 w-full rounded h-12 overflow-hidden flex items-center">
            {heights.map((height, index) => (
                <div
                    key={index}
                    className={`flex-1 ${index < activeSegments ? 'bg-green-500' : 'bg-neutral-900'} rounded`}
                    style={{ height: `${height}%`, margin: '0 1px' }}
                />
            ))}
        </div>
    );
};

export default SongTimer;
