/**
 * PrimeFactorVenn
 * ===============
 * Two overlapping circles holding the prime factors of the two chosen numbers.
 * In "hcf" mode only the shared middle is emphasised; in "lcm" mode every
 * region is emphasised. Both modes read the same two global variables so the
 * lesson can compare the results directly.
 */

import { SimulationPanel } from "@/components/atoms";
import { useVar } from "@/stores";
import {
    getHighestCommonFactor,
    getLowestCommonMultiple,
    splitPrimeFactors,
} from "./numberTheory";

const VIEWBOX_WIDTH = 640;
const VIEWBOX_HEIGHT = 470;
const CIRCLE_RADIUS = 135;
const LEFT_CENTER_X = 250;
const RIGHT_CENTER_X = 390;
const CENTER_Y = 215;
const CHIP_SPACING = 36;

const FIRST_COLOR = "#3b82f6";
const SECOND_COLOR = "#ec4899";
const SHARED_COLOR = "#8b5cf6";

interface PrimeFactorVennProps {
    /** Which result the diagram is pointing at. */
    mode: "hcf" | "lcm";
}

const productOf = (values: number[]) =>
    values.reduce((runningTotal, value) => runningTotal * value, 1);

export const PrimeFactorVenn = ({ mode }: PrimeFactorVennProps) => {
    const first = Math.max(2, Math.round(useVar("firstNumber", 24) as number));
    const second = Math.max(2, Math.round(useVar("secondNumber", 36) as number));

    const { firstOnly, shared, secondOnly } = splitPrimeFactors(first, second);
    const highestCommonFactor = getHighestCommonFactor(first, second);
    const lowestCommonMultiple = getLowestCommonMultiple(first, second);

    const showingHighestCommonFactor = mode === "hcf";
    const accent = showingHighestCommonFactor ? SHARED_COLOR : "#f59e0b";

    const outerOpacity = showingHighestCommonFactor ? 0.3 : 1;

    const summary = showingHighestCommonFactor
        ? `HCF of ${first} and ${second} = ${shared.length ? shared.join(" x ") : "1"} = ${highestCommonFactor}`
        : `LCM of ${first} and ${second} = ${lowestCommonMultiple}`;

    const renderChips = (
        values: number[],
        centerX: number,
        color: string,
        opacity: number,
        keyPrefix: string,
    ) => {
        const startY = CENTER_Y - ((values.length - 1) * CHIP_SPACING) / 2;
        return values.map((value, index) => (
            <g key={`${keyPrefix}-${index}`} opacity={opacity}>
                <circle cx={centerX} cy={startY + index * CHIP_SPACING} r={15} fill={color} />
                <text
                    x={centerX}
                    y={startY + index * CHIP_SPACING + 5}
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight={700}
                    fill="#ffffff"
                >
                    {value}
                </text>
            </g>
        ));
    };

    return (
        <SimulationPanel
            title={showingHighestCommonFactor ? "Shared prime factors" : "All prime factors together"}
            description="Change either number and watch the prime factors move between the regions."
            accentColor={accent}
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
                    aria-label={summary}
                >
                    <circle
                        cx={LEFT_CENTER_X}
                        cy={CENTER_Y}
                        r={CIRCLE_RADIUS}
                        fill={FIRST_COLOR}
                        fillOpacity={0.12}
                        stroke={FIRST_COLOR}
                        strokeWidth={2.5}
                    />
                    <circle
                        cx={RIGHT_CENTER_X}
                        cy={CENTER_Y}
                        r={CIRCLE_RADIUS}
                        fill={SECOND_COLOR}
                        fillOpacity={0.12}
                        stroke={SECOND_COLOR}
                        strokeWidth={2.5}
                    />

                    <text
                        x={LEFT_CENTER_X - 95}
                        y={CENTER_Y - CIRCLE_RADIUS - 18}
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight={700}
                        fill={FIRST_COLOR}
                    >
                        {`Primes of ${first}`}
                    </text>
                    <text
                        x={RIGHT_CENTER_X + 95}
                        y={CENTER_Y - CIRCLE_RADIUS - 18}
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight={700}
                        fill={SECOND_COLOR}
                    >
                        {`Primes of ${second}`}
                    </text>

                    {renderChips(firstOnly, LEFT_CENTER_X - 78, FIRST_COLOR, outerOpacity, "first-only")}
                    {renderChips(shared, (LEFT_CENTER_X + RIGHT_CENTER_X) / 2, SHARED_COLOR, 1, "shared")}
                    {renderChips(secondOnly, RIGHT_CENTER_X + 78, SECOND_COLOR, outerOpacity, "second-only")}

                    {shared.length === 0 && (
                        <text
                            x={(LEFT_CENTER_X + RIGHT_CENTER_X) / 2}
                            y={CENTER_Y + 5}
                            textAnchor="middle"
                            fontSize="14"
                            fontWeight={600}
                            fill="#64748b"
                        >
                            none
                        </text>
                    )}

                    <text
                        x={(LEFT_CENTER_X + RIGHT_CENTER_X) / 2}
                        y={CENTER_Y + CIRCLE_RADIUS + 34}
                        textAnchor="middle"
                        fontSize="14"
                        fontWeight={600}
                        fill={SHARED_COLOR}
                    >
                        shared middle
                    </text>

                    <text
                        x={VIEWBOX_WIDTH / 2}
                        y={VIEWBOX_HEIGHT - 22}
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight={700}
                        fill="#0f172a"
                    >
                        {summary}
                    </text>

                    {!showingHighestCommonFactor && (
                        <text
                            x={VIEWBOX_WIDTH / 2}
                            y={VIEWBOX_HEIGHT - 48}
                            textAnchor="middle"
                            fontSize="14"
                            fontWeight={600}
                            fill="#64748b"
                        >
                            {`Take everything: ${[...firstOnly, ...shared, ...secondOnly].join(" x ")} = ${productOf([
                                ...firstOnly,
                                ...shared,
                                ...secondOnly,
                            ])}`}
                        </text>
                    )}
                </svg>
            </div>
        </SimulationPanel>
    );
};
