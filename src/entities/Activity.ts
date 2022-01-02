import { IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'activity' })
export class Activity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @IsString({ always: true })
  @Column()
  public name: string = "";

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
