import { Migration } from '@mikro-orm/migrations';

export class Migration20250913100353 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" alter column "role" type text using ("role"::text);`);
    this.addSql(`alter table "users" add constraint "users_role_check" check("role" in ('user', 'admin'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop constraint if exists "users_role_check";`);

    this.addSql(`alter table "users" alter column "role" type varchar(50) using ("role"::varchar(50));`);
  }

}
