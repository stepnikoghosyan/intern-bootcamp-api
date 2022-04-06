import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public-endpoint.decorator';
import { DemoService } from './demo.service';

@ApiTags('Demo')
@Controller('Demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get()
  @HttpCode(200)
  @Public()
  public initDemoData() {
    return this.demoService.initAll();
  }
}
