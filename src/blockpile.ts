import {Carryable} from 'carryable';

/**
 * Represents a non-moveable block that you can click to generate a moveable block.
 */
export class BlockPile {
  
  private shape: Shape;
  private transf: Transform;
  private fixedBlock: Entity;
  private dimensions: Vector3;
  
  private material: Material;
  
  /**
   * Create a new BlockPile with the given transform, dimensions (in units of 0.5m cubed grid cells), shape, and material.
   */
  constructor(transf: Transform, dimensions: Vector3, shape: Shape, material: Material) {
    
    this.transf = transf;
    this.shape = shape;
    this.dimensions = dimensions;
    this.material = material;
    
    this.fixedBlock = new Entity();
    this.fixedBlock.addComponent(shape);
    this.fixedBlock.addComponent(transf);
    this.fixedBlock.addComponent(this.material);
    
    this.fixedBlock.addComponent(new OnClick(() => {
      this.spawnNewBlock();
    }));
    
    engine.addEntity(this.fixedBlock);
  }
  
  /**
   * Create a new Carryable block with the same shape and color as this BlockPile.
   */
  public spawnNewBlock() {
    
    log('Creating new block...');
    let newBlock = new Entity();
    newBlock.addComponent(this.shape);
    newBlock.addComponent(new Transform({
      position: this.transf.position.clone(),
      scale: this.transf.scale,
      rotation: this.transf.rotation
    }));
    let blockMat = new Material();
    blockMat.albedoColor = this.material.albedoColor.clone(); // Want it to stick if we change the main block color.
    newBlock.addComponent(blockMat);
    
    engine.addEntity(newBlock);
    
    // Immediately start carrying.
    let carryable = new Carryable(this.dimensions);
    newBlock.addComponent(carryable);
    
    carryable.toggleCarry(newBlock.getComponent(Transform));
    
    newBlock.addComponent(new OnClick(() => {
      carryable.toggleCarry(newBlock.getComponent(Transform));
    }));
  }
}
