import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Activity } from "lucide-react"

const timeChartConfig = {
    totalDuration: {
        label: "Time Spent (minutes)",
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
                    <defs>
                        <linearGradient id="fillTotalDuration" x1="0" y1="0" x2="0" y2="1">
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
                        dataKey="totalDuration"
                        type="step"
                        fill="url(#fillTotalDuration)"
                        fillOpacity={0.4}
                        stroke="var(--chart-2)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}
