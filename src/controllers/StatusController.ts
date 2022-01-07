import { Body, Get, HttpCode, JsonController, Post } from "routing-controllers";
import { Status } from "../entities/Status";
import { getManager } from "typeorm";

@JsonController("/status")
export class StatusController {
  public static async getId(status: string) {
    return Status.createQueryBuilder("status")
      .select("status.id")
      .where("status.name=:name", { name: status })
      .getRawOne();
  }

  @Get("/item")
  public async getAll() {
    const query = getManager().createQueryBuilder()
      .select("*")
      .from("status", "status");
    return query.getRawMany();
  }

  @HttpCode(201)
  @Post("/item")
  public async createStatusItem(
    @Body({ required: true }) items : Status[]
  ) {
    const query = Status.createQueryBuilder("status")
      .insert()
      .values(items);
    try {
      await query.execute();
      return { result: "success" };
    }
    catch(err: any) {
      err.result = "error";
      throw err;
    }
  }
}
