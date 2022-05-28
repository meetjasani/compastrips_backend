import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { TourcourseItinerary } from "./index";

@Entity('tour_course')
export default class TourCourse {
    @PrimaryColumn()
    id:string;

    @Column()
    region: string;

    @Column()
    category: string;

    @Column()
    name: string;

    @Column("simple-array",{
        array: true
    })
    image: string[];

    @Column()
    period: number;

    @Column()
    summary: string;

    @Column()
    address: string

    @Column({
        nullable: true
    })
    website: string;

    @Column()
    mobile: string

    @Column()
    n_p_transportation: string

    @OneToMany(() => TourcourseItinerary, tci => tci.tourcourse)
    toursecourseItinerary: TourcourseItinerary[];

}