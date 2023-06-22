export function getExtension(filename: string) : string {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substring(i).toUpperCase();
}