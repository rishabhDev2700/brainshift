import type { GoalSchema } from '@/types';
import ForceGraph2D from 'react-force-graph-2d';
import { useMemo, useRef, useEffect, useState } from 'react';
import { useTheme } from '@/contexts/theme-provider';

interface GoalsGraphProps {
    goals: GoalSchema[];
}

function GoalsGraph2D({ goals }: GoalsGraphProps) {
    const theme = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div ref={containerRef} className='relative w-full h-96 rounded-3xl overflow-clip'>
            <ForceGraph2D
                width={dimensions.width}
                height={dimensions.height}
                backgroundColor={theme.theme === "dark" ? '#222F' : "#cccF"}
                graphData={graphData}
                enableNodeDrag={true}
                nodeAutoColorBy="status"
                linkDirectionalParticles={5}
                nodeLabel={n => n.title}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.title;
                    const fontSize = 14 / globalScale;
                    ctx.font = `${fontSize}px Work sans`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions: number[] = [textWidth, fontSize].map(n => n + fontSize * 1.5);
                    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                    ctx.fillRect(Number(node.x) - bckgDimensions[0] / 2, Number(node.y) - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = theme.theme === 'dark' ? '#000' : '#000';
                    ctx.fillText(label, Number(node.x), Number(node.y));
                    ctx.imageSmoothingEnabled = true
                }}

                linkColor={() => theme.theme === "dark" ? '#009966' : "#000"}
                linkWidth={2}
            />
        </div>
    );
}

export default GoalsGraph2D;
