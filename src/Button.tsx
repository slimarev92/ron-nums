import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { splitProps, type JSX } from 'solid-js';

const buttonVariants = cva(
    'rounded-xl border-2 p-1 text-white text-shadow-md min-w-[6ch] shadow-md hover:opacity-70 cursor-pointer active:scale-90 transition-transform',
    {
        variants: {
            variant: {
                emerald: 'border-emerald-200 bg-linear-to-r from-emerald-400 to-green-400',
                violet: 'border-violet-200 bg-linear-to-r from-violet-400 to-violet-400',
                teal: 'border-teal-200 bg-linear-to-r from-teal-400 to-teal-400',
                amber: 'border-amber-200 bg-linear-to-r from-amber-400 to-amber-400',
                sky: 'border-sky-200 bg-linear-to-r from-sky-400 to-sky-400',
                red: 'border-red-200 bg-linear-to-r from-red-400 to-red-400',
                blue: 'border-blue-200 bg-linear-to-r from-blue-400 to-blue-400',
                indigo: 'border-indigo-200 bg-linear-to-r from-indigo-400 to-indigo-400',
                rose: 'border-rose-200 bg-linear-to-r from-rose-400 to-rose-400',
                yellow: 'border-yellow-200 bg-linear-to-r from-yellow-400 to-yellow-400',
            },
        },
        defaultVariants: {
            variant: 'emerald',
        },
    },
);

export type ButtonVariants = Exclude<
    VariantProps<typeof buttonVariants>['variant'],
    undefined | null
>;

const ButtonVariantToName: Record<ButtonVariants, ButtonVariants> = {
    emerald: 'emerald',
    violet: 'violet',
    teal: 'teal',
    amber: 'amber',
    sky: 'sky',
    red: 'red',
    blue: 'blue',
    indigo: 'indigo',
    rose: 'rose',
    yellow: 'yellow',
};

export const ALL_BUTTON_VARIANTS = Object.keys(ButtonVariantToName) as ButtonVariants[];

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariants;
}

export function Button(incomingProps: ButtonProps) {
    const [own, rest] = splitProps(incomingProps, ['class', 'children', 'variant']);

    const mergedClasses = () => clsx(buttonVariants({ variant: own.variant }), own.class);

    return (
        <button {...rest} class={mergedClasses()}>
            {own.children}
        </button>
    );
}
