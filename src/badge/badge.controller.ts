import { Controller, Get, Param } from "@nestjs/common";
import { BadgeService } from "./badge.service";

@Controller("badges")
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Get(":userId")
  async getUserBadges(@Param("userId") userId: string) {
    return this.badgeService.getUserBadges(userId);
  }
}
