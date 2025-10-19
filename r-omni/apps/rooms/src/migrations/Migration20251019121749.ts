import { Migration } from '@mikro-orm/migrations';

export class Migration20251019121749 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "building" ("id" uuid not null, "name" varchar(100) not null, "address" varchar(200) null, "description" text null, constraint "building_pkey" primary key ("id"));`);

    this.addSql(`alter table "rooms" add column "building_id" uuid not null;`);
    this.addSql(`alter table "rooms" add constraint "rooms_building_id_foreign" foreign key ("building_id") references "building" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "rooms" drop constraint "rooms_building_id_foreign";`);

    this.addSql(`drop table if exists "building" cascade;`);

    this.addSql(`alter table "rooms" drop column "building_id";`);
  }

}
