import { createSignal, Match, Show, Switch } from 'solid-js';
import { DialogProvider } from './DialogProvider';
import { NumGuessingGame } from './NumGuessingGame';
import { LetterGuessingGame } from './LetterGuessingGame';
import { Button } from './Button';
import { NatureGuessingGame } from './NatureGuessingGame';

type Selection = 'nums' | 'letters' | 'nature';

export default function App() {
    const [selection, setSelection] = createSignal<Selection>();

    const handleFullScreenClick = async (next: Selection) => {
        if (selection()) {
            return;
        }

        await document.body.requestFullscreen();

        setSelection(next);
    };
    return (
        <Show
            when={selection()}
            fallback={
                <div class="flex flex-col gap-5 items-center p-10 *:text-6xl *:p-8 *:w-3/4 font-['Noto_Sans_Hebrew']">
                    <Button variant="sky" onClick={() => handleFullScreenClick('nums')}>
                        מספרים
                    </Button>
                    <Button variant="red" onClick={() => handleFullScreenClick('letters')}>
                        אותיות
                    </Button>
                    <Button variant="emerald" onClick={() => handleFullScreenClick('nature')}>
                        טבע{' '}
                    </Button>
                </div>
            }
        >
            <div class="flex flex-col h-[95vh] my-auto p-10 bg-white">
                <DialogProvider>
                    <Switch>
                        <Match when={selection() === 'letters'}>
                            <LetterGuessingGame />
                        </Match>
                        <Match when={selection() === 'nums'}>
                            <NumGuessingGame />
                        </Match>
                        <Match when={selection() === 'nature'}>
                            <NatureGuessingGame />
                        </Match>
                    </Switch>
                </DialogProvider>
            </div>
        </Show>
    );
}
