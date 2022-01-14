import { Status } from "../entities/Status";
import { getManager } from "typeorm";
import MyError from "../helpers/MyError";

export const getAll = async (uid: string) => {
  const activities = await getManager().createQueryBuilder()
    .select("*")
    .from("status", "status")
    .where("status.\"userId\"=:uid", { uid: uid })
    .getRawMany();
  return activities;
}

export const create = async (uid: string, items: any) => {
  if (!items?.length) {
    throw new MyError("Include items to post.", 400);
  }

  for (let item of items) {
    item.userId = uid;
  }
  
  const query = Status.createQueryBuilder("status")
    .insert()
    .values(items);
  await query.execute();
}
