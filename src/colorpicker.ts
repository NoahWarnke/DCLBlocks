import {CarryableSystem} from 'carryable';

/**
 * Represents a board with colors you can pick for blocks. Also has buttons for block carry modes.
 */
export class ColorPicker {
  
  /**
   * The available colors.
   */
  public colors: Color3[] = [
    Color3.Red(),
    new Color3(1.0, 0.5, 0.0), // Orange
    Color3.Yellow(),
    Color3.Green(),
    Color3.Blue(),
    Color3.Purple(),
    Color3.Magenta(),
    Color3.Teal(),
    new Color3(0.8, 0.5, 0.1), // Brown
    Color3.Black(),
    Color3.Gray(),
    Color3.White()
  ];
  
  private group: Entity;
  
  private carryableSystem: CarryableSystem;
  private blockMaterial: Material;
  
  constructor(transform: Transform, blockMaterial: Material, carryableSystem: CarryableSystem) {
    
    this.blockMaterial = blockMaterial;
    this.carryableSystem = carryableSystem;
    
    this.group = new Entity();
    this.group.addComponent(transform);
    engine.addEntity(this.group);
    
    let board = new Entity();
    board.addComponent(new BoxShape());
    board.addComponent(new Transform({
      scale: new Vector3(3, 0.1, 1.5),
    }));
    let boardMat = new Material();
    boardMat.albedoTexture = new Texture('textures/wood115.jpg');
    board.addComponent(boardMat);
    board.setParent(this.group);
    
    // Color patches.
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 6; x++) {
        this.createPatch(x, y);
      }
    }
    
    // Drag modes.
    let mode0 = new Entity();
    mode0.addComponent(new PlaneShape());
    mode0.addComponent(new Transform({
      position: new Vector3(-0.75, 0.055, 0.5),
      scale: new Vector3(1.3, 0.4, 1),
      rotation: Quaternion.Euler(-90, 180, 0)
    }));
    let carryMat = new Material();
    carryMat.albedoTexture = new Texture('textures/carry_mode.png');
    carryMat.transparencyMode = 2;
    mode0.addComponent(carryMat);
    mode0.setParent(this.group);
    mode0.addComponent(new OnClick(() => {
      this.carryableSystem.setCarryMode(0);
    }));
    
    let mode1 = new Entity();
    mode1.addComponent(new PlaneShape());
    mode1.addComponent(new Transform({
      position: new Vector3(0.75, 0.055, 0.5),
      scale: new Vector3(1.3, 0.4, 1),
      rotation: Quaternion.Euler(-90, 180, 0)
    }));
    let rayMat = new Material();
    rayMat.albedoTexture = new Texture('textures/ray_mode.png');
    rayMat.transparencyMode = 2;
    mode1.addComponent(rayMat);
    mode1.setParent(this.group);
    mode1.addComponent(new OnClick(() => {
      this.carryableSystem.setCarryMode(1);
    }));
    
  }
  
  /**
   * Create a single color patch at the given local coordinates.
   */
  private createPatch(x: number, y: number) {
    let patch = new Entity();
    
    patch.addComponent(new Transform({
      position: new Vector3(x / 2 - 1.25, 0.1, -y / 2),
      scale: new Vector3(0.4, 0.1, 0.4)
    }));
    patch.addComponent(new BoxShape());
    let mat = new Material();
    mat.albedoColor = this.colors[x + y * 6];
    patch.addComponent(mat);
    patch.setParent(this.group);
    patch.addComponent(new OnClick(() => {
      this.blockMaterial.albedoColor = this.colors[x + y * 6];
    }));
  }
}
