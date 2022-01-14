import { Activity } from "../entities/Activity";
import { Entry } from "../entities/Entry";
import { getConnection, getManager } from "typeorm";
import { Status } from "../entities/Status";
import { EntryToStatus } from "../entities/EntryToStatus";
import MyError from "../helpers/MyError";
import { User } from "../entities/User";

export const getEntry = async (uid: string, fromUnix: number, toUnix: number, max: number, activities: string[]) => {
  let from = fromUnix ? new Date(fromUnix * 1000) : new Date(0);
  let to = toUnix ? new Date(toUnix * 1000) : new Date();
  if (!activities) activities = [];

  // get activities
  let actitivityIds : number[];
  actitivityIds = await Activity.findManyIdByName(uid, activities);
  
  let query = getManager().createQueryBuilder()
    .select("entry.*")
    .from((subQuery => { // find how many of the relevant activities each entry has
      let subQ = subQuery
        .select("entry_activity.entryId", "entryId")
        .addSelect("COUNT(entry_activity.\"entryId\")", "matchingActivities")
        .from("entry_activity", "entry_activity")
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
            { from: from.getTime(), to: to.getTime() })
    .orderBy("entry.createdAt", "DESC");
  if (actitivityIds.length > 0) query = query.andWhere("\"matchingActivities\"=:num", { num: actitivityIds.length });
  if (max) query = query.limit(max);
  // console.log(query.getQuery());
  return query.getRawMany();
}

export const create = async (uid: string, items: [{date: number, mood: number, activities: [string], statuses: [{name: string, value: number}]}]) => {
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
          let a = await Activity.findByName(uid, activityName);

          activities.push(a);
        }
      }
      
      // add statuses
      let statuses = [];
      if (item.statuses) {
        for (let status of item.statuses) {
          if (status.name === undefined || status.value === undefined) {
            throw new MyError("Please follow this object structure for each status: {name, value}");
          }
          let s = await Status.findByName(uid, status.name);

          if (s === undefined) {
            throw new MyError("Status item not found: '" + status.name + "'", 400);
          }

          let entryToStatus = new EntryToStatus();
          entryToStatus.entry = entry;
          entryToStatus.status = s;
          entryToStatus.value = status.value;
          statuses.push(entryToStatus);
        }
      }

      // save entry
      entry.user = await User.findById(uid);
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
  }
  catch(err : any) {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
    throw (err);
  }
}
