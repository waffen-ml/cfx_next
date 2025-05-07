import mongoose, { Schema, model, Model, HydratedDocument } from "mongoose";

enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
}

type UserDTO = {
    id: string;
    name: string;
    tag: string;
};

interface IUser {
    name: string;
    tag: string;
    passwordHash: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}

interface IUserMethods {
    getDTO(): UserDTO;
}

interface IUserModel extends Model<IUser, {}, IUserMethods> {
    findByDTO(dto: UserDTO): Promise<HydratedDocument<IUser, IUserMethods>>;
    findByTag(tag: string): Promise<HydratedDocument<IUser, IUserMethods>>;
}

const userSchema = new Schema<IUser, IUserModel, IUserMethods>({
    name: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
    },
    passwordHash: String,
    email: String,
    role: {
        type: String,
        enum: UserRole,
        default: UserRole.USER,
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
});

userSchema.static("findByDTO", function (dto: UserDTO) {
    return this.findOne({ _id: dto.id });
});

userSchema.static("findByTag", function (tag: string) {
    return this.findOne({ tag });
});

userSchema.method("getDTO", function () {
    return {
        id: this._id.toString(),
        name: this.name,
        tag: this.tag,
    };
});

const User =
    (mongoose.models?.User as IUserModel) ||
    model<IUser, IUserModel>("User", userSchema);

export default User;
export type { UserDTO };
export { UserRole };
