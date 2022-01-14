import { Status } from "../entities/Status";
import { getManager } from "typeorm";
import MyError from "../helpers/MyError";

export const getId = async (activity: string) => {
  const res = await Status.createQueryBuilder("status")
    .select("status.id", "id")
    .where("status.name=:name", { name: status })
    .getRawOne();
  return res["id"];
}

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
