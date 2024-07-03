import React, { useEffect, useState } from "react";

interface SongTimerProps {
    playbackDuration: number;
    isPlaying: boolean;
}

const SongTimer: React.FC<SongTimerProps> = ({ playbackDuration, isPlaying }) => {
    const [timeLeft, setTimeLeft] = useState(playbackDuration);

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

    const progressBarWidth = (timeLeft / playbackDuration) * 100;

    return (
        <div className="m-auto mr-6 w-full bg-neutral-900 rounded h-10 overflow-hidden">
            <div
                className="bg-green-500 h-full"
                style={{ width: `${progressBarWidth}%` }}
            />
        </div>
    );
};

export default SongTimer;
