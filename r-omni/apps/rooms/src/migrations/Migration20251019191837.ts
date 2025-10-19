import { Migration } from '@mikro-orm/migrations';

export class Migration20251019191837 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "rooms" drop constraint "rooms_building_id_foreign";`);

    this.addSql(`alter table "rooms" add constraint "rooms_building_id_foreign" foreign key ("building_id") references "building" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "rooms" drop constraint "rooms_building_id_foreign";`);

    this.addSql(`alter table "rooms" add constraint "rooms_building_id_foreign" foreign key ("building_id") references "building" ("id") on update cascade;`);
  }

}
