import confetti from 'canvas-confetti';
import goodAudio from './good.mp3';
import wrongAudio from './wrong.mp3';
import { ALL_BUTTON_VARIANTS, type ButtonVariants } from './Button';

export function useSubmitGuess<T>(
    checkGuess: (guess: T) => boolean,
    afterAnimation: (correct: boolean) => void,
) {
    return (guess: T) => {
        const correct = checkGuess(guess);

        if (correct) {
            const audio = new Audio(goodAudio);

            audio.play();
        } else {
            const audio = new Audio(wrongAudio);

            audio.play();
        }

        setTimeout(() => {
            if (correct) {
                confetti({
                    particleCount: 1000,
                    spread: 360,
                });

                afterAnimation(correct);
            }
        }, 250);
    };
}

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export function randomButtonVariant(): ButtonVariants {
    let variant: ButtonVariants | undefined;

    while (!variant) {
        variant = ALL_BUTTON_VARIANTS[getRandomInt(ALL_BUTTON_VARIANTS.length)];
    }

    return variant;
}
