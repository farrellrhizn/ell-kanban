type ClassValue = string | false | null | undefined;

export const cn = (...classes: Array<ClassValue | ClassValue[]>): string =>
  classes
    .flat()
    .filter(Boolean)
    .join(' ');
