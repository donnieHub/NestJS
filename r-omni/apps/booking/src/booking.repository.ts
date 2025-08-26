import {EntityRepository} from "@mikro-orm/postgresql";
import {Booking} from "./entities/bookings.entity";

export class BookingRepository extends EntityRepository<Booking> {

}