function ComponentConfig({
  config,
  setConfig,
}) {

  const updateConfig = (
    key,
    value
  ) => {

    setConfig((previous) => ({
      ...previous,
      [key]: value,
    }));

  };


  return (
    <section className="config-section">

      <div className="config-header">

        <div>

          <h2>
            Component Configuration
          </h2>

          <p>
            Configure the counter IC, clock source
            and output display.
          </p>

        </div>

      </div>


      <div className="config-grid">


        {/* IC */}

        <div className="config-field">

          <label htmlFor="counter-ic">
            COUNTER IC
          </label>

          <select
            id="counter-ic"
            value={config.ic}
            onChange={(event) =>
              updateConfig(
                "ic",
                event.target.value
              )
            }
          >

            <option value="7490">
              IC 7490 — Decade Counter (0–9)
            </option>

            <option value="7493">
              IC 7493 — Binary Counter (0–15)
            </option>

            <option value="74161">
              IC 74161 — Synchronous Counter (0–15)
            </option>

          </select>

        </div>


        {/* CLOCK */}

        <div className="config-field">

          <label htmlFor="clock-source">
            CLOCK SOURCE
          </label>

          <select
            id="clock-source"
            value={config.clock}
            onChange={(event) =>
              updateConfig(
                "clock",
                event.target.value
              )
            }
          >

            <option value="manual">
              Manual Clock
            </option>

            <option value="automatic">
              Automatic Clock
            </option>

          </select>

        </div>


        {/* OUTPUT */}

        <div className="config-field">

          <label htmlFor="output-display">
            OUTPUT DISPLAY
          </label>

          <select
            id="output-display"
            value={config.output}
            onChange={(event) =>
              updateConfig(
                "output",
                event.target.value
              )
            }
          >

            <option value="LED">
              LED
            </option>

            <option value="7-Segment">
              7-Segment
            </option>

          </select>

        </div>

      </div>


      <div className="config-summary">

        <span>
          IC{" "}
          <strong>
            {config.ic}
          </strong>
        </span>

        <span>
          CLOCK{" "}
          <strong>
            {config.clock === "automatic"
              ? "Automatic"
              : "Manual"}
          </strong>
        </span>

        <span>
          DISPLAY{" "}
          <strong>
            {config.output}
          </strong>
        </span>

      </div>

    </section>
  );
}

export default ComponentConfig;