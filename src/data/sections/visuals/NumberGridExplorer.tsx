/**
 * NumberGridExplorer
 * ==================
 * A 1-36 number grid that highlights either the factors of the chosen number
 * or the multiples of it, driven by the global variable store.
 */

import { SimulationPanel } from "@/components/atoms";
import { useVar } from "@/stores";
import { getFactors } from "./numberTheory";

const COLUMNS = 6;
const ROWS = 6;
const CELL = 58;
const PAD = 28;
const GRID_WIDTH = COLUMNS * CELL;
const GRID_HEIGHT = ROWS * CELL;
// Extra width so the longest summary line never clips at the edges.
const VIEWBOX_WIDTH = 520;
const VIEWBOX_HEIGHT = GRID_HEIGHT + PAD * 2 + 46;
const GRID_LEFT = (VIEWBOX_WIDTH - GRID_WIDTH) / 2;

const FACTOR_COLOR = "#6366f1";
const MULTIPLE_COLOR = "#f59e0b";

export const NumberGridExplorer = () => {
    const chosenNumber = useVar("exploreNumber", 12) as number;
    const mode = useVar("exploreMode", "Factors") as string;

    const showingFactors = mode === "Factors";
    const accent = showingFactors ? FACTOR_COLOR : MULTIPLE_COLOR;

    const isHighlighted = (candidate: number) =>
        showingFactors
            ? chosenNumber % candidate === 0
            : candidate % chosenNumber === 0;

    const highlighted = Array.from({ length: COLUMNS * ROWS }, (_, index) => index + 1)
        .filter(isHighlighted);

    const shorten = (values: number[]) =>
        values.length > 8 ? `${values.slice(0, 8).join(", ")}, ...` : values.join(", ");

    const summary = showingFactors
        ? `Factors of ${chosenNumber}: ${shorten(getFactors(chosenNumber))}`
        : `Multiples of ${chosenNumber} up to 36: ${shorten(highlighted) || "none in this grid"}`;

    return (
        <SimulationPanel
            title="Number grid explorer"
            description="Pick a number, then switch between its factors and its multiples."
            accentColor={accent}
            controlsPosition="bottom"
            controls={[
                {
                    type: "slider",
                    varName: "exploreNumber",
                    label: "Chosen number",
                    min: 2,
                    max: 36,
                    step: 1,
                    color: accent,
                },
                {
                    type: "select",
                    varName: "exploreMode",
                    label: "Show",
                    options: [
                        { label: "Factors of the number", value: "Factors" },
                        { label: "Multiples of the number", value: "Multiples" },
                    ],
                    color: accent,
                },
            ]}
        >
            <div className="flex w-full justify-center">
                <svg
                    width="100%"
                    height={VIEWBOX_HEIGHT}
                    viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                    style={{ maxWidth: VIEWBOX_WIDTH }}
                    role="img"
                    aria-label={summary}
                >
                    {Array.from({ length: COLUMNS * ROWS }, (_, index) => {
                        const value = index + 1;
                        const column = index % COLUMNS;
                        const row = Math.floor(index / COLUMNS);
                        const x = GRID_LEFT + column * CELL;
                        const y = PAD + row * CELL;
                        const active = isHighlighted(value);
                        const isChosen = value === chosenNumber;

                        return (
                            <g key={value}>
                                <rect
                                    x={x + 3}
                                    y={y + 3}
                                    width={CELL - 6}
                                    height={CELL - 6}
                                    rx={10}
                                    fill={active ? accent : "#f8fafc"}
                                    fillOpacity={active ? 0.9 : 1}
                                    stroke={isChosen ? "#0f172a" : active ? accent : "#e2e8f0"}
                                    strokeWidth={isChosen ? 3 : 1.5}
                                />
                                <text
                                    x={x + CELL / 2}
                                    y={y + CELL / 2 + 6}
                                    textAnchor="middle"
                                    fontSize="18"
                                    fontWeight={active ? 700 : 500}
                                    fill={active ? "#ffffff" : "#64748b"}
                                >
                                    {value}
                                </text>
                            </g>
                        );
                    })}

                    <text
                        x={VIEWBOX_WIDTH / 2}
                        y={PAD + GRID_HEIGHT + 34}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight={600}
                        fill="#334155"
                    >
                        {summary}
                    </text>
                </svg>
            </div>
        </SimulationPanel>
    );
};
