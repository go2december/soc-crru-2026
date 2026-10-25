const fs = require('fs');
const path = require('path');

const controllerFile = path.resolve(__dirname, '../apps/programs-service/src/programs.controller.ts');
let code = fs.readFileSync(controllerFile, 'utf8');

const target = '  /**\r\n   * PATCH /programs/tracks/:trackId - Update a track';
const newEndpoints = `  /**
   * GET /programs/tracks/all - Get all tracks across all programs
   */
  @Get('tracks/all')
  getAllTracks(
    @Query('departmentId') departmentId?: string,
    @Query('programId') programId?: string,
  ) {
    const deptId = departmentId ? parseInt(departmentId, 10) : undefined;
    return this.programsService.getAllTracks(deptId, programId);
  }

  /**
   * GET /programs/tracks/:trackId - Get single track by UUID
   */
  @Get('tracks/:trackId')
  getTrackById(@Param('trackId') trackId: string) {
    return this.programsService.getTrackById(trackId);
  }

  /**
   * PATCH /programs/tracks/:trackId - Update a track`;

code = code.replace(target, newEndpoints);
fs.writeFileSync(controllerFile, code);
console.log('Successfully updated programs.controller.ts');
