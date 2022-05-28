import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User, Itinerary } from "./index";

@Entity("like")
export default class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: "host_user_id" })
  host_user_id: User;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: "join_user_id" })
  join_user_id: Itinerary;

  @CreateDateColumn({
    type: "timestamp",
  })
  created_at: Date;
}
