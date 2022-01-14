import { IsNumber } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany, BaseEntity, ManyToOne } from "typeorm";
import { Activity } from "./Activity";
import { EntryToStatus } from "./EntryToStatus";
import { User } from "./User";

@Entity({ name: 'entry' })
export class Entry extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: "uuid" })
  public userId!: string;

  @ManyToOne(() => User, user => user.entries)
  public user!: User;

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
