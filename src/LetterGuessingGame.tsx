import { createMemo, createSignal, For } from 'solid-js';
import { Button } from './Button';
import { getRandomInt, randomButtonVariant, useSubmitGuess } from './utils';

type DotOption = { emoji: string; letter: string };

const DOT_OPTIONS = [
    { emoji: '🐖', letter: 'ח' }, // חזיר
    { emoji: '🐄', letter: 'פ' }, // פרה
    { emoji: '🐥', letter: 'א' }, // אפרוח
    { emoji: '🐧', letter: 'פ' }, // פינגווין
    { emoji: '🦭', letter: 'כ' }, // כלב ים
    { emoji: '🚁', letter: 'מ' }, // מסוק
    { emoji: '🦋', letter: 'פ' }, // פרפר
    { emoji: '🐌', letter: 'ח' }, // חילזון
    { emoji: '🛝', letter: 'מ' }, // מגלשה
    { emoji: '🐗', letter: 'ח' }, // חזיר בר
    { emoji: '🐒', letter: 'ק' }, // קוף
    { emoji: '🥕', letter: 'ג' }, // גזר
    { emoji: '🍎', letter: 'ת' }, // תפוח
    { emoji: '🏗️', letter: 'מ' }, // מנוף
    { emoji: '🍏', letter: 'ת' }, // תפוח
    { emoji: '🦁', letter: 'א' }, // אריה
    { emoji: '🚦', letter: 'ר' }, // רמזור
    { emoji: '🍌', letter: 'ב' }, // בננה
    { emoji: '🐢', letter: 'צ' }, // צב
    { emoji: '🍨', letter: 'ג' }, // גלידה
    { emoji: '🍓', letter: 'ת' }, // תות
    { emoji: '🛵', letter: 'ק' }, // קטנוע
    { emoji: '🍪', letter: 'ע' }, // עוגייה
    { emoji: '🌲', letter: 'ע' }, // עץ
    { emoji: '🌴', letter: 'ד' }, // דקל
    { emoji: '🌼', letter: 'פ' }, // פרח
    { emoji: '🍍', letter: 'א' }, // אננס
    { emoji: '🧸', letter: 'ד' }, // דובי
    { emoji: '🐭', letter: 'ע' }, // עכבר
    { emoji: '🍰', letter: 'ע' }, // עוגה
    { emoji: '🌽', letter: 'ת' }, // תירס
    { emoji: '🛩️', letter: 'מ' }, // מטוס
    { emoji: '🚒', letter: 'כ' }, // כבאית
    { emoji: '🐶', letter: 'כ' }, // כלב
    { emoji: '🐕', letter: 'כ' }, // כלב
    { emoji: '🍕', letter: 'פ' }, // פיצה
    { emoji: '🐈', letter: 'ח' }, // חתול
    { emoji: '🐱', letter: 'ח' }, // חתול
    { emoji: '🧦', letter: 'ג' }, // גרב
    { emoji: '🔑', letter: 'מ' }, // מפתח
    { emoji: '🏠', letter: 'ב' }, // בית
    { emoji: '📖', letter: 'ס' }, // ספר
    { emoji: '⚽', letter: 'כ' }, // כדור
    { emoji: '🪑', letter: 'כ' }, // כיסא
    { emoji: '👟', letter: 'נ' }, // נעל
    { emoji: '⏰', letter: 'ש' }, // שעון
    { emoji: '🌙', letter: 'י' }, // ירח
    { emoji: '☀️', letter: 'ש' }, // שמש
    { emoji: '🚗', letter: 'מ' }, // מכונית
    { emoji: '🚲', letter: 'א' }, // אופניים
    { emoji: '👖', letter: 'מ' }, // מכנסיים
    { emoji: '👚', letter: 'ח' }, // חולצה
    { emoji: '🥄', letter: 'כ' }, // כף
    { emoji: '🪥', letter: 'מ' }, // מברשת שיניים
    { emoji: '🥚', letter: 'ב' }, // ביצה
    { emoji: '🐟', letter: 'ד' }, // דג
    { emoji: '🧅', letter: 'ב' }, // בצל
    { emoji: '🍋', letter: 'ל' }, // לימון
    { emoji: '🦓', letter: 'ז' }, // זברה
    { emoji: '🐘', letter: 'פ' }, // פיל
    { emoji: '🐸', letter: 'צ' }, // צפרדע
    { emoji: '🎈', letter: 'ב' }, // בלון
    { emoji: '🎁', letter: 'מ' }, // מתנה
    { emoji: '🔦', letter: 'פ' }, // פנס
    { emoji: '🚪', letter: 'ד' }, // דלת
    { emoji: '🐅', letter: 'ט' }, // טיגריס
    { emoji: '🐴', letter: 'ס' }, // סוס
    { emoji: '🦄', letter: 'ח' }, // חד קרן
    { emoji: '🐿️', letter: 'ס' }, // סנאי
    { emoji: '🦔', letter: 'ק' }, // קיפוד
    { emoji: '🦇', letter: 'ע' }, // עטלף
    { emoji: '🐨', letter: 'ק' }, // קואלה
    { emoji: '🦘', letter: 'ק' }, // קנגרו
    { emoji: '🦚', letter: 'ט' }, // טווס
    { emoji: '🦜', letter: 'ת' }, // תוכי
    { emoji: '🦉', letter: 'י' }, // ינשוף
];

function getSecret() {
    return DOT_OPTIONS[getRandomInt(DOT_OPTIONS.length)];
}

function getGuesses(secret: DotOption) {
    let firstGuess = secret;
    let secondGuess = secret;

    while (firstGuess.letter === secret.letter) {
        firstGuess = getSecret();
    }

    while (secondGuess.letter === secret.letter || firstGuess.letter === secondGuess.letter) {
        secondGuess = getSecret();
    }

    return [firstGuess, secondGuess];
}

export function LetterGuessingGame() {
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
        (guess) => guess.letter === secret().letter,
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
                            {guess.letter}
                        </Button>
                    )}
                </For>
            </div>
        </>
    );
}
