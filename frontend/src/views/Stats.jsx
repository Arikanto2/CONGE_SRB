import React from "react";
import GanttChart from "../Composants/Chart.jsx";
import {exampleTasks} from "../data/Conge.js"

export default function Stats() {
    return (
        <div className="p-6">
            <GanttChart tasks={exampleTasks} dayWidth={28} />
        </div>
    );
}
