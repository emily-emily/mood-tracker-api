import MyError from "../helpers/MyError";
import { getManager } from "typeorm";
import { Entry } from "../entities/Entry";
import * as stats from "../helpers/stats";
import * as StatusController from "./StatusController";

export const getLastEntryDate = async () => {
  let res = await Entry.createQueryBuilder("entry")
    .select("entry.createdAt", "createdAt")
    .orderBy("\"createdAt\"", "DESC")
    .getRawOne();
  
  return res && res["createdAt"];
}

export const getLastActivityOccurrence = async (activity: string) => {
  let res = await getManager().createQueryBuilder()
    .select("entry.createdAt", "createdAt")
    .from("entry_activity", "entry_activity")
    .leftJoin("entry", "entry", "entry.id=entry_activity.\"entryId\"")
    .leftJoin("activity", "activity", "activity.id=entry_activity.\"activityId\"")
    .where("activity.name=:name", { name: activity })
    .orderBy("\"createdAt\"", "DESC")
    .getRawOne();
  
  return res && res["createdAt"];
}

export const getAvg = async (fromUnix: number, toUnix: number) => {
  let from = fromUnix ? new Date(fromUnix * 1000) : new Date(0);
  let to = toUnix ? new Date(toUnix * 1000) : new Date();
  
  let moodRes = await Entry.createQueryBuilder("entry")
    .select("entry.mood", "mood")
    .where("entry.\"createdAt\" BETWEEN TO_TIMESTAMP(:from) AND TO_TIMESTAMP(:to)",
            { from: from.getTime() / 1000, to: to.getTime() / 1000 })
    .getRawMany();
  
  let statusRes = await getManager().createQueryBuilder()
    .select("entry_status.value", "value")
    .addSelect("status.name", "name")
    .from("entry_status", "entry_status")
    .leftJoin("entry", "entry", "entry.id=entry_status.\"entryId\"")
    .leftJoin("status", "status", "status.id=entry_status.\"statusItemId\"")
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
    throw new MyError("Unable to get results from db.");
  }
}

export const getPlotData = async (fromUnix: number, toUnix: number, status: string) => {
  let from = fromUnix ? new Date(fromUnix * 1000) : new Date(0);
  let to = toUnix ? new Date(toUnix * 1000) : new Date();

  let x : any[] = [];
  let y : number[] = [];

  if (status === "mood") {
    const query = Entry.createQueryBuilder("entry")
      .select("entry.mood", "mood")
      .addSelect("entry.createdAt", "date")
      .where("entry.\"createdAt\" BETWEEN TO_TIMESTAMP(:from) AND TO_TIMESTAMP(:to)",
              { from: from.getTime() / 1000, to: to.getTime() / 1000 });
    let res = await query.getRawMany();
    x = res.map(entry => entry.date);
    y = res.map(entry => entry.mood);
  }
  else {
    const statusId = await StatusController.getId(status);
    const query = getManager().createQueryBuilder()
    .select("entry_status.value", "value")
    .addSelect("entry.createdAt", "date")
    .from("entry_status", "entry_status")
    .leftJoin("entry", "entry", "entry.id=entry_status.\"entryId\"")
    .where("entry_status.\"statusItemId\"=:statusId", { statusId: statusId })
    .andWhere("entry.\"createdAt\" BETWEEN TO_TIMESTAMP(:from) AND TO_TIMESTAMP(:to)",
              { from: from.getTime() / 1000, to: to.getTime() / 1000 });
    let res = await query.getRawMany();
    x = res.map(entry => entry.date);
    y = res.map(entry => entry.value);
  }

  x = stats.reducePoints(x, 20, false);
  y = stats.reducePoints(y, 20, true);

  return { result: "success", x: x, y: y };
}
