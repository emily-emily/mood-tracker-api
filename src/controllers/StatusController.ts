import { Body, Get, HttpCode, JsonController, Post } from "routing-controllers";
import { Status } from "../entities/Status";
import { getManager } from "typeorm";

@JsonController("/status")
export class StatusController {
  public static async getId(status: string) {
    const res = await Status.createQueryBuilder("status")
      .select("status.id", "id")
      .where("status.name=:name", { name: status })
      .getRawOne();
    return res["id"];
  }

  @Get("/")
  public async getAll() {
    const query = getManager().createQueryBuilder()
      .select("*")
      .from("status", "status");
    return query.getRawMany();
  }

  @HttpCode(201)
  @Post("/")
  public async createStatusItem(
    @Body({ required: true }) items : Status[]
  ) {
    const query = Status.createQueryBuilder("status")
      .insert()
      .values(items);
    await query.execute();
    return { result: "success" };
  }
}
