import { Migration } from '@mikro-orm/migrations';

export class Migration20250830114457 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "bookings" ("id" uuid not null, "user_id" uuid not null, "room_id" uuid not null, "date_from" timestamptz not null, "date_to" timestamptz not null, "status" text check ("status" in ('pending', 'confirmed', 'cancelled', 'completed', 'rejected')) not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, constraint "bookings_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "bookings" cascade;`);
  }

}
