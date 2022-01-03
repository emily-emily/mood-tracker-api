import { Body, Get, HttpCode, JsonController, Post } from "routing-controllers";
import { StatusItem } from "../entities/StatusItem";
import { getManager } from "typeorm";

@JsonController("/status")
export class StatusController {
  @Get("/item")
  public async getAll() {
    const query = getManager().createQueryBuilder()
      .select("*")
      .from("status_item", "status_item");
    return query.getRawMany();
  }

  @HttpCode(201)
  @Post("/item")
  public async createStatusItem(
    @Body({ required: true }) items : StatusItem[]
  ) {
    const query = StatusItem.createQueryBuilder("status_item")
      .insert()
      .values(items);
    try {
      await query.execute();
      return { result: "success" };
    }
    catch(err: any) {
      err.result = "error";
      return err;
    }
  }
}
