import { useState } from "react";

import ComponentConfig from "./components/ComponentConfig";
import SimulationBoard from "./components/SimulationBoard";
import useCounter from "./hooks/useCounter";

function App() {
  const [activeSection, setActiveSection] =
    useState("simulation");

  const [config, setConfig] = useState({
    ic: "7490",
    clock: "manual",
    output: "LED",
  });

  const {
    count,
    pulseCount,
    bits,
    generatePulse,
    resetCounter,
    isRunning,
  } = useCounter(
    config.ic,
    config.clock
  );

  const navItems = [
    {
      id: "simulation",
      label: "Simulation",
    },
    {
      id: "aim",
      label: "Aim",
    },
    {
      id: "theory",
      label: "Theory",
    },
    {
      id: "components",
      label: "Components",
    },
    {
      id: "procedure",
      label: "Procedure",
    },
    {
      id: "observation",
      label: "Observation",
    },
    {
      id: "post-test",
      label: "Post Test",
    },
    {
      id: "viva",
      label: "Viva Questions",
    },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="app">

      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="top-header">

        <div className="brand-area">

          <div className="brand-logo">
            BIET
          </div>

          <div>
            <h2>BIET Jhansi</h2>
            <span>Virtual Laboratory</span>
          </div>

        </div>

        <div className="header-title">
          <h1>Counter Using IC</h1>
          <p>
            Integrated Circuits Virtual Lab
          </p>
        </div>

        <div className="header-rating">
          ★★★★☆
        </div>

      </header>


      {/* ==================================================
          MAIN LAYOUT
      ================================================== */}

      <div className="app-layout">

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside className="sidebar">

          <div className="sidebar-title">
            EXPERIMENT
          </div>

          <nav className="sidebar-nav">

            {navItems.map((item, index) => (

              <button
                key={item.id}
                type="button"
                className={`nav-button ${
                  activeSection === item.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  scrollToSection(item.id)
                }
              >

                <span className="nav-number">
                  {index + 1}
                </span>

                <span>
                  {item.label}
                </span>

              </button>

            ))}

          </nav>

        </aside>


        {/* ==================================================
            CONTENT
        ================================================== */}

        <main className="main-content">

          {/* ================================================
              SIMULATION
          ================================================= */}

          <section
            id="simulation"
            className="page-section simulation-page"
          >

            <div className="page-heading">
              <h1>
                Counter Using IC
              </h1>

              <p>
                Study and simulate digital counters
                using Integrated Circuits.
              </p>
            </div>


            <ComponentConfig
              config={config}
              setConfig={setConfig}
            />


            <SimulationBoard
              config={config}
              count={count}
              pulseCount={pulseCount}
              bits={bits}
              isRunning={isRunning}
              onPulse={generatePulse}
              onReset={resetCounter}
            />

          </section>


          {/* ================================================
              AIM
          ================================================= */}

          <section
            id="aim"
            className="content-card"
          >

            <div className="content-card-header">
              <span>02</span>
              <h2>Aim</h2>
            </div>

            <p>
              To study the operation of digital counters
              using IC 7490, IC 7493 and IC 74161 and
              observe their counting sequence using LED
              and 7-segment displays.
            </p>

          </section>


          {/* ================================================
              THEORY
          ================================================= */}

          <section
            id="theory"
            className="content-card"
          >

            <div className="content-card-header">
              <span>03</span>
              <h2>Theory</h2>
            </div>

            <p>
              A counter is a sequential digital circuit
              that changes its output state for every
              incoming clock pulse.
            </p>

            <div className="theory-grid">

              <div className="theory-item">
                <strong>IC 7490</strong>
                <span>
                  Decade counter with a counting range
                  from 0 to 9.
                </span>
              </div>

              <div className="theory-item">
                <strong>IC 7493</strong>
                <span>
                  4-bit binary counter with a range
                  from 0 to 15.
                </span>
              </div>

              <div className="theory-item">
                <strong>IC 74161</strong>
                <span>
                  4-bit synchronous binary counter
                  with a range from 0 to 15.
                </span>
              </div>

            </div>

          </section>


          {/* ================================================
              COMPONENTS
          ================================================= */}

          <section
            id="components"
            className="content-card"
          >

            <div className="content-card-header">
              <span>04</span>
              <h2>Components</h2>
            </div>

            <div className="component-list">

              <div>
                <strong>IC 7490</strong>
                <span>
                  Decade counter
                </span>
              </div>

              <div>
                <strong>IC 7493</strong>
                <span>
                  Binary counter
                </span>
              </div>

              <div>
                <strong>IC 74161</strong>
                <span>
                  Synchronous counter
                </span>
              </div>

              <div>
                <strong>LEDs</strong>
                <span>
                  Digital output indication
                </span>
              </div>

              <div>
                <strong>7-Segment Display</strong>
                <span>
                  Decimal output indication
                </span>
              </div>

              <div>
                <strong>Clock Source</strong>
                <span>
                  Manual or automatic clock
                </span>
              </div>

            </div>

          </section>


          {/* ================================================
              PROCEDURE
          ================================================= */}

          <section
            id="procedure"
            className="content-card"
          >

            <div className="content-card-header">
              <span>05</span>
              <h2>Procedure</h2>
            </div>

            <ol className="procedure-list">

              <li>
                Select the required counter IC.
              </li>

              <li>
                Select manual or automatic clock.
              </li>

              <li>
                Select LED or 7-segment output.
              </li>

              <li>
                Click Generate Clock Pulse.
              </li>

              <li>
                Observe the counter output.
              </li>

              <li>
                Use Reset to return the counter to zero.
              </li>

            </ol>

          </section>


          {/* ================================================
              OBSERVATION
          ================================================= */}

          <section
            id="observation"
            className="content-card"
          >

            <div className="content-card-header">
              <span>06</span>
              <h2>Observation</h2>
            </div>

            <div className="observation-table">

              <div className="table-row table-header">
                <span>Pulse</span>
                <span>Count</span>
                <span>QA</span>
                <span>QB</span>
                <span>QC</span>
                <span>QD</span>
              </div>

              <div className="table-row">
                <span>Current</span>
                <span>{count}</span>
                <span>{bits[0]}</span>
                <span>{bits[1]}</span>
                <span>{bits[2]}</span>
                <span>{bits[3]}</span>
              </div>

            </div>

          </section>


          {/* ================================================
              POST TEST
          ================================================= */}

          <section
            id="post-test"
            className="content-card"
          >

            <div className="content-card-header">
              <span>07</span>
              <h2>Post Test</h2>
            </div>

            <div className="question-box">

              <p>
                <strong>
                  Q1.
                </strong>{" "}
                What is the maximum count of a 4-bit
                binary counter?
              </p>

              <div className="options">
                <span>A. 9</span>
                <span>B. 10</span>
                <span>C. 15</span>
                <span>D. 16</span>
              </div>

              <p className="answer">
                Answer: C. 15
              </p>

            </div>

          </section>


          {/* ================================================
              VIVA QUESTIONS
          ================================================= */}

          <section
            id="viva"
            className="content-card"
          >

            <div className="content-card-header">
              <span>08</span>
              <h2>Viva Questions</h2>
            </div>

            <div className="viva-list">

              <div>
                <strong>
                  1. What is a counter?
                </strong>

                <p>
                  A counter is a sequential circuit
                  that counts clock pulses.
                </p>
              </div>

              <div>
                <strong>
                  2. What is IC 7490?
                </strong>

                <p>
                  IC 7490 is a decade counter that
                  counts from 0 to 9.
                </p>
              </div>

              <div>
                <strong>
                  3. What is IC 7493?
                </strong>

                <p>
                  IC 7493 is a 4-bit binary counter
                  with a range from 0 to 15.
                </p>
              </div>

              <div>
                <strong>
                  4. What is IC 74161?
                </strong>

                <p>
                  IC 74161 is a 4-bit synchronous
                  binary counter.
                </p>
              </div>

              <div>
                <strong>
                  5. What is the function of a clock
                  pulse?
                </strong>

                <p>
                  The clock pulse controls when the
                  counter changes its state.
                </p>
              </div>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default App;