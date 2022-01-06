import { Body, Get, HttpCode, JsonController, Post } from "routing-controllers";
import { Activity } from "../entities/Activity";
import { Entry } from "../entities/Entry";
import { getConnection, getManager } from "typeorm";
import { StatusItem } from "../entities/StatusItem";
import { EntryToStatusItem } from "../entities/EntryToStatusItem";

@JsonController("/entry")
export class EntryController {
  @Get("/")
  public async getEntry(
    @Body({ required: true }) body : { from: Date, to: Date, max: number, activities: string[] }
  ) {
    // fill in default values
    if (!body.from) body.from = new Date(0);
    if (!body.to) body.to = new Date();
    if (!body.activities) body.activities = [];

    // get activities
    let actitivityIds : number[];
    try {
      actitivityIds = await Activity.findManyIdByName(body.activities);
    }
    catch(err : any) {
      err.result = "error";
      throw err;
    }
    
    let query = getManager().createQueryBuilder()
      .select("entry.*")
      .from((subQuery => { // find how many of the relevant activities each entry has
        let subQ = subQuery
          .select("entry_activity.entryId", "entryId")
          .addSelect("COUNT(entry_activity.\"entryId\")", "matchingActivities")
          .from("entry_activities_activity", "entry_activity")
          .leftJoin("activity", "activity", "activity.id=entry_activity.\"activityId\"");
        
        for (let i in actitivityIds) {
          let varName = "a" + i;
          let varObj: { [key: string]: number; } = {};
          varObj[varName] = actitivityIds[i];
          subQ = subQ.orWhere("activity.id=:" + varName, varObj);
        }

        subQ = subQ
          .groupBy("entry_activity.entryId");

        return subQ;
      }), "subq")
      // we want all of the activities specified
      .leftJoin("entry", "entry", "entry.id=subq.\"entryId\"")
      .where("\"createdAt\" BETWEEN TO_TIMESTAMP(:from) AND TO_TIMESTAMP(:to)",
             { from: body.from.getTime(), to: body.to.getTime() })
      .orderBy("entry.createdAt", "DESC");
    if (actitivityIds.length > 0) query = query.andWhere("\"matchingActivities\"=:num", { num: actitivityIds.length });
    if (body.max) query = query.limit(body.max);
    // console.log(query.getQuery());
    return query.getRawMany();
  }

  @HttpCode(201)
  @Post("/")
  public async createEntry(
    @Body({ required: true }) items : [{date: number, mood: number, activities: [string], statuses: [{name: string, value: number}]}]
  ) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      for (let item of items) {
        const entry = new Entry();

        // get activities
        let activities = [];
        if (item.activities) {
          for (let activityName of item.activities) {
            let a = await Activity.findByName(activityName);
  
            activities.push(a);
          }
        }
        
        // add statuses
        let statuses = [];
        if (item.statuses) {
          for (let status of item.statuses) {
            if (!status.name || !status.value) {
              throw { error: "Please follow this object structure for each status: {name, value}" };
            }
            let s = await queryRunner.manager.findOne(StatusItem, {name: status.name});
  
            if (s === undefined) {
              throw { error: "Status item not found: '" + status.name + "'" };
            }
  
            let entryToStatusItem = new EntryToStatusItem();
            entryToStatusItem.entry = entry;
            entryToStatusItem.statusItem = s;
            entryToStatusItem.value = status.value;
            statuses.push(entryToStatusItem);
          }
        }

        // save entry
        entry.mood = item.mood;
        entry.createdAt = item.date ? new Date(item.date * 1000) : new Date();
        entry.activities = activities
        await queryRunner.manager.save(entry);

        // save join table item (entry-status)
        for (let status of statuses) {
          await queryRunner.manager.save(status);
        }
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return { result: "success" };
    }
    catch(err : any) {
      await queryRunner.rollbackTransaction();
      err.result = "error";
      console.log("Error: ", err)
      await queryRunner.release();
      throw (err);
    }
  }
}
