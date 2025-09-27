import { createSignal, Match, Show, Switch } from 'solid-js';
import { DialogProvider } from './DialogProvider';
import { NumGuessingGame } from './NumGuessingGame';
import { LetterGuessingGame } from './LetterGuessingGame';
import { Button } from './Button';

type Selection = 'nums' | 'letters';

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
                <div class="w-full h-svh flex gap-5 items-center *:grow p-10 *:text-6xl">
                    <Button variant="sky" onClick={() => handleFullScreenClick('nums')}>
                        מספרים
                    </Button>
                    <Button variant="red" onClick={() => handleFullScreenClick('letters')}>
                        אותיות
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
                    </Switch>
                </DialogProvider>
            </div>
        </Show>
    );
}
