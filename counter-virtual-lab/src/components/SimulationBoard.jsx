import SevenSegment from "./SevenSegment";

function SimulationBoard({
  config,
  count = 0,
  pulseCount = 0,
  bits = [],
  isRunning = false,
  onPulse,
  onReset,
}) {

  const ic = config?.ic || "7490";

  const output =
    config?.output || "LED";


  const showLED =
    output === "LED";

  const showSevenSegment =
    output === "7-Segment";


  const icInfo = {

    "7490": {
      name: "IC 7490",
      type: "DECADE COUNTER",
      range: "0 – 9",
    },

    "7493": {
      name: "IC 7493",
      type: "BINARY COUNTER",
      range: "0 – 15",
    },

    "74161": {
      name: "IC 74161",
      type: "SYNCHRONOUS COUNTER",
      range: "0 – 15",
    },

  };


  const currentIC =
    icInfo[ic] ||
    icInfo["7490"];


  const outputBits = [

    bits[0] ??
      ((count >> 0) & 1),

    bits[1] ??
      ((count >> 1) & 1),

    bits[2] ??
      ((count >> 2) & 1),

    bits[3] ??
      ((count >> 3) & 1),

  ];


  const outputs = [

    {
      name: "QA",
      value: outputBits[0],
    },

    {
      name: "QB",
      value: outputBits[1],
    },

    {
      name: "QC",
      value: outputBits[2],
    },

    {
      name: "QD",
      value: outputBits[3],
    },

  ];


  return (
    <section className="simulation-section">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="simulation-header">

        <div>

          <h2>
            Simulation
          </h2>

          <p>
            Interactive digital counter circuit
          </p>

        </div>

        <div className="simulation-ic-badge">
          {currentIC.name}
        </div>

      </div>


      {/* =================================================
          CIRCUIT
      ================================================= */}

      <div className="circuit-board">


        <div
          className={`circuit-layout ${
            showSevenSegment
              ? "seven-mode"
              : "led-mode"
          }`}
        >


          {/* =============================================
              CLOCK
          ============================================= */}

          <div className="clock-column">

            <div className="circuit-label">
              CLOCK INPUT
            </div>

            <div className="clock-row">

              <button
                type="button"
                className={`clock-trigger ${
                  isRunning
                    ? "clock-running"
                    : ""
                }`}
                onClick={onPulse}
                aria-label="Generate clock pulse"
              >

                <span className="clock-outer">

                  <span className="clock-inner">

                    <span />

                  </span>

                </span>

              </button>


              <div className="clock-line" />


              <span className="clock-name">
                CLK
              </span>

            </div>


            <div className="clock-mode">
              {config.clock === "automatic"
                ? "Automatic Clock"
                : "Manual Clock"}
            </div>

          </div>


          {/* =============================================
              IC
          ============================================= */}

          <div className="ic-column">

            <div className="ic-body">

              <div className="ic-notch" />

              <span className="ic-label">
                COUNTER IC
              </span>

              <strong className="ic-title">
                {currentIC.name}
              </strong>

              <span className="ic-type">
                {currentIC.type}
              </span>

              <div className="ic-divider" />

              <span className="ic-count-label">
                COUNT
              </span>

              <strong className="ic-count">
                {count}
              </strong>

              <span className="ic-range">
                RANGE {currentIC.range}
              </span>

            </div>

          </div>


          {/* =============================================
              OUTPUT
          ============================================= */}

          <div className="output-column">


            {/* ===========================================
                LED MODE

                IC -> LINE -> BULB
            =========================================== */}

            {showLED && (

              <div className="led-output">

                <div className="circuit-label">
                  DIGITAL OUTPUT
                </div>


                <div className="output-lines">

                  {outputs.map((item) => {

                    const active =
                      Number(item.value) === 1;


                    return (
                      <div
                        className="output-row"
                        key={item.name}
                      >

                        {/* LINE CONNECTED FROM IC */}
                        <div
                          className={`output-wire ${
                            active
                              ? "active"
                              : ""
                          }`}
                        />


                        {/* BULB */}
                        <div
                          className={`output-bulb ${
                            active
                              ? "active"
                              : ""
                          }`}
                        >

                          <span />

                        </div>


                        {/* LABEL */}
                        <span className="output-name">
                          {item.name}
                        </span>

                      </div>
                    );

                  })}

                </div>

              </div>

            )}


            {/* ===========================================
                7-SEGMENT MODE

                NO RIGHT-SIDE WIRES
                NO BULBS
            =========================================== */}

            {showSevenSegment && (

              <div className="seven-output">

                <div className="circuit-label">
                  DECIMAL OUTPUT
                </div>


                <SevenSegment
                  value={count}
                />


                <span className="seven-caption">
                  Current Count
                </span>

              </div>

            )}

          </div>

        </div>


        {/* =================================================
            STATUS
        ================================================= */}

        <div className="circuit-status">

          <div className="status-left">

            <span className="status-light" />

            <span>
              Circuit Ready
            </span>

            {isRunning && (
              <span className="running-text">
                • Automatic
              </span>
            )}

          </div>


          <div className="status-divider" />


          <div>
            Pulse Count:{" "}
            <strong>
              {pulseCount}
            </strong>
          </div>

        </div>

      </div>


      {/* =================================================
          CONTROLS
      ================================================= */}

      <div className="simulation-controls">

        <button
          type="button"
          className="pulse-button"
          onClick={onPulse}
        >

          <span>
            ⚡
          </span>

          Generate Clock Pulse

        </button>


        <button
          type="button"
          className="reset-button"
          onClick={onReset}
        >

          ↻ Reset

        </button>

      </div>

    </section>
  );
}

export default SimulationBoard;