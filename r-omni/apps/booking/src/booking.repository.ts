import {Booking} from "./entities/bookings.entity";
import {EntityRepository} from "@mikro-orm/postgresql";

export class BookingRepository extends EntityRepository<Booking> {

}