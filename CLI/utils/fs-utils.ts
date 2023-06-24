import * as path from "path";

export function getExtension(filename: string) : string {
    const i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substring(i).toUpperCase();
}

export function getFileNameFromPath(filepath: string) : string {
    const i = filepath.lastIndexOf(path.sep);
    return (i < 0) ? '' : filepath.substring(i+1);
}