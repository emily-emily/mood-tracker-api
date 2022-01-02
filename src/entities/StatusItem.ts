import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { EntryToStatusItem } from "./EntryToStatusItem";

@Entity({ name: 'status_item' })
export class StatusItem {
  @PrimaryGeneratedColumn()
  public id!: number;

  @IsString({ always: true })
  @Column()
  public name: string = "";

  @OneToMany(() => EntryToStatusItem, status => status.entry)
  public statuses!: EntryToStatusItem[];

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
