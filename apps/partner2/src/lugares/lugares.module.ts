import { Module } from '@nestjs/common';
import { SpotsController } from './lugares.controller';
import { SpotsCoreModule } from '@app/core/spots/spots-core.module';

@Module({
  imports: [SpotsCoreModule],
  controllers: [SpotsController],
})
export class LugaresModule {}
