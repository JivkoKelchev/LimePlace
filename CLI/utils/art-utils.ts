export const combineArt = (art1: string, art2: string) => {
    const lines1 = art1.split('\n');
    const lines2 = art2.split('\n');
    let combinedArt = '';

    for (let i = 0; i < lines1.length; i++) {
        combinedArt += lines1[i] + '  ' + lines2[i] + '\n';
    }

    return combinedArt;
};

export const padArt = (art: string, lines: number) => {
    const artLines = art.split('\n');
    const padding = ' '.repeat(artLines[0].length);

    while (artLines.length < lines) {
        artLines.unshift(padding);
    }

    return artLines.join('\n');
};

