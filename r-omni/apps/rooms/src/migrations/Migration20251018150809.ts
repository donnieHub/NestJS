import { Migration } from '@mikro-orm/migrations';

export class Migration20251018150809 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "room_availability" ("id" uuid not null, "room_id" uuid not null, "date_from" timestamptz not null, "date_to" timestamptz not null, "is_booked" boolean not null, constraint "room_availability_pkey" primary key ("id"));`);
    this.addSql(`alter table "room_availability" add constraint "room_availability_room_id_unique" unique ("room_id");`);

    this.addSql(`alter table "room_availability" add constraint "room_availability_room_id_foreign" foreign key ("room_id") references "rooms" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "room_availability" cascade;`);
  }

}
