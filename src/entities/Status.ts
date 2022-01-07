import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity } from "typeorm";
import { EntryToStatus } from "./EntryToStatus";

@Entity({ name: 'status' })
export class Status extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @IsString({ always: true })
  @Column()
  public name: string = "";

  @OneToMany(() => EntryToStatus, status => status.entry)
  public statuses!: EntryToStatus[];

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
