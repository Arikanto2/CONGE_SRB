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
        <p className="p-4 text-slate-600">Chargement des données...</p>
      )}
    </div>
  );
}
