# Speech Emotion Recognition System

## Overview
This project implements a Speech Emotion Recognition (SER) system that classifies emotions from audio recordings using the RAVDESS Dataset. The system utilizes deep learning techniques to extract features from audio signals and train a model to recognize emotions such as happiness, sadness, anger, fear, and others.

## Dataset
The system is trained using the **RAVDESS Dataset**, which consists of emotional speech audio recordings. The dataset is organized into folders by actor and contains labels corresponding to various emotions.

- **RAVDESS Dataset**: [Link to RAVDESS Dataset](https://www.kaggle.com/datasets/annavictorova/ravdess-emotional-speech-audio)

## Features
- Extracts Mel-frequency cepstral coefficients (MFCCs) from audio files as features.
- Utilizes a feedforward neural network for emotion classification.
- Implements dropout layers for regularization and early stopping to prevent overfitting.
- Provides real-time predictions of emotions based on audio input.

## Installation
### Prerequisites
- Python 3.7 or higher
- TensorFlow
- Keras
- Librosa
- NumPy
- Scikit-learn

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/speech-emotion-recognition.git
   cd speech-emotion-recognition

Install the required packages:

pip install -r requirements.txt

### Usage

1. Place your audio files from the RAVDESS Dataset in the designated folder.

2. Run the feature extraction script:

python scripts/extract_features.py

3. Train the model:

python scripts/train_model.py

4. Test the model with new audio inputs:

python scripts/predict.py --audio_path path_to_audio_file.wav

### File Structure

speech-emotion-recognition/
│
├── dataset/                  # Contains the RAVDESS Dataset
│   └── RAVDESS/
│
├── models/                   # Trained models
│   └── emotion_model.h5      # Model file
│
├── scripts/                  # Python scripts
│   ├── extract_features.py    # Script for feature extraction
│   ├── train_model.py         # Script for training the model
│   └── predict.py             # Script for making predictions
│
├── requirements.txt           # Required Python packages
│
└── README.md                  # Project documentation

### Acknowledgments

- Librosa for audio processing.
- Keras for building and training the neural network.
- TensorFlow for machine learning.

### License

This project is licensed under the MIT License - see the LICENSE file for details.
