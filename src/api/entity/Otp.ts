import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("otp")
export default class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mobile: string;

  @Column()
  code: number;
}
