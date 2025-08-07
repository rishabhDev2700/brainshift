import type { GoalSchema } from '@/types';
import ForceGraph3D from 'react-force-graph-3d';
import { useMemo } from 'react';
import { useTheme } from '@/contexts/theme-provider';

interface GoalsGraphProps {
    goals: GoalSchema[];
}

function GoalsGraph({ goals }: GoalsGraphProps) {

    const theme = useTheme();

    const graphData = useMemo(() => {
        const nodes = goals.map(goal => ({
            id: goal.id,
            title: goal.title,
            status: goal.status,
            val: goal.priority
        }));

        const links = goals
            .filter(goal => goal.parentId)
            .map(goal => ({
                source: goal.id,
                target: goal.parentId,
            }));

        return { nodes, links };
    }, [goals]);

   
    return (
        <div className='rounded-3xl overflow-clip'>
            <ForceGraph3D
                backgroundColor={theme.theme === "dark" ? '#000F' : "#cccF"}
                graphData={graphData}
                enableNodeDrag={true}
                warmupTicks={5}
                nodeAutoColorBy="status"
                linkDirectionalParticles={5}
                nodeLabel={n => n.title}
                nodeResolution={20}
                linkOpacity={0.6}
                linkColor={theme.theme === "dark" ? '#000' : "#000"}
                linkWidth={2}
                linkResolution={20}
            />
        </div>
    );
}

export default GoalsGraph;
