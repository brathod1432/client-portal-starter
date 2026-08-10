"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ticketTrend = [
  { month: "Mar", opened: 18, resolved: 15 },
  { month: "Apr", opened: 22, resolved: 20 },
  { month: "May", opened: 16, resolved: 19 },
  { month: "Jun", opened: 24, resolved: 21 },
  { month: "Jul", opened: 20, resolved: 23 },
  { month: "Aug", opened: 12, resolved: 14 },
];

const slaData = [
  { month: "Mar", uptime: 99.95 },
  { month: "Apr", uptime: 99.98 },
  { month: "May", uptime: 99.9 },
  { month: "Jun", uptime: 99.99 },
  { month: "Jul", uptime: 99.97 },
  { month: "Aug", uptime: 100 },
];

const spendByCategory = [
  { name: "Managed Support", value: 60000 },
  { name: "Networking", value: 32000 },
  { name: "Migration", value: 25800 },
  { name: "Compliance", value: 51000 },
];

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

const tooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--popover-foreground)",
};

export default function DashboardCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Ticket volume</CardTitle>
          <CardDescription>Opened vs. resolved, last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ticketTrend}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={28}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ opacity: 0.1 }} />
              <Bar
                dataKey="opened"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
                name="Opened"
                isAnimationActive={false}
              />
              <Bar
                dataKey="resolved"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
                name="Resolved"
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service availability</CardTitle>
          <CardDescription>Monthly uptime against 99.9% SLA</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={slaData}>
              <defs>
                <linearGradient id="uptime" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[99.8, 100]}
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ opacity: 0.1 }} />
              <Area
                type="monotone"
                dataKey="uptime"
                stroke="var(--chart-2)"
                fill="url(#uptime)"
                strokeWidth={2}
                name="Uptime %"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Spend by category</CardTitle>
          <CardDescription>
            Year-to-date engagement spend distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={spendByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                isAnimationActive={false}
              >
                {spendByCategory.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            {spendByCategory.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                  }}
                />
                {entry.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
