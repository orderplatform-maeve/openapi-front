import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @IsString()
  value: string;
}

export class CreateTodoDtoData {
  @ApiProperty({
    example: {
      value: '퇴근....',
    },
    description: '추가할 작업',
  })
  data: CreateTodoDto;
}
