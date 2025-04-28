export function containsWholeSubstring(mainString: string, subString: string) {
    const escapedSubString = subString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSubString}\\b`);
    return regex.test(mainString);
}

