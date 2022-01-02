import { IsInt } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Entry } from "./Entry";
import { StatusItem } from "./StatusItem";

@Entity({ name: 'entry_status_item' })
export class EntryToStatusItem {
  @PrimaryGeneratedColumn()
  public id!: number;

  @IsInt({ always: true })
  @Column()
  public entryId!: number;

  @IsInt({ always: true })
  @Column()
  public activityId!: number;

  @IsInt({ always: true })
  @Column()
  public value!: number;

  @ManyToOne(() => Entry, entry => entry.statuses)
  public entry!: Entry;

  @ManyToOne(() => StatusItem, statusItem => statusItem.statuses)
  public statusItem!: StatusItem;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
