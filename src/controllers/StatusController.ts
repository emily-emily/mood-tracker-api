import { Status } from "../entities/Status";
import { getManager } from "typeorm";
import MyError from "../helpers/MyError";

export const getAll = async () => {
  const activities = await getManager().createQueryBuilder()
    .select("*")
    .from("status", "status")
    .getRawMany();
  return activities;
}

export const create = async (items: any) => {
  if (!items?.length) {
    throw new MyError("Include items to post.", 400);
  }
  
  const query = Status.createQueryBuilder("status")
    .insert()
    .values(items);
  await query.execute();
}
