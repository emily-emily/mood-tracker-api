import { IsInt } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Activity } from "./Activity";
import { EntryToStatusItem } from "./EntryToStatusItem";

@Entity({ name: 'entry' })
export class Entry {
  @PrimaryGeneratedColumn()
  public id!: number;

  @IsInt({ always: true })
  @Column()
  public mood!: number;

  @ManyToMany(() => Activity)
  @JoinTable()
  public activities!: Activity[];

  @OneToMany(() => EntryToStatusItem, status => status.entry)
  public statuses!: EntryToStatusItem[];

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
