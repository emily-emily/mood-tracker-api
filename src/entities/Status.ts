import { IsString } from "class-validator";
import MyError from "../helpers/MyError";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity, ManyToOne } from "typeorm";
import { EntryToStatus } from "./EntryToStatus";
import { User } from "./User";

@Entity({ name: 'status' })
export class Status extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: "uuid" })
  public userId!: string;

  @ManyToOne(() => User, user => user.statuses)
  public user!: User;

  @IsString({ always: true })
  @Column()
  public name: string = "";

  @OneToMany(() => EntryToStatus, status => status.entry)
  public entries!: EntryToStatus[];

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  // finds a status by its name. Returns undefined if no such activity is found
  public static async findByName(uid: string, name: string) {
    let status = await Status.findOne({ userId: uid, name: name });
    if (status === undefined) throw new MyError("Status not found: '" + name + "'", 400);
    return status;
  }

  // finds a status id
  public static async findIdByName(uid: string, name : string) {
    let status = await Status.findOne({ userId: uid, name: name });
    if (status === undefined) throw new MyError("Status not found: '" + name + "'", 400);
    return status?.id;
  }
}
