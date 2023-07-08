export interface CollectionsQueryState {
    page: number;
    search: string | null;
    fileter: CollectionsFilter[];
    sort: CollectionsSort[];
}

export interface ListingsQueryState {
    page: number;
    search: string | null;
    fileter: ListingsFilter[];
    sort: ListingsSort[];
}

export interface CollectionsFilter {
    owner?: string;
    floor?: string;
    volume?: string;
}

export interface CollectionsSort {
    floor?: 'ASC' | 'DESC';
    volume?: 'ASC' | 'DESC';
    listings?: 'ASC' | 'DESC';
}

export interface ListingsFilter {
    owner?: string;
    collection?: string;
    price?: string;
}

export interface ListingsSort {
    price?: 'ASC' | 'DESC';
}


export interface HeaderIndicator{
    filterIndicator?: boolean;
    sortIndicator?: 'ASC' | 'DESC'
} 
export class Column {
    name: string;
    type: 'ETH' | string;
    width: number;
    align: 'LEFT' | 'RIGHT'
    dataMapping : string;
    indicator?: HeaderIndicator;
    
    constructor(
        name: string, 
        type: 'ETH' | 'TXT', 
        width: number, 
        align: 'LEFT' | 'RIGHT', 
        dataMapping: string,
        indicator?: HeaderIndicator
    ) {
        this.name = name;
        this.type = type;
        this.width = width;
        this.align = align;
        this.dataMapping = dataMapping;
        this.indicator = indicator;
    }
}


export class Table {
    columns: Column[] = [];
    data: any[] = [];
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
        const totalPages = Math.ceil(totalCount/10);
        console.log(`Page ${page}/${totalPages}`)
    }
    
    private buildHeader() : number {
        let header = '';
        for (let i = 0; i < this.columns.length; i++) {
            let col = this.columns[i];
            let name = col.name;
            if(col.indicator?.filterIndicator){
                name += ' \u2691'
            }
            if(col.indicator?.sortIndicator === 'ASC'){
                name += ' \u2191'
            }
            if(col.indicator?.sortIndicator === 'DESC'){
                name += ' \u2193'
            }
                
            header +=  Table.textPadding(name, col.width, col.align) + this.border;
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
            return text.substring(0, width-3) + '...';
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