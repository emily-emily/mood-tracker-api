import { Activity } from "../entities/Activity";
import MyError from "../helpers/MyError";
import { getManager } from "typeorm";

export const getId = async (activity: string) => {
  const res = await Activity.createQueryBuilder("activity")
    .select("activity.id", "id")
    .where("activity.name=:name", { name: activity })
    .getRawOne();
  return res["id"];
}

export const getAll = async () => {
  const activities = await getManager().createQueryBuilder()
    .select("*")
    .from("activity", "activity")
    .getRawMany();
  return activities;
}

export const create = async (items: any) => {
  if (!items?.length) {
    throw new MyError("Include items to post.", 400);
  }
  
  const query = Activity.createQueryBuilder("activity")
    .insert()
    .values(items);
  await query.execute();
}
