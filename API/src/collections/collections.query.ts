import {ApiModelPropertyOptional} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class CollectionsQuery {
    @ApiModelPropertyOptional({
        type: Number,
        example: 1,
    })
    page?: number
    
    @ApiModelPropertyOptional({
        type: Number,
        example: 1
    })
    active?: 1 | 0
    
    @ApiModelPropertyOptional({
        type:String,
    })
    name?: string

    @ApiModelPropertyOptional({
        type: Number,
    })
    floor?: number

    @ApiModelPropertyOptional({
        type: Number,
    })
    floorGt?: number

    @ApiModelPropertyOptional({
        type: Number,
    })
    floorLt?: number

    @ApiModelPropertyOptional({
        type: Number,
    })
    volume?: number

    @ApiModelPropertyOptional({
        type: Number,
    })
    volumeGt?: number

    @ApiModelPropertyOptional({
        type: Number,
    })
    volumeLt?: number

    @ApiModelPropertyOptional({
        type: String,
    })
    owner?: string

    @ApiModelPropertyOptional({
        type: String,
        example: 'ASC',
    })
    sortFloor?: 'ASC' | 'DESC'

    @ApiModelPropertyOptional({
        type: String,
        example: 'ASC',
    })
    sortVolume?: 'ASC' | 'DESC'

    @ApiModelPropertyOptional({
        type: String,
        example: 'ASC',
    })
    sortListings?: 'ASC' | 'DESC'
}