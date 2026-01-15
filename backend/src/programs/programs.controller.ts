import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Controller('programs')
export class ProgramsController {
    constructor(private readonly programsService: ProgramsService) { }

    /**
     * POST /programs - Create a new program
     */
    @Post()
    create(@Body() createProgramDto: CreateProgramDto) {
        return this.programsService.create(createProgramDto);
    }

    /**
     * GET /programs - Get all programs
     */
    @Get()
    findAll() {
        return this.programsService.findAll();
    }

    /**
     * GET /programs/:id - Get a program by ID
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.programsService.findOne(id);
    }

    /**
     * GET /programs/code/:code - Get a program by code (e.g., "social-sci")
     */
    @Get('code/:code')
    findByCode(@Param('code') code: string) {
        return this.programsService.findByCode(code);
    }

    /**
     * PATCH /programs/:id - Update a program
     */
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProgramDto: UpdateProgramDto) {
        return this.programsService.update(id, updateProgramDto);
    }

    /**
     * DELETE /programs/:id - Delete a program
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.programsService.remove(id);
    }
}
