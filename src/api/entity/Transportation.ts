import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("transportation")
export default class Transportation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
