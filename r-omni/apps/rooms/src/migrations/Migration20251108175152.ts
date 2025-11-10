import { Migration } from '@mikro-orm/migrations';

export class Migration20251108175152 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "room_availability" drop column "date_from", drop column "date_to";`);

    this.addSql(`alter table "room_availability" add column "date" date not null;`);
    this.addSql(`alter table "room_availability" rename column "is_booked" to "is_available";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "room_availability" drop column "date";`);

    this.addSql(`alter table "room_availability" add column "date_from" timestamptz not null, add column "date_to" timestamptz not null;`);
    this.addSql(`alter table "room_availability" rename column "is_available" to "is_booked";`);
  }

}
