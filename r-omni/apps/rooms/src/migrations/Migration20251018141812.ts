import { Migration } from '@mikro-orm/migrations';

export class Migration20251018141812 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "rooms" ("id" uuid not null, "type" text check ("type" in ('standard', 'economy')) not null, "price" numeric(10,0) not null, "description" varchar(255) not null, "is_available" boolean not null, constraint "rooms_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "rooms" cascade;`);
  }

}
