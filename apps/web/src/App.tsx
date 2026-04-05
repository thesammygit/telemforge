function App() {
  const sections = [
    {
      title: 'Mission Overview',
      body: 'Mission clock, health summary, alerts, and top anomalies.',
    },
    {
      title: 'Fault Injection',
      body: 'Manual failure triggers, severity controls, and scenario metadata.',
    },
    {
      title: 'Replay And Analysis',
      body: 'Timeline scrubbing, event markers, and anomaly overlays.',
    },
  ]

  return (
    <main className="shell">
      <header className="hero">
        <p className="eyebrow">Mission Operations Sandbox Template</p>
        <h1>TelemForge</h1>
        <p className="summary">
          This frontend is intentionally limited to template structure and product framing.
          Dedicated implementation agents can build telemetry views, replay workflows, and
          anomaly overlays on top of this shell.
        </p>
      </header>

      <section className="grid">
        {sections.map((section) => (
          <article key={section.title} className="card">
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App

