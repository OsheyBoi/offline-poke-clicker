export type LogBookType = {
    display: string;
    label: string;
};

export const LogBookTypes: Record<string, LogBookType> = {
    NEW: {
        display: 'primary',
        label: 'NEW',
    },
    SHINY: {
        display: 'warning',
        label: 'SHINY',
    },
    CAUGHT: {
        display: 'success',
        label: 'CAUGHT',
    },
    ESCAPED: {
        display: 'danger',
        label: 'ESCAPED',
    },
    FOUND: {
        display: 'primary',
        label: 'FOUND',
    },
    ROAMER: {
        display: 'info',
        label: 'ROAMER',
    },
    ACHIEVE: {
        display: 'warning',
        label: 'ACHIEVE',
    },
    QUEST: {
        display: 'info',
        label: 'QUEST',
    },
    FRONTIER: {
        display: 'success',
        label: 'FRONTIER',
    },
    WANDER: {
        display: 'primary',
        label: 'WANDER',
    },
    OTHER: {
        display: 'dark',
        label: 'OTHER',
    },
};
