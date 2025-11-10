import { Migration } from '@mikro-orm/migrations';

export class Migration20251108160213 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "room_availability" drop constraint "room_availability_room_id_unique";`);

    this.addSql(`alter table "room_availability" add column "booking_id" uuid null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "room_availability" drop column "booking_id";`);

    this.addSql(`alter table "room_availability" add constraint "room_availability_room_id_unique" unique ("room_id");`);
  }

}
