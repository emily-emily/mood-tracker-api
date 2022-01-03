import { Body, Get, HttpCode, JsonController, Post } from "routing-controllers";
import { Activity } from "../entities/Activity";
import { Entry } from "../entities/Entry";
import { getConnection, getManager } from "typeorm";
import { StatusItem } from "../entities/StatusItem";
import { EntryToStatusItem } from "../entities/EntryToStatusItem";

@JsonController("/entry")
export class EntryController {
  @Get("/")
  public async getAll(
    @Body({ required: true }) body : { from: Date, to: Date, max: number }
  ) {
    // fill in default values
    if (!body.max) body.max = 5;
    if (!body.from) body.from = new Date(0);
    if (!body.to) body.to = new Date();

    const query = getManager().createQueryBuilder()
      .select("*")
      .from("entry", "entry")
      .where("\"createdAt\" BETWEEN TO_TIMESTAMP(:from) AND TO_TIMESTAMP(:to)",
             { from: body.from.getTime(), to: body.to.getTime() })
      .limit(body.max);
    return query.getRawMany();
  }

  @HttpCode(201)
  @Post("/")
  public async createEntry(
    @Body({ required: true }) items : [{date: Date, mood: number, activities: [string], statuses: [{name: string, value: number}]}]
  ) {
    let returnValue;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();

    queryRunner.startTransaction();
    try {
      for (let item of items) {
        const entry = new Entry();

        // get activities
        let activities = [];
        if (item.activities) {
          for (let activityName of item.activities) {
            let a = await queryRunner.manager.findOne(Activity, {name: activityName});
  
            if (a === undefined) {
              throw { error: "Activity not found: '" + activityName + "'" };
            }
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
            statuses.push(s);
          }
        }

        // save entry
        entry.mood = item.mood;
        entry.createdAt = item.date;
        entry.activities = activities
        await queryRunner.manager.save(entry);

        // save join table item (entry-status)
        for (let status of statuses) {
          await queryRunner.manager.save(status);
        }
      }
      await queryRunner.commitTransaction();
      returnValue = { result: "success" };
    }
    catch(err : any) {
      await queryRunner.rollbackTransaction();
      err.result = "error";
      returnValue = err;
    }

    await queryRunner.release();
    return returnValue;
  }
}
