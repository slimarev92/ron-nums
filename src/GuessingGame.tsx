import { createMemo, createSignal, For, useContext } from 'solid-js';
import { DialogContext } from './DialogProvider';

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function getSecret() {
    return getRandomInt(10) + 1;
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

export function GuessingGame() {
    const dialogStore = useContext(DialogContext);

    if (!dialogStore) {
        throw new Error('Dialog store does not exist');
    }

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

    const submitGuess = (guess: number) => {
        setSecret(getSecret());

        if (guess === secret()) {
            dialogStore.setDialog(<h1>You were right!</h1>);
        } else {
            dialogStore.setDialog(<h1>You were wrong!</h1>);
        }

        setTimeout(() => dialogStore.setDialog(undefined), 3000);
    };

    return (
        <div>
            <h1>{secret()}</h1>

            <For each={scrambledGuesses()}>
                {(guess) => <button onClick={() => submitGuess(guess)}>{guess}</button>}
            </For>
        </div>
    );
}
