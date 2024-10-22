import { IsString } from 'class-validator';

export class CreateMusicDto {
    @IsString()
    readonly videoId: string;

    @IsString()
    readonly title: string;

    @IsString()
    readonly addedBy: string;

    @IsString()
    readonly thumbnail: string;  // Thêm trường thumbnail
}
