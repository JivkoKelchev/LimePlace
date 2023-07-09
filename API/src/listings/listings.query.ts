import {ApiModelPropertyOptional} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class ListingsQuery {
    @ApiModelPropertyOptional({
        type: Number,
    })
    page?: number
    
    @ApiModelPropertyOptional({
        type: Number,
    })
    active?: boolean
    
    @ApiModelPropertyOptional({
        type: String,
    })
    collection?: string

    @ApiModelPropertyOptional({
        type: Number,
    })
    price?: number
    
    @ApiModelPropertyOptional({
        type: Number,
    })
    priceGt?: number
    
    @ApiModelPropertyOptional({
        type: Number,
    })
    priceLt?: number
    
    @ApiModelPropertyOptional({
        type: String,
    })
    owner?: string
    
    @ApiModelPropertyOptional({
        type: String,
        example: 'ASC',
    })
    sortPrice?: 'ASC' | 'DESC'
}