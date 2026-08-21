import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH1, EditableH2, EditableParagraph } from "@/components/atoms";
import { NumberGridExplorer } from "./visuals/NumberGridExplorer";

export const factorsAndMultiplesBlocks: ReactElement[] = [
    <StackLayout key="layout-lesson-title" maxWidth="xl">
        <Block id="lesson-title" padding="md">
            <EditableH1 id="h1-lesson-title" blockId="lesson-title">
                HCF and LCM: Building Numbers from Primes
            </EditableH1>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lesson-overview" maxWidth="xl">
        <Block id="lesson-overview" padding="sm">
            <EditableParagraph id="para-lesson-overview" blockId="lesson-overview">
                By the end of this lesson you will be able to find the highest common factor
                (HCF) and the lowest common multiple (LCM) of two numbers by breaking them into
                their prime building blocks. We start from the very beginning, so nothing is
                assumed.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-factors-multiples-heading" maxWidth="xl">
        <Block id="factors-multiples-heading" padding="sm">
            <EditableH2 id="h2-factors-multiples-heading" blockId="factors-multiples-heading">
                1. Factors and Multiples
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-factors-definition" maxWidth="xl">
        <Block id="factors-definition" padding="sm">
            <EditableParagraph id="para-factors-definition" blockId="factors-definition">
                A factor of a number divides into it exactly, leaving no remainder. The factors
                of 12 are 1, 2, 3, 4, 6 and 12, because each of these fits into 12 a whole number
                of times. Factors are never bigger than the number itself.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-multiples-definition" maxWidth="xl">
        <Block id="multiples-definition" padding="sm">
            <EditableParagraph id="para-multiples-definition" blockId="multiples-definition">
                A multiple of a number is what you get when you count up in that number. The
                multiples of 12 are 12, 24, 36, 48 and so on. Multiples are never smaller than
                the number itself, and the list goes on forever.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-factors-multiples-grid" maxWidth="2xl">
        <Block id="factors-multiples-grid" padding="sm" hasVisualization>
            <NumberGridExplorer />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-factors-multiples-grid-guidance" maxWidth="xl">
        <Block id="factors-multiples-grid-guidance" padding="sm">
            <EditableParagraph
                id="para-factors-multiples-grid-guidance"
                blockId="factors-multiples-grid-guidance"
            >
                Slide to choose a number, then switch between the two views. Notice that the
                factors always crowd towards the small end of the grid, while the multiples
                spread out towards the large end. That difference is the key idea behind
                everything that follows.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-factors-multiples-question" maxWidth="xl">
        <Block id="factors-multiples-question" padding="sm">
            <EditableParagraph id="para-factors-multiples-question" blockId="factors-multiples-question">
                Practice: Write down all the factors of 20, and the first four multiples of 20.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-factors-multiples-answer" maxWidth="xl">
        <Block id="factors-multiples-answer" padding="sm">
            <EditableParagraph id="para-factors-multiples-answer" blockId="factors-multiples-answer">
                Answer: the factors are 1, 2, 4, 5, 10 and 20; the first four multiples are 20,
                40, 60 and 80. Factors divide into 20, while multiples are made by counting up in
                twenties.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-factors-multiples-challenge" maxWidth="xl">
        <Block id="factors-multiples-challenge" padding="sm">
            <EditableParagraph id="para-factors-multiples-challenge" blockId="factors-multiples-challenge">
                Practice: Which numbers below 40 are multiples of 6 and also factors of 36?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-factors-multiples-challenge-answer" maxWidth="xl">
        <Block id="factors-multiples-challenge-answer" padding="sm">
            <EditableParagraph
                id="para-factors-multiples-challenge-answer"
                blockId="factors-multiples-challenge-answer"
            >
                Answer: 6, 12, 18 and 36. Each one is reached by counting up in sixes and also
                divides into 36 exactly, so it satisfies both conditions at once.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
