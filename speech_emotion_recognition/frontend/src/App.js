import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import AnimatedEmojis from './AnimatedEmojis'; // Import the animated emojis component

function App() {
    const [file, setFile] = useState(null);
    const [emotion, setEmotion] = useState('');
    const [audioUrl, setAudioUrl] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0); // State for recording time
    const audioRef = useRef(null);
    const fileInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunks = useRef([]);
    const timerRef = useRef(null); // Reference for the timer

    const emotionEmojiMap = {
        "Neutral": "😐",
        "Calm": "😌",
        "Happy": "😊",
        "Sad": "😢",
        "Angry": "😠",
        "Fearful": "😨",
        "Disgust": "🤢",
        "Surprised": "😲"
    };

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (!uploadedFile) return; // Ensure there's a file

        setFile(uploadedFile);
        setEmotion(''); // Clear previous emotion
        setAudioUrl(null); // Clear previous audio URL

        const audioUrl = URL.createObjectURL(uploadedFile);
        setAudioUrl(audioUrl);
        playAudio(audioUrl); // Play audio upon file selection
        handleSubmit(uploadedFile); // Immediately process the uploaded file
    };

    const playAudio = (url) => {
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play();
        }
    };

    const handleSubmit = async (uploadedFile) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setEmotion(data.emotion);

            // Automatically clear emotion and file after 5 seconds
            setTimeout(() => {
                resetState();
            }, 5000);
        } catch (error) {
            console.error("Error during prediction:", error);
            alert("There was an error processing your request.");
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setEmotion('');
        setFile(null);
        setAudioUrl(null);
    };

    const handleStartRecording = async () => {
        setEmotion(''); // Clear previous emotion
        setAudioUrl(null); // Clear previous audio URL
        recordedChunks.current = []; // Reset recorded chunks
        setRecordingTime(0); // Reset recording time
        setIsRecording(true); // Start recording
        timerRef.current = setInterval(() => {
            setRecordingTime((prevTime) => prevTime + 1); // Increment recording time every second
        }, 1000);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.current.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = async () => {
            clearInterval(timerRef.current); // Clear the timer
            const audioBlob = new Blob(recordedChunks.current, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);
            playAudio(audioUrl); // Play the recorded audio
            handleSubmit(audioBlob); // Automatically predict emotion after recording
            setRecordingTime(0); // Reset recording time after stop
        };

        mediaRecorderRef.current.start();
    };

    const handleStopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    return (
        <div
            className="app-container"
            style={{
                backgroundImage: `url("/pexels-tara-winstead-8386440.jpg")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(0px)',
            }}
        >
            <div className="content">
                <h1 className="title">Speech Emotion Recognition</h1>

                {/* Add animated emojis here */}
                <AnimatedEmojis />

                <form className="upload-form" onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="audio/*"
                        className="file-input"
                        ref={fileInputRef}
                        style={{ display: 'none' }} // Hide the default input
                    />
                    <button
                        type="button"
                        className="file-select-button"
                        onClick={() => fileInputRef.current.click()}
                    >
                        Choose File
                    </button>

                    {/* Recording buttons with timer display */}
                    <div className="recording-controls">
                        {!isRecording ? (
                            <button
                                type="button"
                                className="record-button"
                                onClick={handleStartRecording}
                            >
                                Start Recording
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="stop-button"
                                onClick={handleStopRecording}
                            >
                                Stop Recording
                            </button>
                        )}
                        {isRecording && (
                            <span className="timer">
                                {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:
                                {(recordingTime % 60).toString().padStart(2, '0')}
                            </span>
                        )}
                    </div>

                    {loading && <h3>Processing...</h3>} {/* Loading message */}
                    {file && !loading && <h3>File Uploaded!</h3>}
                </form>

                {emotion && (
                    <h2 className="emotion-result">
                        Predicted Emotion: {emotion} {emotionEmojiMap[emotion]}
                    </h2>
                )}

                {audioUrl && (
                    <div className="audio-player">
                        <h3>Uploaded/Recorded Audio:</h3>
                        <audio ref={audioRef} controls autoPlay src={audioUrl}>
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
