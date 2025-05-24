import { createMemo, createSignal, For, Match, Switch } from 'solid-js';

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

export default function App() {
    const [secret, setSecret] = createSignal(getSecret());
    const guesses = createMemo(() => getGuesses(secret()));
    const [lastGuessCorrect, setLastGuessCorrect] = createSignal<boolean>();
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
        setLastGuessCorrect(guess === secret());
        setSecret(getSecret());
    };

    return (
        <div>
            <h1>{secret()}</h1>

            <For each={scrambledGuesses()}>
                {(guess) => <button onClick={() => submitGuess(guess)}>{guess}</button>}
            </For>

            <Switch>
                <Match when={lastGuessCorrect() === true}>
                    <h2>You were right</h2>
                </Match>

                <Match when={lastGuessCorrect() === false}>
                    <h2>You were wrong</h2>
                </Match>
            </Switch>
        </div>
    );
}
