"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Pie, PieChart, Cell } from "recharts";

interface InsightsClientProps {
  monthData: { month: string; count: number }[];
  genreData: { genre: string; count: number }[];
}

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

export function InsightsClient({ monthData, genreData }: InsightsClientProps) {
  const chartConfig = {
    count: {
      label: "감상 수",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>월별 감상 추이</CardTitle>
          <CardDescription>월별 영화 감상 횟수입니다.</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          {monthData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={monthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false} 
                  fontSize={12} 
                  tickFormatter={(val) => {
                    const [, m] = val.split("-");
                    return `${Number(m)}월`;
                  }}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground border border-dashed rounded-lg bg-muted/20">
              데이터가 충분하지 않습니다.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>선호 장르 분포</CardTitle>
          <CardDescription>최근 감상한 영화 기준 선호 장르입니다.</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          {genreData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="genre"
                    label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground border border-dashed rounded-lg bg-muted/20">
              데이터가 충분하지 않습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
