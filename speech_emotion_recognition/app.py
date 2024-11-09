from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import librosa
import os
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)  # Allow CORS for React frontend

# Load the trained emotion recognition model from the correct path
model = load_model(r"D:\speech_emotion_recognition\emotion_model.h5")

# Define the emotion mapping
emotion_map_reverse = {0: "Neutral", 1: "Calm", 2: "Happy", 3: "Sad", 4: "Angry",
                       5: "Fearful", 6: "Disgust", 7: "Surprised"}

# Function to extract features from audio
def extract_features(audio_path):
    y, sr = librosa.load(audio_path, sr=22050)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    return np.mean(mfccs.T, axis=0)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"})
    
    if file:
        # Save the file temporarily in a Windows-compatible way
        temp_dir = r"C:\temp"  # Ensure this directory exists on your system
        os.makedirs(temp_dir, exist_ok=True)  # Create temp_dir if it doesn't exist
        file_path = os.path.join(temp_dir, file.filename)
        file.save(file_path)
        
        # Extract features and make prediction
        features = extract_features(file_path)
        features = features.reshape(1, -1)  # Reshape for prediction
        prediction = model.predict(features)
        predicted_emotion = np.argmax(prediction)
        
        # Return the predicted emotion
        return jsonify({"emotion": emotion_map_reverse[predicted_emotion]})

if __name__ == '__main__':
    app.run(debug=True)
