import { useParams } from "react-router-dom";
import { TaskForm } from "@/components/forms/task-form";

function TaskFormPage() {
    let id = useParams().id;

    return (
        <div className="p-4 md:p-8 space-y-8">
            <h2 className="text-3xl font-bold tracking-tight mb-8">
                {id ? "Edit Task" : "Create New Task"}
            </h2>
            <TaskForm id={Number(id)} />
        </div>
    );
}

export default TaskFormPage;
