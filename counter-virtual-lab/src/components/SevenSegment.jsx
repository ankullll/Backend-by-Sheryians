function SevenSegment({ value = 0 }) {

  const segmentMap = {
    0: ["a", "b", "c", "d", "e", "f"],

    1: ["b", "c"],

    2: ["a", "b", "g", "e", "d"],

    3: ["a", "b", "c", "d", "g"],

    4: ["f", "g", "b", "c"],

    5: ["a", "f", "g", "c", "d"],

    6: [
      "a",
      "f",
      "g",
      "e",
      "c",
      "d",
    ],

    7: ["a", "b", "c"],

    8: [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
    ],

    9: [
      "a",
      "b",
      "c",
      "d",
      "f",
      "g",
    ],
  };


  const numericValue =
    Number.isFinite(Number(value))
      ? Math.max(
          0,
          Math.floor(Number(value))
        )
      : 0;


  const digits =
    numericValue >= 10
      ? String(numericValue)
          .split("")
          .map(Number)
      : [numericValue];


  const renderDigit = (
    digit,
    index
  ) => {

    const activeSegments =
      segmentMap[digit] ||
      segmentMap[0];


    const isActive = (segment) =>
      activeSegments.includes(segment);


    return (
      <div
        className="seven-digit"
        key={`${digit}-${index}`}
      >

        <span
          className={`seven-segment segment-a ${
            isActive("a")
              ? "active"
              : ""
          }`}
        />

        <span
          className={`seven-segment segment-b ${
            isActive("b")
              ? "active"
              : ""
          }`}
        />

        <span
          className={`seven-segment segment-c ${
            isActive("c")
              ? "active"
              : ""
          }`}
        />

        <span
          className={`seven-segment segment-d ${
            isActive("d")
              ? "active"
              : ""
          }`}
        />

        <span
          className={`seven-segment segment-e ${
            isActive("e")
              ? "active"
              : ""
          }`}
        />

        <span
          className={`seven-segment segment-f ${
            isActive("f")
              ? "active"
              : ""
          }`}
        />

        <span
          className={`seven-segment segment-g ${
            isActive("g")
              ? "active"
              : ""
          }`}
        />

      </div>
    );
  };


  return (
    <div className="seven-segment-wrapper">

      <div className="seven-display">

        {digits.map(renderDigit)}

      </div>

    </div>
  );
}

export default SevenSegment;