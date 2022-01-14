import { IsEmail, IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";
import { EntryToStatus } from "./EntryToStatus";

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

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
