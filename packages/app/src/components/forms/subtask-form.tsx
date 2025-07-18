import { Input } from "../ui/input";
import { Label } from "../ui/label";
import * as z from "zod";

const subtaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: z.enum(["To Do", "In Progress", "Done"]),
    estimatedDuration: z.number().int().min(0).optional(),
    actualDuration: z.number().int().min(0).optional(),
});

type SubtaskFormValues = z.infer<typeof subtaskSchema>;


function SubtaskForm() {
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="lg:grid grid-cols-2 grid-rows-3 items-baseline gap-12">
            <div>
                <div>
                    <Label htmlFor="title" className="my-2 font-semibold text-xl">Title</Label>
                    <Input id="title" type="text" {...register("title")} />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>
                <div className="mt-4">
                    <Label htmlFor="description" className="my-2 font-semibold text-xl">Description</Label>
                    <Textarea id="description" {...register("description")} />
                </div>
            </div>
        </form>
    )
}


export default SubtaskForm;
