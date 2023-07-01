//will return empty sting on wrong data
const collectionFilterFlags = ['-O', '-F', 'V'];
export const parseCollectionFilterUserInput = (input: string): string => {
    let result = '';
    const filters = input.split(' ');
    filters.forEach((fStr: string) => {
        const flag = fStr.substring(0,2);
        if(!collectionFilterFlags.includes(flag)){
            console.log('Filter flag not found : expected ', collectionFilterFlags);
            return '';
        }
        if(flag === collectionFilterFlags[0]) {
            const values = fStr.split(':')
            if(values.length != 2) {
                console.log('Value not provided!')
            }
            result +='owner='+values[1];
        }
        
        //Todo parse other filters
    })
    
    return '';
}