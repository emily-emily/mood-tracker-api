import { Body, Get, InternalServerError, JsonController } from "routing-controllers";
import { getManager } from "typeorm";
import { Entry } from "../entities/Entry";

@JsonController("/stats")
export class StatsController {
  @Get("/lastEntryDate")
  public async getLastEntryDate() {
    let res = await Entry.createQueryBuilder("entry")
      .select("entry.createdAt", "createdAt")
      .orderBy("\"createdAt\"", "DESC")
      .getRawOne();
    
    return res && res["createdAt"];
  }

  @Get("/lastActivityOccurrence")
  public async getLastActivityOccurrence(
    @Body({ required: true }) body: { activity: string }
  ) {
    let res = await getManager().createQueryBuilder()
      .select("entry.createdAt", "createdAt")
      .from("entry_activity", "entry_activity")
      .leftJoin("entry", "entry", "entry.id=entry_activity.\"entryId\"")
      .leftJoin("activity", "activity", "activity.id=entry_activity.\"activityId\"")
      .where("activity.name=:name", { name: body.activity })
      .orderBy("\"createdAt\"", "DESC")
      .getRawOne();
    
    return res && res["createdAt"];
  }

  @Get("/averageStatuses")
  public async getAvg(
    @Body({ required: false }) body: { from: number, to: number }
  ) {
    let from = body.from ? new Date(body.from * 1000) : new Date(0);
    let to = body.to ? new Date(body.to * 1000) : new Date();
    
    let moodRes = await Entry.createQueryBuilder("entry")
      .select("entry.mood", "mood")
      .where("entry.\"createdAt\" BETWEEN TO_TIMESTAMP(:from) AND TO_TIMESTAMP(:to)",
             { from: from.getTime() / 1000, to: to.getTime() / 1000 })
      .getRawMany();
    
    let statusRes = await getManager().createQueryBuilder()
      .select("entry_status_item.value", "value")
      .addSelect("status_item.name", "name")
      .from("entry_status_item", "entry_status_item")
      .leftJoin("entry", "entry", "entry.id=entry_status_item.\"entryId\"")
      .leftJoin("status_item", "status_item", "status_item.id=entry_status_item.\"statusItemId\"")
      .where("entry.\"createdAt\" BETWEEN TO_TIMESTAMP(:from) AND TO_TIMESTAMP(:to)",
             { from: from.getTime() / 1000, to: to.getTime() / 1000 })
      .getRawMany();

    if (moodRes && statusRes) {
      let result: { [key: string]: number; } = {};
      // sum
      statusRes.forEach(row => {
        if (!result[row.name]) result[row.name] = 0;
        result[row.name] += Number(row.value);
      });
      // avg
      Object.keys(result).forEach(key => {
        let denom = statusRes.filter(row => row.name === key).length;
        result[key] /= denom;
      });
      // avg for mood
      result["mood"] = moodRes.reduce((acc, curr) => acc + curr.mood, 0);
      result["mood"] /= moodRes.length;
      return result;
    }
    else {
      console.log("moodRes:", moodRes);
      console.log("statusRes:", statusRes);
      throw new InternalServerError("Unable to get results from db.");
    }
  }
}
