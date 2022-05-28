import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { HostingStatus, HostType } from "../../utils/constant";
import { User, Itinerary, Participant } from "./index";

@Entity("hosting")
export default class Hosting {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: HostType,
  })
  type: HostType;

  @Column({ type: "date" })
  date: Date;

  @Column({
    type: "time",
  })
  start_time: string;

  @Column({
    type: "time",
  })
  end_time: string;

  @Column()
  location: string;

  @Column({
    type: "enum",
    enum: HostingStatus,
    default: HostingStatus.upcoming,
  })
  status: HostingStatus;

  @Column()
  transportation: string;

  @Column({
    default: 0,
  })
  pax: number;

  @Column()
  host_information: string;

  @ManyToOne(() => User, (user) => user.hostings)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Itinerary, (itinerary) => itinerary.hostings)
  @JoinColumn({ name: "itinerary_id" })
  itinerary: Itinerary;

  @OneToMany(() => Participant, (participant) => participant.hosting)
  participants: Participant[];
}
