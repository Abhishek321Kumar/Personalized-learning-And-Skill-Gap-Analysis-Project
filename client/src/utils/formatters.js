export const percent = (value = 0) => `${Math.round(value)}%`;

export const pluralize = (count, noun) => `${count} ${noun}${count === 1 ? "" : "s"}`;

