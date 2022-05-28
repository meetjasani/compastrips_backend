import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Gender } from "../../utils/constant";
import { Like, Hosting, Participant } from "./index";
import Itinerary from "./Ititnerary";

@Entity("user")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, default: null })
  avatar: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  user_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: Gender,
  })
  gender: Gender;

  @Column()
  nationality: string;

  @Column()
  mobile: string;

  @Column({
    type: "date",
  })
  dob: Date;

  @Column({ nullable: true })
  admin_note: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  created_at: Date;

  @CreateDateColumn({
    type: "timestamp",
  })
  updated_at: Date;

  @Column({
    default: false,
  })
  is_deleted: boolean;

  @Column({
    default: false,
  })
  is_verified: boolean;

  @OneToMany(
    () => Like,
    (like) => {
      like.host_user_id, like.join_user_id;
    }
  )
  likes: Like[];

  @OneToMany(() => Hosting, (hosting) => hosting.user)
  hostings: Hosting[];

  @OneToOne(() => Participant, (participant) => participant.user)
  participant: Participant;

  @OneToMany(() => Itinerary, (itinerary) => itinerary.user)
  itinerary: Itinerary[];
}
