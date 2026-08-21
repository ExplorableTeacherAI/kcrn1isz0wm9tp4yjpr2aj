import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph, InlineFormula } from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { PrimeFactorVenn } from "./visuals/PrimeFactorVenn";
import { HighestLowestScale } from "./visuals/HighestLowestScale";

export const lowestCommonMultipleBlocks: ReactElement[] = [
    <StackLayout key="layout-lowest-common-multiple-heading" maxWidth="xl">
        <Block id="lowest-common-multiple-heading" padding="sm">
            <EditableH2 id="h2-lowest-common-multiple-heading" blockId="lowest-common-multiple-heading">
                4. The Lowest Common Multiple
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-idea" maxWidth="xl">
        <Block id="lowest-common-multiple-idea" padding="sm">
            <EditableParagraph id="para-lowest-common-multiple-idea" blockId="lowest-common-multiple-idea">
                The lowest common multiple is the smallest number that both numbers divide into.
                It has to contain every prime factor of the first number and every prime factor of
                the second, so this time we sweep up all three regions of the diagram, not just
                the middle.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-venn" maxWidth="2xl">
        <Block id="lowest-common-multiple-venn" padding="sm" hasVisualization>
            <PrimeFactorVenn mode="lcm" />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-worked-example" maxWidth="xl">
        <Block id="lowest-common-multiple-worked-example" padding="lg">
            <FormulaBlock
                latex="24 = 2^3 \times 3 \quad , \quad 36 = 2^2 \times 3^2 \quad \Rightarrow \quad \clr{result}{LCM = 2^3 \times 3^2 = 72}"
                colorMap={{ result: "#f59e0b" }}
                color="#f59e0b"
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-rule" maxWidth="xl">
        <Block id="lowest-common-multiple-rule" padding="sm">
            <EditableParagraph id="para-lowest-common-multiple-rule" blockId="lowest-common-multiple-rule">
                The rule in words: for every prime that appears in either number, take the higher
                power, then multiply. Notice this is the mirror image of the HCF rule, where we
                took the lower power of the shared primes only.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-multiply-warning" maxWidth="xl">
        <Block id="lowest-common-multiple-multiply-warning" padding="sm">
            <EditableParagraph
                id="para-lowest-common-multiple-multiply-warning"
                blockId="lowest-common-multiple-multiply-warning"
            >
                Multiplying the two numbers together does not usually give the LCM: 24 x 36 = 864,
                which is twelve times too big. The shared primes in the middle must be counted
                once, not twice.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-order-scale" maxWidth="2xl">
        <Block id="lowest-common-multiple-order-scale" padding="sm" hasVisualization>
            <HighestLowestScale />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-order-explanation" maxWidth="xl">
        <Block id="lowest-common-multiple-order-explanation" padding="sm">
            <EditableParagraph
                id="para-lowest-common-multiple-order-explanation"
                blockId="lowest-common-multiple-order-explanation"
            >
                This is the safest check you can make. The HCF is a factor of both numbers, so it
                always sits at or below the smaller one. The LCM is a multiple of both, so it
                always sits at or above the larger one. If your HCF ever comes out bigger than your
                LCM, the two answers have been swapped.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-question" maxWidth="xl">
        <Block id="lowest-common-multiple-question" padding="sm">
            <EditableParagraph id="para-lowest-common-multiple-question" blockId="lowest-common-multiple-question">
                Practice: Use prime factorisation to find the LCM of 18 and 30.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-answer" maxWidth="xl">
        <Block id="lowest-common-multiple-answer" padding="sm">
            <EditableParagraph id="para-lowest-common-multiple-answer" blockId="lowest-common-multiple-answer">
                Answer: 90. Since <InlineFormula latex="18 = 2 \times 3^2" colorMap={{}} /> and{" "}
                <InlineFormula latex="30 = 2 \times 3 \times 5" colorMap={{}} />, taking the higher
                power of each prime gives <InlineFormula latex="2 \times 3^2 \times 5 = 90" colorMap={{}} />,
                which is well below 18 x 30 = 540.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-check-question" maxWidth="xl">
        <Block id="lowest-common-multiple-check-question" padding="sm">
            <EditableParagraph
                id="para-lowest-common-multiple-check-question"
                blockId="lowest-common-multiple-check-question"
            >
                Practice: A student says the HCF of 16 and 20 is 80 and the LCM is 4. Without doing
                the full working, explain how you know both answers are wrong.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lowest-common-multiple-check-answer" maxWidth="xl">
        <Block id="lowest-common-multiple-check-answer" padding="sm">
            <EditableParagraph
                id="para-lowest-common-multiple-check-answer"
                blockId="lowest-common-multiple-check-answer"
            >
                Answer: the answers have been swapped. A factor of 16 cannot be 80, and a multiple
                of 20 cannot be 4. Correctly, the HCF is 4 and the LCM is 80.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
