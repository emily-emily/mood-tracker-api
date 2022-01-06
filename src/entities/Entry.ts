import { IsNumber } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany, BaseEntity } from "typeorm";
import { Activity } from "./Activity";
import { EntryToStatusItem } from "./EntryToStatusItem";

@Entity({ name: 'entry' })
export class Entry extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @IsNumber()
  @Column({ type: "real" })
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

  public hasActivity(activity : string) {
    return this.activities.find(a => a.name === activity) !== undefined;
  }
}
