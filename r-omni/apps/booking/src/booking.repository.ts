import {Booking} from "./entities/booking.entity";
import {EntityRepository} from "@mikro-orm/postgresql";

export class BookingRepository extends EntityRepository<Booking> {

}