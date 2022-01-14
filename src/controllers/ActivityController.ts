import { Activity } from "../entities/Activity";
import MyError from "../helpers/MyError";
import { getManager } from "typeorm";

export const getAll = async (uid: string) => {
  const activities = await getManager().createQueryBuilder()
    .select("*")
    .from("activity", "activity")
    .where("activity.\"userId\"=:uid", { uid: uid })
    .getRawMany();
  return activities;
}

// creates an activity for each item
export const create = async (uid: string, items: any) => {
  if (!items?.length) {
    throw new MyError("Include items to post.", 400);
  }

  for (let item of items) {
    item.userId = uid;
  }
  
  const query = Activity.createQueryBuilder("activity")
    .insert()
    .values(items);
  await query.execute();
}
