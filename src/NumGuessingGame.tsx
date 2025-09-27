import { createMemo, createSignal, For } from 'solid-js';
import { Button } from './Button';
import { getRandomInt, randomButtonVariant, useSubmitGuess } from './utils';

const MAX_DOTS = 10;

const DOT_OPTIONS = [
    '🐖',
    '🐄',
    '🐥',
    '🐧',
    '🦭',
    '🚁',
    '🦋',
    '🐌',
    '🛝',
    '🍟',
    '⭐',
    '🐊',
    '🐗',
    '🐒',
    '🥕',
    '🍎',
    '🏗️',
    '⛵',
    '🍏',
    '🦁',
    '🚦',
    '🦒',
    '🍌',
    '🐢',
    '🍨',
    '🍓',
    '🛵',
    '🍪',
    '🌲',
    '🌴',
    '🌼',
    '🍍',
    '🌷',
    '🎳',
    '🧸',
    '🛻',
    '🐭',
    '🍰',
    '🌽',
    '🛩️',
    '🚒',
    '🐶',
    '🐕',
    '🍕',
    '🐈',
    '🐱',
    '🚎',
    '🚌',
    '⏰',
    '👟',
    '🪑',
    '⚽',
    '📖',
    '🏠',
    '🔑',
    '🧦',
    '🌙',
    '☀️',
    '🚗',
    '🚲',
    '👖',
    '👚',
    '🥄',
    '🪥',
    '🥚',
    '🐟',
    '🧅',
    '🍋',
    '🦓',
    '🐘',
    '🐸',
    '🎈',
    '🎁',
    '🔦',
    '🚪',
    '🐅',
    '🐴',
    '🦄',
    '🐿️',
    '🦔',
    '🦇',
    '🐨',
    '🦘',
    '🦚',
    '🦜',
    '🦉',
];

function getDotOption() {
    return DOT_OPTIONS[getRandomInt(DOT_OPTIONS.length)];
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

const DOTS = Array<number>(10);

export function NumGuessingGame() {
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

    const submitGuess = useSubmitGuess(
        (guess) => guess === secret(),
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
            <div class="flex gap-12 w-full items-center justify-center text-5xl flex-wrap">
                <For each={DOTS.slice(0, secret())}>
                    {() => <div class="before:content-[attr(data-dot)]" data-dot={dotOption()} />}
                </For>
            </div>

            <div class="flex flex-col md:flex-row gap-4 p-2 w-full justify-center mt-auto">
                <For each={scrambledGuesses()}>
                    {(guess) => (
                        <Button
                            variant={randomButtonVariant()}
                            onClick={() => submitGuess(guess)}
                            class="text-6xl aspect-[1/0.33]"
                        >
                            {guess}
                        </Button>
                    )}
                </For>
            </div>
        </>
    );
}
