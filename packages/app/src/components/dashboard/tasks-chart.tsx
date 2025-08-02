import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import {
    type ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    tasks: {
        label: "tasks",
        color: "var(--chart-2)",
    },

} satisfies ChartConfig

export function TasksChart({ data }: { data: any[] }) {
    return (
        <ChartContainer
            config={chartConfig}
            className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full"
        >
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="5%"
                                stopColor="var(--chart-2)"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="var(--chart-2)"
                                stopOpacity={0.1}
                            />
                        </linearGradient>

                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => {
                            const date = new Date(value)
                            return date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })
                        }}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                labelFormatter={(value) => {
                                    return new Date(value).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                                indicator="dot"
                            />
                        }
                    />
                    <Area
                        dataKey="tasks"
                        type="natural"
                        fill="url(#fillTasks)"
                        stroke="var(--chart-2)"
                        stackId="a"
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}
