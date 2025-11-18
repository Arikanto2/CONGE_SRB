import React, { useEffect, useState } from "react";
import GanttChart from "../Composants/Chart.jsx";
import { getTasks } from "../api/tasks.js";

export default function Stats() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTasks();
      setTasks(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      {tasks.length > 0 ? (
        <GanttChart tasks={tasks} dayWidth={28} />
      ) : (
        <div className="flex h-64 flex-col items-center justify-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
