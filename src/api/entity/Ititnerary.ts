import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Disclosure, ItineraryCreator } from "../../utils/constant";
import { User, Hosting, TourcourseItinerary } from "./index";

@Entity("itinerary")
export default class Itinerary {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  information: string;

  @Column({
    type: "enum",
    enum: Disclosure,
  })
  disclosure: Disclosure;

  @Column({
    type: "enum",
    enum: ItineraryCreator,
    default: ItineraryCreator.compastrips,
  })
  creator: ItineraryCreator;

  @Column({
    type: "date",
  })
  start_date: Date;

  @Column({
    type: "date",
  })
  end_date: Date;

  @CreateDateColumn({
    type: "timestamp",
  })
  created_at: Date;

  @CreateDateColumn({
    type: "timestamp",
  })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.itinerary, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "created_by" })
  user: User;

  @OneToMany(() => TourcourseItinerary, (tci) => tci.itinerary)
  toursecourseItinerary!: TourcourseItinerary[];

  @OneToMany(() => Hosting, (hosting) => hosting.itinerary)
  hostings: Hosting[];
}
