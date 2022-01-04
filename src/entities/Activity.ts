import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

@Entity({ name: 'activity' })
export class Activity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @IsString({ always: true })
  @Column()
  public name: string = "";

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  // finds an activity by its name. Returns undefined if no such activity is found
  public static async findByName(name : string) {
    let activity = await Activity.findOne({name: name});
    if (activity === undefined) throw { error: "Activity not found: '" + name + "'" };
    return activity;
  }

  // finds an activity id
  public static async findIdByName(name : string) {
    let activity = await Activity.findOne({name: name});
    if (activity === undefined) throw { error: "Activity not found: '" + name + "'" };
    return activity?.id;
  }

  public static async findManyByName(names : string[]) {
    let activities = [];
    for (let name of names) {
      activities.push(await this.findByName(name));
    }
    return activities;
  }

  public static async findManyIdByName(names : string[]) {
    let activities = [];
    for (let name of names) {
      activities.push(await this.findIdByName(name));
    }
    return activities;
  }
}
