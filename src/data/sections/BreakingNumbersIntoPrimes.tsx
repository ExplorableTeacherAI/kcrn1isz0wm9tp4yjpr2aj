import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph, InlineFormula } from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { FactorTreeDiagram } from "./visuals/FactorTreeDiagram";

export const breakingNumbersIntoPrimesBlocks: ReactElement[] = [
    <StackLayout key="layout-primes-heading" maxWidth="xl">
        <Block id="primes-heading" padding="sm">
            <EditableH2 id="h2-primes-heading" blockId="primes-heading">
                2. Breaking Numbers into Primes
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-primes-definition" maxWidth="xl">
        <Block id="primes-definition" padding="sm">
            <EditableParagraph id="para-primes-definition" blockId="primes-definition">
                A prime number has exactly two factors: 1 and itself. The first few primes are 2,
                3, 5, 7, 11, 13, 17 and 19. The number 1 is not prime, because it has only one
                factor, and 9 is not prime either, because 3 divides into it.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-primes-building-blocks" maxWidth="xl">
        <Block id="primes-building-blocks" padding="sm">
            <EditableParagraph id="para-primes-building-blocks" blockId="primes-building-blocks">
                Primes are the building blocks of every other whole number. Keep splitting a
                number into two factors and you always end up with the same collection of primes,
                no matter which split you start with. A factor tree is the neat way to record
                that process.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-primes-factor-tree" maxWidth="2xl">
        <Block id="primes-factor-tree" padding="sm" hasVisualization>
            <FactorTreeDiagram />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-primes-index-form-example" maxWidth="xl">
        <Block id="primes-index-form-example" padding="lg">
            <FormulaBlock
                latex="36 = 2 \times 2 \times 3 \times 3 = \clr{primetwo}{2^2} \times \clr{primethree}{3^2}"
                colorMap={{ primetwo: "#0ea5e9", primethree: "#10b981" }}
                color="#0ea5e9"
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-primes-index-form-explanation" maxWidth="xl">
        <Block id="primes-index-form-explanation" padding="sm">
            <EditableParagraph
                id="para-primes-index-form-explanation"
                blockId="primes-index-form-explanation"
            >
                Writing repeated primes in index form keeps things short. Here{" "}
                <InlineFormula latex="2^2" colorMap={{}} /> means two 2s multiplied together, and{" "}
                <InlineFormula latex="3^2" colorMap={{}} /> means two 3s. This compact form is
                exactly what we need for the next two sections.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-primes-question" maxWidth="xl">
        <Block id="primes-question" padding="sm">
            <EditableParagraph id="para-primes-question" blockId="primes-question">
                Practice: Write 90 as a product of its prime factors in index form.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-primes-answer" maxWidth="xl">
        <Block id="primes-answer" padding="sm">
            <EditableParagraph id="para-primes-answer" blockId="primes-answer">
                Answer: <InlineFormula latex="90 = 2 \times 3^2 \times 5" colorMap={{}} />. Split
                90 into 9 and 10, then split those into 3 x 3 and 2 x 5; the two 3s combine into{" "}
                <InlineFormula latex="3^2" colorMap={{}} />.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-primes-check-question" maxWidth="xl">
        <Block id="primes-check-question" padding="sm">
            <EditableParagraph id="para-primes-check-question" blockId="primes-check-question">
                Practice: A student says the prime factorisation of 45 is 1 x 3 x 15. Find the two
                mistakes and give the correct answer.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-primes-check-answer" maxWidth="xl">
        <Block id="primes-check-answer" padding="sm">
            <EditableParagraph id="para-primes-check-answer" blockId="primes-check-answer">
                Answer: 1 is not a prime, and 15 can still be split into 3 x 5, so the tree was
                stopped too early. The correct factorisation is{" "}
                <InlineFormula latex="45 = 3^2 \times 5" colorMap={{}} />.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
