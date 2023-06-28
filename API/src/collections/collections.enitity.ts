import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Collection {
    @PrimaryGeneratedColumn()
    id: number
    
    @ApiProperty()
    @Column()
    address: string

    @ApiProperty()
    @Column()
    owner: string

    @ApiProperty()
    @Column()
    name: string

    @ApiProperty()
    @Column()
    symbol: string
    
    @ApiProperty()
    @Column({type: 'bigint'})
    updated_at: number
    
}