import Decimal from "decimal.js";
import {
    FlatRawConfig,
    FlatRawGroupWithLabel,
    FlatRawPhase,
    FlatRawProtocol,
    FormQuestionType,
    RawForm,
    RawFormOption,
    RawFormQuestion,
    RawFormQuestionSelectMultiple,
    RawFormQuestionSelectOne, RawInformationCard,
    RawPhaseQuestion,
    RawTestOption,
} from "./raw-types";
import { shuffle } from "./shuffle";
import { TranslationKey } from "./translations";

const defaults = Object.freeze({
    config: Object.freeze({
        anonymous: false,
    } satisfies Partial<FlatRawConfig>),
    protocol: Object.freeze({
        allowPreviousPhase: true,
        allowPreviousQuestion: true,
        allowSkipQuestion: true,
        randomize: false,
    } satisfies Partial<FlatRawProtocol>),
    phase: Object.freeze({
        randomize: false,
    } satisfies Partial<FlatRawPhase>),
    phaseQuestion: Object.freeze({
        randomize: false,
    } satisfies Partial<RawPhaseQuestion>),
    testOption: Object.freeze({
        correct: false,
    } satisfies Partial<RawTestOption>),
    formQuestionSelectMultiple: Object.freeze({
        other: false,
    } satisfies Partial<RawFormQuestionSelectMultiple>),
    formQuestionSelectOne: Object.freeze({
        other: false,
    } satisfies Partial<RawFormQuestionSelectOne>),
});

/**
 * Main configuration class that processes and provides access to experiment configuration.
 */
export class Config {
    public readonly icon: Image;
    public readonly title: string;
    public readonly subtitle?: string;
    public readonly description: string;
    public readonly anonymous: boolean;
    public readonly informationCards: readonly InformationCard[];
    public readonly informedConsent: string;
    public readonly faq: readonly Faq[];
    public readonly preTestForm?: Form;
    public readonly postTestForm?: Form;
    public readonly groupLabels: readonly string[];

    private readonly groups: readonly FlatRawGroupWithLabel[];
    private readonly totalGroupQuestionsMap: ReadonlyMap<string, number>;
    private readonly probabilitySums: readonly Decimal[];
    private readonly translations: Translations;

    /**
     * Main configuration class that processes and provides access to experiment configuration.
     *
     * Processes forms and groups and freezes all objects for immutability, including the {@link Config} instance
     * itself.
     *
     * @param config - The flattened configuration object
     */
    public constructor(config: FlatRawConfig) {
        this.icon = Object.freeze(config.icon);
        this.title = config.title;

        if (config.subtitle) {
            this.subtitle = config.subtitle;
        }

        this.description = config.description;
        this.anonymous = config.anonymous ?? defaults.config.anonymous;
        this.informationCards = Object.freeze(config.informationCards?.map(makeInformationCard) ?? []);
        this.informedConsent = config.informedConsent;
        this.faq = Object.freeze(config.faq?.map(f => Object.freeze(f)) ?? []);

        if (config.preTestForm) {
            this.preTestForm = makeForm(config.preTestForm);
        }
        if (config.postTestForm) {
            this.postTestForm = makeForm(config.postTestForm);
        }

        this.groups = Object.freeze(parseGroups(config));
        this.totalGroupQuestionsMap = new Map(this.groups.map(g => [
            g.label,
            g.protocol.phases.reduce((sum, p) => sum + p.questions.length, 0),
        ]));
        this.groupLabels = Object.freeze(this.groups.map(g => g.label));

        const probabilitySums: Decimal[] = [];
        let lastProbability = new Decimal(0);

        for (const { probability } of Object.values(this.groups)) {
            lastProbability = lastProbability.add(probability);
            probabilitySums.push(lastProbability);
        }

        this.probabilitySums = Object.freeze(probabilitySums);
        this.translations = Object.freeze(config.translations);

        Object.freeze(this);
    }

