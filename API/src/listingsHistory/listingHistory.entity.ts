import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class ListingHistory {
    @PrimaryGeneratedColumn()
    id: number
    
    @ApiProperty()
    @Column()
    listingUid: string
    
    @ApiProperty()
    @Column()
    tokenId: number
    
    @ApiProperty()
    @Column()
    owner: string
    
    @ApiProperty()
    @Column()
    active: boolean

    @ApiProperty()
    @Column()
    historyEvent: string
    
    @ApiProperty()
    @Column()
    price: number
    
    @ApiProperty()
    @Column()
    updated_at: number
}