import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph, InlineFormula, Table } from "@/components/atoms";

export const whichOneDoINeedBlocks: ReactElement[] = [
    <StackLayout key="layout-choosing-method-heading" maxWidth="xl">
        <Block id="choosing-method-heading" padding="sm">
            <EditableH2 id="h2-choosing-method-heading" blockId="choosing-method-heading">
                5. Which One Do I Need?
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-choosing-method-intro" maxWidth="xl">
        <Block id="choosing-method-intro" padding="sm">
            <EditableParagraph id="para-choosing-method-intro" blockId="choosing-method-intro">
                Both methods start the same way: write each number as a product of primes. What
                you do next depends on whether the question is about breaking things apart or
                bringing things together.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-choosing-method-table" maxWidth="xl">
        <Block id="choosing-method-table" padding="sm">
            <Table
                columns={[
                    { header: "", align: "left", width: 150 },
                    { header: "HCF", align: "left" },
                    { header: "LCM", align: "left" },
                ]}
                rows={[
                    {
                        cells: [
                            "Which primes",
                            "Only the shared ones",
                            "Every prime that appears",
                        ],
                    },
                    {
                        cells: [
                            "Which power",
                            <InlineFormula key="hcf-power" latex="\text{lower power}" colorMap={{}} />,
                            <InlineFormula key="lcm-power" latex="\text{higher power}" colorMap={{}} />,
                        ],
                    },
                    {
                        cells: [
                            "Size of answer",
                            "At or below the smaller number",
                            "At or above the larger number",
                        ],
                        highlight: true,
                        highlightColor: "#8b5cf6",
                    },
                    {
                        cells: [
                            "Typical question",
                            "Splitting into equal groups, largest tile, cutting with nothing left over",
                            "Events meeting again, buying matching packs, bells ringing together",
                        ],
                    },
                    {
                        cells: [
                            "Example with 24 and 36",
                            <InlineFormula key="hcf-example" latex="2^2 \times 3 = 12" colorMap={{}} />,
                            <InlineFormula key="lcm-example" latex="2^3 \times 3^2 = 72" colorMap={{}} />,
                        ],
                    },
                ]}
                color="#6366f1"
                caption="Table - choosing between HCF and LCM"
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-choosing-method-shortcut" maxWidth="xl">
        <Block id="choosing-method-shortcut" padding="sm">
            <EditableParagraph id="para-choosing-method-shortcut" blockId="choosing-method-shortcut">
                A useful check once you have both answers:{" "}
                <InlineFormula latex="HCF \times LCM = \text{first} \times \text{second}" colorMap={{}} />. For 24
                and 36 that gives 12 x 72 = 864 = 24 x 36, so both answers agree.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-choosing-method-bus-question" maxWidth="xl">
        <Block id="choosing-method-bus-question" padding="sm">
            <EditableParagraph id="para-choosing-method-bus-question" blockId="choosing-method-bus-question">
                Practice: One bus leaves the station every 15 minutes and another every 25
                minutes. They leave together at 9:00 am. When do they next leave together?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-choosing-method-bus-answer" maxWidth="xl">
        <Block id="choosing-method-bus-answer" padding="sm">
            <EditableParagraph id="para-choosing-method-bus-answer" blockId="choosing-method-bus-answer">
                Answer: 10:15 am. Events meeting again needs the LCM:{" "}
                <InlineFormula latex="15 = 3 \times 5" colorMap={{}} /> and{" "}
                <InlineFormula latex="25 = 5^2" colorMap={{}} /> give{" "}
                <InlineFormula latex="3 \times 5^2 = 75" colorMap={{}} /> minutes.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-choosing-method-tile-question" maxWidth="xl">
        <Block id="choosing-method-tile-question" padding="sm">
            <EditableParagraph id="para-choosing-method-tile-question" blockId="choosing-method-tile-question">
                Practice: A floor measures 84 cm by 126 cm and must be covered exactly by
                identical square tiles. What is the largest possible tile side length?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-choosing-method-tile-answer" maxWidth="xl">
        <Block id="choosing-method-tile-answer" padding="sm">
            <EditableParagraph id="para-choosing-method-tile-answer" blockId="choosing-method-tile-answer">
                Answer: 42 cm. The tile length must divide both sides, so we need the HCF:{" "}
                <InlineFormula latex="84 = 2^2 \times 3 \times 7" colorMap={{}} /> and{" "}
                <InlineFormula latex="126 = 2 \times 3^2 \times 7" colorMap={{}} /> share{" "}
                <InlineFormula latex="2 \times 3 \times 7 = 42" colorMap={{}} />.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-choosing-method-mixed-question" maxWidth="xl">
        <Block id="choosing-method-mixed-question" padding="sm">
            <EditableParagraph id="para-choosing-method-mixed-question" blockId="choosing-method-mixed-question">
                Practice: Two numbers have an HCF of 6 and an LCM of 72. One of the numbers is 24.
                What is the other?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-choosing-method-mixed-answer" maxWidth="xl">
        <Block id="choosing-method-mixed-answer" padding="sm">
            <EditableParagraph id="para-choosing-method-mixed-answer" blockId="choosing-method-mixed-answer">
                Answer: 18. Using the check above, the two numbers multiply to 6 x 72 = 432, and
                432 divided by 24 is 18.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-choosing-method-summary" maxWidth="xl">
        <Block id="choosing-method-summary" padding="sm">
            <EditableParagraph id="para-choosing-method-summary" blockId="choosing-method-summary">
                You can now split any two numbers into primes, keep the shared primes for the HCF,
                take every prime at its highest power for the LCM, and check your answers by
                remembering that the HCF is small and the LCM is large.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