    /**
     * Samples a group based on the defined probabilities. Uses weighted random sampling to select a group according to
     * its probability. Time complexity is `O(log(n))` as binary search is used to find the appropriate group to use.
     *
     * @returns The randomly selected group
     */
    public sampleGroup(): Group {
        const randomValue = crypto.getRandomValues(new Uint32Array(1))[0]!;
        const targetProbability = new Decimal("0." + randomValue.toString().split("").reverse().join(""));

        let left = 0;
        let right = this.probabilitySums.length - 1;
        let index = 0;

        while (left <= right) {
            const mid = left + Math.floor((right - left) / 2);
            const value = this.probabilitySums[mid]!;

            if (value.greaterThan(targetProbability)) {
                index = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        return makeGroup(this.groups[index]!);
    }

    /**
     * Gets the total number of questions present in a given group. Returns `null` if the group doesn't exist.
     *
     * @param label - The label that identifies the group.
     *
     * @return The total number of questions in the group, or `null` if it doesn't exist.
     */
    public getTotalQuestions(label: string): number | null {
        return this.totalGroupQuestionsMap.get(label) ?? null;
    }

    /**
     * Get a translation value by its key.
     *
     * @param key The translation key.
     * @param args List of values to replace in the translation string.
     *
     * @throws Error on unknown key
     *
     * @return The translation string with the proper inset values.
     */
    public t(key: TranslationKey, ...args: string[]): string {
        let value = this.translations[key];

        if (!value) {
            throw new Error(`Translation key '${key}' not found.`);
        }

        for (let i = 0; i < args.length; i++) {
            value = value.replace(`{${i}}`, args[i]!);
        }

        return value;
    }
}

/**
 * Creates a {@link InformationCard} object from raw information card data.
 *
 * @param infoCard - The raw information card data
 *
 * @returns An immutable {@link InformationCard} object
 */
function makeInformationCard(infoCard: RawInformationCard): InformationCard {
    return Object.freeze({
        title: infoCard.title,
        description: infoCard.description,
        ...infoCard.color && { color: Object.freeze(infoCard.color) },
        ...infoCard.icon && { icon: Object.freeze(infoCard.icon) },
    });
}

/**
 * Creates a {@link Form} object from raw form data.
 *
 * @param form - The raw form data
 *
 * @returns An immutable {@link Form} object
 */
function makeForm(form: RawForm): Form {
    return Object.freeze({
        questions: Object.freeze(form.questions.map(makeFormQuestion)),
    });
}

/**
 * Creates a {@link FormQuestion} object from raw question data. Handles different question types with their specific
 * properties.
 *
 * @param question - The raw form question
 * @param index - The index of the question
 *
 * @returns An immutable {@link FormQuestion} object
 */
function makeFormQuestion(question: RawFormQuestion, index: number): FormQuestion {
    const id = index + 1;

    switch (question.type) {
        case FormQuestionType.SELECT_MULTIPLE:
            return Object.freeze({
                id,
                category: question.category,
                text: question.text,
                ...question.image && { image: Object.freeze(question.image) },
                type: question.type,
                options: Object.freeze(question.options.map(makeFormOption)),
                min: question.min,
                max: question.max,
                other: question.other ?? defaults.formQuestionSelectMultiple.other,
            });
        case FormQuestionType.SELECT_ONE:
            return Object.freeze({
                id,
                category: question.category,
                text: question.text,
                ...question.image && { image: Object.freeze(question.image) },
                type: question.type,
                options: Object.freeze(question.options.map(makeFormOption)),
                other: question.other ?? defaults.formQuestionSelectOne.other,
            });
        case FormQuestionType.NUMBER:
            return Object.freeze({
                id,
                category: question.category,
                text: question.text,
                ...question.image && { image: Object.freeze(question.image) },
                type: question.type,
                placeholder: question.placeholder,
                min: question.min,
                max: question.max,
                step: question.step,
            });
        case FormQuestionType.SLIDER:
            return Object.freeze({
                id,
                category: question.category,
                text: question.text,
                ...question.image && { image: Object.freeze(question.image) },
                type: question.type,
                min: question.min,
                max: question.max,
                step: question.step,
                labels: Object.freeze(makeSliderLabels(question.labels ?? {})),
            });
        case FormQuestionType.TEXT_SHORT:
            return Object.freeze({
                id,
                category: question.category,
                text: question.text,
                ...question.image && { image: Object.freeze(question.image) },
                type: question.type,
                placeholder: question.placeholder,
                minLength: question.minLength,
                maxLength: question.maxLength,
            });
        case FormQuestionType.TEXT_LONG:
            return Object.freeze({
                id,
                category: question.category,
                text: question.text,
                ...question.image && { image: Object.freeze(question.image) },
                type: question.type,
                placeholder: question.placeholder,
                minLength: question.minLength,
                maxLength: question.maxLength,
            });
    }
}

/**
 * Creates a {@link FormOption} object from raw option data.
 *
 * @param option - The raw form option
 *
 * @returns An immutable {@link FormOption} object
 */
function makeFormOption(option: RawFormOption): FormOption {
    return Object.freeze({
        ...option.text && { text: option.text },
        ...option.image && { image: Object.freeze(option.image) },
    });
}

/**
 * Converts slider labels from the raw configuration format to an array of immutable {@link SliderLabel} objects.
 *
 * @param labels - Object mapping numeric positions to label text
 *
 * @returns Array of immutable {@link SliderLabel} objects
 */
function makeSliderLabels(labels: Record<`${number}`, string>): SliderLabel[] {
    return Object.entries(labels).map(([number, label]) => Object.freeze({
        number: +number,
        label,
    }));
}

/**
 * Parses and sorts groups from the configuration by probability (low to high).
 *
 * @param config - The flattened configuration
 *
 * @returns Array of groups with labels, sorted by probability
 */
function parseGroups(config: FlatRawConfig): readonly FlatRawGroupWithLabel[] {
    const groups = Object.entries(config.groups)
        .map<FlatRawGroupWithLabel>(([label, group]) => ({
            ...group,
            label,
        }));

    return groups.sort((a, b) => new Decimal(a.probability).comparedTo(b.probability));
}

/**
 * Creates a {@link Group} object from a raw group with label.
 *
 * @param group - The raw group with label
 *
 * @returns An immutable {@link Group} object
 */
function makeGroup(group: FlatRawGroupWithLabel): Group {
    return Object.freeze({
        label: group.label,
        probability: new Decimal(group.probability),
        protocol: makeProtocol(group.protocol),
        greeting: group.greeting,
    });
}

/**
 * Creates a {@link Protocol} object from a raw protocol.
 *
 * @param protocol - The raw protocol data
 *
 * @returns An immutable {@link Protocol} object
 */
function makeProtocol(protocol: FlatRawProtocol): Protocol {
    const randomize = protocol.randomize ?? defaults.protocol.randomize;
    const phases = protocol.phases.map(makePhase);

    return Object.freeze({
        allowPreviousPhase: protocol.allowPreviousPhase ?? defaults.protocol.allowPreviousPhase,
        allowPreviousQuestion: protocol.allowPreviousQuestion ?? defaults.protocol.allowPreviousQuestion,
        allowSkipQuestion: protocol.allowSkipQuestion ?? defaults.protocol.allowSkipQuestion,
        phases: Object.freeze(randomize ? shuffle(phases) : phases),
    });
}

/**
 * Creates a {@link Phase} object from a raw phase.
 *
 * @param phase - The raw phase data
 * @param index - The index of the phase
 *
 * @returns An immutable {@link Phase} object
 */
function makePhase(phase: FlatRawPhase, index: number): Phase {
    const randomize = phase.randomize ?? defaults.phase.randomize;
    const questions = phase.questions.map(makePhaseQuestion);

    return Object.freeze({
        id: index + 1,
        questions: Object.freeze(randomize ? shuffle(questions) : questions),
    });
}

/**
 * Creates a {@link PhaseQuestion} object from raw question data.
 *
 * @param question - The raw phase question
 * @param index - The index of the question
 *
 * @returns An immutable {@link PhaseQuestion} object
 */
function makePhaseQuestion(question: RawPhaseQuestion, index: number): PhaseQuestion {
    const randomize = question.randomize ?? defaults.phaseQuestion.randomize;
    const options = question.options.map(makeTestOption);

    return Object.freeze({
        id: index + 1,
        ...question.text && { text: question.text },
        ...question.image && { image: Object.freeze(question.image) },
        options: Object.freeze(randomize ? shuffle(options) : options),
    });
}

/**
 * Creates a {@link TestOption} object from raw option data.
 *
 * @param option - The raw test option
 * @param index - The index of the option
 *
 * @returns An immutable {@link TestOption} object
 */
function makeTestOption(option: RawTestOption, index: number): TestOption {
    return Object.freeze({
        id: index + 1,
        ...option.text && { text: option.text },
        ...option.image && { image: Object.freeze(option.image) },
        correct: option.correct ?? defaults.testOption.correct,
    });
}

export type Translations = Readonly<Record<string, string>>;

export type InformationCard = {
    readonly title: string;
    readonly description: string;
    readonly color?: Color;
    readonly icon?: Image;
};

export type Faq = {
    readonly question: string;
    readonly answer: string;
};

export type Form = {
    readonly questions: readonly FormQuestion[];
};

export type FormQuestion =
    | FormQuestionSelectMultiple
    | FormQuestionSelectOne
    | FormQuestionNumber
    | FormQuestionSlider
    | FormQuestionTextShort
    | FormQuestionTextLong;

export type FormQuestionSelectMultiple = FormQuestionBase & {
    readonly type: FormQuestionType.SELECT_MULTIPLE;
    readonly options: readonly FormOption[];
    readonly min: number;
    readonly max: number;
    readonly other: boolean;
};

export type FormQuestionSelectOne = FormQuestionBase & {
    readonly type: FormQuestionType.SELECT_ONE;
    readonly options: readonly FormOption[];
    readonly other: boolean;
};

export type FormQuestionNumber = FormQuestionBase & {
    readonly type: FormQuestionType.NUMBER;
    readonly placeholder: string;
    readonly min: number;
    readonly max: number;
    readonly step: number;
};

export type FormQuestionSlider = FormQuestionBase & {
    readonly type: FormQuestionType.SLIDER;
    readonly min: number;
    readonly max: number;
    readonly step: number;
    readonly labels: readonly SliderLabel[];
};

export type FormQuestionTextShort = FormQuestionBase & {
    readonly type: FormQuestionType.TEXT_SHORT;
    readonly placeholder: string;
    readonly minLength: number;
    readonly maxLength: number;
};

export type FormQuestionTextLong = FormQuestionBase & {
    readonly type: FormQuestionType.TEXT_LONG;
    readonly placeholder: string;
    readonly minLength: number;
    readonly maxLength: number;
};

export type FormQuestionBase = {
    readonly id: number;
    readonly category: string;
    readonly text: string;
    readonly image?: Image;
};

export type FormOption = {
    readonly text?: string;
    readonly image?: Image;
};

export type SliderLabel = {
    readonly number: number;
    readonly label: string;
};

export type Group = {
    readonly label: string;
    readonly probability: Decimal;
    readonly protocol: Protocol;
    readonly greeting?: string;
};

export type Protocol = {
    readonly allowPreviousPhase: boolean;
    readonly allowPreviousQuestion: boolean;
    readonly allowSkipQuestion: boolean;
    readonly phases: readonly Phase[];
};

export type Phase = {
    readonly id: number;
    readonly questions: readonly PhaseQuestion[];
};

export type PhaseQuestion = {
    readonly id: number;
    readonly text?: string;
    readonly image?: Image;
    readonly options: readonly TestOption[];
};

export type TestOption = {
    readonly id: number;
    readonly text?: string;
    readonly image?: Image;
    readonly correct: boolean;
};

export type Image = {
    readonly src: string;
    readonly alt: string;
};

export type Color = {
    readonly r: number;
    readonly g: number;
    readonly b: number;
};
