import { DialogProvider } from './DialogProvider';
import { GuessingGame } from './GuessingGame';

export default function App() {
    return (
        <DialogProvider>
            <GuessingGame />
        </DialogProvider>
    );
}
