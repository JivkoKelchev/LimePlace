import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Listing {
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
    collection: string
    
    @ApiProperty()
    @Column()
    owner: string
    
    @ApiProperty()
    @Column()
    active: boolean
    
    @ApiProperty()
    @Column()
    price: string
    
    @ApiProperty()
    @Column({type: 'bigint'})
    updated_at: number
}