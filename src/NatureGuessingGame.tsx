import { createMemo, createSignal, For } from 'solid-js';
import { Button } from './Button';
import { getRandomInt, randomButtonVariant, useSubmitGuess } from './utils';

type DotOption = { emoji: string; word: string };

const DOT_OPTIONS = [
    { emoji: '🐖', word: 'חזיר' },
    { emoji: '🐄', word: 'פרה' },
    { emoji: '🐥', word: 'אפרוח' },
    { emoji: '🐧', word: 'פינגווין' },
    { emoji: '🦭', word: 'כלב ים' },
    { emoji: '🦋', word: 'פרפר' },
    { emoji: '🐌', word: 'חילזון' },
    { emoji: '🐗', word: 'חזיר בר' },
    { emoji: '🐒', word: 'קוף' },
    { emoji: '🥕', word: 'גזר' },
    { emoji: '🍎', word: 'תפוח' },
    { emoji: '🍏', word: 'תפוח' },
    { emoji: '🦁', word: 'אריה' },
    { emoji: '🍌', word: 'בננה' },
    { emoji: '🐢', word: 'צב' },
    { emoji: '🍓', word: 'תות' },
    { emoji: '🌲', word: 'עץ' },
    { emoji: '🌴', word: 'דקל' },
    { emoji: '🌼', word: 'פרח' },
    { emoji: '🍍', word: 'אננס' },
    { emoji: '🐭', word: 'עכבר' },
    { emoji: '🌽', word: 'תירס' },
    { emoji: '🐶', word: 'כלב' },
    { emoji: '🐕', word: 'כלב' },
    { emoji: '🐈', word: 'חתול' },
    { emoji: '🐱', word: 'חתול' },
    { emoji: '🥚', word: 'ביצה' },
    { emoji: '🐟', word: 'דג' },
    { emoji: '🧅', word: 'בצל' },
    { emoji: '🍋', word: 'לימון' },
    { emoji: '🦓', word: 'זברה' },
    { emoji: '🐘', word: 'פיל' },
    { emoji: '🐸', word: 'צפרדע' },
    { emoji: '🐅', word: 'טיגריס' },
    { emoji: '🐴', word: 'סוס' },
    { emoji: '🦄', word: 'חד קרן' },
    { emoji: '🐿️', word: 'סנאי' },
    { emoji: '🦔', word: 'קוד' },
    { emoji: '🦇', word: 'עטלף' },
    { emoji: '🐨', word: 'קואלה' },
    { emoji: '🦘', word: 'קנגרו' },
    { emoji: '🦚', word: 'טווס' },
    { emoji: '🦜', word: 'תוכי' },
    { emoji: '🦉', word: 'ינשוף' },
];

function getSecret() {
    return DOT_OPTIONS[getRandomInt(DOT_OPTIONS.length)];
}

function getGuesses(secret: DotOption) {
    let firstGuess = secret;
    let secondGuess = secret;

    while (firstGuess.word === secret.word) {
        firstGuess = getSecret();
    }

    while (secondGuess.word === secret.word || firstGuess.word === secondGuess.word) {
        secondGuess = getSecret();
    }

    return [firstGuess, secondGuess];
}

export function NatureGuessingGame() {
    const [secret, setSecret] = createSignal(getSecret());
    const guesses = createMemo(() => getGuesses(secret()));
    const scrambledGuesses = createMemo(() => {
        const currSecret = secret();
        const [firstGuess, secondGuess] = guesses();

        const result = [currSecret, firstGuess, secondGuess];

        for (let i = 0; i < 100; i++) {
            const firstIndex = getRandomInt(3);
            const secondIndex = getRandomInt(3);

            if (firstIndex === secondIndex) {
                continue;
            }

            const firstToSwap = result[firstIndex];
            const secondToSwap = result[secondIndex];

            if (!firstToSwap || !secondToSwap) {
                continue;
            }

            result[firstIndex] = secondToSwap;
            result[secondIndex] = firstToSwap;
        }

        return result;
    });

    const submitGuess = useSubmitGuess<DotOption>(
        (guess) => guess.word === secret().word,
        (correct) => {
            if (!correct) {
                return;
            }

            let nextSecret = secret();

            while (nextSecret === secret()) {
                nextSecret = getSecret();
            }

            setSecret(nextSecret);
        },
    );

    return (
        <>
            <div class="flex gap-12 w-full items-center justify-center text-9xl flex-wrap">
                <div class="before:content-[attr(data-dot)]" data-dot={secret().emoji} />
            </div>

            <div class="flex flex-col md:flex-row gap-4 p-2 w-full justify-center mt-auto font-['Noto_Sans_Hebrew']">
                <For each={scrambledGuesses()}>
                    {(guess) => (
                        <Button
                            variant={randomButtonVariant()}
                            onClick={() => submitGuess(guess)}
                            class="text-6xl aspect-[1/0.33]"
                        >
                            {guess.word}
                        </Button>
                    )}
                </For>
            </div>
        </>
    );
}
