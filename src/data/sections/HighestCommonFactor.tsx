import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph, InlineFormula } from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { PrimeFactorVenn } from "./visuals/PrimeFactorVenn";

export const highestCommonFactorBlocks: ReactElement[] = [
    <StackLayout key="layout-highest-common-factor-heading" maxWidth="xl">
        <Block id="highest-common-factor-heading" padding="sm">
            <EditableH2 id="h2-highest-common-factor-heading" blockId="highest-common-factor-heading">
                3. The Highest Common Factor
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-idea" maxWidth="xl">
        <Block id="highest-common-factor-idea" padding="sm">
            <EditableParagraph id="para-highest-common-factor-idea" blockId="highest-common-factor-idea">
                The highest common factor of two numbers is the largest number that divides into
                both of them. Once both numbers are written as primes, the HCF is simply the
                collection of primes they share.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-venn" maxWidth="2xl">
        <Block id="highest-common-factor-venn" padding="sm" hasVisualization>
            <PrimeFactorVenn mode="hcf" />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-venn-guidance" maxWidth="xl">
        <Block id="highest-common-factor-venn-guidance" padding="sm">
            <EditableParagraph
                id="para-highest-common-factor-venn-guidance"
                blockId="highest-common-factor-venn-guidance"
            >
                Each circle holds the prime factors of one number, and the middle holds the ones
                they have in common. Only the middle is used for the HCF. Try a pair with nothing
                in the middle, such as 25 and 27, and the HCF drops to 1.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-worked-example" maxWidth="xl">
        <Block id="highest-common-factor-worked-example" padding="lg">
            <FormulaBlock
                latex="24 = 2^3 \times 3 \quad , \quad 36 = 2^2 \times 3^2 \quad \Rightarrow \quad \clr{result}{HCF = 2^2 \times 3 = 12}"
                colorMap={{ result: "#8b5cf6" }}
                color="#8b5cf6"
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-rule" maxWidth="xl">
        <Block id="highest-common-factor-rule" padding="sm">
            <EditableParagraph id="para-highest-common-factor-rule" blockId="highest-common-factor-rule">
                The rule in words: for every prime that appears in both numbers, take the lower
                power, then multiply. Here 24 has three 2s and 36 has two
                2s, so we take <InlineFormula latex="2^2" colorMap={{}} />; both have at least one
                3, so we take 3. The HCF can never be larger than the smaller of the two numbers.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-question" maxWidth="xl">
        <Block id="highest-common-factor-question" padding="sm">
            <EditableParagraph id="para-highest-common-factor-question" blockId="highest-common-factor-question">
                Practice: Use prime factorisation to find the HCF of 40 and 56.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-answer" maxWidth="xl">
        <Block id="highest-common-factor-answer" padding="sm">
            <EditableParagraph id="para-highest-common-factor-answer" blockId="highest-common-factor-answer">
                Answer: 8. Since <InlineFormula latex="40 = 2^3 \times 5" colorMap={{}} /> and{" "}
                <InlineFormula latex="56 = 2^3 \times 7" colorMap={{}} />, the only shared primes
                are three 2s, giving <InlineFormula latex="2^3 = 8" colorMap={{}} />.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-word-question" maxWidth="xl">
        <Block id="highest-common-factor-word-question" padding="sm">
            <EditableParagraph
                id="para-highest-common-factor-word-question"
                blockId="highest-common-factor-word-question"
            >
                Practice: A gardener has 42 tulips and 63 roses. She wants identical bunches with
                no flowers left over. What is the greatest number of bunches she can make?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-highest-common-factor-word-answer" maxWidth="xl">
        <Block id="highest-common-factor-word-answer" padding="sm">
            <EditableParagraph
                id="para-highest-common-factor-word-answer"
                blockId="highest-common-factor-word-answer"
            >
                Answer: 21 bunches. Splitting into equal groups means we need a common factor, and
                the greatest one is the HCF: <InlineFormula latex="42 = 2 \times 3 \times 7" colorMap={{}} /> and{" "}
                <InlineFormula latex="63 = 3^2 \times 7" colorMap={{}} /> share 3 x 7 = 21.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
