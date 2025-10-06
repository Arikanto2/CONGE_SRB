import React from "react";
import GanttChart from "../Composants/Chart.jsx";
import {exampleTasks} from "../data/Conge.js"

export default function Stats() {
    return (
        <div>
            <GanttChart tasks={exampleTasks} dayWidth={28} />
        </div>
    );
}
