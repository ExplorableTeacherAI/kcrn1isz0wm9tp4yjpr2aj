/**
 * HighestLowestScale
 * ==================
 * Places the HCF, the two chosen numbers and the LCM on one scale so the order
 * HCF <= numbers <= LCM is impossible to miss. A logarithmic spacing keeps the
 * small HCF and the large LCM both readable.
 */

import { SimulationPanel } from "@/components/atoms";
import { useVar } from "@/stores";
import { getHighestCommonFactor, getLowestCommonMultiple } from "./numberTheory";

const VIEWBOX_WIDTH = 640;
const VIEWBOX_HEIGHT = 250;
const PAD = 70;
const AXIS_Y = 150;
const TRACK_WIDTH = VIEWBOX_WIDTH - PAD * 2;

const HCF_COLOR = "#8b5cf6";
const FIRST_COLOR = "#3b82f6";
const SECOND_COLOR = "#ec4899";
const LCM_COLOR = "#f59e0b";

export const HighestLowestScale = () => {
    const first = Math.max(2, Math.round(useVar("firstNumber", 24) as number));
    const second = Math.max(2, Math.round(useVar("secondNumber", 36) as number));

    const highestCommonFactor = getHighestCommonFactor(first, second);
    const lowestCommonMultiple = getLowestCommonMultiple(first, second);

    const markers = [
        { name: "HCF", value: highestCommonFactor, color: HCF_COLOR },
        { name: "First number", value: Math.min(first, second), color: first <= second ? FIRST_COLOR : SECOND_COLOR },
        { name: "Second number", value: Math.max(first, second), color: first <= second ? SECOND_COLOR : FIRST_COLOR },
        { name: "LCM", value: lowestCommonMultiple, color: LCM_COLOR },
    ];

    const logLow = Math.log(highestCommonFactor);
    const logHigh = Math.log(lowestCommonMultiple);
    const logRange = logHigh - logLow;

    const xOf = (value: number) =>
        logRange <= 0
            ? PAD + TRACK_WIDTH / 2
            : PAD + ((Math.log(value) - logLow) / logRange) * TRACK_WIDTH;

    return (
        <SimulationPanel
            title="HCF and LCM on one scale"
            description="However you move the sliders, the HCF stays on the left and the LCM stays on the right."
            accentColor={LCM_COLOR}
            controlsPosition="bottom"
            controls={[
                {
                    type: "slider",
                    varName: "firstNumber",
                    label: "First number",
                    min: 2,
                    max: 60,
                    step: 1,
                    color: FIRST_COLOR,
                },
                {
                    type: "slider",
                    varName: "secondNumber",
                    label: "Second number",
                    min: 2,
                    max: 60,
                    step: 1,
                    color: SECOND_COLOR,
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
                    aria-label={`HCF ${highestCommonFactor}, numbers ${first} and ${second}, LCM ${lowestCommonMultiple}`}
                >
                    <line
                        x1={PAD - 20}
                        y1={AXIS_Y}
                        x2={VIEWBOX_WIDTH - PAD + 20}
                        y2={AXIS_Y}
                        stroke="#cbd5e1"
                        strokeWidth={4}
                        strokeLinecap="round"
                    />

                    <text x={PAD - 24} y={AXIS_Y + 46} textAnchor="start" fontSize="13" fill="#94a3b8">
                        smaller
                    </text>
                    <text
                        x={VIEWBOX_WIDTH - PAD + 24}
                        y={AXIS_Y + 46}
                        textAnchor="end"
                        fontSize="13"
                        fill="#94a3b8"
                    >
                        larger
                    </text>

                    {markers.map((marker, index) => {
                        const x = xOf(marker.value);
                        const labelY = index % 2 === 0 ? AXIS_Y - 62 : AXIS_Y - 30;
                        return (
                            <g key={marker.name}>
                                <line
                                    x1={x}
                                    y1={labelY + 8}
                                    x2={x}
                                    y2={AXIS_Y - 10}
                                    stroke={marker.color}
                                    strokeWidth={1.5}
                                    strokeDasharray="3 3"
                                />
                                <circle cx={x} cy={AXIS_Y} r={10} fill={marker.color} />
                                <text
                                    x={x}
                                    y={labelY}
                                    textAnchor="middle"
                                    fontSize="13"
                                    fontWeight={700}
                                    fill={marker.color}
                                >
                                    {marker.name}
                                </text>
                                <text
                                    x={x}
                                    y={AXIS_Y + 28}
                                    textAnchor="middle"
                                    fontSize="15"
                                    fontWeight={700}
                                    fill="#0f172a"
                                >
                                    {marker.value}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </SimulationPanel>
    );
};
