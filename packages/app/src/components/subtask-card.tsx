import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { dataService } from "@/services/api-service";
import type { SubtaskSchema } from "@/types";
import { Badge } from "./ui/badge";
import { EditSubtaskForm } from "./forms/edit-subtask-form";
import { useState } from "react";
import { CalendarIcon, Trash2Icon, EditIcon } from "lucide-react";

interface SubtaskCardProps {
    subtask: SubtaskSchema;
    taskId: number;
    fetchTask: () => void;
}

export function SubtaskCard({ subtask, taskId, fetchTask }: SubtaskCardProps) {
    const [isEditSubtaskDialogOpen, setIsEditSubtaskDialogOpen] = useState(false);
    const [editingSubtask, setEditingSubtask] = useState<SubtaskSchema | null>(null);

    return (
        <Card className="flex flex-col w-full p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out border border-gray-200 dark:border-gray-700 rounded-lg">
            <CardHeader className="pb-2 px-0 pt-0">
                <CardTitle className="text-xl font-bold leading-tight">{subtask.title}</CardTitle>
                {subtask.description && <CardDescription className="text-sm text-gray-500 mt-1 line-clamp-2">{subtask.description}</CardDescription>}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between pt-2 px-0">
                <div className="flex items-center justify-between text-sm mb-3">
                    <Badge className={`px-2 py-1 rounded ${subtask.status === "NOT STARTED" ? "bg-gray-100 text-gray-700" :
                        subtask.status === "IN PROGRESS" ? "bg-blue-100 text-blue-700" : subtask.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        {subtask.status}
                    </Badge>
                    <span className="flex items-center text-gray-500">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(subtask.deadline).toLocaleDateString()}
                    </span>
                </div>
                <div className="flex mt-auto space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Dialog open={isEditSubtaskDialogOpen} onOpenChange={(open) => {
                        setIsEditSubtaskDialogOpen(open);
                        if (!open) {
                            setEditingSubtask(null);
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => {
                                setEditingSubtask(subtask);
                                setIsEditSubtaskDialogOpen(true);
                            }}><EditIcon className="w-5 h-5" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Subtask</DialogTitle>
                            </DialogHeader>
                            {editingSubtask && (
                                <EditSubtaskForm subtask={editingSubtask} onSubtaskUpdated={() => {
                                    setIsEditSubtaskDialogOpen(false);
                                    setEditingSubtask(null);
                                    fetchTask();
                                }} />
                            )}
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900"><Trash2Icon className="w-5 h-5" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you sure?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete the subtask.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="secondary">Cancel</Button>
                                <Button variant="destructive" onClick={async () => {
                                    await dataService.deleteSubtask(taskId, subtask.id!);
                                    fetchTask();
                                }}>Delete</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}