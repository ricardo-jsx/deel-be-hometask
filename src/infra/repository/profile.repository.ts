import { Transaction } from "sequelize";
import { Profile } from "~/core/models";

export class ProfileRepository {
  async updateProfile(profile: Profile, transaction?: Transaction) {
    await profile.save({ transaction });
  }

  async findProfileById(id: number, transaction?: Transaction) {
    const profile = await Profile.findOne({
      where: { id },
      transaction
    });

    return profile;
  }
}