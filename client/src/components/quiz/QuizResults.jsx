import React, { useState, useEffect } from 'react';

const QuizResults = ({ quiz, scores, currentUser, onExit, isTeacher }) => {
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [currentUserScore, setCurrentUserScore] = useState(null);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  
  // Process scores data
  useEffect(() => {
    const playersArray = Object.entries(scores).map(([userId, data]) => ({
      userId,
      displayName: data.displayName,
      photoURL: data.photoURL,
      score: data.score || 0
    }));
    
    // Sort by score (descending)
    const sorted = playersArray.sort((a, b) => b.score - a.score);
    setSortedPlayers(sorted);
    
    // Find current user's score and rank (only for students)
    if (!isTeacher) {
      const currentPlayer = playersArray.find(player => player.userId === currentUser.uid);
      if (currentPlayer) {
        setCurrentUserScore(currentPlayer.score);
        
        // Find rank (accounting for ties)
        const userRank = sorted.findIndex(player => player.userId === currentUser.uid);
        setCurrentUserRank(userRank !== -1 ? userRank + 1 : null);
      }
    }
  }, [scores, currentUser, isTeacher]);
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
        <p className="text-xl font-semibold text-gray-600 mb-4">
          {quiz.title}
        </p>
        
        {/* User's result - only show for students */}
        {!isTeacher && (
          <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto mb-8">
            <p className="text-lg mb-2">Your score:</p>
            <div className="text-4xl font-bold text-blue-600 mb-3">
              {currentUserScore || 0}
              <span className="text-xl text-gray-600">/{quiz.questions?.length || 0} points</span>
            </div>
            
            {currentUserRank && (
              <p className="text-gray-700">
                Your rank: <span className="font-bold">{currentUserRank}</span> of {sortedPlayers.length}
              </p>
            )}
          </div>
        )}
        
        {/* Teacher summary */}
        {isTeacher && (
          <div className="bg-green-50 rounded-lg p-6 max-w-md mx-auto mb-8">
            <p className="text-lg mb-2">Quiz Summary</p>
            <div className="text-lg mb-2">
              <span className="font-semibold">Participants:</span> {sortedPlayers.length}
            </div>
            
            {sortedPlayers.length > 0 && (
              <div className="text-lg mb-2">
                <span className="font-semibold">Average Score:</span> {
                  (sortedPlayers.reduce((sum, player) => sum + player.score, 0) / sortedPlayers.length).toFixed(1)
                } / {quiz.questions?.length || 0}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Final leaderboard */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Final Standings</h2>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <div 
                key={player.userId}
                className={`flex items-center p-3 rounded-md ${
                  !isTeacher && player.userId === currentUser.uid ? 'bg-blue-100 font-medium' : ''
                }`}
              >
                {/* Rank/medal */}
                <div className="w-10 mr-2">
                  {index === 0 && (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-white font-bold">1</span>
                  )}
                  {index === 1 && (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-400 text-white font-bold">2</span>
                  )}
                  {index === 2 && (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-white font-bold">3</span>
                  )}
                  {index > 2 && (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-800 font-bold">{index + 1}</span>
                  )}
                </div>
                
                {/* Player info */}
                <div className="flex items-center flex-1">
                  {player.photoURL ? (
                    <img 
                      src={player.photoURL} 
                      alt={player.displayName} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                      {player.displayName?.charAt(0).toUpperCase() || 'A'}
                    </div>
                  )}
                  <span>
                    {player.displayName}
                    {!isTeacher && player.userId === currentUser.uid && " (You)"}
                  </span>
                </div>
                
                {/* Score */}
                <div className="font-bold text-lg">{player.score}</div>
              </div>
            ))}
            
            {sortedPlayers.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No players found
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between">
        <button
          onClick={onExit}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Exit
        </button>
        
        {!quiz.isAIGenerated && !isTeacher && (
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizResults; 