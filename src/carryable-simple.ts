/**
 * A component that allows an Entity to be carried, i.e. to
 * stay in the same location relative to a user, when toggled.
 * @author Interweaver
 */
@Component('carryable')
export class Carryable {
  
  /**
   * True when the Entity is being carried. False otherwise.
   */
  public beingCarried: boolean = false;
  
  /**
   * When the Entity is being carried, its constant user-space position. Undefined otherwise.
   */
  public pUser: Vector3 = undefined;
  
  /**
   * Toggle whether this Carryable is being carried or not.
   */
  public toggleCarry() {
    this.beingCarried = !this.beingCarried;
  }
}

/**
 * A System to update Carryable entities.
 * @author Interweaver
 */
export class CarryableSystem {
  
  /**
   * The ComponentGroup of all Entities that have both Carryable and Transform Components.
   */
  private carryables: ComponentGroup = engine.getComponentGroup(Carryable, Transform);
  
  /**
   * Once per frame, update the position of each Entity that is being carried
   * so that its position relative to the user remains constsant.
   */
  public update(dt: number) {
    
    for (let entity of this.carryables.entities) {
      
      let carryable = entity.getComponent(Carryable);
      
      if (carryable.beingCarried) {
        
        if (carryable.pUser === undefined) {
          
          // Grab the current world-space position of the Entity.
          let pWorld = entity.getComponent(Transform).position;
          
          // Calculate and save the user-space position of the Entity from its world-space position.
          carryable.pUser = pWorld
            .subtract(Camera.instance.position)           // Subtract U
            .rotate(Camera.instance.rotation.conjugate()) // Unrotate by R
          ;
        }
        else {
          
          // Calculate the variable world-space position of the Entity from its constant user-space position.
          let pWorld = carryable.pUser
            .clone()                          // (Clone stops the .rotate from changing pUser)
            .rotate(Camera.instance.rotation) // Rotate by R
            .add(Camera.instance.position)    // Add U
          ;
          
          // Move the Entity to its new world-space position.
          entity.getComponent(Transform).position = pWorld;
        }
      }
      else if (carryable.pUser !== undefined) {
        
        // Entity was dropped, so don't care about pUser anymore.
        carryable.pUser = undefined;
      }
    }
  }
}

// Workaround for SDK bug with Camera.instance.
let dummy = Camera.instance;
