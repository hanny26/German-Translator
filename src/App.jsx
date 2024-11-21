import React, { useState } from "react";
import dictionary from "./dictionary"; // Assuming this is an object with English words as keys and German translations as values
import { FaVolumeUp, FaExchangeAlt, FaSpinner, FaSearch, FaGlobe } from "react-icons/fa"; // Added icons
import Fuse from "fuse.js"; // Importing Fuse.js for fuzzy search

const App = () => {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize Fuse.js with the dictionary data
  const fuse = new Fuse(Object.keys(dictionary), {
    includeScore: true,
    threshold: 0.3,
  });

  // Function to handle translation using fuzzy search
  const handleTranslate = () => {
    setLoading(true);
    setTimeout(() => {
      const inputText = text.toLowerCase().trim();

      const result = fuse.search(inputText);

      if (result.length > 0 && result[0].score < 0.3) {
        const closestMatch = result[0].item;
        setTranslation(dictionary[closestMatch]);
      } else {
        setTranslation("Translation not found!");
      }

      setLoading(false);
    }, 500);
  };

  // Function to handle pronunciation and animation
  const handlePronounce = () => {
    const utterance = new SpeechSynthesisUtterance(translation);
    utterance.lang = "de-DE"; // For German pronunciation
    speechSynthesis.speak(utterance);
    setIsSpeaking(true); // Start animation of the face

    // Stop the animation once the speech is done
    utterance.onend = () => setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 transition-all duration-300">
      {/* Header with creator credit */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-sm font-medium text-white transition-all duration-300">
        <p>Created by <span className="font-bold text-yellow-300">Hanny Vyas🎨 </span> </p>
      </div>

      <div className="bg-white bg-opacity-90 mt-14 mb-4 rounded-3xl p-8 w-full max-w-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-400 to-purple-600 text-center mb-6 transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-yellow-400">
          English to German Translator
        </h1>

        <div className="flex justify-center items-center mb-6 text-blue-500">
          <FaExchangeAlt size={30} className="mr-2" />
          <p className="text-xl font-medium">Enter an English word to translate to German</p>
        </div>

        <div className="relative">
          <FaSearch className="absolute left-4 top-3 text-gray-500" size={20} />
          <textarea
            className="w-full p-4 pl-12 border-2 border-blue-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder="Enter text to translate..."
            rows="6"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleTranslate}
          className="mt-6 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-8 rounded-lg w-full max-w-sm hover:bg-gradient-to-r hover:from-teal-400 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2 text-white" />
              <span className="text-sm md:text-lg">Translating...</span>
            </>
          ) : (
            <>
              <FaGlobe className="mr-2 text-white" />
              <span className="text-sm md:text-lg">Translate</span>
            </>
          )}
        </button>

        {translation && (
          <div className="mt-8 p-6 rounded-lg shadow-xl bg-blue-50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-blue-700">Translated Text:</h2>
            <p className="mt-2 text-lg text-blue-800">{translation}</p>

            {/* Pronunciation Button with Speaking Icon */}
            <div className="flex items-center mt-6 space-x-4">
              <div className="flex items-center">
                <p className="text-xl text-blue-700">Listen to the pronunciation:</p>
              </div>
              <button
                onClick={handlePronounce}
                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <FaVolumeUp className="mr-2" />
                
              </button>
            </div>

            {/* Face/Character Animation when Speaking */}
            {isSpeaking && (
              <div className="flex justify-center mt-6">
                <div className="animate-pulse flex flex-col items-center">
                  <img
                    src="https://avatars.githubusercontent.com/u/137649234?v=4" // Replace with your face image URL
                    alt="Speaking Character"
                    className="w-24 h-24 rounded-full border-4 border-yellow-300"
                  />
                  <p className="mt-2 text-lg text-yellow-300">Speaking...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
