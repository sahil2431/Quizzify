import React, { useEffect, useState } from "react";
import { getStudentQuizzData} from "../../services/api";

const Student = () => {
  const [averageScore, setAverageScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [recentQuizzes, setRecentQuizzes] = useState([]);

  const getScoreColor = (score) => {
    if (score < 35) return "bg-red-100 text-red-800 border-red-300";
    if (score < 60) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-green-100 text-green-800 border-green-300";
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getStudentQuizzData();
        console.log("User Quiz Data:", response);
        setAverageScore(response.averagePercentage);
        setRecentQuizzes(
          response.leaderboardEntries.map((entry) => ({
            id: entry._id,
            date: entry.createdAt,
            score: (entry.score / entry.maxScore) * 100,
            title: entry.quizCode,
          }))
        );
        setTotalQuizzes(response.leaderboardEntries.length);
        const totalQuestions = response.leaderboardEntries.reduce(
          (acc, entry) => acc + entry.maxScore,
          0
        );
        setQuestionsAttempted(totalQuestions);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }
  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`rounded-lg border p-6 flex flex-col items-center ${getScoreColor(
              averageScore
            )}`}
          >
            <span className="text-lg font-medium">Average Score</span>
            <span className="text-4xl font-bold mt-2">{averageScore}%</span>
          </div>

          <div className="rounded-lg border p-6 flex flex-col items-center bg-blue-100 text-blue-800 border-blue-300">
            <span className="text-lg font-medium">Total Quizzes</span>
            <span className="text-4xl font-bold mt-2">{totalQuizzes}</span>
          </div>

          <div className="rounded-lg border p-6 flex flex-col items-center bg-purple-100 text-purple-800 border-purple-300">
            <span className="text-lg font-medium">Questions Attempted</span>
            <span className="text-4xl font-bold mt-2">
              {questionsAttempted}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Quizzes</h2>
        {recentQuizzes.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentQuizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quiz.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(quiz.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(
                          quiz.score
                        )}`}
                      >
                        {quiz.score}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No quizzes taken yet.</p>
        )}
      </div>
    </div>
  );
};

export default Student;
