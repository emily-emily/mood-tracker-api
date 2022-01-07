import { IsInt, IsNumber } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, BaseEntity } from "typeorm";
import { Entry } from "./Entry";
import { Status } from "./Status";

@Entity({ name: 'entry_status' })
export class EntryToStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @IsInt({ always: true })
  @Column({ type: "int" })
  public entryId!: number;

  @IsInt({ always: true })
  @Column({ type: "int" })
  public statusItemId!: number;

  @IsNumber()
  @Column({ type: "real" })
  public value!: number;

  @ManyToOne(() => Entry, entry => entry.statuses)
  public entry!: Entry;

  @ManyToOne(() => Status, statusItem => statusItem.statuses)
  public statusItem!: Status;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
