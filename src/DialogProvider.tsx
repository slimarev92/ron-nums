import { createContext, type JSXElement } from 'solid-js';
import { createStore } from 'solid-js/store';

function createDialogStore() {
    const [store, setStore] = createStore({
        currDialog: undefined as JSXElement | undefined,
        setDialog: (next: JSXElement | undefined) => setStore({ currDialog: next }),
    });

    return store;
}

type DialogStore = ReturnType<typeof createDialogStore>;

export const DialogContext = createContext<DialogStore>();

export function DialogProvider(props: { children: JSXElement }) {
    const dialogStore = createDialogStore();

    return (
        <>
            <DialogContext.Provider value={dialogStore}>{props.children}</DialogContext.Provider>
            <dialog open={!!dialogStore.currDialog}>{dialogStore.currDialog}</dialog>
        </>
    );
}
