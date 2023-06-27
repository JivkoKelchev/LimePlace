import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class BlockInfo {
    @PrimaryGeneratedColumn()
    id: number
    
    @ApiProperty()
    @Column()
    blockNumber: number
    
    @ApiProperty()
    @Column({type: 'bigint'})
    updated_at: number
    
}