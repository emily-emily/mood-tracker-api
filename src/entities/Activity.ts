import { IsString } from "class-validator";
import MyError from "../helpers/MyError";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity({ name: 'activity' })
export class Activity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: "uuid" })
  public userId!: string;

  @ManyToOne(() => User, user => user.activities)
  public user!: User;

  @IsString({ always: true })
  @Column()
  public name: string = "";

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  // finds an activity by its name. Throws error if no such activity is found
  public static async findByName(uid: string, name: string) {
    let activity = await Activity.findOne({ userId: uid, name: name });
    if (activity === undefined) throw new MyError("Activity not found: '" + name + "'", 400);
    return activity;
  }

  // finds an activity id
  public static async findIdByName(uid: string, name: string) {
    let activity = await Activity.findOne({ userId: uid, name: name });
    if (activity === undefined) throw new MyError("Activity not found: '" + name + "'", 400);
    return activity?.id;
  }

  public static async findManyByName(uid: string, names : string[]) {
    let activities = [];
    for (let name of names) {
      activities.push(await this.findByName(uid, name));
    }
    return activities;
  }

  public static async findManyIdByName(uid: string, names : string[]) {
    let activities = [];
    for (let name of names) {
      activities.push(await this.findIdByName(uid, name));
    }
    return activities;
  }
}
