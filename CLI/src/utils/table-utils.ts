import {text} from "figlet";

export class Column {
    name: string;
    type: 'ETH' | string;
    width: number;
    align: 'LEFT' | 'RIGHT'
    dataMapping : string;
    
    constructor(name: string, type: 'ETH' | 'TXT', width: number, align: 'LEFT' | 'RIGHT', dataMapping: string) {
        this.name = name;
        this.type = type;
        this.width = width;
        this.align = align;
        this.dataMapping = dataMapping;
    }
}


export class Table {
    columns: Column[] = [];
    data: any[] = [];
    sortBy: string[] = [];
    filterBy: string[] = [];
    search: string = '';
    border: string = '    ';
    
    addColumn(col: Column) {
        this.columns.push(col);
    }
    
    addData(data: any[]) {
        this.data = data;
    }
    
    print(page: number, totalCount: number) {
        const totalLength = this.buildHeader();
        this.buildData();
        console.log(Table.fillSpace(totalLength, '-'));
        const totalPages = Math.ceil(totalCount/5);
        console.log(`Page ${page}/${totalPages}`)
    }
    
    private buildHeader() : number {
        //todo include filters
        let header = '';
        for (let i = 0; i < this.columns.length; i++) {
            let col = this.columns[i];
            header +=  Table.textPadding(col.name, col.width, col.align) + this.border;
        }
        console.log(header);
        console.log(Table.fillSpace(header.length, '-'))
        return header.length;
    }
    
    private buildData() {
        let row = '';
        for (let i = 0; i < this.data.length; i++) {
            const rowData = this.data[i];
            row = '';
            
            this.columns.forEach((col) => {
                let value = rowData[col.dataMapping];
                let text:string;
                if(!value) {
                    text = '-';
                } else {
                    text = value.toString();
                    if(col.type === 'ETH') {
                        text = Number.parseFloat(text).toString();
                        text += ' ETH';
                    } 
                }
                row += Table.textPadding(text, col.width, col.align) + this.border;
            })
                
            
            console.log(row);
        }
    }
    
    static textPadding(text: string, width: number, align: 'LEFT' | 'RIGHT'): string {
        if(text.length == width) {
            return text;
        }
        
        if(text.length > width) {
            return text.substring(0, width - 1);
        }

        const whiteSpaceNumber = width - text.length;
        const whiteSpace = Table.fillSpace(whiteSpaceNumber, ' ')
        if(align === 'LEFT') {
            return text + whiteSpace;
        } else {
            return whiteSpace + text;
        }
    }
    
    static fillSpace(num: number, char: string): string {
        let whitespace = '';
        for (let i = 0; i < num; i++) {
            whitespace += char;
        }
        return whitespace;
    }
}