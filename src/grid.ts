
/**
 * Represents a 3D grid of cells that can be either filled or unfilled.
 * Provides some functions for testing filled state, and setting filled state.
 */
export class Grid {
  
  public cells: number[][][];
  
  public size: Vector3;
  
  /**
   * Create a new Grid with the given integer dimensions.
   */
  constructor(size: Vector3) {
    this.size = size;
    
    // Initialize grid cells to empty.
    this.cells = [];
    for (let x = 0; x < size.x; x++) {
      this.cells[x] = [];
      for (let y = 0; y < size.y; y++) {
        this.cells[x][y] = [];
        for (let z = 0; z < size.z; z++) {
          this.cells[x][y][z] = -1;
        }
      }
    }
  }
  
  /**
   * Check if all of the cells in the given box are in the empty state.
   * @param pos The minimum corner of the box.
   * @param size The dimensions of the box.
   * @return true if all cells empty, or false if any are filled, or if box is out of bounds.
   */
  public checkBox(pos: Vector3, size: Vector3): boolean {
    
    // Verify all cells within bounds.
    if ( pos.x < 0 || pos.x + size.x > this.size.x
      || pos.y < 0 || pos.y + size.y > this.size.y
      || pos.z < 0 || pos.z + size.z > this.size.z
    ) {
      return false;
    }
    
    // Verify no cells filled.
    for (let x = pos.x; x < pos.x + size.x; x++) {
      for (let y = pos.y; y < pos.y + size.y; y++) {
        for (let z = pos.z; z < pos.z + size.z; z++) {
          if (this.cells[x][y][z] >= 0) {
            return false;
          };
        }
      }
    }
    
    return true;
  }
  
  /**
   * Set all the cells in the given box to the given filled state.
   * Does nothing if box is out of bounds.
   * @param pos The minimum corner of the box.
   * @param size The dimensions of the box.
   * @param oldFilled The only allowed old fill to replace.
   * @param filled What number to fill the grid at this position with.
   */
  public setBox(pos: Vector3, size: Vector3, oldFilled: number, filled: number) {
    // Verify all cells within bounds.
    if ( pos.x < 0 || pos.x + size.x > this.size.x
      || pos.y < 0 || pos.y + size.y > this.size.y
      || pos.z < 0 || pos.z + size.z > this.size.z
    ) {
      return false;
    }
    
    // Fill in all cells.
    for (let x = pos.x; x < pos.x + size.x; x++) {
      for (let y = pos.y; y < pos.y + size.y; y++) {
        for (let z = pos.z; z < pos.z + size.z; z++) {
          if (this.cells[x][y][z] == oldFilled) {
            this.cells[x][y][z] = filled;
          }
          else {
            log('invalid unfill at ' + x + ', ' + y + ', ' + z + ', saw ' + this.cells[x][y][z] + ' but expected ' + oldFilled);
          }
        }
      }
    }
  }
}
