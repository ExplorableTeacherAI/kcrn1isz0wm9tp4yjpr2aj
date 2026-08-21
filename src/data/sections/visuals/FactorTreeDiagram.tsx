/**
 * FactorTreeDiagram
 * =================
 * Splits the chosen number into prime factors, one branch at a time, and draws
 * the resulting factor tree. Prime leaves are highlighted in green.
 */

import { SimulationPanel } from "@/components/atoms";
import { useVar } from "@/stores";
import { getPrimeFactors, getPrimePowers } from "./numberTheory";

interface TreeNode {
    value: number;
    isPrime: boolean;
    children: TreeNode[];
    x: number;
    depth: number;
}

const PAD = 40;
const LEAF_SPACING = 84;
const LEVEL_HEIGHT = 82;
const NODE_RADIUS = 24;
const SUMMARY_SPACE = 52;

const PRIME_COLOR = "#10b981";
const COMPOSITE_COLOR = "#0ea5e9";

const smallestPrimeFactor = (value: number): number => {
    for (let candidate = 2; candidate * candidate <= value; candidate += 1) {
        if (value % candidate === 0) return candidate;
    }
    return value;
};

const buildTree = (value: number, depth: number, cursor: { next: number }): TreeNode => {
    const factor = smallestPrimeFactor(value);
    if (factor === value) {
        const leaf: TreeNode = { value, isPrime: true, children: [], x: cursor.next, depth };
        cursor.next += LEAF_SPACING;
        return leaf;
    }
    const left = buildTree(factor, depth + 1, cursor);
    const right = buildTree(value / factor, depth + 1, cursor);
    return {
        value,
        isPrime: false,
        children: [left, right],
        x: (left.x + right.x) / 2,
        depth,
    };
};

const flatten = (node: TreeNode): TreeNode[] => [node, ...node.children.flatMap(flatten)];

export const FactorTreeDiagram = () => {
    const chosenNumber = useVar("treeNumber", 36) as number;
    const safeNumber = Math.max(2, Math.round(chosenNumber));

    const cursor = { next: 0 };
    const root = buildTree(safeNumber, 0, cursor);
    const nodes = flatten(root);

    const spread = Math.max(cursor.next - LEAF_SPACING, LEAF_SPACING);
    const maxDepth = nodes.reduce((deepest, node) => Math.max(deepest, node.depth), 0);
    const viewBoxWidth = spread + PAD * 2 + NODE_RADIUS * 2;
    const treeHeight = maxDepth * LEVEL_HEIGHT + NODE_RADIUS * 2;
    const viewBoxHeight = treeHeight + PAD * 2 + SUMMARY_SPACE;

    const offsetX = PAD + NODE_RADIUS;
    const yOf = (depth: number) => PAD + NODE_RADIUS + depth * LEVEL_HEIGHT;

    const primeFactors = getPrimeFactors(safeNumber);
    const powers = getPrimePowers(safeNumber);
    const indexForm = Object.entries(powers)
        .map(([prime, power]) => (power > 1 ? `${prime}^${power}` : prime))
        .join(" x ");
    const summary =
        primeFactors.length === 1
            ? `${safeNumber} is already prime`
            : `${safeNumber} = ${primeFactors.join(" x ")} = ${indexForm}`;

    return (
        <SimulationPanel
            title="Factor tree builder"
            description="Choose a number and watch it split down to its prime building blocks."
            accentColor={COMPOSITE_COLOR}
            controlsPosition="bottom"
            controls={[
                {
                    type: "slider",
                    varName: "treeNumber",
                    label: "Number to split",
                    min: 4,
                    max: 100,
                    step: 1,
                    color: COMPOSITE_COLOR,
                },
                {
                    type: "button-group",
                    label: "Quick picks",
                    buttons: [
                        { type: "button", varName: "treeNumber", label: "24", value: 24, variant: "outline" },
                        { type: "button", varName: "treeNumber", label: "36", value: 36, variant: "outline" },
                        { type: "button", varName: "treeNumber", label: "60", value: 60, variant: "outline" },
                        { type: "button", varName: "treeNumber", label: "72", value: 72, variant: "outline" },
                    ],
                },
            ]}
        >
            <div className="flex w-full justify-center">
                <svg
                    width="100%"
                    height={viewBoxHeight}
                    viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                    style={{ maxWidth: viewBoxWidth }}
                    role="img"
                    aria-label={summary}
                >
                    {nodes.flatMap((node) =>
                        node.children.map((child) => (
                            <line
                                key={`branch-${node.depth}-${node.x}-${child.x}-${child.value}`}
                                x1={offsetX + node.x}
                                y1={yOf(node.depth) + NODE_RADIUS * 0.7}
                                x2={offsetX + child.x}
                                y2={yOf(child.depth) - NODE_RADIUS * 0.7}
                                stroke="#94a3b8"
                                strokeWidth={2}
                            />
                        )),
                    )}

                    {nodes.map((node) => (
                        <g key={`node-${node.depth}-${node.x}-${node.value}`}>
                            <circle
                                cx={offsetX + node.x}
                                cy={yOf(node.depth)}
                                r={NODE_RADIUS}
                                fill={node.isPrime ? PRIME_COLOR : "#ffffff"}
                                stroke={node.isPrime ? PRIME_COLOR : COMPOSITE_COLOR}
                                strokeWidth={2.5}
                            />
                            <text
                                x={offsetX + node.x}
                                y={yOf(node.depth) + 6}
                                textAnchor="middle"
                                fontSize="17"
                                fontWeight={700}
                                fill={node.isPrime ? "#ffffff" : "#0f172a"}
                            >
                                {node.value}
                            </text>
                        </g>
                    ))}

                    <text
                        x={viewBoxWidth / 2}
                        y={PAD + treeHeight + 34}
                        textAnchor="middle"
                        fontSize="16"
                        fontWeight={700}
                        fill="#0f172a"
                    >
                        {summary}
                    </text>
                </svg>
            </div>
        </SimulationPanel>
    );
};
