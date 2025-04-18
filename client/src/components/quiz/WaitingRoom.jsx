import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase';

const WaitingRoom = ({ quiz, quizCode, onExit }) => {
  const [players, setPlayers] = useState({});
  const [countdown, setCountdown] = useState(null);
  
  // Listen for players joining
  useEffect(() => {
    const playersRef = ref(database, `quizzes/${quizCode}/players`);
    
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPlayers(data);
    });
    
    // Listen for countdown to start
    const countdownRef = ref(database, `quizzes/${quizCode}/countdown`);
    const unsubscribeCountdown = onValue(countdownRef, (snapshot) => {
      const countdownValue = snapshot.val();
      setCountdown(countdownValue);
    });
    
    return () => {
      unsubscribe();
      unsubscribeCountdown();
    };
  }, [quizCode]);
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{quiz?.title || 'Quiz'}</h1>
        <div className="flex items-center">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            Code: {quizCode}
          </span>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Waiting for host to start the quiz...</h2>
        {countdown !== null && (
          <div className="text-center py-4">
            <p className="text-lg">Quiz starting in:</p>
            <p className="text-4xl font-bold text-blue-600">{countdown}</p>
          </div>
        )}
        <p className="text-gray-600">{quiz?.description}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Players ({Object.keys(players).length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Object.values(players).map((player, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-md flex items-center">
              {player.photoURL ? (
                <img 
                  src={player.photoURL} 
                  alt={player.displayName} 
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
                  {player.displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="truncate">{player.displayName}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onExit}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Exit
        </button>
        <div className="flex items-center text-sm text-gray-500">
          <span className="animate-pulse mr-2">●</span>
          Waiting for host to start...
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom; 