import { IsNumber } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany, BaseEntity } from "typeorm";
import { Activity } from "./Activity";
import { EntryToStatus } from "./EntryToStatus";

@Entity({ name: 'entry' })
export class Entry extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @IsNumber()
  @Column({ type: "real" })
  public mood!: number;

  @ManyToMany(() => Activity)
  @JoinTable({ name: "entry_activity" })
  public activities!: Activity[];

  @OneToMany(() => EntryToStatus, status => status.entry)
  public statuses!: EntryToStatus[];

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  public hasActivity(activity : string) {
    return this.activities.find(a => a.name === activity) !== undefined;
  }
}
