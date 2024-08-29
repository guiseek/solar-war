import { GLTF } from "three/examples/jsm/Addons.js";
import { Group, Vector3 } from "three";

export class Missile {
  #group = new Group();

  constructor(
    gltf: GLTF,
    readonly direction: Vector3,
    readonly velocity: number,
    readonly reach = 300
  ) {
    gltf.scene.scale.setScalar(0.01)
    this.#group.add(gltf.scene);
  }

  getMissile() {
    return this.#group;
  }

  get position() {
    return this.#group.position;
  }

  get quaternion() {
    return this.#group.quaternion;
  }

  update() {
    this.#group.position.addScaledVector(this.direction, this.velocity);
  }
}
