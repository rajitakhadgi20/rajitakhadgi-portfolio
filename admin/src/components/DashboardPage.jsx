import { useMemo, useState } from "react";
import { Icon } from "./icons";
import { Sparkline, MiniBars, LineChart, Donut } from "./charts";
import {
  bucketDays, bucketMonths, bucketWeeks, sum,
  dayLabel, monthShort, monthLong, initials, timeAgo,
} from "../lib/stats";

const PALETTE = ["#a65fd7", "#cea4eb", "#8b31ca", "#e879f9", "#6d4a8a", "#f5d0fe"];

function StatCard({ icon, label, value, note, noteTone, children }) {
  return (
    <section className="ad-card ad-stat">
      <div className="ad-stat-head">
        <span className="ad-chip"><Icon name={icon} size={14} /></span>
        {label}
      </div>
      <div className="ad-stat-body">
        <div>
          <div className="ad-stat-num">{value}</div>
          <p className={`ad-stat-note ${noteTone || ""}`}>{note}</p>
        </div>
        <div className="ad-stat-viz">{children}</div>
      </div>
    </section>
  );
}

export function DashboardPage({ projects, messages, onOpenMessage, onGo }) {
  const [months, setMonths] = useState(12);

  const d = useMemo(() => {
    // Categories (tags)
    const tagCounts = new Map();
    projects.forEach((p) => (p.tags || []).forEach((t) => tagCounts.set(t, (tagCounts.get(t) || 0) + 1)));
    const tags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]);

    const days14 = bucketDays(messages, 14).values;
    const unread14 = bucketDays(messages, 14, (m) => !m.read).values;
    const thisWeek = sum(days14.slice(-7));
    const unread = messages.filter((m) => !m.read).length;
    const monthPair = bucketMonths(messages, 2).values;

    return {
      tags,
      days14,
      unread14,
      thisWeek,
      unread,
      thisMonth: monthPair[1],
      monthDelta: monthPair[1] - monthPair[0],
      weeks8: bucketWeeks(messages, 8),
      days30: bucketDays(messages, 30),
    };
  }, [projects, messages]);

  const monthly = useMemo(() => {
    const all = bucketMonths(messages, months);
    const read = bucketMonths(messages, months, (m) => m.read).values;
    return { months: all.months, received: all.values, read };
  }, [messages, months]);

  const donutSegments = useMemo(() => {
    const top = d.tags.slice(0, 5).map(([label, value], i) => ({ label, value, color: PALETTE[i] }));
    const rest = sum(d.tags.slice(5).map(([, v]) => v));
    if (rest > 0) top.push({ label: "Other", value: rest, color: PALETTE[5] });
    return top;
  }, [d.tags]);

  const tagTotal = sum(d.tags.map(([, v]) => v));
  const maxTag = d.tags.length ? d.tags[0][1] : 1;
  const noMessages = messages.length === 0;

  return (
    <div className="ad-grid">
      {/* Row 1: stats */}
      <div className="c-3">
        <StatCard icon="projects" label="Projects on your site" value={projects.length}
          note={`${d.tags.length} categor${d.tags.length === 1 ? "y" : "ies"}`}>
          <MiniBars values={d.tags.slice(0, 7).map(([, v]) => v)} />
        </StatCard>
      </div>
      <div className="c-3">
        <StatCard icon="mail" label="Total messages" value={messages.length}
          note={d.thisWeek > 0 ? `+${d.thisWeek} in the last 7 days` : "None in the last 7 days"} noteTone={d.thisWeek > 0 ? "up" : ""}>
          <Sparkline values={d.days14} />
        </StatCard>
      </div>
      <div className="c-3">
        <StatCard icon="inbox" label="Unread messages" value={d.unread}
          note={d.unread === 0 ? "You're all caught up" : `${d.unread} waiting for you`} noteTone={d.unread > 0 ? "warn" : ""}>
          <Sparkline values={d.unread14} color="var(--accent-2)" />
        </StatCard>
      </div>
      <div className="c-3">
        <StatCard icon="calendar" label="Messages this month" value={d.thisMonth}
          note={d.monthDelta === 0 ? "Same as last month" : `${d.monthDelta > 0 ? "+" : ""}${d.monthDelta} vs last month`}
          noteTone={d.monthDelta > 0 ? "up" : ""}>
          <Sparkline values={d.weeks8} />
        </StatCard>
      </div>

      {/* Row 2: main chart + donut */}
      <section className="ad-card c-8">
        <div className="ad-card-head">
          <h3>Messages received</h3>
          <div className="ad-head-tools">
            <span className="ad-legend"><i style={{ background: "var(--accent)" }} />Received</span>
            <span className="ad-legend"><i style={{ background: "var(--accent-2)" }} />Read</span>
            <select className="ad-select" value={months} onChange={(e) => setMonths(Number(e.target.value))} aria-label="Time range">
              <option value={12}>Last 12 months</option>
              <option value={6}>Last 6 months</option>
            </select>
          </div>
        </div>
        <div className="ad-chart-wrap">
          <LineChart
            labels={monthly.months.map(monthShort)}
            tipLabels={monthly.months.map(monthLong)}
            series={[
              { name: "Received", color: "#a65fd7", values: monthly.received },
              { name: "Read", color: "#cea4eb", values: monthly.read, dashed: true },
            ]}
            height={270}
          />
          {noMessages && <p className="ad-chart-empty"><span>No messages yet — they'll appear here once someone uses your contact form.</span></p>}
        </div>
      </section>

      <section className="ad-card c-4">
        <div className="ad-card-head">
          <h3>Projects by category</h3>
        </div>
        {projects.length === 0 ? (
          <div className="ad-empty">No projects yet.<button className="btn small" onClick={() => onGo("projects", true)}>Add a project</button></div>
        ) : (
          <div className="ad-donut-block">
            <Donut segments={donutSegments} centerTop={projects.length} centerBottom={projects.length === 1 ? "project" : "projects"} />
            <ul className="ad-donut-legend">
              {donutSegments.map((s) => (
                <li key={s.label}><i style={{ background: s.color }} />{s.label}<b>{s.value}</b></li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Row 3: recent messages, 30-day activity, categories table */}
      <section className="ad-card c-4">
        <div className="ad-card-head">
          <h3>Recent messages</h3>
          <button className="ad-pill" onClick={() => onGo("messages")}>View all</button>
        </div>
        {messages.length === 0 ? (
          <div className="ad-empty">Nothing here yet.</div>
        ) : (
          <ul className="ad-msglist">
            {messages.slice(0, 4).map((m) => (
              <li key={m.id}>
                <button className="ad-msg" onClick={() => onOpenMessage(m)}>
                  <span className="ad-avatar">{initials(m.name)}</span>
                  <span className="ad-msg-body">
                    <span className="ad-msg-top">
                      <b>{m.name}</b>
                      {!m.read && <span className="ad-unread" aria-label="Unread" />}
                      <time>{timeAgo(m.created_at)}</time>
                    </span>
                    <span className="ad-msg-text">{m.subject ? `${m.subject} — ` : ""}{m.message}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="ad-card c-4">
        <div className="ad-card-head">
          <h3>Last 30 days</h3>
          <span className="ad-sub">{sum(d.days30.values)} message{sum(d.days30.values) === 1 ? "" : "s"}</span>
        </div>
        <div className="ad-chart-wrap">
          <LineChart
            labels={d.days30.days.map(dayLabel)}
            series={[{ name: "Messages", color: "#a65fd7", values: d.days30.values }]}
            area
            height={230}
          />
          {noMessages && <p className="ad-chart-empty"><span>No activity yet.</span></p>}
        </div>
      </section>

      <section className="ad-card c-4 wide-md">
        <div className="ad-card-head">
          <h3>Categories</h3>
          <button className="ad-pill" onClick={() => onGo("projects")}>Manage</button>
        </div>
        {d.tags.length === 0 ? (
          <div className="ad-empty">Add tags to your projects to see them here.</div>
        ) : (
          <table className="ad-table">
            <thead>
              <tr><th>Name</th><th className="num">Projects</th><th>Share</th></tr>
            </thead>
            <tbody>
              {d.tags.slice(0, 6).map(([tag, count], i) => (
                <tr key={tag}>
                  <td>{tag}</td>
                  <td className="num">{count}</td>
                  <td>
                    <div className="ad-share">
                      <div className="ad-bar"><i style={{ width: `${(count / maxTag) * 100}%`, background: PALETTE[i % PALETTE.length] }} /></div>
                      <span>{Math.round((count / tagTotal) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}