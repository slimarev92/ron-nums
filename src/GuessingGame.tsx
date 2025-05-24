import { createMemo, createSignal, For, useContext } from 'solid-js';
import { DialogContext } from './DialogProvider';
import { ALL_BUTTON_VARIANTS, Button, type ButtonVariants } from './Button';
import confetti from 'canvas-confetti';
import goodAudio from './good.mp3';
import wrongAudio from './wrong.mp3';

const MAX_DOTS = 6;

const DOT_OPTIONS = [
    '🐖',
    '🐄',
    '🐗',
    '🐒',
    '🥕',
    '🍎',
    '🍏',
    '🦁',
    '🦒',
    '🐢',
    '🍓',
    '🍪',
    '🌲',
    '🌴',
    '🌼',
    '🌷',
    '🎳',
    '🧸',
    '🛻',
    '🐭',
    '🍰',
    '🌽',
    '🚒',
    '🐶',
    '🐕',
    '🐈',
    '🐱',
    '🚎',
    '🚌',
];

function getDotOption() {
    return DOT_OPTIONS[getRandomInt(DOT_OPTIONS.length)];
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function getSecret() {
    return getRandomInt(MAX_DOTS) + 1;
}

function getGuesses(secret: number) {
    let firstGuess = secret;
    let secondGuess = secret;

    while (firstGuess === secret) {
        firstGuess = getSecret();
    }

    while (secondGuess === secret || firstGuess === secondGuess) {
        secondGuess = getSecret();
    }

    return [firstGuess, secondGuess];
}

function randomButtonVariant(): ButtonVariants {
    let variant: ButtonVariants | undefined;

    while (!variant) {
        variant = ALL_BUTTON_VARIANTS[getRandomInt(ALL_BUTTON_VARIANTS.length)];
    }

    return variant;
}

const DOTS = Array<number>(10);

export function GuessingGame() {
    const dialogStore = useContext(DialogContext);

    if (!dialogStore) {
        throw new Error('Dialog store does not exist');
    }

    const [secret, setSecret] = createSignal(getSecret());
    const dotOption = createMemo(() => {
        void secret();

        return getDotOption();
    });

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

    const submitGuess = (guess: number) => {
        let releaseConfetti = false;

        if (guess === secret()) {
            releaseConfetti = true;
            const audio = new Audio(goodAudio);

            audio.play();
        } else {
            const audio = new Audio(wrongAudio);

            audio.play();
        }

        setTimeout(() => {
            if (releaseConfetti) {
                confetti({
                    particleCount: 1000,
                    spread: 360,
                });
            }

            let nextSecret = secret();

            while (nextSecret === secret()) {
                nextSecret = getSecret();
            }

            setSecret(nextSecret);
        }, 250);
    };

    return (
        <div class="p-5 text-5xl mt-5">
            <div class="flex gap-12 w-full items-center justify-center mb-20">
                <For each={DOTS.slice(0, secret())}>
                    {() => <div class="w-5 h-5">{dotOption()}</div>}
                </For>
            </div>

            <div class="flex gap-4 p-2 w-full justify-center">
                <For each={scrambledGuesses()}>
                    {(guess) => (
                        <Button variant={randomButtonVariant()} onClick={() => submitGuess(guess)}>
                            {guess}
                        </Button>
                    )}
                </For>
            </div>
        </div>
    );
}
