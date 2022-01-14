import { IsEmail, IsString } from "class-validator";
import MyError from "../helpers/MyError";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from "typeorm";
import { Activity } from "./Activity";
import { Entry } from "./Entry";
import { Status } from "./Status";

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: number;

  @IsString({ always: true })
  @Column()
  public name!: string;

  @IsEmail()
  @Column({ unique: true })
  public email!: string;

  @Column()
  public password!: string;

  @OneToMany(() => Entry, entry => entry.user)
  public entries!: Entry[];

  @OneToMany(() => Activity, activity => activity.user)
  public activities!: Activity[];

  @OneToMany(() => Status, status => status.user)
  public statuses!: Status[];

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  public static async findById(uid: string) {
    let user = await User.findOne(uid);
    if (user === undefined) throw new MyError("User not found");
    return user;
  }
}
