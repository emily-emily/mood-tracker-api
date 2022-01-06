import { JsonController, Body, Get, Post, HttpCode } from 'routing-controllers';
import { Activity } from '../entities/Activity';
import { getManager } from 'typeorm';

@JsonController("/activity")
export class ActivityController {
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
    try {
      await query.execute();
      return { result: "success" };
    }
    catch(err: any) {
      err.result = "error";
      throw err;
    }
  }
}
