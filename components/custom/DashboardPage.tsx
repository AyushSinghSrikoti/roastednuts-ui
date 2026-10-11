import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Database,
  MoreHorizontal,
  Server,
  TriangleAlert,
} from "lucide-react";

const metrics = [
  {
    label: "Events today",
    value: "24,892",
    change: "+12.4%",
    trend: "up",
    detail: "vs. yesterday",
    icon: Activity,
    accent: "text-[#79533d] bg-[#f2e2d0]",
  },
  {
    label: "Error rate",
    value: "0.82%",
    change: "-0.16%",
    trend: "down",
    detail: "vs. yesterday",
    icon: TriangleAlert,
    accent: "text-[#a6483a] bg-[#f8ded9]",
  },
  {
    label: "Active services",
    value: "6",
    change: "All healthy",
    trend: "steady",
    detail: "across production",
    icon: Server,
    accent: "text-[#477250] bg-[#e2f0e4]",
  },
  {
    label: "Storage used",
    value: "1.8 GB",
    change: "18%",
    trend: "steady",
    detail: "of 10 GB allowance",
    icon: Database,
    accent: "text-[#53658d] bg-[#e2e8f4]",
  },
];

const logs = [
  { level: "ERROR", message: "Payment gateway request timed out", service: "checkout-api", time: "12 sec ago", color: "bg-[#c25343]" },
  { level: "WARN", message: "Database pool reached 80% capacity", service: "users-api", time: "2 min ago", color: "bg-[#d89035]" },
  { level: "INFO", message: "Deployment 1.4.2 completed successfully", service: "deploy-worker", time: "8 min ago", color: "bg-[#4f8060]" },
  { level: "ERROR", message: "Unable to refresh authentication token", service: "auth-service", time: "14 min ago", color: "bg-[#c25343]" },
  { level: "INFO", message: "Daily archive segment uploaded", service: "log-writer", time: "22 min ago", color: "bg-[#4f8060]" },
];

