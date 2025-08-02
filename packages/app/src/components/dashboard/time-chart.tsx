import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Activity } from "lucide-react"

const timeChartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-2)",
        icon: Activity,
    },
} satisfies ChartConfig

export function TimeChart({ data }: { data: any[] }) {
    return (
        <ChartContainer config={timeChartConfig} className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Area
                        dataKey="desktop"
                        type="step"
                        fill="var(--color-desktop)"
                        fillOpacity={0.4}
                        stroke="var(--color-desktop)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}
