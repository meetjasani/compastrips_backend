import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TourCourse, Itinerary } from "./index";

@Entity('tourcourse_itinerary')
export default class TourcourseItinerary {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Itinerary, itinerary => itinerary.toursecourseItinerary, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'itinerary_id'})
    itinerary!: Itinerary;

    @ManyToOne(() => TourCourse, tourcourse => tourcourse.toursecourseItinerary, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'tourcourse_id'})
    tourcourse!: TourCourse;
} 