const chartBars = [42, 58, 47, 65, 52, 71, 62, 76, 57, 68, 84, 73, 92, 79, 86, 69, 82, 95, 76, 89, 68, 74, 61, 72];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.035em] text-[#2c2018] sm:text-3xl">Good evening</h1>
          <p className="mt-1 text-sm text-[#806c5f]">Here&apos;s what&apos;s happening across your services today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#887366]">
          <Clock3 className="size-3.5" />
          Last updated just now
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Overview metrics">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="rounded-2xl border border-[#e0d5c8] bg-[#fffdf9] p-4 shadow-[0_1px_2px_rgba(48,32,22,0.03)] sm:p-5">
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium text-[#897568]">{metric.label}</p>
                <span className={`grid size-8 place-items-center rounded-xl ${metric.accent}`}><Icon className="size-4" /></span>
              </div>
              <p className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-[#2d2119]">{metric.value}</p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                <span className={metric.trend === "up" ? "text-[#4f8060]" : metric.trend === "down" ? "text-[#4f8060]" : "text-[#6f5b4e]"}>
                  {metric.trend === "up" ? <ArrowUpRight className="mr-0.5 inline size-3" /> : null}
                  {metric.trend === "down" ? <ArrowDownRight className="mr-0.5 inline size-3" /> : null}
                  {metric.change}
                </span>
                <span className="text-[#a18f83]">{metric.detail}</span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.7fr)]">
        <article className="rounded-2xl border border-[#e0d5c8] bg-[#fffdf9] p-5 shadow-[0_1px_2px_rgba(48,32,22,0.03)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-[#35271e]">Event volume</h2>
              <p className="mt-1 text-xs text-[#927f72]">Events received over the last 24 hours</p>
            </div>
            <button type="button" className="rounded-lg border border-[#dfd4c8] bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#6f5b4e]">Last 24 hours</button>
          </div>
          <div className="mt-7 flex h-52 items-end gap-1.5 border-b border-[#e9e0d6] sm:gap-2" aria-label="Dummy event volume chart">
            {chartBars.map((height, index) => (
              <div key={index} className="group relative flex h-full flex-1 items-end">
                <div
                  className="w-full rounded-t-sm bg-[#b88966]/55 transition-all duration-300 hover:bg-[#87583c]"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-[#aa998e]"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>Now</span></div>
        </article>

        <article className="rounded-2xl border border-[#e0d5c8] bg-[#fffdf9] p-5 shadow-[0_1px_2px_rgba(48,32,22,0.03)] sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#35271e]">Usage this month</h2>
              <p className="mt-1 text-xs text-[#927f72]">Free plan allowance</p>
            </div>
            <MoreHorizontal className="size-4 text-[#a18f83]" />
          </div>
          <div className="mt-7 grid place-items-center">
            <div className="relative grid size-36 place-items-center rounded-full" style={{ background: "conic-gradient(#805239 0 18%, #eee4d8 18% 100%)" }}>
              <div className="grid size-[116px] place-items-center rounded-full bg-[#fffdf9] text-center">
                <div><p className="text-2xl font-semibold tracking-[-0.04em]">18%</p><p className="text-[10px] text-[#9a877a]">used</p></div>
              </div>
            </div>
          </div>
          <div className="mt-7 space-y-3">
            <div className="flex items-center justify-between text-xs"><span className="text-[#897568]">Stored logs</span><span className="font-medium text-[#3e2e24]">1.8 / 10 GB</span></div>
            <div className="flex items-center justify-between text-xs"><span className="text-[#897568]">Retention</span><span className="font-medium text-[#3e2e24]">3 days</span></div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.7fr)]">
        <article className="overflow-hidden rounded-2xl border border-[#e0d5c8] bg-[#fffdf9] shadow-[0_1px_2px_rgba(48,32,22,0.03)]">
          <div className="flex items-center justify-between border-b border-[#e9e0d6] px-5 py-4 sm:px-6">
            <div><h2 className="text-sm font-semibold text-[#35271e]">Recent logs</h2><p className="mt-0.5 text-xs text-[#927f72]">Latest events across all services</p></div>
            <button type="button" className="flex items-center gap-1 text-xs font-medium text-[#75452e] hover:text-[#4e2d1e]">View all <ArrowRight className="size-3" /></button>
          </div>
          <div className="divide-y divide-[#eee6dc]">
            {logs.map((log, index) => (
              <div key={`${log.message}-${index}`} className="grid gap-2 px-5 py-3.5 transition hover:bg-[#fbf7f1] sm:grid-cols-[70px_minmax(0,1fr)_120px_80px] sm:items-center sm:px-6">
                <span className="flex items-center gap-2 font-mono text-[10px] font-semibold text-[#69564a]"><span className={`size-1.5 rounded-full ${log.color}`} />{log.level}</span>
                <p className="truncate text-xs font-medium text-[#423127]">{log.message}</p>
                <span className="w-fit rounded-md bg-[#f0e8de] px-2 py-1 font-mono text-[10px] text-[#755e4f]">{log.service}</span>
                <span className="text-right text-[10px] text-[#a08e82]">{log.time}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[#e0d5c8] bg-[#fffdf9] p-5 shadow-[0_1px_2px_rgba(48,32,22,0.03)] sm:p-6">
          <h2 className="text-sm font-semibold text-[#35271e]">Service health</h2>
          <p className="mt-1 text-xs text-[#927f72]">Production environment</p>
          <div className="mt-5 space-y-4">
            {["checkout-api", "users-api", "auth-service", "log-writer"].map((service) => (
              <div key={service} className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-[#4f8060]" />
                <span className="flex-1 font-mono text-xs text-[#503d31]">{service}</span>
                <span className="text-[10px] font-medium text-[#4f8060]">Healthy</span>
              </div>
            ))}
          </div>
          <button type="button" className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#ded3c7] bg-[#fbf7f1] py-2.5 text-xs font-medium text-[#6b5547] transition hover:bg-[#f3ebe1]">
            View infrastructure <ArrowUpRight className="size-3" />
          </button>
        </article>
      </section>
    </div>
  );
}
