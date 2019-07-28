
/**
 * A component that allows an entity to stay in the same location relative to a camera's position, when toggled.
 * @author Interweaver
 */
@Component('carryable')
export class Carryable {
  
  public beingCarried: boolean;
  public relativeTransform: Transform;
  public camera: Camera;
  
  constructor() {
    this.beingCarried = false;
    this.relativeTransform = undefined;
    this.camera = Camera.instance;
  }
  
  /**
   * Toggle whether this Carryable is being 'carried' (tracking user camera) or not.
   * @param myTransform The Transform of the entity this Component was added to. No other good way to get this than passing it in here.
   */
  public toggleCarry(myTransform: Transform) {
    this.beingCarried = !this.beingCarried;
    
    if (!this.beingCarried) {
      this.relativeTransform = undefined;
      return;
    }
    
    // Save position of object relative to camera at moment of toggle.
    this.relativeTransform = new Transform({
      position: myTransform.position
        .subtract(this.camera.position)
        .rotate(this.camera.rotation
          .conjugate()
        )
    });
  }
}

/**
 * A System to update Carryable entities.
 * @author Interweaver
 */
export class CarryableSystem {
  
  private carryables: ComponentGroup = engine.getComponentGroup(Carryable, Transform);
  private camera: Camera;
  
  constructor() {
    this.camera = Camera.instance;
  }
  
  public update(dt: number) {
    for (let entity of this.carryables.entities) {
      let carryable = entity.getComponent(Carryable);
      if (!carryable.beingCarried) {
        continue;
      }
      
      // Move object back to same relative position versus camera as when you clicked it.
      entity.getComponent(Transform).position = carryable.relativeTransform.position
        .clone()
        .rotate(this.camera.rotation)
        .add(this.camera.position)
      ;
    }
  }
}