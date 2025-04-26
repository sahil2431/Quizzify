import React, { useEffect, useState } from 'react';


const Teacher = () => {
  const [totalQuizzesHosted, setTotalQuizzesHosted] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [avgParticipants, setAvgParticipants] = useState(0);
  const [recentQuizzes, setRecentQuizzes] = useState([]);

  useEffect(() => {
    // Sample data instead of API call
    const loadSampleData = () => {
      setIsLoading(true);
      
      // Sample quiz data
      const sampleData = {
        quizzes: [
          {
            _id: "quiz1",
            code: "ABC123",
            title: "JavaScript Basics",
            createdAt: "2025-04-10T10:30:00Z",
            participants: [
              { id: "user1" },
              { id: "user2" },
              { id: "user3" },
              { id: "user4" },
              { id: "user5" }
            ]
          },
          {
            _id: "quiz2",
            code: "XYZ789",
            title: "React Fundamentals",
            createdAt: "2025-04-15T14:45:00Z",
            participants: [
              { id: "user1" },
              { id: "user3" },
              { id: "user6" }
            ]
          },
          {
            _id: "quiz3",
            code: "DEF456",
            title: "Database Design",
            createdAt: "2025-04-20T09:15:00Z",
            participants: [
              { id: "user2" },
              { id: "user4" },
              { id: "user5" },
              { id: "user7" }
            ]
            },
        ]
      };
      
      
      setTotalQuizzesHosted(sampleData.quizzes.length);
      
      // Calculate average participants
      const totalParticipants = sampleData.quizzes.reduce(
        (acc, quiz) => acc + quiz.participants.length, 
        0
      );
      const avgParticipantsCount = sampleData.quizzes.length > 0 
        ? Math.round(totalParticipants / sampleData.quizzes.length) 
        : 0;
      setAvgParticipants(avgParticipantsCount);
      
      // Set recent quizzes
      setRecentQuizzes(
        sampleData.quizzes.map((quiz) => ({
          id: quiz._id,
          code: quiz.code,
          title: quiz.title,
          date: quiz.createdAt,
          participants: quiz.participants.length
        }))
      );
      
      setIsLoading(false);
    };

    // Simulate loading time for realism
    setTimeout(loadSampleData, 500);
  }, []);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg border p-6 flex flex-col items-center bg-indigo-100 text-indigo-800 border-indigo-300">
            <span className="text-lg font-medium">Total Quizzes Hosted</span>
            <span className="text-4xl font-bold mt-2">{totalQuizzesHosted}</span>
          </div>

          <div className="rounded-lg border p-6 flex flex-col items-center bg-cyan-100 text-cyan-800 border-cyan-300">
            <span className="text-lg font-medium">Avg. Participants</span>
            <span className="text-4xl font-bold mt-2">{avgParticipants}</span>
          </div>

          <div className="rounded-lg border p-6 flex flex-col items-center bg-emerald-100 text-emerald-800 border-emerald-300">
            <span className="text-lg font-medium">Total Participants</span>
            <span className="text-4xl font-bold mt-2">
              {recentQuizzes.reduce((acc, quiz) => acc + quiz.participants, 0)}
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
                    Quiz Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
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
                      {quiz.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(quiz.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {quiz.participants}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No quizzes hosted yet.</p>
        )}
      </div>
    </div>
  );
};

export default Teacher;