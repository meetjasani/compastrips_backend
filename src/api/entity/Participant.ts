import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User, Hosting } from "./index";

@Entity("participant")
export default class Participant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: false })
  is_accepted: boolean;

  @CreateDateColumn({ type: "timestamp" })
  requested_at: Date;

  @Column({ type: "timestamp", default: null })
  accepted_at: Date;

  @ManyToOne(() => Hosting, (hosting) => hosting.participants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "hosting_id" })
  hosting: Hosting;

  @OneToOne(() => User, (user) => user.participant, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
}
