import { get, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { database } from "../../firebase";

const Leaderboard = ({
  currentQuestion,
  quizId,
  totalQuestions,
  currentUser,
  isTeacher,
  onNextQuestion,
}) => {
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const leaderboardRef = ref(database, `quizzes/${quizId}/leaderboard`);
      const leaderboardSnapshot = await get(leaderboardRef);
      const leaderboardData = leaderboardSnapshot.val() || {};
      console.log(leaderboardData);
      if (leaderboardData) {
        const players = Object.entries(leaderboardData)
          .filter(([key]) => key !== "showLeaderboard") // Filter out the control flag
          .map(([userId, data]) => ({
            userId,
            ...data,
          }));

        console.log(players);

        const sorted = players.sort((a, b) => b.points - a.points);

        // Find current user's rank
        const rankIndex = sorted.findIndex(
          (player) => player.userId === currentUser.uid
        );
        setCurrentUserRank(rankIndex + 1); // +1 to convert index to rank

        setSortedPlayers(sorted);
        console.log(sortedPlayers)
      }
    };

    fetchLeaderboard();
  }, [quizId, currentUser.uid]);


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
        <p className="text-gray-600">
          After Question {currentQuestion} of {totalQuestions}
        </p>
        {isTeacher ? (
          <div className="mt-4">
            <button
              onClick={onNextQuestion}
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {currentQuestion < totalQuestions ? "Next Question" : "End Quiz"}
            </button>
          </div>
        ) : (
          <div className="mt-4 inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
            <p>Next question starting soon...</p>
          </div>
        )}
      </div>

      <div className="mb-8 mt-28">
        {/* Top 3 players podium */}
        {sortedPlayers.length > 0 && (
          <div className="flex justify-center items-end mb-8 h-40">
            {/* Second place */}
            {sortedPlayers.length > 1 && (
              <div className="w-1/4 mx-2 flex flex-col items-center">
                <div className="mb-2">
                  {sortedPlayers[1].photoURL ? (
                    <img
                      src={sortedPlayers[1].photoURL}
                      alt={sortedPlayers[1].displayName}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                      {sortedPlayers[1].displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="truncate text-center w-full">
                  {sortedPlayers[1].displayName}
                </div>
                <div className="font-bold">{sortedPlayers[1].points} pts</div>
                <div className="bg-gray-600  h-24 w-full rounded-t-lg flex items-center justify-center text-3xl font-bold text-white">
                  2
                </div>
              </div>
            )}

            {/* First place */}
            <div className="w-1/4 mx-2 flex flex-col items-center">
              <div className="mb-2">
                {sortedPlayers[0].photoURL ? (
                  <img
                    src={sortedPlayers[0].photoURL}
                    alt={sortedPlayers[0].displayName}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {sortedPlayers[0].displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="truncate text-center w-full font-medium">
                {sortedPlayers[0].displayName}
              </div>
              <div className="font-bold">{sortedPlayers[0].points} pts</div>
              <div className="bg-yellow-500 h-32 w-full rounded-t-lg flex items-center justify-center text-4xl font-bold text-white">
                1
              </div>
            </div>

            {/* Third place */}
            {sortedPlayers.length > 2 && (
              <div className="w-1/4 mx-2 flex flex-col items-center">
                <div className="mb-2">
                  {sortedPlayers[2].photoURL ? (
                    <img
                      src={sortedPlayers[2].photoURL}
                      alt={sortedPlayers[2].displayName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold">
                      {sortedPlayers[2].displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="truncate text-center w-full">
                  {sortedPlayers[2].displayName}
                </div>
                <div className="font-bold">{sortedPlayers[2].points} pts</div>
                <div className="bg-amber-700 h-16 w-full rounded-t-lg flex items-center justify-center text-2xl font-bold text-white">
                  3
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full leaderboard */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-4">Full Standings</h3>

          <div className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.userId}
                className={`flex items-center p-2 rounded-md ${
                  !isTeacher && player.userId === currentUser.uid
                    ? "bg-blue-100"
                    : ""
                }`}
              >
                <div className="font-semibold w-8">{index + 1}.</div>
                <div className="flex items-center flex-1">
                  {player.photoURL ? (
                    <img
                      src={player.photoURL}
                      alt={player.displayName}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                      {player.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span
                    className={`${
                      !isTeacher && player.userId === currentUser.uid
                        ? "font-semibold"
                        : ""
                    }`}
                  >
                    {player.displayName}
                    {!isTeacher &&
                      player.userId === currentUser.uid &&
                      " (You)"}
                  </span>
                </div>
                <div className="font-bold">{player.points}</div>
              </div>
            ))}

            { sortedPlayers.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No players yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Your position - only show for students */}
      {!isTeacher && currentUserRank && (
        <div className="text-center py-3 bg-blue-50 rounded-lg">
          <span className="font-medium">Your position: </span>
          <span className="font-bold">{currentUserRank}</span>
          <span className="font-medium"> of {sortedPlayers.length}</span>
        </div>
      )}

      {/* Teacher controls */}
      {isTeacher && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onNextQuestion}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {currentQuestion < totalQuestions ? "Next Question" : "End Quiz"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
