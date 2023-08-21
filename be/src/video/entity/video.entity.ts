
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('videos')
export class Video extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number ;
    @Column({ name: 'title', type: 'varchar', length: 255, nullable: false })
    title: string ;
    @Column({ name: 'url', type: 'varchar', length: 255, nullable: false })
    url: string ;

    @Column({
        nullable: false,
        name: 'likeCount',
        type: 'integer',
        default: 0,
    })
    likeCount: number ;
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

}