import {loadHeader} from "../controllers/homeController";
import asciifyImage from 'asciify-image'

export const combineArt = (art1: string, art2: string) => {
    const lines1 = art1.split('\n');
    const lines2 = art2.split('\n');
    let combinedArt = '';

    for (let i = 0; i < lines1.length; i++) {
        combinedArt += lines1[i] + '  ' + lines2[i];
        if(i < lines1.length - 1){
            combinedArt += '\n';
        }
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

export const clearScreen = async () => {
    console.clear();
    loadHeader();
}

export const printImage = async (imagePath: string) => {
    let fit: 'box' | 'width' | 'height' | 'original' | 'none';
    fit = 'box';
    const options = {
        color: true,
        fit:    fit,
        width:  20,
    }

    const asciified = await asciifyImage(imagePath, options);
    
    console.log('');
    // Print asciified image to console
    console.log(asciified);
        // .then(function (asciified) {
        //     console.log('');
        //     // Print asciified image to console
        //     console.log(asciified);
        // })
        // .catch(function (err) {
        //     // Print error to console
        //     console.error(err);
        // });
}

