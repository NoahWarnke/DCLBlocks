import {BlockPile} from 'blockpile';
import {Carryable, CarryableSystem} from 'carryable';
import {Grid} from 'grid';
import {ColorPicker} from 'colorpicker';

let grid = new Grid(new Vector3(32, 32, 32));

// Block off the blockpiles.
grid.setBox(new Vector3(0, 0, 29), new Vector3(20, 7, 3), -1, 10000);

let carryableSystem = new CarryableSystem(grid);
engine.addSystem(carryableSystem);

let blockMaterial = new Material();
blockMaterial.albedoColor = Color3.Red();

let box = new BoxShape();
box.withCollisions = true;

let cyl = new CylinderShape();
cyl.radiusTop = 1;
cyl.withCollisions = true;

let cone = new ConeShape();
cone.withCollisions = true;

let blockpiles: BlockPile[] = [
  new BlockPile(new Transform({position: new Vector3(1, 0.5, 15), scale: new Vector3(1, 1, 1)}), new Vector3(2, 2, 2), box, blockMaterial),
  new BlockPile(new Transform({position: new Vector3(1.25, 1.25, 15.25), scale: new Vector3(0.5, 0.5, 0.5)}), new Vector3(1, 1, 1), box, blockMaterial),
  new BlockPile(new Transform({position: new Vector3(0.75, 2, 15.25), scale: new Vector3(0.5, 1, 0.5)}), new Vector3(1, 2, 1), box, blockMaterial),
  new BlockPile(new Transform({position: new Vector3(1, 2.75, 15.25), scale: new Vector3(1, 0.5, 0.5)}), new Vector3(2, 1, 1), box, blockMaterial),
  new BlockPile(new Transform({position: new Vector3(1.25, 3.25, 15), scale: new Vector3(0.5, 0.5, 1)}), new Vector3(1, 1, 2), box, blockMaterial),
  new BlockPile(new Transform({position: new Vector3(2, 0.5, 15), scale: new Vector3(0.5, 0.5, 0.5)}), new Vector3(2, 2, 2), cyl, blockMaterial),
  new BlockPile(new Transform({position: new Vector3(2, 1.5, 15), scale: new Vector3(0.5, 0.5, 0.5), rotation: Quaternion.Euler(90, 0, 0)}), new Vector3(2, 2, 2), cyl, blockMaterial),
  new BlockPile(new Transform({position: new Vector3(2, 2.5, 15), scale: new Vector3(0.5, 0.5, 0.5), rotation: Quaternion.Euler(0, 0, 90)}), new Vector3(2, 2, 2), cyl, blockMaterial),
  new BlockPile(new Transform({position: new Vector3(3, 0.5, 15), scale: new Vector3(0.5, 0.5, 0.5)}), new Vector3(2, 2, 2), cone, blockMaterial),
  new BlockPile(new Transform({position: new Vector3(3, 1.5, 15), scale: new Vector3(0.5, 0.5, 0.5), rotation: Quaternion.Euler(90, 0, 0)}), new Vector3(2, 2, 2), cone, blockMaterial),
  new BlockPile(new Transform({position: new Vector3(3, 2.5, 15), scale: new Vector3(0.5, 0.5, 0.5), rotation: Quaternion.Euler(0, 0, 90)}), new Vector3(2, 2, 2), cone, blockMaterial),
  new BlockPile(new Transform({position: new Vector3(4, 0.5, 15), scale: new Vector3(0.5, 0.5, 0.5), rotation: Quaternion.Euler(0, 0, 180)}), new Vector3(2, 2, 2), cone, blockMaterial),
  new BlockPile(new Transform({position: new Vector3(4, 1.5, 15), scale: new Vector3(0.5, 0.5, 0.5), rotation: Quaternion.Euler(-90, 0, 0)}), new Vector3(2, 2, 2), cone, blockMaterial),
  new BlockPile(new Transform({position: new Vector3(4, 2.5, 15), scale: new Vector3(0.5, 0.5, 0.5), rotation: Quaternion.Euler(0, 0, -90)}), new Vector3(2, 2, 2), cone, blockMaterial),
];

let picker = new ColorPicker(
  new Transform({
    position: new Vector3(8, 1, 15),
    rotation: Quaternion.Euler(-60, 0, 0)
  }),
  blockMaterial,
  carryableSystem
);

// Create a carpeted floor for your block adventures.
let floor = new Entity();
let mat = new Material();
let floorTex = new Texture('textures/seamless_carpet_texture.jpg', {wrap: 2});
mat.albedoTexture = floorTex;
floor.addComponent(mat);
floor.addComponent(new Transform({
  position: new Vector3(8, 0, 8),
  rotation: Quaternion.Euler(-90, 0, 0),
  scale: new Vector3(16, 16, 1)
}));
let shape = new PlaneShape();
shape.uvs = [
  -5, -5,
  5, -5,
  5, 5,
  -5, 5,
  0, 0,
  1, 0,
  1, 1,
  0, 1
]
floor.addComponent(shape);

// Hack to turn off carry if you click the floor (sometimes block isn't quite in the middle of the screen.)
floor.addComponent(new OnClick(() => {
  if (Carryable.currentCarry) {
    Carryable.currentCarry.toggleCarry(new Transform()); // Turning off, so transform doesn't matter.
  }
}))
engine.addEntity(floor);

// Create a deletion zone.
let trash = new Entity();
let trashMat = new Material();
let trashTex = new Texture('textures/no.png', {wrap: 2});
trashMat.albedoTexture = trashTex;
trashMat.transparencyMode = 2;
trash.addComponent(trashMat);
trash.addComponent(new Transform({
  position: new Vector3(12, 0.02, 15),
  rotation: Quaternion.Euler(-90, 0, 0),
  scale: new Vector3(2, 2, 1)
}));

trash.addComponent(new PlaneShape());
engine.addEntity(trash);
