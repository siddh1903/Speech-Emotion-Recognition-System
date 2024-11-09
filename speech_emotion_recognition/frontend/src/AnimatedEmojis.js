import React, { useEffect, useState } from 'react';
import './AnimatedEmojis.css'; // Ensure this file exists for styling

const emojiList = ['😐', '😌', '😊', '😢', '😠', '😨', '🤢', '😲']; // List of emojis

const AnimatedEmojis = () => {
    const [emojis, setEmojis] = useState([]);

    const handleMouseMove = (event) => {
        // Create a new emoji at the cursor position
        const newEmoji = {
            emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
            left: event.clientX,
            top: event.clientY,
        };
        setEmojis((prev) => [...prev, newEmoji]);

        // Remove the emoji after a certain duration
        setTimeout(() => {
            setEmojis((prev) => prev.filter((e) => e !== newEmoji));
        }, 2000); // Change duration as needed
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="emoji-container">
            {emojis.map((emoji, index) => (
                <div
                    key={index}
                    className="emoji"
                    style={{
                        position: 'absolute',
                        left: emoji.left,
                        top: emoji.top,
                        transition: 'transform 0.5s',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    {emoji.emoji}
                </div>
            ))}
        </div>
    );
};

export default AnimatedEmojis;
