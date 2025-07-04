import { DialogProvider } from './DialogProvider';
import { NumGuessingGame } from './NumGuessingGame';

export default function App() {
    return (
        <DialogProvider>
            <NumGuessingGame />
        </DialogProvider>
    );
}
