import { usePomodoroSettings } from "../hooks/usePomodoroSettings";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function SettingsPage() {
    const { settings, setSettings } = usePomodoroSettings();

    const handleWorkDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, workDuration: Number(e.target.value) }));
    };

    const handleBreakDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, breakDuration: Number(e.target.value) }));
    };

    const handleSave = () => {
        toast.success("Settings saved!");
    };

    return (
        <div className="container mx-auto px-0 md:px-8 py-4 md:py-8 space-y-8">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-100 mb-4 md:mb-0">Pomodoro Settings</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="workDuration">Work Duration (minutes)</Label>
                    <Input
                        id="workDuration"
                        type="number"
                        value={settings.workDuration}
                        onChange={handleWorkDurationChange}
                    />
                </div>
                <div>
                    <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                    <Input
                        id="breakDuration"
                        type="number"
                        value={settings.breakDuration}
                        onChange={handleBreakDurationChange}
                    />
                </div>
                <Button onClick={handleSave}>Save Settings</Button>
            </div>
        </div>
    );
}

export default SettingsPage;
