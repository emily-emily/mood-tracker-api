import { JsonController, Body, Get, Post, HttpCode } from 'routing-controllers';
import { Activity } from '../entities/Activity';
import { getManager } from 'typeorm';

@JsonController("/activity")
export class ActivityController {
  public async getId(activity: string) {
    const res = await Activity.createQueryBuilder("activity")
      .select("activity.id", "id")
      .where("activity.name=:name", { name: activity })
      .getRawOne();
    return res["id"];
  }

  @Get("")
  public async getAll() {
    const query = getManager().createQueryBuilder()
      .select("*")
      .from("activity", "activity");
    return query.getRawMany();
  }

  @HttpCode(201)
  @Post("/")
  public async createActivities(
    @Body({ required: true }) activities : Activity[]
  ) {
    const query = Activity.createQueryBuilder("activity")
      .insert()
      .values(activities);
    await query.execute();
    return { result: "success" };
  }
}
